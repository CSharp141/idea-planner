"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FolderOpen, Brain, Hammer } from "lucide-react";
import {
  fadeSlideUp,
  staggerContainer,
  VIEWPORT,
} from "./motion/motionTokens";

const CARDS = [
  {
    Icon: FolderOpen,
    title: "Ideas live everywhere",
    description:
      "Your ideas are spread across Notion pages, Apple Notes, random markdown files, and browser tabs you never close. When inspiration strikes again, you can never find what you wrote last time.",
  },
  {
    Icon: Brain,
    title: "Ideas die half-formed",
    description:
      "You had a spark, wrote down three words, and moved on. Weeks later the idea feels cold and you have no memory of where you were going with it.",
  },
  {
    Icon: Hammer,
    title: "You build before you think",
    description:
      "The urge to open a new repo is real, but most projects stall because the idea was never properly stress-tested. Two hours of thinking up front saves two weeks of building the wrong thing.",
  },
];

export function Problem() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section
      aria-labelledby="problem-heading"
      className="bg-ink-900/50 py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 grid gap-12 md:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Lead column */}
        <div className="md:sticky md:top-28 md:self-start flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-signal-400">The problem</span>
          <h2
            id="problem-heading"
            className="text-3xl md:text-4xl font-display font-bold text-white"
          >
            Sound familiar?
          </h2>
          <p className="text-base text-ink-400 leading-relaxed">
            Every developer has a graveyard of half-thought ideas. The problem isn&apos;t a lack of
            ideas — it&apos;s that they never get the ten minutes of honest thinking they deserve.
          </p>
        </div>

        {/* Numbered problem list */}
        <motion.ol
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="flex flex-col"
        >
          {CARDS.map((card, i) => (
            <motion.li
              key={card.title}
              variants={fadeSlideUp(reducedMotion)}
              className="group flex gap-5 border-t border-white/10 py-7 first:border-t-0 first:pt-0"
            >
              <span className="font-mono text-sm text-ink-600 pt-1 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <card.Icon className="w-5 h-5 text-signal-400 shrink-0" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                </div>
                <p className="text-sm text-ink-400 leading-relaxed">{card.description}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
