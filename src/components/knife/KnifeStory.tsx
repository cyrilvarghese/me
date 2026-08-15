"use client";

import { useRef } from "react";
import { capabilities } from "@/lib/data/capabilities";
import { INTRO_END, COMPLETE_START, windowFor } from "@/lib/data/scroll";
import { gsap, useGSAP } from "@/lib/gsap";
import KnifeCanvas from "./KnifeCanvas";
import ToolLabels from "./ToolLabels";
import styles from "./knife-story.module.css";

/**
 * The 600vh knife story (spec §13–18). One knife across the whole page:
 * the hero's knife travels into this stage (in-place swap at pin start),
 * unfolds window by window, then — text out, knife to center, statement
 * beneath (user storyboard) — hands off to the morph section's knife.
 */
export default function KnifeStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          compact: "(max-width: 768px)",
          hoverOk: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { motionOk, compact, hoverOk } = ctx.conditions as {
            motionOk: boolean;
            compact: boolean;
            hoverOk: boolean;
          };
          if (!motionOk) return;

          const wrap = wrapRef.current;
          const stage = stageRef.current;

          // §32: compress blade angles on small screens
          const factor = compact ? 0.8 : 1;

          // ---- hero → story: the hero knife travels to this stage's knife
          // box as the hero scrolls out, then the story knife takes over
          // in-place at pin start.
          const heroKnife = document.querySelector<HTMLElement>("[data-hero-knife]");
          const heroSection = document.getElementById("top");
          if (heroKnife && heroSection && wrap && stage) {
            const target = () => {
              const wr = wrap.getBoundingClientRect();
              const st = stage.getBoundingClientRect();
              return { x: wr.left + wr.width / 2, y: wr.top - st.top + wr.height / 2, w: wr.width };
            };
            const cur = (p: string) => Number(gsap.getProperty(heroKnife, p)) || 0;

            gsap.to(heroKnife, {
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: 0.4,
                invalidateOnRefresh: true,
              },
              x: () => {
                const r = heroKnife.getBoundingClientRect();
                return target().x - (r.left + r.width / 2 - cur("x"));
              },
              y: () => {
                const r = heroKnife.getBoundingClientRect();
                const cyPage = r.top + window.scrollY + r.height / 2 - cur("y");
                return target().y - cyPage + heroSection.offsetHeight;
              },
              scale: () => {
                const r = heroKnife.getBoundingClientRect();
                const s = Number(gsap.getProperty(heroKnife, "scaleX")) || 1;
                return target().w / (r.width / s);
              },
              rotation: 0,
              transformOrigin: "50% 50%",
              ease: "power1.inOut",
            });
          }

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
            },
          });

          tl.to({}, { duration: 1 }, 0);

          // in-place swap: story knife appears exactly where the hero knife
          // landed; the hero knife hides in the same tick (reversible)
          if (wrap) tl.set(wrap, { autoAlpha: 1 }, 0.004);
          if (heroKnife) tl.set(heroKnife, { autoAlpha: 0 }, 0.005);

          capabilities.forEach((c, i) => {
            const { start, end } = windowFor(i);
            const dur = end - start;
            const blade = `[data-tool="${c.id}"]`;
            const panel = `[data-panel="${c.id}"]`;
            const open = c.openAngle * factor;
            const last = i === capabilities.length - 1;

            // §15 mechanical overshoot: sweep past resting angle, settle back.
            tl.to(blade, { rotation: open * 1.06, duration: dur * 0.8, ease: "power3.inOut" }, start).to(
              blade,
              { rotation: open, duration: dur * 0.2, ease: "power1.out" },
              start + dur * 0.8
            );

            tl.to(panel, { autoAlpha: 1, y: 0, duration: 0.025, ease: "power2.out" }, start + 0.005).to(
              `${panel} [data-tag]`,
              { autoAlpha: 1, y: 0, duration: 0.02, stagger: 0.008, ease: "power2.out" },
              start + 0.022
            );

            // the last panel goes out to the left (user storyboard)
            const fadeAt = last ? COMPLETE_START : end;
            tl.to(
              panel,
              { autoAlpha: 0, x: last ? -60 : 0, y: -16, duration: 0.018, ease: "power2.in" },
              fadeAt - 0.014
            );

            tl.to(`[data-label="${c.id}"]`, { autoAlpha: 1, duration: 0.015 }, start + dur * 0.55);
          });

          tl.to('[data-panel="intro"]', { autoAlpha: 0, y: -16, duration: 0.02, ease: "power2.in" }, INTRO_END - 0.012);

          // storyboard order: text out → knife moves to center → statement
          // appears beneath the centered knife.
          if (wrap) {
            const targetW = () => Math.min(0.58 * window.innerHeight, 0.54 * window.innerWidth, 660);
            tl.to(
              wrap,
              {
                x: () => {
                  const r = wrap.getBoundingClientRect();
                  const cur = (Number(gsap.getProperty(wrap, "x")) as number) || 0;
                  return cur + window.innerWidth / 2 - (r.left + r.width / 2);
                },
                y: () => {
                  const r = wrap.getBoundingClientRect();
                  const cur = (Number(gsap.getProperty(wrap, "y")) as number) || 0;
                  return cur + window.innerHeight / 2 - (r.top + r.height / 2);
                },
                scale: () => {
                  const r = wrap.getBoundingClientRect();
                  const s = (Number(gsap.getProperty(wrap, "scale")) as number) || 1;
                  return targetW() / (r.width / s);
                },
                duration: 0.05,
                ease: "power2.inOut",
              },
              0.9
            );
          }

          tl.to("[data-story-statement]", { autoAlpha: 1, y: 0, duration: 0.028, ease: "power2.out" }, 0.952);
          tl.to("[data-story-line]", { autoAlpha: 1, y: 0, duration: 0.018, ease: "power2.out" }, 0.978);

          // §39: once fully open, hovering a blade dims the others (desktop only)
          if (hoverOk && !compact && wrap) {
            const tools = Array.from(wrap.querySelectorAll<HTMLElement>("[data-tool]"));
            const st = tl.scrollTrigger;

            const onOver = (e: MouseEvent) => {
              const hit = (e.target as Element | null)?.closest?.("[data-tool]");
              if (!hit || !st || st.progress < COMPLETE_START) return;
              const id = hit.getAttribute("data-tool");
              tools.forEach((t) =>
                gsap.to(t, { opacity: t === hit ? 1 : 0.55, duration: 0.2, overwrite: "auto" })
              );
              gsap.to(`[data-label]:not([data-label="${id}"])`, { color: "#9a9a9a", duration: 0.2, overwrite: "auto" });
              gsap.to(`[data-label="${id}"]`, { color: "#f8f8f8", duration: 0.2, overwrite: "auto" });
            };

            const onLeave = () => {
              tools.forEach((t) => gsap.to(t, { opacity: 1, duration: 0.2, overwrite: "auto" }));
              gsap.to("[data-label]", { color: "#ededed", duration: 0.2, overwrite: "auto" });
            };

            wrap.addEventListener("mouseover", onOver);
            wrap.addEventListener("mouseleave", onLeave);
            return () => {
              wrap.removeEventListener("mouseover", onOver);
              wrap.removeEventListener("mouseleave", onLeave);
            };
          }
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.story} id="work" aria-label="Capabilities">
      <div className={styles.stage} ref={stageRef}>
        <div className={styles.stageInner}>
          <div className={styles.narrative}>
            <div className={styles.panel} data-panel="intro">
              <p className={`serif-display ${styles.statement}`}>
                Sometimes the problem isn&apos;t a design problem.
              </p>
            </div>

            {capabilities.map((c, i) => (
              <div key={c.id} className={`${styles.panel} ${styles.hiddenPanel}`} data-panel={c.id}>
                <p className={`mono-label ${styles.eyebrow}`}>
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span> / {c.label}
                </p>
                <h2 className={`serif-display ${styles.statement}`}>{c.statement}</h2>
                <ul className={styles.tags}>
                  {c.tags.map((t) => (
                    <li key={t} data-tag className={`mono-label ${styles.tag}`}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.knifeWrap} ref={wrapRef} data-story-handoff="">
            <KnifeCanvas />
            <ToolLabels />
          </div>
        </div>

        <div className={styles.centerCopy} data-story-handoff="">
          <h2 className={`serif-display ${styles.centerStatement}`} data-story-statement="">
            One person.
            <br />
            Multiple points of leverage.
          </h2>
          <p className={styles.centerLine} data-story-line="">
            Different problems require different tools.
          </p>
        </div>
      </div>
    </section>
  );
}
