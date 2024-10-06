use anchor_lang::prelude::*;

declare_id!("AErCyNJrsPkmK3bX4WMNmLkNwqDNr1ZMfK8rtAKFgWPJ");

#[program]
pub mod solana_voting_d_app {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, poll_name: String) -> Result<()> {
        let vote_account = &mut ctx.accounts.vote_account;
        vote_account.poll_name = poll_name;
        vote_account.crunchy = 0;
        vote_account.smooth = 0;
        Ok(())
    }

    pub fn vote_crunchy(ctx: Context<Vote>) -> Result<()> {
        let vote_account = &mut ctx.accounts.vote_account;
        vote_account.crunchy += 1;
        Ok(())
    }

    pub fn vote_smooth(ctx: Context<Vote>) -> Result<()> {
        let vote_account = &mut ctx.accounts.vote_account;
        vote_account.smooth += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 2048 + 8 + 8)]
    pub vote_account: Account<'info, VoteAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub vote_account: Account<'info, VoteAccount>,
}

#[account]
pub struct VoteAccount {
    pub poll_name: String,
    pub crunchy: u64,
    pub smooth: u64,
}
