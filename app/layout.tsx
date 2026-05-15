import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Preflight — Don't build without it.",
  description:
    "Run an AI preflight check on your side-project idea before you write a line of code. Structured questions, honest answers, saved summary. Free for developers and indie hackers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
