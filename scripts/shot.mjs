import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "shot.png";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const fullPage = process.argv[6] === "full";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({ viewport: { width, height } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage });
console.log("SAVED", out);
if (errors.length) console.log("CONSOLE_ERRORS:\n" + errors.join("\n"));
else console.log("NO_CONSOLE_ERRORS");
await browser.close();
