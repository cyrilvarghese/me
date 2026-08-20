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
    <section className={`section-shell ${styles.block}`}>
      <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
      {heading && <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>}
      {lede && <p className={styles.lede}>{lede}</p>}

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
                <div className={styles.disc}>
                  <img src={g.icon} alt="" className={styles.icon} />
                </div>
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
    </section>
  );
}

/** The accent lands on the clause the quote turns on — the source deck
    underlines it, and underlining is not a voice this site has. */
function Bubble({ quote }: { quote: Quote }) {
  const { text, mark } = quote;
  const at = mark ? text.indexOf(mark) : -1;

  return (
    <li className={styles.quote}>
      <span aria-hidden="true">&ldquo;</span>
      {at < 0 ? (
        text
      ) : (
        <>
          {text.slice(0, at)}
          <em className={styles.mark}>{mark}</em>
          {text.slice(at + (mark?.length ?? 0))}
        </>
      )}
      <span aria-hidden="true">&rdquo;</span>
    </li>
  );
}

/* One arc per quote, upper before lower, so the halo never promises more
   connections than the group actually has. Each spans 40° at r46 — a short
   arc is worse than none, because at the house dash period it paints one
   pill and reads as a speck rather than a rail. */
const ARCS = {
  left: ["M-44.4 -11.9 A46 46 0 0 1 -26.4 -37.7", "M-26.4 37.7 A46 46 0 0 1 -44.4 11.9"],
  right: ["M26.4 -37.7 A46 46 0 0 1 44.4 -11.9", "M44.4 11.9 A46 46 0 0 1 26.4 37.7"],
};

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
        {ARCS.left.slice(0, left).map((d) => (
          <path key={d} d={d} />
        ))}
        {ARCS.right.slice(0, right).map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
