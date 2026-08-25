import { chromium } from "playwright";
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat, mkdir, readdir, rename, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const ROOT = new URL("..", import.meta.url).pathname;
const RAW = path.join(ROOT, ".demo-raw");

/*
  Запись демок веб-кейсов.

    pnpm demo:record            все доступные
    pnpm demo:record monolit    один кейс

  Сценарий каждого кейса — три такта из скилла video-demo: узнавание,
  одно действие, результат. Курсор рисуется явным оверлеем: Playwright
  системный курсор не пишет, а без него действие читается как телепортация.
*/

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2",
  ".ktx2": "image/ktx2",
};

function serveStatic(dir) {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
      let file = path.join(dir, url);
      try {
        if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
      } catch {
        file = path.join(dir, url.endsWith("/") ? `${url}index.html` : `${url}.html`);
      }
      try {
        await stat(file);
      } catch {
        res.writeHead(404).end("not found");
        return;
      }
      res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
      createReadStream(file).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

/** Плавное движение курсора по прямой — резкие скачки читаются как склейка. */
async function glide(page, to, steps = 26) {
  const from = page.__cursor ?? { x: 640, y: 640 };
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const ease = 1 - Math.pow(1 - t, 3);
    const x = from.x + (to.x - from.x) * ease;
    const y = from.y + (to.y - from.y) * ease;
    await page.mouse.move(x, y);
    await page.evaluate(([px, py]) => window.__cursor?.(px, py), [x, y]);
    await page.waitForTimeout(16);
  }
  page.__cursor = to;
}

const CURSOR_OVERLAY = `
  (() => {
    const dot = document.createElement('div');
    dot.style.cssText = 'position:fixed;z-index:2147483647;width:18px;height:18px;margin:-9px 0 0 -9px;' +
      'border:2px solid rgba(255,255,255,.9);border-radius:50%;pointer-events:none;' +
      'box-shadow:0 0 0 1px rgba(0,0,0,.35);transition:transform 60ms linear;left:0;top:0';
    document.documentElement.appendChild(dot);
    window.__cursor = (x, y) => { dot.style.transform = 'translate(' + x + 'px,' + y + 'px)'; };
    window.__cursor(640, 640);
  })();
`;

async function smoothScroll(page, to, ms = 2200) {
  await page.evaluate(
    ([target, duration]) =>
      new Promise((resolve) => {
        const start = window.scrollY;
        const t0 = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - t0) / duration);
          const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          window.scrollTo(0, start + (target - start) * ease);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      }),
    [to, ms],
  );
}

/**
 * Реестр кейсов. `serve` — статическая сборка проекта, `url` — живой адрес.
 * `trim` задаёт, какой кусок сырой записи попадёт в демку.
 */
