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
        className="bg-gray-950 py-32 md:py-40"
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
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Your next idea deserves more than a sticky note.
          </h2>
          <p className="text-lg text-gray-400 max-w-md">
            Start free and keep every idea in one place, with AI ready when you need it.
          </p>
          <Link
            href="/login"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-10 py-4 rounded-full text-base transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          >
            Start for Free
          </Link>
          <a
            href="https://github.com/CSharp141/idea-planner"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Star Idea Planner on GitHub — ${stars} stars`}
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" aria-hidden="true" />
            <span>{stars > 0 ? `${stars} stars on GitHub` : "Star on GitHub"}</span>
          </a>
        </motion.div>
      </section>

      <footer
        role="contentinfo"
        className="border-t border-white/5 bg-gray-950"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© 2026 Idea Planner. All rights reserved.</p>
          <nav aria-label="Footer links" className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
            >
              Terms
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
