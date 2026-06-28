"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GitBranch, Code2, Zap } from "lucide-react";
import { fadeSlideUp, staggerContainer, VIEWPORT } from "./motion/motionTokens";

const PROOF = [
  {
    Icon: Code2,
    title: "Built in the open",
    body: "The whole thing is open source. Read the code, file an issue, or send a PR.",
  },
  {
    Icon: Zap,
    title: "No account to try it",
    body: "Run your first preflight check without signing up. Save it later if you want to keep it.",
  },
  {
    Icon: GitBranch,
    title: "Made by one developer",
    body: "I built this because my own ideas kept dying in a notes app. It's the tool I wanted.",
  },
];

export function SocialProof() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section
      aria-labelledby="social-heading"
      className="bg-ink-900/30 py-24 md:py-32"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center gap-6 text-center">
        <h2
          id="social-heading"
          className="text-3xl md:text-4xl font-display font-bold text-white"
        >
          No fake testimonials. Just honest software.
        </h2>
        <p className="max-w-xl text-base text-ink-400 leading-relaxed">
          Preflight is new, so there&apos;s no wall of five-star quotes here yet. What there is: an
          open codebase, a free tier that actually works, and a maker who uses it every day.
        </p>

        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full text-left"
        >
          {PROOF.map((p) => (
            <motion.article
              key={p.title}
              variants={fadeSlideUp(reducedMotion)}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-ink-800/40 p-6"
            >
              <p.Icon className="h-5 w-5 text-signal-500" aria-hidden="true" />
              <h3 className="text-base font-semibold text-white">{p.title}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{p.body}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
