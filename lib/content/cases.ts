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
    stack: ["FastAPI", "Playwright", "PostgreSQL / MySQL / SQLite", "Next.js", "Aiogram", "OpenAI"],
    links: { repo: `${GH}/AutoScraper__bot` },
  },
  {
    slug: "browser-agent",
    chapter: "y4",
    weight: "feature",
    stack: ["Python", "Playwright", "GPT-4o Vision", "OpenRouter"],
    links: { repo: `${GH}/ai-browser-agent-v2` },
  },
  {
    slug: "voicedesk",
    chapter: "y4",
    weight: "medium",
    stack: ["FastAPI", "Pipecat", "WebRTC / SIP", "PostgreSQL", "Bitrix24", "Next.js"],
    links: {},
  },
  {
    slug: "midnight",
    chapter: "y4",
    weight: "medium",
    stack: ["Python", "LLM-скоринг", "очередь с ретраями", "Telegram"],
    links: {},
  },
  {
    slug: "sixmo",
    media: {
      poster: "/poster/sixmo.jpg",
      webm: "/video/sixmo.webm",
      mp4: "/video/sixmo.mp4",
      duration: 7.5,
      tint: "hsl(150 42% 58%)",
    },
    chapter: "y4",
    weight: "medium",
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
      tint: "hsl(157 65% 58%)",
    },
    chapter: "y4",
    weight: "medium",
    stack: ["TypeScript", "Canvas", "нодовый редактор", "без бэкенда"],
    links: { repo: `${GH}/Algo-Crafter` },
  },

  // ── Год 3 — AI-интеграции ───────────────────────────────────────────────
  {
    slug: "smartembed",
    chapter: "y3",
    weight: "feature",
    stack: ["Python", "FastAPI", "ChromaDB", "React 19", "RAG"],
    links: { repo: `${GH}/ai-widget-saas` },
  },
  {
    slug: "mindtrack",
    chapter: "y3",
    weight: "medium",
    stack: ["Next.js 15", "Tailwind v4", "OpenAI / OpenRouter", "JWT"],
    links: { repo: `${GH}/MindTrack-app-MOBILE-` },
  },
  {
    slug: "lapka",
    chapter: "y3",
    weight: "medium",
    stack: ["aiogram 3", "Whisper", "GPT-4o mini", "SQLAlchemy 2.0 async", "APScheduler"],
    links: {},
  },
  {
    slug: "choice-app-meal",
    chapter: "y3",
    weight: "archive",
    stack: ["Next.js 14", "TypeScript", "Zustand", "OpenRouter", "Docker"],
    links: { repo: `${GH}/Choice-App-Meal` },
  },
  {
    slug: "voice-agent-bot",
    chapter: "y3",
    weight: "archive",
    stack: ["n8n", "MySQL", "Telegram Bot API", "ElevenLabs"],
    links: {},
  },
  {
    slug: "defect-probe",
    chapter: "y3",
    weight: "archive",
    stack: ["Python", "Gemini Vision"],
    links: {},
  },

  // ── Год 2 — fullstack ───────────────────────────────────────────────────
  {
    slug: "agora",
    chapter: "y2",
    weight: "feature",
    stack: ["Next.js 16", "Prisma 7", "PostgreSQL", "Stripe", "NextAuth", "Upstash Redis"],
    links: { live: "https://agora.24rbs.ru" },
  },
  {
    slug: "perfectshop",
    chapter: "y2",
    weight: "archive",
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
      tint: "hsl(212 42% 58%)",
    },
    chapter: "y2",
    weight: "medium",
    stack: ["React 19", "Zustand", "Zod", "FastAPI", "SQLAlchemy async", "Pydantic v2"],
    links: { repo: `${GH}/work-journal` },
  },
  {
    slug: "meteo-app",
    chapter: "y2",
    weight: "archive",
    stack: ["React", "Vite", "TypeScript", "Mantine", "Cesium"],
    links: {},
  },
  {
    slug: "resale-miniapp",
    chapter: "y2",
    weight: "archive",
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
      tint: "hsl(37 42% 58%)",
    },
    chapter: "y1",
    weight: "feature",
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
    chapter: "y1",
    weight: "medium",
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
      tint: "hsl(237 42% 58%)",
    },
    chapter: "y1",
    weight: "medium",
    stack: ["React", "TypeScript", "SCSS", "GSAP", "Swiper.js", "Webpack"],
    links: { repo: `${GH}/only-digital-test` },
  },
  {
    slug: "ticket-jira",
    chapter: "y1",
    weight: "archive",
    stack: ["Next.js 16", "React 19", "Prisma", "SQLite", "Server Actions"],
    links: { repo: `${GH}/ticket-jira` },
  },
  {
    slug: "airesto",
    chapter: "y1",
    weight: "archive",
    stack: ["Vue 3", "Composition API", "TypeScript", "Vite"],
    links: { repo: `${GH}/PlanTZ` },
  },

  // ── Работа с клиентами (обезличенно) ────────────────────────────────────
  {
    slug: "client-iiko-bi",
    chapter: "client",
    weight: "client",
    stack: ["Python", "SQL Server", "ночной ETL", "BI-витрины"],
    links: {},
  },
  {
    slug: "client-crm-copilot",
    chapter: "client",
    weight: "client",
    stack: ["Python", "CRM Открытые линии", "LLM", "прайс как источник"],
    links: {},
  },
  {
    slug: "client-clinic-rag",
    chapter: "client",
    weight: "client",
    stack: ["Python", "aiogram", "RAG", "провайдер-агностичный LLM-слой"],
    links: {},
  },
  {
    slug: "client-deals-bot",
    chapter: "client",
    weight: "client",
    stack: ["Python", "CRM REST", "Telegram"],
    links: {},
  },
  {
    slug: "client-custdev",
    chapter: "client",
    weight: "client",
    stack: ["стек ИИ-сервисов", "промпты по этапам", "процесс анализа интервью"],
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
