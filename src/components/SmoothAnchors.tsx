"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Smooth in-page anchor travel. CSS scroll-behavior is off the table —
 * it would animate ScrollTrigger's per-frame scroll writes and turn the
 * scrubbed sections to mush — so GSAP's ScrollToPlugin drives the glide.
 * Duration scales with distance; autoKill hands control back the moment
 * the visitor scrolls.
 */
export default function SmoothAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const href = link.getAttribute("href")!;
      const target = href.length > 1 ? document.querySelector(href) : null;
      const y =
        target ? target.getBoundingClientRect().top + window.scrollY : 0;

      e.preventDefault();
      const distance = Math.abs(y - window.scrollY);
      gsap.to(window, {
        scrollTo: { y, autoKill: true },
        duration: gsap.utils.clamp(0.5, 1.2, 0.4 + distance / (window.innerHeight * 6)),
        ease: "power2.inOut",
        overwrite: "auto",
      });
      history.pushState(null, "", href);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
