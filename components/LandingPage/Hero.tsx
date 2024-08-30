"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import WalletConnection from "../WalletConnection";
import { Card, CardContent } from "../ui/card";
import { GroupIcon, NetworkIcon, VoteIcon } from "lucide-react";
import { useWalletContext } from "@/contexts/WalletContext";

const Hero = () => {
  const { connected, publicKey, balance, disconnectWallet } =
    useWalletContext();
  return (
    <div>
      {!connected ? (
        <div className="">
          <section className="w-full  md:pt-20 lg:pt-10 border-b py-8 md:py-10 lg:py-10">
            <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
              <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
                <div>
                  <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                    Secure and Transparent Voting
                  </h1>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-3">
                    VoteChain empowers you to participate in decentralized
                    decision-making. Cast your vote and make your voice heard.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <WalletConnection />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col items-start gap-4">
                <div className="bg-muted rounded-lg px-4 py-2 text-sm font-medium">
                  Web3 Voting
                </div>
                <h2 className="text-3xl font-bold tracking-tighter">
                  Create an Event
                </h2>
                <p className="text-muted-foreground">
                  Establish a decentralized organization and empower your
                  community to make decisions together. Our platform provides
                  the tools you need to get started.
                </p>
                <Link
                  href="\organizer"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Create Event
                </Link>
              </div>
              <div className="flex flex-col items-start gap-4">
                <div className="bg-muted rounded-lg px-4 py-2 text-sm font-medium">
                  Web3 Voting
                </div>
                <h2 className="text-3xl font-bold tracking-tighter">
                  Cast a Vote
                </h2>
                <p className="text-muted-foreground">
                  Participate in decentralized decision-making by casting your
                  vote on important issues. Our platform ensures your voice is
                  heard and your vote is secure.
                </p>
                <Link
                  href="\voter"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Cast a Vote
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <VoteIcon className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold">Secure Voting</h3>
              <p className="text-muted-foreground text-center">
                Our decentralized platform ensures secure and transparent voting
                processes.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <GroupIcon className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold">Empower Community</h3>
              <p className="text-muted-foreground text-center">
                Engage your community in decision-making and foster a sense of
                ownership.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <NetworkIcon className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold">
                Decentralized Governance
              </h3>
              <p className="text-muted-foreground text-center">
                Our platform enables decentralized decision-making and
                transparent governance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Hero;
