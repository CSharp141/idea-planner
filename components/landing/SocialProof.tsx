"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeSlideUp, staggerContainer, VIEWPORT } from "./motion/motionTokens";

const TESTIMONIALS = [
  {
    quote:
      "I've tried keeping ideas in Notion but I always end up with a graveyard of half-written pages. This is the first thing that actually made me think an idea through before opening Xcode.",
    name: "Alex R.",
    role: "iOS Developer",
    initials: "AR",
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    quote:
      "The AI interview is surprisingly useful. It asked me a question I hadn't thought about and I realised the idea had a flaw I would have discovered two months into building it.",
    name: "Maya T.",
    role: "Indie Hacker",
    initials: "MT",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    quote: "Clean, fast, and doesn't make me think about the tool instead of the idea. Exactly what I wanted.",
    name: "Jamie K.",
    role: "Solo Founder",
    initials: "JK",
    gradient: "from-cyan-600 to-indigo-600",
  },
];

export function SocialProof() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section
      aria-labelledby="social-heading"
      className="bg-gray-900/30 py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center gap-12">
        <p className="text-center text-xs text-gray-600 font-mono -mb-8">
          [ Placeholder — replace before launch ]
        </p>

        <h2
          id="social-heading"
          className="text-3xl md:text-4xl font-bold text-white text-center"
        >
          What people are saying
        </h2>

        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full"
        >
          {TESTIMONIALS.map((t) => (
            <motion.article
              key={t.name}
              variants={fadeSlideUp(reducedMotion)}
              className="bg-gray-800/50 border border-white/10 rounded-2xl p-8 flex flex-col gap-6"
            >
              <blockquote className="text-sm text-gray-300 leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
