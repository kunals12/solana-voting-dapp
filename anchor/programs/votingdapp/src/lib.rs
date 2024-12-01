// Allows the code to bypass Clippy linter checks for large error types in results.
#![allow(clippy::result_large_err)]

// Importing necessary macros and types from the Anchor framework.
use anchor_lang::prelude::*;

// Declare the unique program ID for this voting program.
// Replace the string with the actual program ID after deploying.
declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program] // Indicates this is the entry point for the Solana program logic.
pub mod votingdapp {
    use super::*;

    // The initialize_poll function sets up a new poll with the given poll_id.
    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        poll_id: u64,
        description: String,
        poll_start: u64,
        poll_end: u64,
    ) -> Result<()> {
        // For now, the function doesn't perform any additional actions,
        // but it successfully completes, signaling a valid instruction.
        let poll = &mut ctx.accounts.poll;
        poll.poll_id = poll_id;
        poll.description = description;
        poll.poll_start = poll_start;
        poll.poll_end = poll_end;
        poll.candidate_amount = 0;
        Ok(())
    }
}

// Define the accounts required for the `initialize_poll` instruction.
// `poll_id` is passed as an instruction argument to uniquely identify the poll.
#[derive(Accounts)]
#[instruction(poll_id: u64)] // Instruction context accepts the `poll_id` parameter.
pub struct InitializePoll<'info> {
    // The signer of the transaction, i.e., the user creating the poll.
    // Must sign the transaction to authorize account creation.
    #[account(mut)]
    pub signer: Signer<'info>,

    // The poll account, which stores the poll's data on-chain.
    // - `init`: Creates a new account.
    // - `payer = signer`: The signer pays for the account creation.
    // - `space = 8 + Poll::INIT_SPACE`: Specifies the account size.
    // - `seeds`: Derives a unique address using the `poll_id`.
    // - `bump`: The bump seed for the derived address.
    #[account(
        init,
        payer = signer,
        space = 8 + Poll::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll: Account<'info, Poll>,

    // The system program is required for account creation and management.
    pub system_program: Program<'info, System>,
}

// Define the structure of the Poll account.
// This struct determines the data layout stored in the poll account.
#[account]
#[derive(InitSpace)] // Automatically calculates and sets the account's initial space requirement.
pub struct Poll {
    // Unique identifier for the poll.
    pub poll_id: u64,

    // Description of the poll, with a maximum length of 280 characters.
    #[max_len(280)]
    pub description: String,

    // The start time of the poll, stored as a Unix timestamp.
    pub poll_start: u64,

    // The end time of the poll, stored as a Unix timestamp.
    pub poll_end: u64,

    // The number of candidates participating in the poll.
    pub candidate_amount: u64,
}
