import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3100";
const OUT = process.env.OUT ?? "/tmp/claude-1000/-home-samsa016-web-PORTFOLIO/a1b429e7-9967-403d-b331-31fea52b45bc/scratchpad/shots";

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

async function shot(name, { path = "/ru", width = 1440, height = 900, act } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(2200); // пробег Set-of-Marks длится 1.2 с
  if (act) await act(page);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await page.close();
  console.log("shot", name);
}

const scrollTo = (y) => async (page) => {
  await page.evaluate((target) => window.scrollTo(0, target), y);
  await page.waitForTimeout(1200);
};

await shot("home-top");
await shot("home-frames", { act: scrollTo(3400) });
await shot("home-client", { act: scrollTo(11500) });
await shot("case", { path: "/ru/case/monolit" });
await shot("about", { path: "/ru/about" });
await shot("mobile", { width: 390, height: 844, act: scrollTo(2600) });

// Проявка: кадр под курсором возвращает насыщенность и подсвечивает секцию.
await shot("hover", {
  act: async (page) => {
    const frame = page.locator("[data-frame]:has(video)").first();
    await frame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await frame.hover({ force: true });
    await page.waitForTimeout(2000);
  },
});

await browser.close();
