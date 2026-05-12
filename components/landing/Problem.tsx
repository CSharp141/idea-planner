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
      className="bg-gray-900/50 py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <h2
          id="problem-heading"
          className="text-3xl md:text-4xl font-bold text-white text-center mb-16"
        >
          Sound familiar?
        </h2>

        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {CARDS.map((card) => (
            <motion.article
              key={card.title}
              variants={fadeSlideUp(reducedMotion)}
              className="bg-gray-800/50 border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-colors duration-300 flex flex-col gap-4"
            >
              <card.Icon className="w-8 h-8 text-indigo-400" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{card.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
