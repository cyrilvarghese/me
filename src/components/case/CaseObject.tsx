import CaseDiagram from "./CaseDiagram";
import { Mark, MarkQuote } from "./CaseMark";
import styles from "./CaseObject.module.css";

type Attr = { icon: string; label: string };
type User = { icon: string; label: string; quote: string; mark?: string };

/** One object, and the two people who use it from opposite sides.

    The shape is the argument: everything the episode contains hangs off a
    single thing in the middle, and both users reach the same thing rather
    than each being handed their own material. Attributes are split left
    and right of it so the centre stays the centre.

    HTML rather than an SVG figure, for the same reason CaseVoices is: the
    quotes run two and three lines and have to wrap at whatever width the
    page gives them. The rails stay inline SVG so their dash still paints
    the round-capped pill the house uses. */
export default function CaseObject({
  eyebrow,
  heading,
  lede,
  object,
  attrs,
  users,
  diagramMobile,
  caption,
}: {
  eyebrow: string;
  heading?: string;
  lede?: string;
  object: { icon: string; label: string };
  attrs: Attr[];
  users: [User, User];
  /** The phone telling. A ring of marks and two quotes needs width to say
      anything; a drawn diagram can say the same thing in a column. When
      one is supplied it replaces the marks entirely below the breakpoint
      rather than trying to rearrange them. */
  diagramMobile?: string;
  caption?: string;
}) {
  const split = Math.ceil(attrs.length / 2);

  return (
    <section className={`section-shell ${styles.block}`}>
      <div className={styles.head}>
        <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
        <div>
          {heading && <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>}
          {lede && <p className={styles.lede}>{lede}</p>}
        </div>
      </div>

      <figure className={`${styles.figure} ${diagramMobile ? styles.hasNarrow : ""}`}>
        {diagramMobile && (
          <div className={styles.narrowDiagram}>
            <CaseDiagram src={diagramMobile} />
          </div>
        )}

        <div className={styles.cluster}>
          <ul className={`${styles.attrs} ${styles.left}`}>
            {attrs.slice(0, split).map((a) => (
              <li key={a.label} className={styles.attr}>
                <span className={`mono-label ${styles.attrLabel}`}>{a.label}</span>
                <Mark icon={a.icon} />
              </li>
            ))}
          </ul>

          <div className={styles.object}>
            <Mark icon={object.icon} />
            <p className={`mono-label ${styles.objectLabel}`}>{object.label}</p>
          </div>

          <ul className={`${styles.attrs} ${styles.right}`}>
            {attrs.slice(split).map((a) => (
              <li key={a.label} className={styles.attr}>
                <Mark icon={a.icon} />
                <span className={`mono-label ${styles.attrLabel}`}>{a.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <Fan />

        <div className={styles.users}>
          {users.map((u, i) => (
            <div key={u.label} className={styles.user} data-side={i === 0 ? "left" : "right"}>
              <Rail />
              <div className={styles.persona}>
                <Mark icon={u.icon} />
                <p className={`mono-label ${styles.userLabel}`}>{u.label}</p>
              </div>
              <MarkQuote text={u.quote} mark={u.mark} className={styles.userQuote} />
            </div>
          ))}
        </div>

        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
    </section>
  );
}

/* Both rails render at 1:1 — the CSS box matches the viewBox — so they can
   carry the house rail's own numbers rather than a scaled copy of them. */
const RAIL = {
  fill: "none",
  stroke: "#f8f4f2",
  strokeOpacity: ".28",
  strokeWidth: "3",
  strokeLinecap: "round" as const,
  strokeDasharray: "2 14",
};

/** The wide connector: one stem out of the object, splitting to each user.

    It has to span the figure, and an svg given a width but no matching
    height gets letterboxed by `preserveAspectRatio` — which is how the
    first attempt ended up a third of its length and read as a small
    bracket. `aspect-ratio` on the box, matching the viewBox, makes the fit
    exact at every width instead.

    The arms land at 24% and 76%, which is where a two-column grid puts its
    column centres once the gap between them is taken out. */
function Fan() {
  return (
    <svg className={styles.fan} viewBox="0 0 900 104" aria-hidden="true">
      <defs>
        <marker
          id="caseObjArrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="#f8f4f2" fillOpacity=".45" />
        </marker>
      </defs>
      <g {...RAIL}>
        <path d="M450 40 L450 8" markerEnd="url(#caseObjArrow)" />
        <path d="M450 42 L220 92" markerEnd="url(#caseObjArrow)" />
        <path d="M450 42 L680 92" markerEnd="url(#caseObjArrow)" />
      </g>
    </svg>
  );
}

/** The narrow connector. Rotated with the arrangement: once the object
    sits between its two users rather than above them, the rail runs
    vertically — down out of the teacher, up into the student. */
function Rail() {
  return (
    <svg className={styles.rail} viewBox="0 0 24 60" aria-hidden="true">
      <path d="M12 4 L12 56" {...RAIL} />
    </svg>
  );
}
