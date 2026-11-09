"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { Bell, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

function navbar() {
  const [unReadCount, setUnReadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: "/chat",
      label: "Chat",
      match: (p?: string | null) => p?.startsWith("chat"),
    },
    {
      href: "/profile",
      label: "Profile",
      match: (p?: string | null) => p?.startsWith("profile"),
    },
  ];

  const renderNavLinks = (item: (typeof navItems)[number]) => {
    return (
      <Link
        key={item.href}
        href={item.href}
        className="flex items-center rounded-full px-3 py-2 text-sm font-medium transition-colors bg-primary/90 text-primary-foreground shadow-sm"
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sidebar-border bg-sidebar/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link
            href={"/"}
            className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground"
          >
            <span className="bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Ace
            </span>
            <span className="text-foreground/90">Forum</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(renderNavLinks)}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Show when={"signed-in"}>
            <Link href={"/notification"}>
              <Button
                size="icon"
                variant="ghost"
                className="relative h-9 w-9 text-muted-foreground hover:bg-card/10 hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold shadow-sm shadow-primary">
                  {unReadCount > 0 ? unReadCount : 0}
                </span>
              </Button>
            </Link>
            <UserButton afterSwitchSessionUrl="/"></UserButton>
          </Show>

          <Show when="signed-out">
            <Link href="/sign-in">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/90 cursor-pointer">
                Sign In
              </Button>
            </Link>
          </Show>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-sidebar-border bg-sidebar-accent text-muted-foreground transition-colors md:hidden"
          >{
            mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />
          }</button>
        </div>
      </div>
    </header>
  );
}

export default navbar;
