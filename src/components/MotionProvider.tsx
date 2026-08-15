"use client";

import { LazyMotion, domAnimation, MotionConfig } from "motion/react";

/**
 * Slim Framer Motion setup: LazyMotion + `m` components load only the
 * domAnimation feature set; strict mode errors if the full <motion.*>
 * namespace sneaks in. MotionConfig reducedMotion="user" converts
 * transform animations to opacity-only for prefers-reduced-motion users
 * (spec §34: "transitions use simple opacity").
 *
 * Scope: Framer Motion owns the time-based once-reveals. The three
 * scrubbed pinned sections (KnifeStory, OutcomeTransition, FinalCTA)
 * stay on GSAP ScrollTrigger.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
