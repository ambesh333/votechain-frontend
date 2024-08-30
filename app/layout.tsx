import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import WalletContextProvider from "@/contexts/WalletContextProvider";
import { WalletProvider } from "@/contexts/WalletContext";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoteChain",
  description: "Solana based voting APP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WalletContextProvider>
            <WalletProvider>
              <Header />
              {children}
            </WalletProvider>
          </WalletContextProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
