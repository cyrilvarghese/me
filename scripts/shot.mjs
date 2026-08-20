import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "shot.png";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const rest = process.argv.slice(6);
const fullPage = rest.includes("full");
const reduced = rest.includes("reduce");
/* click=<selector>[,<selector>…] shoots a state you can only reach by
   interacting — an open dialog, a started player, the third slide of a
   gallery. Selectors are pressed in order. Everything else here is
   load-and-shoot. */
const clicks = (rest.find((a) => a.startsWith("click="))?.slice(6) ?? "")
  .split(",")
  .map((c) => c.trim())
  .filter(Boolean);
/* hover=<selector> parks the pointer on a control so its hover state is
   what gets shot. Applied after any clicks, and left there for the
   screenshot — hover rules are otherwise unverifiable from a static
   shot, which is how .btn-ghost's transparent hover reached a control
   living over photographs. */
const hover = rest.find((a) => a.startsWith("hover="))?.slice(6).trim();

const browser = await chromium.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({
  viewport: { width, height },
  reducedMotion: reduced ? "reduce" : "no-preference",
});
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(800);
for (const click of clicks) {
  await page.click(click, { timeout: 15000 });
  /* long enough for the slowest transition on the page to settle */
  await page.waitForTimeout(1200);
}
if (hover) {
  await page.hover(hover, { timeout: 15000 });
  await page.waitForTimeout(400);
}
await page.screenshot({ path: out, fullPage });
console.log("SAVED", out);
if (errors.length) console.log("CONSOLE_ERRORS:\n" + errors.join("\n"));
else console.log("NO_CONSOLE_ERRORS");
await browser.close();
