import { chromium, devices } from "playwright";

/*
  Автопроверка пунктов приёмки, которые глазами не поймать:
  горизонтальный скролл, преждевременная загрузка видео, залипшее
  воспроизведение при быстром проходе курсором и уважение reduced-motion.

  Запуск: pnpm audit   (нужен поднятый сервер, BASE задаёт адрес)
*/

const BASE = process.env.BASE ?? "http://localhost:3100";
// Со статическим экспортом маршруты — каталоги, поэтому со слешем на конце.
const PAGES = ["/ru/", "/en/", "/ru/case/autoscraper/", "/ru/case/client-iiko-bi/", "/ru/about/"];
/*
  2560 добавлена 31.08.2026: до неё самой широкой проверкой была 1920, и весь
  класс «большой монитор» оставался слепой зоной — на 27 дюймах страница
  жалась в колонку посреди экрана, а титры держали фиксированные 13 px.
*/
const WIDTHS = [360, 768, 1280, 1920, 2560];

const failures = [];
const note = (message) => console.log(`   ${message}`);

const browser = await chromium.launch();

// ── 1. Горизонтальный скролл ────────────────────────────────────────────────
console.log("Горизонтальный скролл");
for (const width of WIDTHS) {
  for (const path of PAGES) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(BASE + path, { waitUntil: "networkidle" });

    const overflow = await page.evaluate(() => {
      const root = document.documentElement;
      if (root.scrollWidth <= root.clientWidth) return null;

      // Ищем виновника: первый элемент, вылезающий за правый край вьюпорта.
      const culprit = Array.from(document.querySelectorAll("*")).find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.right > root.clientWidth + 1 && rect.width > 0;
      });

      return {
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        culprit: culprit
          ? `${culprit.tagName.toLowerCase()}.${String(culprit.className).slice(0, 60)}`
          : "не найден",
      };
    });

    await page.close();

    if (overflow) {
      failures.push(`${path} @${width}: ${overflow.scrollWidth} > ${overflow.clientWidth} (${overflow.culprit})`);
      note(`✗ ${path} @${width} — ${overflow.culprit}`);
    }
  }
}
if (failures.length === 0) note("✓ на всех ширинах чисто");

// ── 1б. Текст не наезжает на соседнюю колонку ───────────────────────────────
/*
  Слепое пятно проверки выше: заголовок, вылезший из своей колонки внутрь
  контейнера, наезжает на соседний текст, но ширину документа не меняет —
  горизонтального скролла нет, и вылет проходит незамеченным. Ловим его
  сравнением каждого текстового блока с его же колонкой.
*/
console.log("Вылет за колонку");
{
  const before = failures.length;

  for (const width of WIDTHS) {
    for (const path of PAGES) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(BASE + path, { waitUntil: "networkidle" });

      const spills = await page.evaluate(() => {
        const out = [];

        /*
          Меряем сам блок, а не его потомков: длинное слово внутри заголовка
          вылезает как inline-содержимое, границы же самого заголовка остаются
          по колонке. Расхождение scrollWidth и clientWidth — единственный
          честный признак того, что содержимое шире отведённого ему места.
        */
        for (const el of document.querySelectorAll("h1, h2, h3, p, li, blockquote")) {
          if (getComputedStyle(el).overflow !== "visible") continue;

          const over = el.scrollWidth - el.clientWidth;
          if (over > 2) {
            out.push({
              tag: el.tagName.toLowerCase(),
              text: (el.textContent ?? "").trim().slice(0, 32),
              over,
            });
          }
        }
        return out;
      });

      await page.close();

      for (const spill of spills) {
        failures.push(`${path} @${width}: <${spill.tag}> «${spill.text}» вылез за колонку на ${spill.over}px`);
        note(`✗ ${path} @${width} — <${spill.tag}> «${spill.text}» на ${spill.over}px`);
      }
    }
  }

  if (failures.length === before) note("✓ текст держится в своих колонках");
}

