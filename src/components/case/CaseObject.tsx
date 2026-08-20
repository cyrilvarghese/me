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
  caption,
}: {
  eyebrow: string;
  heading?: string;
  lede?: string;
  object: { icon: string; label: string };
  attrs: Attr[];
  users: [User, User];
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

      <figure className={styles.figure}>
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

        <div className={styles.users}>
          {users.map((u, i) => (
            <div key={u.label} className={styles.user} data-side={i === 0 ? "left" : "right"}>
              <Rail side={i === 0 ? "left" : "right"} />
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

/** A rail per user, pointing at the object.

    Two of them, because the figure has two arrangements and the rail has
    to point in each. Wide, the users sit left and right below the object,
    so the rail leans diagonally back up to it. Narrow, the object sits
    between them, so the rail runs vertically — down out of the teacher,
    up into the student.

    Each lives in its own column at a fixed size: a single rail spanning
    the figure has to be letterboxed to fit and arrives at a fraction of
    its length, which is how the first attempt read as a small bracket. */
function Rail({ side }: { side: "left" | "right" }) {
  return (
    <>
      <svg className={`${styles.rail} ${styles.railWide}`} viewBox="0 0 96 52" aria-hidden="true">
        <path d={side === "left" ? "M6 48 L90 6" : "M90 48 L6 6"} {...RAIL} />
      </svg>
      <svg className={`${styles.rail} ${styles.railNarrow}`} viewBox="0 0 24 60" aria-hidden="true">
        <path d="M12 4 L12 56" {...RAIL} />
      </svg>
    </>
  );
}
