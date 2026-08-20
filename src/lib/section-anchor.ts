/**
 * Where a section actually *arrives*.
 *
 * For a plain section that is its top: the heading is on screen the moment
 * the top is. A pinned scrub section is different — FinalCTA is 300vh, and
 * for the first two thirds of it the knife is still folding with no ask on
 * the page at all. Treating its top as the section's place puts the rail's
 * CONTACT mark, the nav's current stop and the anchor jump in the middle of
 * nowhere, all three pointing at scroll positions where the thing they name
 * is not visible.
 *
 * So a section may declare its arrival as a fraction of its OWN scroll range
 * with `data-ruler-arrive`, the same shape as the `data-ruler-beats` it
 * already uses. Everything that needs to point at the section reads it here,
 * so the mark, the link and the copy cannot disagree.
 */
export function sectionArrival(s: HTMLElement): number {
  const top = s.getBoundingClientRect().top + window.scrollY;
  const f = parseFloat(s.dataset.rulerArrive ?? "");
  if (Number.isNaN(f)) return top;
  const range = s.offsetHeight - window.innerHeight;
  return range > 0 ? top + f * range : top;
}
