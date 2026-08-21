"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { experience } from "@/lib/data/experience";
import styles from "./About.module.css";

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

/* Hidden start state comes from .fx-hidden (globals.css), gated behind
   prefers-reduced-motion: no-preference — so reduced users get the
   whole timeline straight from CSS, with no initial prop to undo. */
const fromY24 = { ["--fx-from" as string]: "translateY(24px)" };
const viewport = { once: true, margin: "0px 0px -18% 0px" };

/* How the hover film is fitted inside the portrait circle. The photograph
   under it is a 3:2 frame padded out to a square, not a crop, so the film
   is contained rather than covered — cover threw away the sides of the
   16:9 and enlarged what was left, and the scene jumped in size the moment
   the pointer arrived.

   Contain gets the two close but not identical: the film was shot tighter
   than the photograph, so the same fit still leaves the people slightly
   larger. SCALE / X / Y close that gap by hand. Dial them on the bench
   below (any page with ?tune) and bring the numbers back here. */
const FILM_SCALE = 1;
const FILM_X = 0;
const FILM_Y = 0;

export default function About() {
  const filmRef = useRef<HTMLVideoElement>(null);
  /* ?tune in the URL swaps the shipped framing for live sliders — a
     bench for matching the film to the photograph, not a shipped
     control, so it costs nothing unasked (same pattern as CaseJourney) */
  const [tune, setTune] = useState<null | { scale: number; x: number; y: number }>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("tune")) {
      setTune({ scale: FILM_SCALE, x: FILM_X, y: FILM_Y });
    }
  }, []);

  const scale = tune?.scale ?? FILM_SCALE;
  const x = tune?.x ?? FILM_X;
  const y = tune?.y ?? FILM_Y;

  /* The portrait plays under the pointer. Deliberately not autoplaying:
     the film is a reward for hovering, and a looping video in the corner
     of a page that is otherwise still would pull the eye off the copy.

     Reduced motion never starts it — the CSS hides it there too, so the
     photograph is all that exists. play() is a promise that browsers
     reject when their autoplay policy says no; the catch is what keeps
     that from throwing, and the still photograph underneath is already
     the fallback. */
  const playFilm = () => {
    const v = filmRef.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true;
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
          <p className={styles.lede}>
            From sketching stories as a kid to designing products as a designer, that
            same sense of{" "}
            <strong>
              <span className={styles.spark}>curiosity and wonder</span> still drives my
              work
            </strong>
            .
          </p>
          <p className={styles.lede}>
            With a background spanning product design, engineering and storytelling,
            I&apos;m now a{" "}
            <strong>
              digital product design engineer exploring how AI can reshape the way we
              learn, build and solve problems
            </strong>
            .
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
          {/* the mask is the circle; the film pans and zooms INSIDE it, so
              a scale can never push a square corner past the rim */}
          <span className={styles.portraitFilm} aria-hidden="true">
            <video
              ref={filmRef}
              className={styles.film}
              src="/assets/profile-hover-video.mp4"
              poster="/assets/profile.webp"
              width={1280}
              height={720}
              muted
              loop
              playsInline
              preload="none"
              tabIndex={-1}
              style={{ transform: `translate(${x}%, ${y}%) scale(${scale})` }}
            />
          </span>
        </div>
      </div>

      {tune && (
        <div className={styles.tuner}>
          <p className={`mono-label ${styles.tunerNote}`}>
            Hover the portrait while you drag. Bring these back to FILM_SCALE / X / Y.
          </p>
          {(
            [
              ["scale", "Zoom", 0.5, 2.5, 0.01],
              ["x", "Pan X (%)", -60, 60, 0.5],
              ["y", "Pan Y (%)", -60, 60, 0.5],
            ] as const
          ).map(([key, label, min, max, step]) => (
            <label key={key} className={`mono-label ${styles.tunerRow}`}>
              {label}
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={tune[key]}
                onChange={(e) => setTune({ ...tune, [key]: Number(e.target.value) })}
              />
              {tune[key]}
            </label>
          ))}
        </div>
      )}

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
