"use client";
import ActiveVote from "@/components/voterPage/ActiveVote";
import PastVote from "@/components/voterPage/PastVote";
import WalletConnectPage from "@/components/LandingPage/ConnectWalletPage";
import { useWalletContext } from "@/contexts/WalletContext";

export default function Component() {
  const { connected } = useWalletContext();
  return (
    <>
      {!connected ? (
        <WalletConnectPage />
      ) : (
        <>
          <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <div className="grid gap-8">
              <ActiveVote />
              <PastVote />
            </div>
          </div>
        </>
      )}
    </>
  );
}
