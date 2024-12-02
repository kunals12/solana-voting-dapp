import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
const IDL = require('../target/idl/votingdapp.json');
const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('votingdapp', () => {

  let context;
  let provider;
  let votingProgram: Program<Votingdapp>;

  beforeAll(async () => {
    context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], []);
    provider = new BankrunProvider(context);
    votingProgram = new Program<Votingdapp>(
			IDL,
			provider,
		);
  })

  it('Initialize Poll', async () => {
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "Who will win US Election",
      new anchor.BN(0),
      new anchor.BN(1753075298)
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, 'le', 8)], votingAddress);
    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);
    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("Who will win US Election");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  it("Initialize Candidate", async() => {
    await votingProgram.methods.initializeCandidate(
      new anchor.BN(1),
      "Donald Trump"
    ).rpc()

    await votingProgram.methods.initializeCandidate(
      new anchor.BN(1),
      "Kamala Harris"
    ).rpc()

    const [ trumpAddress ] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Donald Trump")], votingAddress);
    const candidateTrump = await votingProgram.account.candidate.fetch(trumpAddress);
    console.log(candidateTrump);
    expect(candidateTrump.candidateVotes.toNumber()).toEqual(0);

    const [harrisAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Kamala Harris")], votingAddress);
    const candidateHaris = await votingProgram.account.candidate.fetch(harrisAddress);
    console.log(candidateHaris);
    expect(candidateHaris.candidateVotes.toNumber()).toEqual(0);
  })

  it("Initialize Poll", async() => {
    await votingProgram.methods.vote(
      new anchor.BN(1),
      "Donald Trump"
    ).rpc()

    const [ trumpAddress ] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Donald Trump")], votingAddress);
    const candidateTrump = await votingProgram.account.candidate.fetch(trumpAddress);
    console.log(candidateTrump);
    expect(candidateTrump.candidateVotes.toNumber()).toEqual(1);

    const [harrisAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Kamala Harris")], votingAddress);
    const candidateHaris = await votingProgram.account.candidate.fetch(harrisAddress);
    console.log(candidateHaris);
    expect(candidateHaris.candidateVotes.toNumber()).toEqual(0);
  })
})
