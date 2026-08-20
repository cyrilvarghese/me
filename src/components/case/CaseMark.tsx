import styles from "./CaseMark.module.css";

/** Supplied artwork on the light disc the diagram skill reserves for marks
    it did not draw: `--fg` fill, a hairline, colours untouched. Flat
    clip-art is drawn with black outlines that vanish on this ground, and a
    filter over them reads as a smudge rather than a mark.

    The disc takes its size from a `--disc` custom property on whatever
    contains it, so one figure can hold marks at two scales without this
    component knowing anything about the layout. */
export function Mark({ icon }: { icon: string }) {
  return (
    <span className={styles.disc}>
      <img src={icon} alt="" className={styles.icon} />
    </span>
  );
}

/** A quote with the accent on the clause it turns on.

    Red is decorative and large-type only on this ground — as body copy at
    this size it fails AA — so the emphasis is a value step, brightest
    against a muted quote, and the accent goes into the rule beneath it.
    That is also what a source deck means when it underlines. */
export function MarkQuote({
  text,
  mark,
  className = "",
}: {
  text: string;
  mark?: string;
  className?: string;
}) {
  const at = mark ? text.indexOf(mark) : -1;

  return (
    <p className={`${styles.quote} ${className}`}>
      <span aria-hidden="true">&ldquo;</span>
      {at < 0 ? (
        text
      ) : (
        <>
          {text.slice(0, at)}
          <em className={styles.em}>{mark}</em>
          {text.slice(at + (mark?.length ?? 0))}
        </>
      )}
      <span aria-hidden="true">&rdquo;</span>
    </p>
  );
}
