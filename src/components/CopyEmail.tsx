"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL } from "@/lib/data/contact";
import styles from "./CopyEmail.module.css";

const IDLE = "Start a conversation";
const DONE = "Email copied";
/* long enough to read the confirmation, short enough that a visitor who
   looks back at the button finds it inviting again rather than stuck */
const HOLD_MS = 2400;

/**
 * The site's one contact control: puts the address on the clipboard and
 * says so, instead of handing the visitor off to whatever their browser
 * thinks a mail client is.
 *
 * The label swaps inside a fixed-width slot — a hidden copy of the
 * longer label holds the box open, so confirming does not resize the
 * control or shift what sits under it. Where the clipboard is refused
 * (an insecure origin, a browser that will not grant it) the click
 * falls through to mailto: rather than doing nothing visible.
 */
export default function CopyEmail({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), HOLD_MS);
  };

  return (
    <button
      type="button"
      className={`mono-label btn ${className}`.trim()}
      onClick={copy}
    >
      <span className={styles.slot}>
        {/* holds the width; never read out, never seen */}
        <span className={styles.spacer} aria-hidden="true">
          {IDLE}
        </span>
        <span className={styles.label} aria-live="polite">
          {copied ? DONE : IDLE}
        </span>
      </span>
    </button>
  );
}
