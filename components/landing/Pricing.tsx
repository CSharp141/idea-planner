"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { scaleUp, staggerContainer, VIEWPORT } from "./motion/motionTokens";

const FREE_FEATURES = [
  "Up to 5 projects",
  "10 AI interviews per month",
  "Tag filtering",
  "Inline notes",
  "GitHub sign-in or magic link",
];

const PRO_FEATURES = [
  "Unlimited projects",
  "Unlimited AI interviews",
  "AI-generated project summaries",
  "GitHub URL per project",
  "Tag filtering and notes",
  "Priority support",
];

const TEAM_FEATURES = [
  "Everything in Pro",
  "Up to 5 team members",
  "Shared project workspace",
  "Collaborative projects",
  "GitHub Org SSO",
  "Admin dashboard",
];

const PRO_EMAIL = "mailto:callum.j.sharp02@gmail.com?subject=Preflight Pro Interest";
const TEAM_EMAIL = "mailto:callum.j.sharp02@gmail.com?subject=Preflight Team Interest";

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="flex flex-col gap-3 flex-1">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
          <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" aria-hidden="true" />
          {f}
        </li>
      ))}
    </ul>
  );
}

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="bg-gray-950 py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center gap-12">
        <h2
          id="pricing-heading"
          className="text-3xl md:text-4xl font-bold text-white text-center"
        >
          Simple, transparent pricing
        </h2>

        {/* Billing toggle */}
        <div
          role="group"
          aria-label="Billing period"
          className="flex items-center bg-gray-900 border border-white/10 rounded-full p-1"
        >
          <button
            onClick={() => setAnnual(false)}
            aria-pressed={!annual}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              !annual ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            aria-pressed={annual}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex items-center gap-1.5 ${
              annual ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Annual
            <span className="text-xs text-green-400 font-medium">Save 22%</span>
          </button>
        </div>

        {/* Cards */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full"
        >
          {/* Free */}
          <motion.div
            variants={scaleUp(reducedMotion)}
            className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 flex flex-col gap-6"
          >
            <div>
              <p className="text-sm font-medium text-gray-400 mb-3">Free</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-sm text-gray-400">/ forever</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Get started without a credit card.</p>
            </div>
            <hr className="border-white/10" />
            <FeatureList features={FREE_FEATURES} />
            <Link
              href="/login"
              className="w-full py-3 rounded-xl font-semibold text-sm text-center transition-colors bg-white/10 hover:bg-white/15 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Pro — highlighted */}
          <motion.div
            variants={scaleUp(reducedMotion)}
            className="bg-indigo-950/30 border border-indigo-500 rounded-2xl p-8 flex flex-col gap-6 relative"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </span>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-3">Pro</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  {annual ? "$7" : "$9"}
                </span>
                <span className="text-sm text-gray-400">/ mo</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                For builders who think seriously about ideas.
              </p>
            </div>
            <hr className="border-indigo-500/30" />
            <FeatureList features={PRO_FEATURES} />
            <a
              href={PRO_EMAIL}
              className="w-full py-3 rounded-xl font-semibold text-sm text-center transition-colors bg-indigo-600 hover:bg-indigo-500 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
            >
              Get Pro
            </a>
          </motion.div>

          {/* Team */}
          <motion.div
            variants={scaleUp(reducedMotion)}
            className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 flex flex-col gap-6"
          >
            <div>
              <p className="text-sm font-medium text-gray-400 mb-3">Team</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  {annual ? "$24" : "$29"}
                </span>
                <span className="text-sm text-gray-400">/ mo</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Share the workspace with your whole team.
              </p>
            </div>
            <hr className="border-white/10" />
            <FeatureList features={TEAM_FEATURES} />
            <a
              href={TEAM_EMAIL}
              className="w-full py-3 rounded-xl font-semibold text-sm text-center transition-colors bg-white/10 hover:bg-white/15 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
            >
              Contact Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
