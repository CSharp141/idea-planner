import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Features } from "@/components/landing/Features";
import { AiDemo } from "@/components/landing/AiDemo";
import { Pricing } from "@/components/landing/Pricing";
import { SocialProof } from "@/components/landing/SocialProof";
import { FooterCta } from "@/components/landing/FooterCta";

export const metadata: Metadata = {
  title: "Idea Planner — Develop side-project ideas with AI",
  description:
    "Capture, organise, and develop your side project ideas with AI interviews and structured notes. Free to start. Built for developers and indie hackers.",
};

async function getGitHubStars(): Promise<number> {
  try {
    const res = await fetch("https://api.github.com/repos/CSharp141/idea-planner", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
}

export default async function LandingPage() {
  const stars = await getGitHubStars();

  return (
    <div className="bg-gray-950 font-sans">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Features />
        <AiDemo />
        <Pricing />
        <SocialProof />
        <FooterCta stars={stars} />
      </main>
    </div>
  );
}
