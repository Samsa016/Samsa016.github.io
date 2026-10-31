import type { Slug } from "./slugs";

export const LANGS = ["ru", "en"] as const;
export type Lang = (typeof LANGS)[number];

/**
 * Главы фильмографии. Порядок на странице — обратный: сначала `y4`.
 * Отдельной главы для заказов нет: коммерческие работы последнего года стоят
 * в `y4` рядом со своими — так видно, что заказчики платят за то же, что он
 * делает для себя. Обезличенную подачу задаёт `weight: "client"`, не глава.
 */
export const CHAPTER_IDS = ["y4", "y3", "y2", "y1"] as const;
export type ChapterId = (typeof CHAPTER_IDS)[number];

/**
 * Календарный год главы. Нужен строке меты под названием работы
 * (`ГОД 4 · 2026 · СВОИ ПРОДУКТЫ · NEXT`) — референс строки
 * `Season 1 | 2019 | fantasy | 15+`, см. `DESIGN.md` §2.
 * Держим здесь, а не в кейсах: год — свойство главы, дублировать его
 * по 29 записям значит завести 29 мест, где он может разъехаться.
 */
export const CHAPTER_YEAR: Record<ChapterId, number> = {
  y4: 2026,
  y3: 2025,
  y2: 2024,
  y1: 2023,
};

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
};

export type CaseMeta = {
  slug: Slug;
  chapter: ChapterId;
  weight: Weight;
  stack: readonly string[];
  links: { live?: string; repo?: string };
  /**
   * Цвет работы — единственный источник цвета на сайте. Там, где съёмка есть,
   * это доминанта постер-кадра, посчитанная `scripts/tint.mjs`; там, где съёмки
   * нет, — цвет самого интерфейса работы. Он держит фон главы и свечение кадра,
   * поэтому нужен каждой работе: без него страница остаётся мёртвой заливкой.
   */
  tint: string;
  /** Пока демка не снята — поля нет, компонент рисует заглушку кадра. */
  media?: Media;
};

/**
 * Крупная цифра кейса (`DESIGN.md` §5). Референс — счётчики SpaceX: число
 * огромным моноширинным кеглем, под ним мелкая подпись.
 *
 * Сюда попадают только величины, проверяемые по исходникам работы: тест,
 * который можно пересчитать, размер бандла, который можно взвесить, строка
 * README. Кейсу без таких чисел поле просто не заводится — компонент тогда
 * не рисуется. Придумать метрику, чтобы заполнить сетку, нельзя: выдуманное
 * число обесценивает и все настоящие рядом с ним.
 */
export type Figure = {
  /** Только число: `133`, `6 000+`. Набирается крупно. */
  value: string;
  /** Единица измерения — `КБ`, `%`. Идёт мельче цифры и приглушённой. */
  unit?: string;
  /** Что именно посчитано. Одна строка, без точки: подпись идёт капсом. */
  label: string;
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
  /** Две-три величины, которые кейс выносит крупно. Нет чисел — нет поля. */
  figures?: readonly Figure[];
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
    /** Заголовок сквозного списка работ. */
    allWork: string;
    year: string;
    noFootage: string;
    backHome: string;
    caseOf: (n: number, total: number) => string;
  };
  /** Светлая полоса-оглавление между героем и первой главой (`DESIGN.md` §4). */
  contents: {
    title: string;
    works: string;
    years: string;
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
  /**
   * Подвал. Бегущая строка с контактами и имя во всю ширину — приём из
   * `REFERENCES.md`, redis.agency: «названия, перематывающиеся вбок, в footer».
   */
  footer: {
    /** Одна строка о том, чем сделан сайт. Без обещаний и без метрик. */
    note: string;
    top: string;
  };
};
