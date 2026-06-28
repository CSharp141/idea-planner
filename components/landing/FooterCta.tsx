"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeSlideUp, VIEWPORT } from "./motion/motionTokens";

interface FooterCtaProps {
  stars: number;
}

export function FooterCta({ stars }: FooterCtaProps) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <>
      <section
        aria-labelledby="footer-cta-heading"
        className="bg-ink-950 py-32 md:py-40"
      >
        <motion.div
          variants={fadeSlideUp(reducedMotion)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center gap-8 text-center"
        >
          <h2
            id="footer-cta-heading"
            className="text-4xl md:text-5xl font-display font-bold text-white"
          >
            Every great build starts with a preflight check.
          </h2>
          <p className="text-lg text-ink-400 max-w-md">
            Pilots don&apos;t take off without one. Neither should you. Run your first Preflight check free — no account required to start.
          </p>
          <Link
            href="/login"
            className="bg-signal-500 hover:bg-signal-400 text-ink-950 font-semibold px-10 py-4 rounded-full text-base transition-colors focus-visible:ring-2 focus-visible:ring-signal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          >
            Run Your First Preflight
          </Link>
          <a
            href="https://github.com/CSharp141/idea-planner"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Star Preflight on GitHub — ${stars} stars`}
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" aria-hidden="true" />
            <span>{stars > 0 ? `${stars} stars on GitHub` : "Star on GitHub"}</span>
          </a>
        </motion.div>
      </section>

      <footer
        role="contentinfo"
        className="border-t border-white/5 bg-ink-950"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-600">© 2026 Preflight. All rights reserved.</p>
          <nav aria-label="Footer links" className="flex items-center gap-6">
            <a
              href="https://github.com/CSharp141/idea-planner"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-600 hover:text-ink-400 transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
