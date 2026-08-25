/**
 * Единый список слагов. Держится отдельно, чтобы и структура кейсов (`cases.ts`),
 * и тексты (`ru.ts` / `en.ts`) сверялись с ним на этапе компиляции:
 * добавил кейс — TypeScript потребует текст на обоих языках.
 */
export const SLUGS = [
  "autoscraper",
  "browser-agent",
  "voicedesk",
  "midnight",
  "sixmo",
  "tradesandbox",
  "smartembed",
  "mindtrack",
  "lapka",
  "choice-app-meal",
  "voice-agent-bot",
  "defect-probe",
  "agora",
  "perfectshop",
  "work-journal",
  "meteo-app",
  "resale-miniapp",
  "yav",
  "monolit",
  "only-digital-test",
  "ticket-jira",
  "airesto",
  "client-iiko-bi",
  "client-crm-copilot",
  "client-clinic-rag",
  "client-deals-bot",
  "client-custdev",
] as const;

export type Slug = (typeof SLUGS)[number];