// ── 2. Видео не грузится до наведения ───────────────────────────────────────
console.log("Загрузка видео");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const videoRequests = [];
  page.on("request", (request) => {
    if (/\.(webm|mp4)(\?|$)/.test(request.url())) videoRequests.push(request.url());
  });

  await page.goto(`${BASE}/ru/`, { waitUntil: "networkidle" });
  await page.mouse.move(5, 5);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(1500);

  if (videoRequests.length > 0) {
    failures.push(`видео тянется без наведения: ${videoRequests.length} запрос(ов)`);
    note(`✗ ${videoRequests.length} запрос(ов) за видео без наведения`);
  } else {
    note("✓ до наведения сеть за видео не трогается");
  }

  // ── 3. Наведение запускает ролик ──────────────────────────────────────────
  const withVideo = page.locator("[data-frame]:has(video)").first();
  await withVideo.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await withVideo.hover({ force: true });
  await page.waitForTimeout(1500);

  const playingOnHover = await page.evaluate(
    () => Array.from(document.querySelectorAll("video")).filter((v) => !v.paused).length,
  );
  if (playingOnHover !== 1) {
    failures.push(`наведение должно запускать ровно один ролик, играет ${playingOnHover}`);
    note(`✗ по наведению играет ${playingOnHover}, ожидался 1`);
  } else {
    note("✓ наведение запускает ровно один ролик");
  }

  // ── 4. Быстрый проход по сетке не оставляет играющих видео ────────────────
  const frames = await page.locator("[data-frame]").all();
  for (const frame of frames.slice(0, 8)) {
    await frame.hover({ force: true, timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(60);
  }
  await page.mouse.move(2, 2);
  await page.waitForTimeout(1200);

  const stillPlaying = await page.evaluate(
    () => Array.from(document.querySelectorAll("video")).filter((v) => !v.paused).length,
  );
  if (stillPlaying > 0) {
    failures.push(`после ухода курсора играет видео: ${stillPlaying}`);
    note(`✗ осталось играть: ${stillPlaying}`);
  } else {
    note("✓ после быстрого прохода ничего не играет");
  }

  await page.close();
}

// ── 5. prefers-reduced-motion ───────────────────────────────────────────────
console.log("Reduced motion");
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto(`${BASE}/ru/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const marks = await page.evaluate(
    () => document.querySelectorAll("[aria-hidden] span[style*='mark-in']").length,
  );

  /*
    Главное здесь — не отсутствие движения, а наличие содержимого. motion
    при системном «уменьшении анимации» отрисовывает `initial` и анимацию не
    запускает: без правила `[data-reveal]` в globals.css блоки остаются на
    `opacity: 0` навсегда, разметка есть, а страница пустая. Проверяем всю
    страницу целиком, а не первый экран.
  */
  const invisible = await page.evaluate(() => {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.scrollIntoView());
    window.scrollTo(0, 0);
    return [...document.querySelectorAll("[data-reveal]")].filter(
      (el) => Number(getComputedStyle(el).opacity) < 0.99,
    ).length;
  });
  if (invisible > 0) {
    failures.push(`при reduced-motion ${invisible} блоков остались невидимыми`);
    note(`✗ невидимых блоков: ${invisible}`);
  } else note("✓ все блоки видимы");
  const frame = page.locator("[data-frame]").first();
  await frame.hover({ force: true }).catch(() => {});
  await page.waitForTimeout(900);
  const playing = await page.evaluate(
    () => Array.from(document.querySelectorAll("video")).filter((v) => !v.paused).length,
  );

  if (marks > 0) {
    failures.push("Set-of-Marks показан при reduced-motion");
    note("✗ Set-of-Marks показан");
  } else note("✓ Set-of-Marks не показан");

  if (playing > 0) {
    failures.push("видео играет при reduced-motion");
    note("✗ видео играет");
  } else note("✓ видео не запускается");

  await page.close();
}

// ── 6. Тач: до первого скролла тихо, после — ровно один кадр ────────────────
console.log("Тач");
{
  const page = await browser.newPage({ ...devices["iPhone 13"] });
  await page.goto(`${BASE}/ru/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  /*
    До первого скролла на телефоне не должно играть ничего. Кадр героя виден
    сразу, и если он стартует на загрузке, то забирает себе LCP: браузер
    считает первый кадр видео главной отрисовкой страницы и приписывает ей всё
    время скачивания ролика. Замер 31.08.2026: LCP 3.7 с и Lighthouse
    Performance 89 против 2.7 с и 96 после отсрочки.
  */
  const early = await page.evaluate(
    () => Array.from(document.querySelectorAll("video")).filter((v) => !v.paused).length,
  );
  if (early !== 0) {
    failures.push(`до первого скролла на тач-устройстве не должно играть ничего, играет ${early}`);
    note(`✗ до скролла играет ${early}, ожидался 0`);
  } else note("✓ до первого скролла ничего не играет");

  await page.evaluate(() => window.scrollBy(0, 120));
  await page.locator("[data-frame]:has(video)").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);

  const playing = await page.evaluate(
    () => Array.from(document.querySelectorAll("video")).filter((v) => !v.paused).length,
  );
  if (playing !== 1) {
    failures.push(`на тач-устройстве должен играть ровно один кадр, играет ${playing}`);
    note(`✗ играет ${playing}, ожидался 1`);
  } else note("✓ после скролла играет ровно один кадр");

  await page.close();
}

