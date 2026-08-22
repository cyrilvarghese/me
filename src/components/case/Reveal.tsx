"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { reveal } from "@/lib/motion";

type Props = {
  className?: string;
  children: ReactNode;
  id?: string;
  /** Seconds to hold this element back behind the one it belongs with —
      a picture beside a paragraph reads better arriving just after it.
      Only the delay is exposed: duration, easing, offset and the
      once-only viewport stay the single contract in motion.ts. */
  delay?: number;
  "aria-label"?: string;
};

/**
 * The block reveal, as the element itself rather than a wrapper around it.
 *
 * Most case blocks are server components. Giving them an `m.section` root
 * directly would push `"use client"` into every one of them; letting this
 * file be the section instead keeps the DOM identical, hydrates one
 * component, and leaves the children server-rendered.
 *
 * `m`, never `motion.*` — LazyMotion runs in strict mode.
 */
export function RevealSection({ className, children, delay, ...rest }: Props) {
  const props = reveal(className);
  return (
    <m.section
      {...props}
      transition={delay ? { ...props.transition, delay } : props.transition}
      {...rest}
    >
      {children}
    </m.section>
  );
}

/** Same reveal for a block whose root is a div — CaseFigure's head, where
    the drawing below it already has entry motion of its own. */
export function RevealDiv({ className, children, delay, ...rest }: Props) {
  const props = reveal(className);
  return (
    <m.div
      {...props}
      transition={delay ? { ...props.transition, delay } : props.transition}
      {...rest}
    >
      {children}
    </m.div>
  );
}
