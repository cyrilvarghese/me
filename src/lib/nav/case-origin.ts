/** Did this case-page visit start from a card on the home page?

    The case page's back control collapses its hero into the card it
    grew from, which only works when that card is still one history
    entry behind at the scroll position it was left at. Anyone else —
    a direct link, a search result, a visitor who wandered in from
    another page — gets a plain navigation to the work list instead, so
    "← Work" always means the work list and never "wherever you just
    were".

    A module value rather than sessionStorage on purpose: it must read
    false after a reload or a fresh landing, and the module's lifetime
    is exactly the client-side session that owns the history entry. */
let origin: string | null = null;

export function markCaseOrigin(slug: string) {
  origin = slug;
}

/** Read once and clear: a second close (via browser forward, say) is no
    longer one step from the card. */
export function takeCaseOrigin(slug: string) {
  const cameFromCard = origin === slug;
  origin = null;
  return cameFromCard;
}
