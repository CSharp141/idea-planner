import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Idea Planner — Develop side-project ideas with AI",
  description:
    "Capture, organise, and develop your side project ideas with AI interviews and structured notes. Free to start. Built for developers and indie hackers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
