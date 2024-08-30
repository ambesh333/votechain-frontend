// /contexts/WalletContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface WalletContextProps {
  connected: boolean;
  publicKey: string | null;
  balance: number | null;
  disconnectWallet: () => void;
  select: (walletName: any | null) => void;
  wallets: Array<{ adapter: { name: string; icon: string } }>;
  connecting: boolean;
  signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined;
}

const WalletContext = createContext<WalletContextProps>({
  connected: false,
  publicKey: null,
  balance: null,
  disconnectWallet: () => {},
  select: () => {},
  wallets: [],
  connecting: false,
  signMessage: undefined,
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { connection } = useConnection();
  const { select, publicKey, disconnect, connecting, signMessage, wallets } = useWallet();

  const [connected, setConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    setConnected(true);

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info.lamports / LAMPORTS_PER_SOL);
      }
    });

    return () => setConnected(false); // Clean up when the component unmounts
  }, [publicKey, connection]);

  const disconnectWallet = async () => {
    await disconnect();
    setConnected(false);
    setBalance(null);
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey: publicKey ? publicKey.toBase58() : null,
        balance,
        disconnectWallet,
        select,
        wallets,
        connecting,
        signMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
