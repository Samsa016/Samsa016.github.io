import { ru } from "./ru";
import { en } from "./en";
import { CASES, casesOfChapter } from "./cases";
import { CHAPTER_IDS, type ChapterId, type Lang, type SiteCopy } from "./types";

export { CASES, CASES_BY_SLUG, casesOfChapter, DEEP_CASES } from "./cases";
export { CHAPTER_IDS, CHAPTER_YEAR, LANGS } from "./types";
export type {
  CaseCopy,
  CaseMeta,
  ChapterCopy,
  ChapterId,
  Figure,
  Lang,
  Media,
  SiteCopy,
  Weight,
} from "./types";
export type { Slug } from "./slugs";

const COPY: Record<Lang, SiteCopy> = { ru, en };

export const getCopy = (lang: Lang): SiteCopy => COPY[lang];

/** Главы в порядке показа: сначала последний год, клиентская — в конце. */
export const CHAPTERS_IN_ORDER: readonly ChapterId[] = CHAPTER_IDS;

export const chaptersWithCases = () =>
  CHAPTERS_IN_ORDER.map((id) => ({ id, cases: casesOfChapter(id) })).filter(
    (chapter) => chapter.cases.length > 0,
  );

/**
 * Работа для кадра героя (`DESIGN.md` §3).
 *
 * Выбирается из данных, а не прописывается вручную: все демки сейчас
 * переснимаются, и захардкоженный слаг сломался бы на первой же выкладке.
 * Порядок предпочтения — крупная работа со съёмкой, затем любая со съёмкой.
 * Съёмок нет вовсе — героя с кадром не будет, страница падает на текстовую
 * подачу (правило `Frame` из TZ §5: пустой бокс 16:9 хуже отсутствия кадра).
 */
export const heroCase = () =>
  CASES.find((c) => c.media && c.weight === "feature") ?? CASES.find((c) => c.media);

/** Номер кейса в общем списке — для подписи «Работа N из M». */
export const caseIndex = (slug: string) => CASES.findIndex((c) => c.slug === slug) + 1;
export const caseTotal = CASES.length;
