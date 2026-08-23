"use client";

import { useEffect } from "react";

/**
 * Puts the light palette (tokens.css, `[data-theme="light"]`) on <html>
 * while the About page is mounted, and takes it off again on the way
 * out — so navigating Home lands back on the dark ground.
 *
 * This covers client-side navigation. A hard load is handled by the
 * inline script in about/layout.tsx, which runs before first paint;
 * React does not re-run that script on a client transition, which is
 * why both exist.
 */
export default function LightRoom() {
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = "light";
    return () => {
      delete html.dataset.theme;
    };
  }, []);
  return null;
}
