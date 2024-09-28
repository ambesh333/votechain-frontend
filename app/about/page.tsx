import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircleIcon,
  LockIcon,
  ShieldIcon,
  UsersIcon,
  VoteIcon,
} from "lucide-react";
import Link from "next/link";

export default function Component() {
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Revolutionizing Voting with Blockchain Technology
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            VoteChain: Secure, Transparent, and Verifiable Elections for All
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <UsersIcon className="h-8 w-8 mb-4" />,
                title: "Decentralized Voting",
                description: "Distributed and unchangeable voting data",
              },
              {
                icon: <LockIcon className="h-8 w-8 mb-4" />,
                title: "End-to-End Security",
                description: "Encrypted and privacy-preserving technology",
              },
              {
                icon: <CheckCircleIcon className="h-8 w-8 mb-4" />,
                title: "Transparency & Trust",
                description: "Visible and verifiable votes",
              },
              {
                icon: <VoteIcon className="h-8 w-8 mb-4" />,
                title: "Scalability",
                description: "Handles millions of participants with ease",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center bg-transparent border-[#98ECFF]"
              >
                <CardHeader>
                  <CardTitle className="flex flex-col items-center">
                    {feature.icon}
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <Card className="bg-transparent border-[#98ECFF]">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Why Choose VoteChain?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                At VoteChain, we believe that democracy thrives when people
                trust the process. Our blockchain-based solution eliminates the
                central points of failure that traditional voting systems face,
                such as fraud, hacking, and lost ballots.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <ShieldIcon className="mr-2 h-5 w-5 text-primary" />
                  <span>Secure & Tamper-Proof: Immutable vote recording</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="mr-2 h-5 w-5 text-primary" />
                  <span>Verifiable Results: Independent vote verification</span>
                </li>
                <li className="flex items-center">
                  <LockIcon className="mr-2 h-5 w-5 text-primary" />
                  <span>
                    Privacy Focused: Anonymous voting with public verification
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Our Mission
          </h2>
          <p className="text-xl text-center max-w-3xl mx-auto">
            VoteChain&apos;s mission is to bring true decentralization to the
            voting process. By empowering individuals to participate in
            elections without intermediaries, we are paving the way for a future
            where voting is transparent, secure, and accessible to all.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "Step 1",
                description:
                  "Connect your Web3 wallet to VoteChain. No registration required—just secure and anonymous access.",
              },
              {
                step: "Step 2",
                description:
                  "Participate in active elections by casting your vote. Your vote is recorded on the blockchain, ensuring transparency and integrity.",
              },
              {
                step: "Step 3",
                description:
                  "Verify your vote at any time using the blockchain ledger, giving you complete confidence that your voice was heard.",
              },
            ].map((step, index) => (
              <Card key={index} className="bg-transparent border-[#98ECFF]">
                <CardHeader>
                  <CardTitle>{step.step}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Join the Revolution</h2>
          <p className="mb-8 text-xl">
            VoteChain is more than a voting system—it&apos;s a movement towards
            a more secure, transparent, and trustworthy electoral process. Be
            part of the future of voting by joining VoteChain today.
          </p>
          <Link href="/" prefetch={false}>
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started with VoteChain
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
