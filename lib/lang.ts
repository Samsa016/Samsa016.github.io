import { LANGS, type Lang } from "./content";

export const DEFAULT_LANG: Lang = "ru";

export const isLang = (value: string): value is Lang =>
  (LANGS as readonly string[]).includes(value);

/**
 * Разбирает Accept-Language и возвращает первый поддерживаемый язык.
 * Качество (`;q=`) учитывается — иначе `en;q=0.2, ru;q=0.9` выберет английский.
 */
export const negotiateLang = (header: string | null): Lang => {
  if (!header) return DEFAULT_LANG;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((entry) => entry.tag && Number.isFinite(entry.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLang(base)) return base;
  }

  return DEFAULT_LANG;
};
