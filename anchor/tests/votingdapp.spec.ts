import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
const IDL = require('../target/idl/votingdapp.json');
const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('votingdapp', () => {

  it('Initialize Poll', async() => {
    const context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], []);
    const provider = new BankrunProvider(context);
    const votingProgram = new Program<Votingdapp>(
			IDL,
			provider,
		);

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "Who will win US Election",
      new anchor.BN(0),
      new anchor.BN(1753075298)
    ).rpc();
  })
})
