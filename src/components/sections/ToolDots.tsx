import { capabilities } from "@/lib/data/capabilities";
import type { CaseStudy } from "@/lib/data/cases";
import styles from "./CaseStudies.module.css";

/** Spec §24: which capabilities were involved — no percentages, no ratings. */
export default function ToolDots({ tools }: { tools: CaseStudy["tools"] }) {
  return (
    <div>
      <p className={`mono-label ${styles.dotsTitle}`}>Tools used</p>
      <ul className={styles.dots}>
        {capabilities.map((c) => (
          <li key={c.id} className={`mono-label ${styles.dotRow}`}>
            <span>{c.label}</span>
            <span className={tools[c.id] ? styles.dotOn : styles.dotOff} aria-hidden="true">
              {tools[c.id] ? "●" : "○"}
            </span>
            <span className="sr-only">{tools[c.id] ? "involved" : "not involved"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