// ── 7. Доступность: заголовки, alt, контраст ────────────────────────────────
console.log("Доступность");
{
  for (const path of ["/ru/", "/ru/case/agora/", "/ru/about/"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + path, { waitUntil: "networkidle" });

    const report = await page.evaluate(() => {
      /*
        Цвета в вёрстке заданы в oklab и с альфой. Разбирать их строкой бессмысленно:
        просим браузер отрисовать цвет поверх фона на канве и читаем итоговый пиксель —
        это разом решает и конвертацию цветового пространства, и наложение прозрачности.
      */
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      const composite = (color, over) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = over;
        ctx.fillRect(0, 0, 1, 1);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return [r, g, b];
      };

      const luminance = ([r, g, b]) => {
        const channel = (v) => {
          const c = v / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      };

      const pageBg = getComputedStyle(document.body).backgroundColor;

      /*
        Подложка — не фон страницы, а ближайший предок с непрозрачной заливкой.
        Иначе светлый текст на светлой плашке выглядит как провал контраста,
        хотя читается прекрасно.
      */
      const backdropOf = (el) => {
        for (let node = el; node; node = node.parentElement) {
          const bg = getComputedStyle(node).backgroundColor;
          const alpha = bg.startsWith("rgba") ? Number(bg.split(",")[3]) : 1;
          if (bg !== "transparent" && alpha > 0.5) return bg;
        }
        return pageBg;
      };

      const ratio = (color, el) => {
        const backdrop = backdropOf(el);
        const back = luminance(composite(backdrop, "#000"));
        const front = luminance(composite(color, backdrop));
        const [hi, lo] = front > back ? [front, back] : [back, front];
        return (hi + 0.05) / (lo + 0.05);
      };

      // Проверяем реально отрисованный текст, а не токены из конфига.
      const samples = new Map();
      for (const el of document.querySelectorAll("p, li, h1, h2, h3, a, span")) {
        if (!el.textContent?.trim() || el.children.length > 0) continue;
        const style = getComputedStyle(el);
        if (style.visibility === "hidden" || style.opacity === "0") continue;
        const size = Number.parseFloat(style.fontSize);
        const key = `${style.color} @${size.toFixed(0)}px`;
        if (!samples.has(key)) samples.set(key, ratio(style.color, el));
      }

      return {
        h1: document.querySelectorAll("h1").length,
        imagesWithoutAlt: Array.from(document.querySelectorAll("img")).filter(
          (img) => img.getAttribute("alt") === null,
        ).length,
        worst: [...samples.entries()].sort((a, b) => a[1] - b[1]).slice(0, 3),
      };
    });

    await page.close();

    if (report.h1 !== 1) {
      failures.push(`${path}: заголовков h1 — ${report.h1}, должен быть один`);
      note(`✗ ${path}: h1 × ${report.h1}`);
    }
    if (report.imagesWithoutAlt > 0) {
      failures.push(`${path}: изображений без alt — ${report.imagesWithoutAlt}`);
      note(`✗ ${path}: без alt — ${report.imagesWithoutAlt}`);
    }
    const [worstKey, worstRatio] = report.worst[0] ?? ["—", 99];
    if (worstRatio < 4.5) {
      failures.push(`${path}: контраст ${worstRatio.toFixed(2)}:1 у ${worstKey}`);
      note(`✗ ${path}: худший контраст ${worstRatio.toFixed(2)}:1 — ${worstKey}`);
    } else {
      const list = report.worst.map(([, r]) => `${r.toFixed(2)}`).join(" / ");
      note(`✓ ${path}: h1 один, alt везде, три худших контраста ${list}`);
    }
  }
}

await browser.close();

console.log("");
if (failures.length > 0) {
  console.log(`ПРОВАЛЕНО: ${failures.length}`);
  failures.forEach((f) => console.log(` · ${f}`));
  process.exit(1);
}
console.log("Все проверки пройдены");
