"use client";

import { useRef } from "react";
import { m } from "motion/react";
import { experience } from "@/lib/data/experience";
import styles from "./About.module.css";

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

/* Hidden start state comes from .fx-hidden (globals.css), gated behind
   prefers-reduced-motion: no-preference — so reduced users get the
   whole timeline straight from CSS, with no initial prop to undo. */
const fromY24 = { ["--fx-from" as string]: "translateY(24px)" };
const viewport = { once: true, margin: "0px 0px -18% 0px" };

export default function About() {
  const filmRef = useRef<HTMLVideoElement>(null);

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
    <section className={`section-shell ${styles.section}`} id="about" aria-label="About">
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
            <span className={styles.spark}>curiosity and wonder still drives my work</span>
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
        <div
          className={styles.portraitFrame}
          onPointerEnter={playFilm}
          onPointerLeave={stopFilm}
        >
          <span className={styles.glow} aria-hidden="true" />
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
