"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeSlideUp, VIEWPORT } from "./motion/motionTokens";

const QA_PAIRS = [
  {
    question: "Who specifically is going to use this, and why would they choose it over just using a notes app?",
    answer: "Developers who want more structure than a notes app but less overhead than a full PM tool. The AI interview piece is the thing a notes app can't do.",
  },
  {
    question: "What does success look like in six months — are you trying to get paying users, or is this a tool you're building for yourself first?",
    answer: "Honestly, mostly for myself to start. If it solves my own problem well enough I'll open it up and see if other people find it useful.",
  },
  {
    question: "What's the one part of this idea you're least confident about right now?",
    answer: "Retention. Getting people to come back after the first session is the hard part — I need to think more about what brings someone back a week later.",
  },
];

export function AiDemo() {
  const reducedMotion = useReducedMotion() ?? false;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const pair = QA_PAIRS[currentIndex];

    if (reducedMotion) {
      setDisplayedAnswer(pair.answer);
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % QA_PAIRS.length);
        setDisplayedAnswer("");
      }, 3000);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    setDisplayedAnswer("");
    let charIndex = 0;

    intervalRef.current = setInterval(() => {
      charIndex++;
      setDisplayedAnswer(pair.answer.slice(0, charIndex));
      if (charIndex >= pair.answer.length) {
        clearInterval(intervalRef.current!);
        timeoutRef.current = setTimeout(() => {
          setCurrentIndex((i) => (i + 1) % QA_PAIRS.length);
          setDisplayedAnswer("");
        }, 2500);
      }
    }, 40);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, reducedMotion]);

  const current = QA_PAIRS[currentIndex];

  return (
    <section
      aria-labelledby="demo-heading"
      className="bg-ink-900/30 py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2
            id="demo-heading"
            className="text-3xl md:text-4xl font-display font-bold text-white"
          >
            See what an AI interview looks like.
          </h2>
          <p className="text-base text-ink-400 max-w-xl">
            The AI asks. You answer. By the end you actually know what you&apos;re building.
          </p>
        </div>

        <motion.div
          variants={fadeSlideUp(reducedMotion)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="w-full max-w-2xl bg-ink-900 border border-white/10 rounded-2xl overflow-hidden"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-ink-950/50">
            <div className="w-3 h-3 rounded-full bg-red-500/70" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" aria-hidden="true" />
            <span className="ml-3 text-xs text-ink-600 font-mono">
              preflight — interview session
            </span>
          </div>

          {/* Messages */}
          <div className="p-6 flex flex-col gap-6 min-h-[200px]">
            {/* AI question */}
            <div key={`q-${currentIndex}`} className="flex flex-col gap-1 transition-opacity duration-300">
              <span className="text-xs font-medium text-horizon-400 font-mono">AI</span>
              <p className="text-sm text-horizon-300 leading-relaxed">{current.question}</p>
            </div>

            {/* User answer with typewriter */}
            {displayedAnswer && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-ink-500 font-mono">You</span>
                <p className="text-sm text-white leading-relaxed font-mono">
                  {displayedAnswer}
                  <span className="animate-pulse">|</span>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
