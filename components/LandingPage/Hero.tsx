"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import WalletConnection from "../WalletConnection";
import { Card, CardContent } from "../ui/card";
import { GroupIcon, NetworkIcon, VoteIcon } from "lucide-react";
import { useWalletContext } from "@/contexts/WalletContext";
import { BoxIcon, CompassIcon } from "lucide-react";
const Hero = () => {
  const { connected, publicKey, balance, disconnectWallet } =
    useWalletContext();
  return (
    <div>
      {!connected ? (
        <div className="flex justify-center items-center py-12">
          <section className="w-full max-w-[800px] border border-white rounded-lg p-6 text-center bg-[#09090B] relative overflow-hidden">
            <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl xl:text-[2.8rem] 2xl:text-[3.2rem] mb-4 text-white">
              Secure and Transparent Voting
            </h1>
            <p className="text-gray-300 md:text-lg mb-6">
              VoteChain empowers you to participate in decentralized
              decision-making. Cast your vote and make your voice heard.
            </p>
            <div className="flex justify-center">
              <WalletConnection />
            </div>
          </section>
        </div>
      ) : (
        <section className="w-full py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/organizer" passHref>
              <div className="bg-[#09090B] border border-[#98FB98] p-6 relative overflow-hidden group flex flex-col items-center text-center cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-[#98FB98] to-[#90EE90] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <BoxIcon className="w-12 h-12 text-[#98FB98] mb-4" />
                <h3 className="text-xl font-bold text-[#98FB98] mb-4">
                  Create an Event
                </h3>
                <p className="text-gray-300 mb-6">
                  Establish a decentralized organization and empower your
                  community to make decisions together. Our platform provides
                  the tools you need to get started.
                </p>
                <span className="inline-block bg-transparent border border-[#98FB98] text-[#98FB98] px-4 py-2 group-hover:bg-[#98FB98] group-hover:text-black transition-colors duration-300">
                  Create an Event
                </span>
              </div>
            </Link>
            <Link href="/voter" passHref>
              <div className="bg-[#09090B] border border-[#FFB6C1] p-6 relative overflow-hidden group flex flex-col items-center text-center cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFB6C1] to-[#FFA07A] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <CompassIcon className="w-12 h-12 text-[#FFB6C1] mb-4" />
                <h3 className="text-xl font-bold text-[#FFB6C1] mb-4">
                  Cast a Vote
                </h3>
                <p className="text-gray-300 mb-6">
                  Participate in decentralized decision-making by casting your
                  vote on important issues. Our platform ensures your voice is
                  heard and your vote is secure.
                </p>
                <span className="inline-block bg-transparent border border-[#FFB6C1] text-[#FFB6C1] px-4 py-2 group-hover:bg-[#FFB6C1] group-hover:text-black transition-colors duration-300">
                  Cast a Vote
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-[#09090B] border border-white p-6 relative overflow-hidden group flex flex-col items-center text-center cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-300 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <VoteIcon className="w-12 h-12 mb-4 text-white" />
            <h3 className="text-xl font-semibold text-white mb-4">
              Secure Voting
            </h3>
            <p className="text-gray-300">
              Our decentralized platform ensures secure and transparent voting
              processes.
            </p>
          </div>
          <div className="bg-[#09090B] border border-white p-6 relative overflow-hidden group flex flex-col items-center text-center cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-300 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <GroupIcon className="w-12 h-12 mb-4 text-white" />
            <h3 className="text-xl font-semibold text-white mb-4">
              Empower Community
            </h3>
            <p className="text-gray-300">
              Engage your community in decision-making and foster a sense of
              ownership.
            </p>
          </div>
          <div className="bg-[#09090B] border border-white p-6 relative overflow-hidden group flex flex-col items-center text-center cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-300 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <NetworkIcon className="w-12 h-12 mb-4 text-white" />
            <h3 className="text-xl font-semibold text-white mb-4">
              Decentralized Governance
            </h3>
            <p className="text-gray-300">
              Our platform enables decentralized decision-making and transparent
              governance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
