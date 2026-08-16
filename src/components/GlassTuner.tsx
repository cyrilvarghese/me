"use client";

import { useState } from "react";

/** Dev-only sliders for the header glass. Values feed the CSS custom
    properties live; bake the chosen numbers into Header.module.css and
    delete this once tuned (never ships — stripped from the build). */
export default function GlassTuner() {
  const [tint, setTint] = useState(78);
  const [blur, setBlur] = useState(10);
  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 500,
        display: "grid",
        gap: 8,
        padding: "0.75rem 1rem",
        background: "rgba(21, 17, 17, 0.92)",
        border: "1px solid rgba(248, 244, 242, 0.25)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "#f8f4f2",
      }}
    >
      <label>
        glass tint {tint}%
        <input
          type="range"
          min={30}
          max={95}
          value={tint}
          style={{ display: "block", width: 180 }}
          onChange={(e) => {
            const v = Number(e.currentTarget.value);
            setTint(v);
            document.documentElement.style.setProperty("--glass-tint", `${v}%`);
          }}
        />
      </label>
      <label>
        glass blur {blur}px
        <input
          type="range"
          min={0}
          max={30}
          value={blur}
          style={{ display: "block", width: 180 }}
          onChange={(e) => {
            const v = Number(e.currentTarget.value);
            setBlur(v);
            document.documentElement.style.setProperty("--glass-blur", `${v}px`);
          }}
        />
      </label>
    </div>
  );
}
