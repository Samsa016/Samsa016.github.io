import Link from "next/link";
import { CHAPTER_YEAR, type CaseMeta, type Lang, type SiteCopy } from "@/lib/content";
import { caseVars } from "@/lib/tint";
import { Frame } from "./Frame";

type Props = {
  meta: CaseMeta;
  lang: Lang;
  copy: SiteCopy;
};

/**
 * Кадр героя с титрами (`DESIGN.md` §3).
 *
 * Референс — SIENA: кадр фильма, поверх название, под ним титры таблицей
 * `DIRECTED BY / YEAR / CATEGORY`. Здесь на их месте — год, глава и стек:
 * всё берётся из данных работы, ничего не сочиняется.
 *
 * Закрывает пустые ~35% первого экрана, висевшие с 27.08.2026.
 * Единственное видео на странице с `priority` — остальные по-прежнему
 * `preload="none"` и не трогают сеть до наведения.
 */
export function Hero({ meta, lang, copy }: Props) {
  const caseCopy = copy.cases[meta.slug];
  const href = `/${lang}/case/${meta.slug}`;

  const credits: readonly { label: string; value: string }[] = [
    { label: copy.labels.year, value: String(CHAPTER_YEAR[meta.chapter]) },
    { label: copy.contents.title, value: copy.chapters[meta.chapter].title },
    { label: copy.labels.stack, value: meta.stack.slice(0, 3).join(" · ") },
  ];

  return (
    <section className="case-field pb-chapter" style={caseVars(meta.tint)}>
      <Frame
        href={href}
        title={caseCopy.title}
        media={meta.media}
        tint={meta.tint}
        priority
        sizes="(max-width: 768px) 100vw, 92vw"
        placeholder={copy.labels.noFootage}
      />

      <div className="mt-8 grid gap-x-gutter gap-y-8 md:mt-10 md:grid-cols-12">
        <h2 className="min-w-0 font-display text-feature text-balance md:col-span-5">
          <Link href={href} className="rule-link">
            {caseCopy.title}
          </Link>
        </h2>

        {/*
          Титры таблицей, а не абзацем: это табличные данные, и моноширинный
          набор в две колонки читается как карточка фильма, а не как подпись.
        */}
        <dl className="grid grid-cols-[5.5rem_1fr] gap-x-6 gap-y-3 self-start md:col-span-4 md:col-start-7">
          {credits.map(({ label, value }) => (
            <div key={label} className="col-span-2 grid grid-cols-subgrid items-baseline border-t border-rule pt-3">
              <dt className="slate">{label}</dt>
              <dd className="min-w-0 text-credit text-bone/80">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
