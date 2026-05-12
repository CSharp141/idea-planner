"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageSquare, LayoutGrid, GitBranch } from "lucide-react";
import {
  fadeSlideLeft,
  fadeSlideRight,
  VIEWPORT,
} from "./motion/motionTokens";
import type { LucideIcon } from "lucide-react";

interface Feature {
  tag: string;
  headline: string;
  body: string;
  Icon: LucideIcon;
  gradient: string;
  textFirst: boolean;
}

const FEATURES: Feature[] = [
  {
    tag: "AI Interview",
    headline: "Let AI interview you about your idea.",
    body: "The AI asks you structured questions — who it's for, what problem it solves, how you'd build it — and streams them one at a time so you can think properly. Your answers get distilled into a saved summary you can come back to.",
    Icon: MessageSquare,
    gradient: "from-indigo-950 via-purple-950 to-gray-900",
    textFirst: true,
  },
  {
    tag: "Dashboard",
    headline: "All your ideas in one place.",
    body: "A clean card grid gives you a bird's-eye view of everything you're thinking about. Filter by tag, search by name, and add a new idea in under ten seconds.",
    Icon: LayoutGrid,
    gradient: "from-gray-900 via-indigo-950 to-gray-900",
    textFirst: false,
  },
  {
    tag: "GitHub",
    headline: "Link the repo when you're ready to build.",
    body: "Add a GitHub URL to any project and it shows up on the card as a direct link. No friction when you're ready to move from idea to execution.",
    Icon: GitBranch,
    gradient: "from-gray-900 via-purple-950 to-indigo-950",
    textFirst: true,
  },
];

export function Features() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="bg-gray-950 py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <h2
          id="features-heading"
          className="text-3xl md:text-4xl font-bold text-white mb-20"
        >
          Built for the way developers think
        </h2>

        <div className="flex flex-col gap-24 md:gap-32">
          {FEATURES.map((feature) => {
            const isTextFirst = feature.textFirst;
            const textVariants = isTextFirst
              ? fadeSlideLeft(reducedMotion)
              : fadeSlideRight(reducedMotion);
            const visualVariants = isTextFirst
              ? fadeSlideRight(reducedMotion)
              : fadeSlideLeft(reducedMotion);

            return (
              <div
                key={feature.tag}
                className={`flex flex-col ${
                  isTextFirst ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-12 lg:gap-20`}
              >
                {/* Text */}
                <motion.div
                  variants={textVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  className="flex-1 flex flex-col gap-4"
                >
                  <span className="inline-flex w-fit items-center bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full">
                    {feature.tag}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {feature.headline}
                  </h3>
                  <p className="text-base text-gray-400 leading-relaxed">{feature.body}</p>
                </motion.div>

                {/* Visual */}
                <motion.div
                  variants={visualVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  className="flex-1 w-full"
                >
                  <div
                    className={`aspect-video rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/10 flex items-center justify-center`}
                  >
                    <feature.Icon
                      className="w-16 h-16 text-white/20"
                      aria-hidden="true"
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
