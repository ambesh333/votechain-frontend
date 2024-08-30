// WalletConnection.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { ChevronDown, LogInIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Jazzicon from "react-jazzicon";
// import Cookies from "js-cookie";
import { useWalletContext } from "@/contexts/WalletContext";
import axios from "axios";

import { BACKEND_URL } from "@/utils";

const WalletConnection = () => {
  const {
    connected,
    publicKey,
    balance,
    disconnectWallet,
    select,
    wallets,
    connecting,
    signMessage,
  } = useWalletContext();

  const [open, setOpen] = useState<boolean>(false);

  const handleWalletSelect = async (walletName: string) => {
    if (walletName) {
      try {
        select(walletName);
        setOpen(false);
      } catch (error) {
        console.log("wallet connection err : ", error);
      }
    }
  };

  useEffect(() => {
    async function signAndSend() {
      if (!publicKey || !signMessage) {
        return;
      }

      try {
        const message = new TextEncoder().encode("Sign into VoteChain");
        const signature = await signMessage(message);
        console.log(signature);
        console.log(publicKey);

        const response = await axios.post(`${BACKEND_URL}/v1/user/signin`, {
          signature,
          publicKey: publicKey.toString(),
        });

        console.log("token", response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("signedIn", "true");
      } catch (error) {
        console.error("Error signing message:", error);
      }
    }

    if (connected) {
      signAndSend();
    }
  }, [publicKey, signMessage, connected]);

  const handleDisconnect = async () => {
    disconnectWallet();
    localStorage.setItem("token", "asd");
  };

  return (
    <div className="text-white">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex gap-2 items-center">
          {!connected ? (
            <>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <LogInIcon className="mr-2 h-4 w-4" />
                  {connecting ? "connecting..." : "Connect Wallet"}
                </Button>
              </DialogTrigger>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <div className="flex items-center gap-2">
                    <Jazzicon
                      diameter={25}
                      seed={Math.round(Math.random() * 10000000)}
                    />
                    <div className="truncate md:w-[150px] w-[100px]">
                      {publicKey}
                    </div>

                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[240px]">
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">SOL Balance</div>

                    {balance ? (
                      <div className="text-lg font-semibold">
                        {balance.toFixed(2)}
                      </div>
                    ) : (
                      <div className="text-lg font-semibold">0</div>
                    )}
                  </div>
                  <Separator />
                  <Button variant="destructive" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DialogContent
            className="max-w-[450px] bg-black"
            style={{
              borderRadius: "30px",
            }}
          >
            <div className="flex w-full justify-center items-center">
              <div className="flex flex-col justify-start items-center space-y-5 w-[300px] md:w-[400px] overflow-y-auto">
                {wallets.map((wallet) => (
                  <Button
                    key={wallet.adapter.name}
                    onClick={() => handleWalletSelect(wallet.adapter.name)}
                    variant={"ghost"}
                    className="h-[40px] hover:bg-transparent hover:text-white text-[20px] text-white font-slackey flex w-full justify-center items-center"
                  >
                    <div className="flex">
                      <Image
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        height={30}
                        width={30}
                        className="mr-5"
                      />
                    </div>
                    <div className="font-slackey text-white wallet-name text-[20px]">
                      {wallet.adapter.name}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default WalletConnection;
