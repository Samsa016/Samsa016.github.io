import type { Slug } from "./slugs";

export const LANGS = ["ru", "en"] as const;
export type Lang = (typeof LANGS)[number];

/** Главы фильмографии. Порядок на странице — обратный: сначала `y4`. */
export const CHAPTER_IDS = ["y4", "y3", "y2", "y1", "client"] as const;
export type ChapterId = (typeof CHAPTER_IDS)[number];

/**
 * Вес кейса определяет и раскладку, и наличие видео.
 * `feature` — полный кадр и отдельная страница разбора.
 * `medium`  — окно в двухколоночной сетке, короткий разбор.
 * `archive` — строка с титрами, без видео.
 * `client`  — обезличенный клиентский кейс, без видео.
 */
export type Weight = "feature" | "medium" | "archive" | "client";

export type Media = {
  /** Постер-кадр — кадр результата, а не первый кадр ролика. */
  poster: string;
  webm: string;
  mp4: string;
  /** Длительность петли в секундах, для таймкода в титрах. */
  duration: number;
  /**
   * Доминанта постер-кадра, посчитанная `scripts/tint.mjs`.
   * Единственный источник цвета на странице. Может отсутствовать: у монохромного
   * кадра доминанты нет, и свечение остаётся нейтральным — это правильный ответ,
   * а не пропуск.
   */
  tint?: string;
};

export type CaseMeta = {
  slug: Slug;
  chapter: ChapterId;
  weight: Weight;
  stack: readonly string[];
  links: { live?: string; repo?: string };
  /** Пока демка не снята — поля нет, компонент рисует заглушку кадра. */
  media?: Media;
};

export type CaseCopy = {
  title: string;
  /** Одна строка: что это, понятно человеку не из IT. */
  oneLiner: string;
  /** Только у `feature` и `medium`: что было нужно и почему это было непросто. */
  task?: string;
  /** Только у `feature` и `medium`: главное архитектурное решение. */
  solution?: string;
  /** Проверяемые факты. Пустой массив — кейсу не место в крупном кадре. */
  proof: readonly string[];
};

export type ChapterCopy = {
  index: string;
  title: string;
  lede: string;
};

export type SiteCopy = {
  meta: { title: string; description: string };
  hero: {
    name: string;
    role: string;
    statement: string;
    lede: string;
    scrollHint: string;
    count: (n: number) => string;
  };
  nav: { work: string; about: string; contact: string };
  labels: {
    stack: string;
    proof: string;
    task: string;
    solution: string;
    openCase: string;
    live: string;
    repo: string;
    archive: string;
    noFootage: string;
    backHome: string;
    caseOf: (n: number, total: number) => string;
  };
  chapters: Record<ChapterId, ChapterCopy>;
  cases: Record<Slug, CaseCopy>;
  about: {
    title: string;
    lede: string;
    sections: readonly { heading: string; body: string }[];
  };
  contact: {
    title: string;
    lede: string;
    channels: readonly { label: string; value: string; href: string }[];
  };
};
