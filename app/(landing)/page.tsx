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
  title: "Preflight — Don't build without it.",
  description:
    "Run an AI preflight check on your side-project idea before you write a line of code. Structured questions, honest answers, saved summary. Free for developers and indie hackers.",
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
    <div className="bg-ink-950 font-sans">
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
