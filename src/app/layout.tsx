import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});


export const metadata: Metadata = {
  title: {
    template: "%s | AI Will Builder",
    absolute: "AI Will Builder",
  },
  description: "AI Will Builder is the essential tool for creating a will online. Create a will in minutes, with or without a lawyer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        {children}
      </body>
    </html>
  );
}
