import { readFileSync } from "node:fs";
import { join } from "node:path";
import "./diagram-motion.css";
import styles from "./CaseDiagram.module.css";

/** Inlines a diagram SVG at build time (server component, static export —
    this runs once during `next build`, never in the browser).

    Inline rather than <img> so the drawing lives in the document: its text
    then inherits the site's mono voice, and one shared keyframes sheet
    animates every diagram instead of each file carrying its own copy. */
export default function CaseDiagram({ src }: { src: string }) {
  const svg = readFileSync(join(process.cwd(), "public", src), "utf8");
  return (
    <div
      className={styles.diagram}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
