import Link from "next/link";
import type { CaseMeta, Lang, SiteCopy } from "@/lib/content";
import { Credits } from "./Credits";
import { Frame } from "./Frame";
import { Reveal } from "./Reveal";

type Common = { lang: Lang; copy: SiteCopy };

const caseHref = (lang: Lang, slug: string) => `/${lang}/case/${slug}`;

/**
 * Крупный кейс: кадр во всю ширину, титры заезжают на него снизу-слева.
 * Наложение — единственное место, где блоки перекрываются; оно и создаёт
 * ощущение раскадровки, а не сетки карточек.
 */
export function FeatureCase({
  meta,
  lang,
  copy,
  priority,
}: Common & { meta: CaseMeta; priority?: boolean }) {
  const href = caseHref(lang, meta.slug);
  const caseCopy = copy.cases[meta.slug];

  /*
    Без съёмки кадра нет. Пустой бокс 16:9 читается как «здесь должно было
    что-то быть» — хуже, чем его отсутствие. Такой кейс подаётся текстом.
  */
  if (!meta.media) {
    return (
      <Reveal className="mb-24 border-t border-rule pt-10 md:mb-40 md:pt-14">
        <div className="grid gap-x-gutter gap-y-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <h3 className="min-w-0 font-display text-chapter text-balance">
              <Link href={href} className="rule-link">
                {caseCopy.title}
              </Link>
            </h3>
            <p className="mt-6 max-w-[42ch] text-lede text-bone/75">{caseCopy.oneLiner}</p>
          </div>

          <div className="flex flex-col gap-6 md:col-span-5 md:col-start-8">
            {caseCopy.solution && (
              <p className="max-w-[54ch] text-credit leading-relaxed text-bone/70">
                {caseCopy.solution}
              </p>
            )}
            <Credits
              meta={meta}
              copy={caseCopy}
              labels={copy.labels}
              href={href}
              proofLimit={4}
              headless
            />
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal className="mb-24 md:mb-40">
      <Frame
        href={href}
        title={caseCopy.title}
        media={meta.media}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 76vw"
        placeholder={copy.labels.noFootage}
      />
      <div className="grid md:grid-cols-12">
        <div className="relative z-10 -mt-6 bg-ink pt-8 pr-6 md:col-span-7 md:-mt-16 md:pt-10 md:pr-12">
          <Credits meta={meta} copy={caseCopy} labels={copy.labels} href={href} />
        </div>
      </div>
    </Reveal>
  );
}

/**
 * Средние кейсы — парами, вторая колонка со сбивкой вниз.
 * Ровная пара читается как карточки; сбивка — как разворот.
 */
export function MediumPair({
  cases,
  lang,
  copy,
}: Common & { cases: readonly CaseMeta[] }) {
  return (
    <div className="mb-24 grid gap-x-gutter gap-y-24 md:mb-40 md:grid-cols-2">
      {cases.map((meta, index) => {
        const href = caseHref(lang, meta.slug);
        const caseCopy = copy.cases[meta.slug];

        return (
          <Reveal
            key={meta.slug}
            delay={index % 2 === 1 ? 0.08 : 0}
            className={index % 2 === 1 ? "md:mt-32" : undefined}
          >
            {meta.media ? (
              <Frame
                href={href}
                title={caseCopy.title}
                media={meta.media}
                sizes="(max-width: 768px) 100vw, 38vw"
                placeholder={copy.labels.noFootage}
              />
            ) : (
              <div className="border-t border-rule" />
            )}
            <div className="mt-8">
              <Credits
                meta={meta}
                copy={caseCopy}
                labels={copy.labels}
                href={href}
                proofLimit={2}
              />
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/** Архив: строка на кейс. Без видео — этим работам нечего показывать в движении. */
export function ArchiveList({
  cases,
  copy,
}: Omit<Common, "lang"> & { cases: readonly CaseMeta[] }) {
  if (cases.length === 0) return null;

  return (
    <Reveal>
      <p className="slate mb-6">{copy.labels.archive}</p>
      <ul className="border-t border-rule">
        {cases.map((meta) => {
          const caseCopy = copy.cases[meta.slug];
          const external = meta.links.repo ?? meta.links.live;

          return (
            <li key={meta.slug} className="border-b border-rule">
              <div className="grid items-baseline gap-x-gutter gap-y-2 py-6 md:grid-cols-12">
                <h3 className="min-w-0 font-display text-lg md:col-span-3">
                  {external ? (
                    <a
                      href={external}
                      target="_blank"
                      rel="noreferrer"
                      className="rule-link"
                    >
                      {caseCopy.title}
                    </a>
                  ) : (
                    caseCopy.title
                  )}
                </h3>
                <p className="min-w-0 max-w-[52ch] text-credit text-bone/70 md:col-span-5">
                  {caseCopy.oneLiner}
                </p>
                <p className="min-w-0 slate normal-case tracking-[0.12em] md:col-span-4 md:text-right">
                  {meta.stack.join(" · ")}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}

/**
 * Клиентские кейсы. Без кадров и без ссылок: у этих работ нет ничего, что
 * можно показать публично, — остаются задача, решение и проверяемые факты.
 */
export function ClientCase({
  meta,
  lang,
  copy,
}: Common & { meta: CaseMeta }) {
  const caseCopy = copy.cases[meta.slug];
  const href = caseHref(lang, meta.slug);

  return (
    <Reveal className="border-t border-rule py-12 first:border-t-0 md:py-16">
      <div className="grid gap-x-gutter gap-y-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <h3 className="min-w-0 font-display text-case text-balance">
            <Link href={href} className="rule-link">
              {caseCopy.title}
            </Link>
          </h3>
          <p className="mt-4 max-w-[42ch] text-lede text-bone/75">{caseCopy.oneLiner}</p>
        </div>

        <div className="flex flex-col gap-6 md:col-span-6 md:col-start-7">
          {caseCopy.solution && (
            <p className="max-w-[58ch] text-credit leading-relaxed text-bone/70">
              {caseCopy.solution}
            </p>
          )}
          <ul className="flex flex-col gap-2 border-t border-rule pt-4">
            {caseCopy.proof.map((item) => (
              <li key={item} className="flex gap-3 text-credit text-bone/70">
                <span aria-hidden className="mt-[0.55em] h-px w-4 shrink-0 bg-rule-strong" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="slate normal-case tracking-[0.12em]">{meta.stack.join(" · ")}</p>
        </div>
      </div>
    </Reveal>
  );
}
