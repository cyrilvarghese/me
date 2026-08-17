"use client";

import { useRouter } from "next/navigation";
import styles from "./CaseClose.module.css";

/** Fixed close control: collapses the page back into the card frame it
    expanded from. Browser-back restores the home scroll position, so
    the vt pair (case-visual-<slug>) re-forms and the hero morphs into
    the same space. Direct visitors with no history get a plain
    navigation to the work grid (history.length is a heuristic — an
    external referrer still means back, which is honest back-button
    semantics). */
export default function CaseClose() {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Close case study"
      className={`mono-label ${styles.close}`}
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push("/#work");
      }}
    >
      ×
    </button>
  );
}
