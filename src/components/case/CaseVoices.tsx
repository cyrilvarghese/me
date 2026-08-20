import { Mark, MarkQuote } from "./CaseMark";
import { RevealSection } from "./Reveal";
import styles from "./CaseVoices.module.css";

type Quote = { text: string; mark?: string };

/** What the people said, around the person who said it.

    Some findings are carried better by a supplied illustration than by a
    drawing — a persona mark the reader recognises immediately. Those marks
    are flat colour clip-art with black outlines, which vanish on this
    ground, so each one sits on the light disc the diagram skill reserves
    for supplied artwork rather than being filtered into a smudge.

    HTML rather than an SVG figure: quotes are two and three lines long and
    have to wrap at whatever width the page gives them. Hand-breaking lines
    in <text> is how a caption ends up clipped off its own viewBox. The
    rails stay real SVG so their dash paints the round-capped pill the house
    uses, which a CSS gradient rasterises square at this size. */
export default function CaseVoices({
  eyebrow,
  heading,
  lede,
  groups,
}: {
  eyebrow: string;
  heading?: string;
  lede?: string;
  groups: { icon: string; label: string; quotes: Quote[] }[];
}) {
  return (
    <RevealSection className={`section-shell ${styles.block}`}>
      {/* the same head as CaseFigure and CaseCompare — eyebrow in its own
          column beside the heading — so every band on the page reads as
          one template rather than as several */}
      <div className={styles.head}>
        <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
        <div>
          {heading && <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>}
          {lede && <p className={styles.lede}>{lede}</p>}
        </div>
      </div>

      {groups.map((g) => {
        /* Source order is reading order: the first half sits left of the
           persona, the rest to its right. */
        const split = Math.ceil(g.quotes.length / 2);
        return (
          <div key={g.label} className={styles.group}>
            <ul className={`${styles.side} ${styles.left}`}>
              {g.quotes.slice(0, split).map((q) => (
                <Bubble key={q.text} quote={q} />
              ))}
            </ul>

            <div className={styles.persona}>
              {/* the halo anchors to the disc, not to the persona block —
                  the label below would otherwise pull its centre down */}
              <div className={styles.discWrap}>
                <Halo left={split} right={g.quotes.length - split} />
                <Mark icon={g.icon} />
              </div>
              <p className={`mono-label ${styles.label}`}>{g.label}</p>
            </div>

            <ul className={`${styles.side} ${styles.right}`}>
              {g.quotes.slice(split).map((q) => (
                <Bubble key={q.text} quote={q} />
              ))}
            </ul>
          </div>
        );
      })}
    </RevealSection>
  );
}

/** One remark, as a list item so the side reads as a set. The quote voice
    itself is shared with every other figure built from supplied marks. */
function Bubble({ quote }: { quote: Quote }) {
  return (
    <li>
      <MarkQuote text={quote.text} mark={quote.mark} className={styles.quote} />
    </li>
  );
}

/* One ray per quote, running from just outside the disc out toward the
   quote it belongs to. Straight rather than arced: an arc curls away from
   what it points at, and the rail's whole job here is to say "this text
   belongs to this person".

   Two quotes on a side fan to ±32°; a single quote sits level with the
   disc, so its ray runs straight out. The set is sliced by quote count, so
   the halo never promises more connections than the group has. */
const RAYS = {
  left: {
    1: ["M-31 0 L-58 0"],
    2: ["M-26.3 -16.4 L-49.2 -30.7", "M-26.3 16.4 L-49.2 30.7"],
  },
  right: {
    1: ["M31 0 L58 0"],
    2: ["M26.3 -16.4 L49.2 -30.7", "M26.3 16.4 L49.2 30.7"],
  },
} as const;

function rays(side: "left" | "right", count: number) {
  if (count <= 0) return [];
  return RAYS[side][count >= 2 ? 2 : 1];
}

/** Rails around the persona. They suggest the connection rather than
    reaching each quote: measuring real endpoints would need layout in JS,
    and the source deck's arcs do not touch their quotes either.

    Stroke and dash are the house rail divided by the box's unit size, so
    the painted pill still lands at roughly 5×3 on screen. */
function Halo({ left, right }: { left: number; right: number }) {
  return (
    <svg className={styles.halo} viewBox="-60 -60 120 120" aria-hidden="true">
      <g
        fill="none"
        stroke="#f8f4f2"
        strokeOpacity=".28"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeDasharray="0.9 6"
      >
        {[...rays("left", left), ...rays("right", right)].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
