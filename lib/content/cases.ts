import { SLUGS, type Slug } from "./slugs";
import type { CaseMeta } from "./types";

const GH = "https://github.com/Samsa016";

/**
 * Структура кейсов — общая для обоих языков. Тексты живут в `ru.ts` / `en.ts`
 * и связаны со структурой по слагу.
 *
 * Порядок внутри массива = порядок на странице.
 */
export const CASES: readonly CaseMeta[] = [
  // ── Год 4 — агенты и автоматизация ──────────────────────────────────────
  {
    slug: "autoscraper",
    chapter: "y4",
    weight: "feature",
    // японский авторынок: ржавчина и терракота кузовов
    tint: "hsl(18 46% 57%)",
    stack: ["FastAPI", "Playwright", "PostgreSQL / MySQL / SQLite", "Next.js", "Aiogram", "OpenAI"],
    links: { repo: `${GH}/AutoScraper__bot` },
  },
  {
    slug: "browser-agent",
    chapter: "y4",
    weight: "feature",
    // агент смотрит на экран — холодный свет монитора
    tint: "hsl(199 46% 58%)",
    stack: ["Python", "Playwright", "GPT-4o Vision", "OpenRouter"],
    links: { repo: `${GH}/ai-browser-agent-v2` },
  },
  {
    slug: "voicedesk",
    chapter: "y4",
    weight: "medium",
    // индикатор занятой телефонной линии
    tint: "hsl(348 40% 60%)",
    stack: ["FastAPI", "Pipecat", "WebRTC / SIP", "PostgreSQL", "Bitrix24", "Next.js"],
    links: {},
  },
  {
    slug: "midnight",
    chapter: "y4",
    weight: "medium",
    // ночная смена, когда очередь разбирает задачи без людей
    tint: "hsl(230 40% 58%)",
    stack: ["Python", "asyncio", "Telethon", "Playwright CDP", "SQLite"],
    links: {},
  },
  {
    slug: "sixmo",
    media: {
      poster: "/poster/sixmo.jpg",
      webm: "/video/sixmo.webm",
      mp4: "/video/sixmo.mp4",
      duration: 7.5,
    },
    chapter: "y2",
    weight: "medium",
    tint: "hsl(150 42% 58%)",
    stack: ["TypeScript", "Playwright", "Zod"],
    links: { repo: `${GH}/Sixmo-Form-Automator` },
  },
  {
    slug: "tradesandbox",
    media: {
      poster: "/poster/tradesandbox.jpg",
      webm: "/video/tradesandbox.webm",
      mp4: "/video/tradesandbox.mp4",
      duration: 8.6,
    },
    chapter: "y2",
    weight: "medium",
    tint: "hsl(157 65% 58%)",
    stack: ["TypeScript", "Canvas", "нодовый редактор", "без бэкенда"],
    links: { repo: `${GH}/Algo-Crafter` },
  },

  // ── Год 3 — AI-интеграции ───────────────────────────────────────────────
  {
    slug: "smartembed",
    chapter: "y2",
    weight: "feature",
    // векторный поиск: холодная бирюза индекса
    tint: "hsl(184 40% 55%)",
    stack: ["Python", "FastAPI", "ChromaDB", "React 19", "RAG"],
    links: { repo: `${GH}/ai-widget-saas` },
  },
  {
    slug: "mindtrack",
    chapter: "y2",
    weight: "medium",
    // трекер состояния: тёплый розовый графика настроения
    tint: "hsl(330 34% 60%)",
    stack: ["Next.js 15", "Tailwind v4", "OpenAI / OpenRouter", "JWT"],
    links: { repo: `${GH}/MindTrack-app-MOBILE-` },
  },
  {
    slug: "lapka",
    chapter: "y3",
    weight: "medium",
    // голосовой бот о живом — приглушённая зелень
    tint: "hsl(96 30% 55%)",
    stack: ["aiogram 3", "Whisper", "GPT-4o mini", "SQLAlchemy 2.0 async", "APScheduler"],
    links: {},
  },
  {
    slug: "choice-app-meal",
    chapter: "y1",
    weight: "archive",
    // выбор еды — тёплый красный
    tint: "hsl(8 42% 58%)",
    stack: ["Next.js 14", "TypeScript", "Zustand", "OpenRouter", "Docker"],
    links: { repo: `${GH}/Choice-App-Meal` },
  },
  {
    slug: "voice-agent-bot",
    chapter: "y3",
    weight: "archive",
    // синтез речи: пурпур волновой формы
    tint: "hsl(320 32% 58%)",
    stack: ["n8n", "MySQL", "Telegram Bot API", "ElevenLabs"],
    links: {},
  },
  {
    slug: "defect-probe",
    chapter: "y1",
    weight: "archive",
    // разметка дефекта — красный контур находки
    tint: "hsl(354 38% 58%)",
    stack: ["Python", "Gemini Vision"],
    links: {},
  },

  // ── Год 2 — fullstack ───────────────────────────────────────────────────
  {
    slug: "agora",
    chapter: "y3",
    weight: "feature",
    // торговая площадь: латунь и золото
    tint: "hsl(46 42% 56%)",
    stack: ["Next.js 16", "Prisma 7", "PostgreSQL", "Stripe", "NextAuth", "Upstash Redis"],
    links: { live: "https://agora.24rbs.ru" },
  },
  {
    slug: "perfectshop",
    chapter: "y2",
    weight: "archive",
    // витрина магазина
    tint: "hsl(340 36% 58%)",
    stack: ["React 19", "TypeScript", "FastAPI", "SQLite", "YooKassa", "JWT"],
    links: { repo: `${GH}/marketplace` },
  },
  {
    slug: "work-journal",
    media: {
      poster: "/poster/work-journal.jpg",
      webm: "/video/work-journal.webm",
      mp4: "/video/work-journal.mp4",
      duration: 10.0,
    },
    chapter: "y2",
    weight: "medium",
    tint: "hsl(212 42% 58%)",
    stack: ["React 19", "Zustand", "Zod", "FastAPI", "SQLAlchemy async", "Pydantic v2"],
    links: { repo: `${GH}/work-journal` },
  },
  {
    slug: "meteo-app",
    chapter: "y1",
    weight: "archive",
    // глобус и атмосфера
    tint: "hsl(196 44% 58%)",
    stack: ["React", "Vite", "TypeScript", "Mantine", "Cesium"],
    links: {},
  },
  {
    slug: "resale-miniapp",
    chapter: "y2",
    weight: "archive",
    // перепродажа внутри Telegram — спокойная зелень
    tint: "hsl(120 28% 54%)",
    stack: ["Telegram Mini App", "FastAPI", "верификация init_data"],
    links: {},
  },

  // ── Год 1 — frontend ────────────────────────────────────────────────────
  {
    slug: "yav",
    media: {
      poster: "/poster/yav.jpg",
      webm: "/video/yav.webm",
      mp4: "/video/yav.mp4",
      duration: 11.0,
    },
    chapter: "y3",
    weight: "feature",
    tint: "hsl(37 42% 58%)",
    stack: ["Vite", "Lenis", "three.js", "WebGPU"],
    links: {},
  },
  {
    slug: "monolit",
    media: {
      poster: "/poster/monolit.jpg",
      webm: "/video/monolit.webm",
      mp4: "/video/monolit.mp4",
      duration: 8.6,
      // Постер почти монохромный: доминанты нет, свечение остаётся нейтральным.
    },
    chapter: "y3",
    weight: "medium",
    // кадр монохромный: цвет остаётся почти нейтральным
    tint: "hsl(210 18% 58%)",
    stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    links: {},
  },
  {
    slug: "only-digital-test",
    media: {
      poster: "/poster/only-digital-test.jpg",
      webm: "/video/only-digital-test.webm",
      mp4: "/video/only-digital-test.mp4",
      duration: 10.0,
    },
    chapter: "y1",
    weight: "medium",
    tint: "hsl(237 42% 58%)",
    stack: ["React", "TypeScript", "SCSS", "GSAP", "Swiper.js", "Webpack"],
    links: { repo: `${GH}/only-digital-test` },
  },
  {
    slug: "ticket-jira",
    chapter: "y2",
    weight: "archive",
    // доска задач
    tint: "hsl(188 36% 56%)",
    stack: ["Next.js 16", "React 19", "Prisma", "SQLite", "Server Actions"],
    links: { repo: `${GH}/ticket-jira` },
  },
  {
    slug: "airesto",
    chapter: "y1",
    weight: "archive",
    // Vue-зелень исходного интерфейса
    tint: "hsl(74 34% 54%)",
    stack: ["Vue 3", "Composition API", "TypeScript", "Vite"],
    links: { repo: `${GH}/PlanTZ` },
  },

  // ── Работа с клиентами (обезличенно) ────────────────────────────────────
  {
    slug: "client-iiko-bi",
    chapter: "y4",
    weight: "client",
    // ночная выгрузка в BI
    tint: "hsl(206 30% 56%)",
    stack: ["Python", "SQL Server", "ночной ETL", "BI-витрины"],
    links: {},
  },
  {
    slug: "client-crm-copilot",
    chapter: "y4",
    weight: "client",
    // подсказка внутри CRM
    tint: "hsl(172 30% 54%)",
    stack: ["Python", "CRM Открытые линии", "LLM", "прайс как источник"],
    links: {},
  },
  {
    slug: "client-clinic-rag",
    chapter: "y4",
    weight: "client",
    // медцентр
    tint: "hsl(160 26% 55%)",
    stack: ["Python", "aiogram", "RAG", "провайдер-агностичный LLM-слой"],
    links: {},
  },
  {
    slug: "client-deals-bot",
    chapter: "y4",
    weight: "client",
    // воронка сделок
    tint: "hsl(38 30% 56%)",
    stack: ["Python", "CRM REST", "Telegram"],
    links: {},
  },
  {
    slug: "client-custdev",
    chapter: "y4",
    weight: "client",
    // исследование клиентов
    tint: "hsl(340 26% 58%)",
    stack: ["стек ИИ-сервисов", "промпты по этапам", "процесс анализа интервью"],
    links: {},
  },
  {
    slug: "client-service-mentor",
    chapter: "y4",
    weight: "client",
    // цех и металл: тёплая охра станочного света
    tint: "hsl(28 30% 55%)",
    stack: [
      "FastAPI",
      "Next.js",
      "OpenRouter",
      "fastembed",
      "faster-whisper",
      "Docker Compose",
      "Caddy",
    ],
    links: {},
  },
  {
    slug: "client-drop-bot",
    chapter: "y4",
    weight: "client",
    // зелёный сигнал старта: всё в этой работе про момент открытия
    tint: "hsl(88 30% 54%)",
    stack: ["Python", "asyncio", "httpx", "HTTP/2"],
    links: {},
  },
];

export const CASES_BY_SLUG = new Map<Slug, CaseMeta>(CASES.map((c) => [c.slug, c]));

/*
  SLUGS — источник правды для типов, CASES — для страницы. Если они разойдутся,
  TypeScript этого не заметит: он проверяет, что каждый слаг существует, но не то,
  что каждый существующий слаг использован. Ловим на сборке.
*/
if (CASES.length !== SLUGS.length) {
  const missing = SLUGS.filter((slug) => !CASES_BY_SLUG.has(slug));
  throw new Error(
    `Кейсы и слаги разошлись: в CASES ${CASES.length}, в SLUGS ${SLUGS.length}.` +
      (missing.length ? ` Нет в CASES: ${missing.join(", ")}.` : " Есть дубли в CASES."),
  );
}

export const casesOfChapter = (chapter: CaseMeta["chapter"]) =>
  CASES.filter((c) => c.chapter === chapter);

/** Кейсы, у которых есть отдельная страница разбора. Архивные строки её не получают. */
export const DEEP_CASES = CASES.filter((c) => c.weight !== "archive");
