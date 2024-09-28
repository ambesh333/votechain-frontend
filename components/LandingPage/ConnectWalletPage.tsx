import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon, LockIcon, ShieldIcon, VoteIcon } from "lucide-react";
import WalletConnection from "../WalletConnection";

export default function Component() {
  return (
    <div className="min-h-screen bg-background">
      {" "}
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
          True Decentralized Voting
        </h1>
        <p className="text-xl md:text-2xl text-center mb-12 max-w-2xl">
          Connect to our app and participate in secure, transparent, and
          decentralized voting powered by blockchain technology.
        </p>
        <Card className="w-full max-w-md mb-12 bg-transparent border-2 border-[#98ECFF]">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <ShieldIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Secure and tamper-proof voting</span>
              </li>
              <li className="flex items-center">
                <LockIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Privacy-preserving technology</span>
              </li>
              <li className="flex items-center">
                <VoteIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Transparent and verifiable results</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <WalletConnection />
        <p className="mt-6 text-sm text-muted-foreground text-center">
          By connecting, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
