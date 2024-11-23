"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react"; //provides a collection of React components for icons.
import ThemeToggle from "@/components/ThemeToggle";
import {dark} from "@clerk/themes";
import {useTheme} from "next-themes";

export default function Navbar() {

  const {theme} = useTheme();  // use hook get the current theme

  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        <Link href="/wills" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="will builder logo"
            width={35}
            height={35}
            className="rounded-full"
          />
          <span className="text-xl font-bold tracking-tight">
            AI Will Builder
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCard className="size-4" />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
}
