"use client";

import { useRouter } from "next/navigation";
import { takeCaseOrigin } from "@/lib/nav/case-origin";
import styles from "./CaseBack.module.css";

/** The case page's one exit, in the hero: collapses the page back into
    the card it expanded from.

    Next runs no view transition for history traversals (probed
    2026-08-17: startViewTransition never fires on popstate), and React
    activates its vt names only inside its own transitions — nor do the
    vt-* attributes exist after client-side navigation. So the reverse
    morph is driven manually on our own data-case-visual hooks: name the
    hero inline, start a native view transition, go back, name the
    restored card before the new-state capture.

    The morph needs the card to be one history entry behind, at the
    scroll position it was left at, so it runs only for a visitor who
    arrived by clicking that card (see lib/nav/case-origin). Everyone
    else — direct link, no view-transition support, reduced motion —
    gets a plain navigation to the work list, which is where this
    control claims to go either way. */
export default function CaseBack({ slug }: { slug: string }) {
  const router = useRouter();

  const back = () => {
    const cameFromCard = takeCaseOrigin(slug);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const name = `case-visual-${slug}`;
    const hero = document.querySelector<HTMLElement>(`[data-case-visual="${slug}"]`);

    /* The landing at #work is a jump, never a glide. html carries
       scroll-behavior: smooth (globals.css), so the restore on the way
       back animates — under the collapse that reads as the page sliding
       around beneath the morph. Clear it inline for the length of the
       navigation and put it back after, so in-page anchors on the home
       page keep their travel. */
    const root = document.documentElement;
    const inlineBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    const restoreBehavior = () => {
      root.style.scrollBehavior = inlineBehavior;
    };

    const canMorph =
      cameFromCard && !reduce && hero && typeof document.startViewTransition === "function";

    if (!canMorph) {
      router.push("/#work");
      setTimeout(restoreBehavior, 600);
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
      restoreBehavior();
    });
  };

  return (
    <button
      type="button"
      className={`mono-label btn btn-ghost ${styles.back}`}
      onClick={back}
    >
      ← Work
    </button>
  );
}
