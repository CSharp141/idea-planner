"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  fadeSlideLeft,
  fadeSlideRight,
  VIEWPORT,
} from "./motion/motionTokens";
import { InterviewMock, DashboardMock, GithubMock } from "./UiMock";

interface Feature {
  tag: string;
  headline: string;
  body: string;
  Visual: () => JSX.Element;
  textFirst: boolean;
}

const FEATURES: Feature[] = [
  {
    tag: "AI Interview",
    headline: "Let AI interview you about your idea.",
    body: "The AI asks you structured questions — who it's for, what problem it solves, how you'd build it — and streams them one at a time so you can think properly. Your answers get distilled into a saved summary you can come back to.",
    Visual: InterviewMock,
    textFirst: true,
  },
  {
    tag: "Dashboard",
    headline: "All your ideas in one place.",
    body: "A clean card grid gives you a bird's-eye view of everything you're thinking about. Filter by tag, search by name, and add a new idea in under ten seconds.",
    Visual: DashboardMock,
    textFirst: false,
  },
  {
    tag: "GitHub",
    headline: "Link the repo when you're ready to build.",
    body: "Add a GitHub URL to any project and it shows up on the card as a direct link. No friction when you're ready to move from idea to execution.",
    Visual: GithubMock,
    textFirst: true,
  },
];

export function Features() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="bg-ink-950 py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <h2
          id="features-heading"
          className="text-3xl md:text-4xl font-display font-bold text-white mb-20"
        >
          Everything you should ask before you start building.
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
                  <span className="inline-flex w-fit items-center bg-signal-500/10 border border-signal-500/30 text-signal-300 text-xs font-medium px-3 py-1 rounded-full">
                    {feature.tag}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
                    {feature.headline}
                  </h3>
                  <p className="text-base text-ink-400 leading-relaxed">{feature.body}</p>
                </motion.div>

                {/* Visual */}
                <motion.div
                  variants={visualVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  className="flex-1 w-full"
                >
                  <feature.Visual />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
