import type { Variants } from "framer-motion";

export const DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
} as const;

export const EASE = {
  enter: "easeOut",
  exit: "easeIn",
} as const;

export const STAGGER = 0.15;

export const VIEWPORT = {
  once: true,
  amount: 0.2,
} as const;

export function fadeSlideUp(reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : DURATION.normal, ease: EASE.enter },
    },
  };
}

export function fadeSlideLeft(reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, x: reducedMotion ? 0 : -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reducedMotion ? 0 : DURATION.slow, ease: EASE.enter },
    },
  };
}

export function fadeSlideRight(reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, x: reducedMotion ? 0 : 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reducedMotion ? 0 : DURATION.slow, ease: EASE.enter },
    },
  };
}

export function scaleUp(reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, scale: reducedMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: reducedMotion ? 0 : DURATION.normal, ease: EASE.enter },
    },
  };
}

export function staggerContainer(staggerChildren = STAGGER): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren } },
  };
}

export function heroFadeIn(reducedMotion: boolean, delayIndex: number) {
  return {
    initial: { opacity: 0, y: reducedMotion ? 0 : 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : DURATION.normal,
        ease: EASE.enter,
        delay: reducedMotion ? 0 : delayIndex * 0.1,
      },
    },
  };
}
