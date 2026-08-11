import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:3001";
const selector = process.argv[3] ?? 'section[aria-label="Capabilities"]';
const positions = (process.argv[4] ?? "0.05,0.16,0.3,0.43,0.56,0.69,0.82,0.95")
  .split(",")
  .map(Number);
const prefix = process.argv[5] ?? "shots-story";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(500);

const metrics = await page.evaluate((sel) => {
  const s = document.querySelector(sel);
  if (!s) return null;
  const r = s.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: s.offsetHeight };
}, selector);
if (!metrics) {
  console.error("SECTION_NOT_FOUND", selector);
  process.exit(1);
}

for (const p of positions) {
  const y = Math.round(metrics.top + p * (metrics.height - 900));
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${prefix}-${String(p).replace(".", "_")}.png` });
  console.log("SAVED", `${prefix}-${String(p).replace(".", "_")}.png`);
}
console.log(errors.length ? "CONSOLE_ERRORS:\n" + errors.join("\n") : "NO_CONSOLE_ERRORS");
await browser.close();