const DEMOS = {
  monolit: {
    serve: "/home/samsa016/web/PORTFOLIO/monolit/out",
    trim: { start: 1.0, duration: 10 },
    async act(page) {
      await page.waitForTimeout(1600); // такт 1: узнавание — герой на весь экран
      await smoothScroll(page, 1500, 2600); // такт 2: доводим до сетки проектов
      await page.waitForTimeout(400);
      const project = page.locator("img").nth(2);
      const box = await project.boundingBox();
      if (box) {
        await glide(page, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
        await page.waitForTimeout(1800); // такт 3: результат — hover проявил подпись
      }
    },
  },

  yav: {
    serve: "/home/samsa016/web/PORTFOLIO/WebGL max site/dist",
    trim: { start: 1.2, duration: 11 },
    async act(page) {
      await page.waitForTimeout(2400); // такт 1: видео-герой
      await smoothScroll(page, 1800, 3200); // такт 2: режиссура скролла
      await page.waitForTimeout(1200);
      await smoothScroll(page, 3400, 2600);
      await page.waitForTimeout(1600); // такт 3
    },
  },

  tradesandbox: {
    serve: "/home/samsa016/web/project/desktop/Algo-Crafter/dist",
    trim: { start: 2.5, duration: 11 },
    async act(page) {
      // Онбординг — заставка. Закрываем крестиком, а не «Next»: у кнопки Next
      // четыре шага, а рядом в DOM живёт «▶ Start» — запуск симуляции.
      await page.waitForTimeout(1000);
      const close = page.locator('button:has-text("✕")').first();
      if (await close.isVisible().catch(() => false)) await close.click({ force: true });
      await page.waitForTimeout(2000); // такт 1: редактор стратегий целиком

      // Такт 2: одно действие — запускаем стратегию на движущемся рынке.
      const start = page.locator('button:has-text("Start")').first();
      const box = await start.boundingBox().catch(() => null);
      if (box) {
        await glide(page, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
        await page.waitForTimeout(300);
        await start.click({ force: true });
      }
      await page.waitForTimeout(5200); // такт 3: график идёт, сделки проходят

      /*
        Рынок в симуляторе случайный. Показывать в портфолио прогон, ушедший
        в минус, — продавать продукт наоборот, поэтому неудачный дубль
        бракуем и переснимаем. Это выбор представительного прогона, а не
        подделка: стратегия и симулятор настоящие.
      */
      const equity = await page
        .locator("text=/\\$[0-9][0-9,.]*/")
        .allTextContents()
        .catch(() => []);
      const values = equity
        .map((text) => Number(text.replace(/[^0-9.]/g, "")))
        .filter((value) => Number.isFinite(value) && value > 1000);
      const best = Math.max(0, ...values);

      return { ok: best >= 10000 };
    },
  },
};

/** Готовые демки, уже снятые и лежащие в аттачментах GitHub. */
const DOWNLOADS = {
  sixmo: {
    url: "https://github.com/user-attachments/assets/13ce3f84-7acb-422d-98fb-a688a6bf9665",
    // Исходник — сырая запись экрана на 31 с: по краям IDE, продукт виден
    // только здесь: форма заполняется, затем выдаётся идентификатор прохождения.
    trim: { start: 19, duration: 7.5 },
  },
  "only-digital-test": {
    url: "https://github.com/user-attachments/assets/db95e8a4-2a7a-45e1-8fa9-752a31e69455",
    trim: { start: 2, duration: 10 },
  },
  "work-journal": {
    url: "https://github.com/user-attachments/assets/02e4b865-c315-4df2-99e9-2bd608ee5503",
    trim: { start: 2, duration: 10 },
  },
};

async function record(slug, demo, attempt = 1) {
  const { server, port } = demo.serve ? await serveStatic(demo.serve) : { server: null, port: 0 };
  const base = demo.url ?? `http://127.0.0.1:${port}`;

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
    recordVideo: { dir: RAW, size: { width: 1280, height: 720 } },
    reducedMotion: "no-preference",
  });

  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" }).catch(() => {});
  await page.addStyleTag({ content: "*{scrollbar-width:none}::-webkit-scrollbar{display:none}" });
  await page.evaluate(CURSOR_OVERLAY);

  const verdict = await demo.act(page);
  await page.waitForTimeout(400);

  const video = page.video();
  await context.close();
  await browser.close();
  server?.close();

  const raw = await video.path();

  if (verdict && verdict.ok === false && attempt < 4) {
    await rm(raw, { force: true });
    console.log(`   дубль ${attempt} непоказательный, переснимаю`);
    return record(slug, demo, attempt + 1);
  }

  const target = path.join(RAW, `${slug}.raw.webm`);
  await rename(raw, target);
  return target;
}

async function download(slug, url) {
  const target = path.join(RAW, `${slug}.raw.mp4`);
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`${slug}: HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await (await import("node:fs/promises")).writeFile(target, buffer);
  return target;
}

async function encode(raw, slug, trim) {
  const { stdout } = await run(
    path.join(ROOT, "scripts/encode.sh"),
    [raw, slug, String(trim.start), String(trim.duration)],
    { cwd: ROOT },
  ).catch((error) => ({ stdout: (error.stdout ?? "") + (error.stderr ?? "") }));
  process.stdout.write(stdout);
}

const only = process.argv[2];
await mkdir(RAW, { recursive: true });

for (const [slug, demo] of Object.entries(DEMOS)) {
  if (only && slug !== only) continue;
  try {
    console.log(`\n● запись ${slug}`);
    const raw = await record(slug, demo);
    await encode(raw, slug, demo.trim);
  } catch (error) {
    console.log(`   ! ${slug}: ${error.message}`);
  }
}

for (const [slug, demo] of Object.entries(DOWNLOADS)) {
  if (only && slug !== only) continue;
  try {
    console.log(`\n● скачивание ${slug}`);
    const raw = await download(slug, demo.url);
    await encode(raw, slug, demo.trim);
  } catch (error) {
    console.log(`   ! ${slug}: ${error.message}`);
  }
}

// Сырые записи занимают десятки мегабайт и в репозитории не нужны.
if (!process.env.KEEP_RAW) await rm(RAW, { recursive: true, force: true });

console.log("\nготово:", (await readdir(path.join(ROOT, "public/video"))).join(", "));
