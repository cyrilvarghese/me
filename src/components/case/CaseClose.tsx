"use client";

import { useRouter } from "next/navigation";
import styles from "./CaseClose.module.css";

/** Fixed close control: collapses the page back into the card frame it
    expanded from.

    Next runs no view transition for history traversals (probed
    2026-08-17: startViewTransition never fires on popstate), and React
    activates its vt names only inside its own transitions — nor do the
    vt-* attributes exist after client-side navigation. So the reverse
    morph is driven manually on our own data-case-visual hooks: name the
    hero inline, start a native view transition, go back, name the
    restored card before the new-state capture. Falls back to a plain
    navigation without support, under reduced motion, or for direct
    visitors with no history. */
export default function CaseClose({ slug }: { slug: string }) {
  const router = useRouter();

  const close = () => {
    const hasHistory = window.history.length > 1;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const name = `case-visual-${slug}`;
    const hero = document.querySelector<HTMLElement>(`[data-case-visual="${slug}"]`);

    if (!hasHistory) {
      router.push("/#work");
      return;
    }
    if (reduce || !hero || typeof document.startViewTransition !== "function") {
      router.back();
      return;
    }

    hero.style.viewTransitionName = name;
    const vt = document.startViewTransition(async () => {
      router.back();
      // rendering is frozen inside this callback, and rAF does not tick
      // while it is — poll with timers (bounded) for the restored home
      // page to bring the matching card back
      const card = await new Promise<HTMLElement | null>((resolve) => {
        const t0 = performance.now();
        const poll = () => {
          const el = [
            ...document.querySelectorAll<HTMLElement>(`[data-case-visual="${slug}"]`),
          ].find((e) => e !== hero);
          if (el) return resolve(el);
          if (performance.now() - t0 > 1000) return resolve(null);
          setTimeout(poll, 16);
        };
        poll();
      });
      if (card) {
        card.style.viewTransitionName = name;
        // scroll restoration lands with the commit — a short beat lets
        // the card settle at its restored position before the capture
        await new Promise((r) => setTimeout(r, 50));
      }
    });
    vt.finished.finally(() => {
      document
        .querySelectorAll<HTMLElement>(`[data-case-visual="${slug}"]`)
        .forEach((el) => el.style.removeProperty("view-transition-name"));
    });
  };

  return (
    <button
      type="button"
      aria-label="Close case study"
      className={`mono-label btn btn-icon ${styles.close}`}
      onClick={close}
    >
      ×
    </button>
  );
}
