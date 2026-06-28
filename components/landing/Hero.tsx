"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { heroFadeIn } from "./motion/motionTokens";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export function Hero() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink-950"
    >
      {/* 3D canvas background */}
      <HeroCanvas />

      {/* Bottom gradient blending the canvas into the next section */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-transparent via-transparent to-ink-950"
        aria-hidden="true"
      />

      {/* Text overlay */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6">
        {/* Badge */}
        <motion.span
          {...heroFadeIn(reducedMotion, 0)}
          className="inline-flex items-center gap-1.5 bg-signal-950/60 border border-signal-400/30 text-signal-300 text-xs font-medium px-3 py-1 rounded-full"
        >
          Now in Beta
        </motion.span>

        {/* H1 */}
        <motion.h1
          {...heroFadeIn(reducedMotion, 1)}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-none text-white text-balance"
        >
          Most developers build before they think. Preflight fixes that.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          {...heroFadeIn(reducedMotion, 2)}
          className="text-lg md:text-xl text-ink-400 max-w-xl leading-relaxed"
        >
          Answer a structured set of AI-led questions about your idea — who it&apos;s for, what problem it solves, and where it could fail — before you write a line of code. For developers and indie hackers who want to ship the right thing.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...heroFadeIn(reducedMotion, 3)}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/login"
            className="bg-signal-500 hover:bg-signal-400 text-ink-950 font-semibold px-8 py-4 rounded-xl text-base transition-colors focus-visible:ring-2 focus-visible:ring-signal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          >
            Run Your First Preflight
          </Link>
          <a
            href="https://github.com/CSharp141/idea-planner"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors bg-transparent focus-visible:ring-2 focus-visible:ring-signal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          >
            View on GitHub
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          {...heroFadeIn(reducedMotion, 4)}
          className="flex flex-col items-center gap-1 text-ink-600"
        >
          <span className="text-xs">See how</span>
          <ChevronDown className="animate-bounce w-5 h-5" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}
