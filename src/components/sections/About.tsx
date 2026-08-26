"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { m } from "motion/react";
import { experience } from "@/lib/data/experience";
import styles from "./About.module.css";

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

/* Hidden start state comes from .fx-hidden (globals.css), gated behind
   prefers-reduced-motion: no-preference — so reduced users get the
   whole timeline straight from CSS, with no initial prop to undo. */
const fromY24 = { ["--fx-from" as string]: "translateY(24px)" };
const viewport = { once: true, margin: "0px 0px -18% 0px" };

/* How far the backlight is allowed to lean toward the pointer, in px.
   Small on purpose: the disc is ~380px across, so this reads as the
   light shifting rather than as something chasing the cursor. */
const LEAN_PX = 16;

export default function About() {
  const filmRef = useRef<HTMLVideoElement>(null);
  const leanRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLAnchorElement>(null);
  const rimRef = useRef<HTMLSpanElement>(null);
  const raf = useRef<number | undefined>(undefined);
  const warmed = useRef(false);

  /* Where the reward lives: hovering the portrait plays a film, and
     nothing on the page says so. The invitation is the light leaning
     toward the reader before they arrive (below) — it does not label
     itself, and the disc no longer moves to ask (Cyril, 2026-08-25). */
  const canHover = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* The backlight leans toward the pointer while it is anywhere in the
     section. The damping is the CSS transition on .glowLean, not a
     spring here: the light arrives a beat late, which is what keeps it
     ambient instead of reading as a cursor toy.

     One rAF per move, and the rect is read inside it — a pointermove
     fires far faster than the screen redraws, and a layout read per
     event is how that turns into jank. */
  const trackPointer = (e: React.PointerEvent) => {
    const el = leanRef.current;
    const frame = frameRef.current;
    if (!el || !frame || !canHover()) return;
    frame.dataset.near = "";
    const { clientX, clientY } = e;
    if (raf.current !== undefined) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = frame.getBoundingClientRect();
      const ox = clientX - (r.left + r.width / 2);
      const oy = clientY - (r.top + r.height / 2);
      const dx = Math.max(-1, Math.min(1, ox / r.width));
      const dy = Math.max(-1, Math.min(1, oy / r.height));
      el.style.transform = `translate3d(${dx * LEAN_PX}px, ${dy * LEAN_PX}px, 0)`;
      /* the lit arc is drawn at the top of the ring, so aiming it is a
         rotation: atan2 reads 0° at three o'clock, +90 brings it round
         to twelve */
      if (rimRef.current) {
        const deg = (Math.atan2(oy, ox) * 180) / Math.PI + 90;
        rimRef.current.style.transform = `rotate(${deg.toFixed(1)}deg)`;
      }
    });
  };

  const restPointer = () => {
    if (raf.current !== undefined) cancelAnimationFrame(raf.current);
    if (leanRef.current) leanRef.current.style.transform = "translate3d(0, 0, 0)";
    if (frameRef.current) delete frameRef.current.dataset.near;
  };

  /* A pointer in this section is a pointer that might hover the
     portrait, and that is the moment to fetch the film — preload="none"
     otherwise means the first hover waits on 660KB. Once only, and never
     before play(), so load() can never interrupt a running clip. */
  const warmFilm = () => {
    const v = filmRef.current;
    if (!v || warmed.current || !canHover()) return;
    warmed.current = true;
    v.preload = "auto";
    v.load();
  };

  useEffect(() => () => {
    if (raf.current !== undefined) cancelAnimationFrame(raf.current);
  }, []);

  /* The portrait plays under the pointer, ONCE, and then holds on its
     last frame — it is a three-second moment, not a loop, and a clip
     going round and round in the corner of an otherwise still page pulls
     the eye off the copy. Leaving rewinds it, so the next hover is the
     moment again from the top rather than a jump back to the start.

     Reduced motion never starts it — the CSS hides it there too, so the
     photograph is all that exists. play() is a promise that browsers
     reject when their autoplay policy says no; the catch is what keeps
     that from throwing, and the still photograph underneath is already
     the fallback. */
  const playFilm = () => {
    const v = filmRef.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true;
    // belt and braces: leaving rewinds, but if the pointer never left and
    // the clip ran out, play() on an ended video would sit on the last frame
    if (v.ended) v.currentTime = 0;
    void v.play().catch(() => {});
  };

  const stopFilm = () => {
    const v = filmRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <section
      className={`section-shell ${styles.section}`}
      id="about"
      aria-label="About"
      onPointerMove={trackPointer}
      onPointerEnter={warmFilm}
      onPointerLeave={restPointer}
    >
      <p className={`mono-label ${styles.eyebrow}`}>About</p>

      <div className={styles.intro}>
        <div>
          <h2 className={`serif-display ${styles.title}`}>
            Where design meets code: creating products that scale from 0&rarr;1
          </h2>
          {/* One highlight in the whole block, and it is the sentence the
              section is about. There were three treatments here — this
              phrase in red, the clause around it in bold, and the whole of
              the next paragraph in bold again — which is enough emphasis
              that none of it emphasised anything (Cyril, 2026-08-21). */}
          <p className={styles.lede}>
            From sketching stories as a kid to designing products as a designer, that
            same sense of{" "}
            <span className={styles.spark}>curiosity and wonder drives my work</span>
            .
          </p>
          <p className={styles.lede}>
            With a background spanning product design, engineering and storytelling,
            I&apos;m now a digital product design engineer exploring how AI can reshape
            the way we learn, build and solve problems.
          </p>
        </div>
        {/* width/height are the real intrinsic size of the file: the box is
            reserved before the image lands, so the timeline below it never
            jumps. next/image is not in play here — the export is static and
            images are unoptimized, so every asset is pre-sized by hand. */}
        {/* The portrait and its signpost are one column. The five rungs
            below are the career; /about is the story behind it, and the
            photograph is the part of that story already on the page — so
            the way through sits under it rather than at the end of the
            lede. One quiet link rather than a nav item: the header's
            scroll-spy is position-based, so a route in that row would
            have nothing to mark as current. */}
        <div className={styles.portraitCol}>
          {/* The frame is the link — the disc has carried cursor: pointer
              since it grew the hover film, and an affordance that leads
              nowhere is a promise the page does not keep. aria-label
              rather than the photograph's alt: a link is named by where
              it goes, and "Cyril at a pottery wheel" names what it shows. */}
          <Link
            href="/about"
            ref={frameRef}
            aria-label="Cyril’s journey so far"
            className={styles.portraitFrame}
            onPointerEnter={playFilm}
            onPointerLeave={stopFilm}
          >
            {/* the glow drifts on a keyframe animation of its own, and a
                CSS animation beats an inline transform — so the lean is
                written to this wrapper instead */}
            <span ref={leanRef} className={styles.glowLean} aria-hidden="true">
              <span className={styles.glow} />
            </span>
            <img
              src="/assets/profile.webp"
              width={1100}
              height={1100}
              alt='Cyril at a pottery wheel in a workshop, marked "me" in the photograph.'
              className={styles.portrait}
            />
            {/* The same moment, moving. aria-hidden and untabbable: it says
                nothing the photograph's alt text does not already say, so to
                a screen reader it is not a second thing to announce.

                preload="none" keeps its 660KB off the initial load — a
                phone can never hover, so it would be paid for and never
                spent. poster is the photograph itself, so the first hover
                cannot flash black while the first frame decodes. */}
            <video
              ref={filmRef}
              className={styles.portraitFilm}
              src="/assets/profile-hover-video.mp4"
              poster="/assets/profile.webp"
              width={1280}
              height={720}
              muted
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            />
            {/* above the film, so the glint survives the hover swap */}
            <span ref={rimRef} className={styles.rim} aria-hidden="true" />
          </Link>
          <Link href="/about" className={`mono-label link ${styles.more}`}>
            My journey so far &rarr;
          </Link>
        </div>
      </div>

      <ol className={styles.timeline}>
        {experience.map((role, i) => (
          <m.li
            key={role.title + role.from}
            className={`${styles.entry} fx-hidden`}
            style={fromY24}
            initial={false}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: EASE_OUT_CUBIC, delay: i * 0.08 }}
          >
            <p className={`mono-label ${styles.years}`}>{role.years}</p>
            {/* the rung: the dot sits on the rule that runs the column, and
                only the running role's dot is filled */}
            <span
              className={`${styles.dot} ${i === 0 ? styles.dotNow : ""}`}
              aria-hidden="true"
            />
            <div className={styles.detail}>
              <h3 className={styles.role}>{role.title}</h3>
              <p className={`mono-label ${styles.org}`}>{role.org}</p>
              {role.body && <p className={styles.body}>{role.body}</p>}
              <p className={`mono-label ${styles.tools}`}>{role.tools.join(" · ")}</p>
            </div>
          </m.li>
        ))}
      </ol>
    </section>
  );
}
