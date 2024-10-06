import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaVotingDApp } from "../target/types/solana_voting_d_app";
import { assert } from "chai";

describe("solana_voting_d_app", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaVotingDApp as Program<SolanaVotingDApp>;

  // Generate a new keypair for the vote account
  let voteAccount = anchor.web3.Keypair.generate();
  const pollName = "Best Peanut Butter";

  it("Initializes a voting account", async () => {
    await program.methods
      .initialize(pollName) // Pass pollName directly
      .accounts({
        voteAccount: voteAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([voteAccount])
      .rpc();

    // Fetch the account and cast it to VoteAccount type
    const account = await program.account.voteAccount.fetch(voteAccount.publicKey);

    // Verify the initial state
    assert.equal(account.pollName, pollName);
    assert.equal(account.crunchy.toNumber(), 0);
    assert.equal(account.smooth.toNumber(), 0);
  });

  it("Votes for Crunchy", async () => {
    await program.methods
      .voteCrunchy() // No parameters needed
      .accounts({
        voteAccount: voteAccount.publicKey,
      })
      .rpc();

    // Fetch the account and cast it to VoteAccount type
    const account = await program.account.voteAccount.fetch(voteAccount.publicKey);

    // Verify the state after voting
    assert.equal(account.crunchy.toNumber(), 1);
    assert.equal(account.smooth.toNumber(), 0);
  });

  it("Votes for Smooth", async () => {
    await program.methods
      .voteSmooth() // No parameters needed
      .accounts({
        voteAccount: voteAccount.publicKey,
      })
      .rpc();

    // Fetch the account and cast it to VoteAccount type
    const account = await program.account.voteAccount.fetch(voteAccount.publicKey);

    // Verify the state after voting
    assert.equal(account.crunchy.toNumber(), 1);
    assert.equal(account.smooth.toNumber(), 1);
  });
});