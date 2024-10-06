import React from "react";
import WalletConnection from "./WalletConnection";
import Link from "next/link";
import { LogInIcon, VoteIcon } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <VoteIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">VoteChain</span>
        </Link>
        <nav className="hidden space-x-4 sm:flex">
          <Link
            href="/organizer"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            Organizers
          </Link>
          <Link
            href="/voter"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            Voters
          </Link>
          <Link
            href="/about"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <WalletConnection />
        </div>
      </div>
    </header>
  );
};

export default Header;
