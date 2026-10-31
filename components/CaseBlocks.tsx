import Link from "next/link";
import type { CaseMeta, Lang, SiteCopy } from "@/lib/content";
import { Counters } from "./Counters";
import { Credits } from "./Credits";
import { Frame } from "./Frame";
import { Reveal } from "./Reveal";
import { caseVars } from "@/lib/tint";

type Common = { lang: Lang; copy: SiteCopy };

const caseHref = (lang: Lang, slug: string) => `/${lang}/case/${slug}`;

const field = caseVars;


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
  from,
}: Common & { meta: CaseMeta; priority?: boolean; from?: "up" | "left" | "right" }) {
  const href = caseHref(lang, meta.slug);
  const caseCopy = copy.cases[meta.slug];

  /*
    Без съёмки кадра нет. Пустой бокс 16:9 читается как «здесь должно было
    что-то быть» — хуже, чем его отсутствие. Такой кейс подаётся текстом.
  */
  if (!meta.media) {
    return (
      <Reveal
        className="case-field mb-24 border-t border-rule pt-10 md:mb-40 md:pt-14"
        style={field(meta.tint)}
        from={from}
      >
        <div className="grid gap-x-gutter gap-y-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <h3 className="min-w-0 font-display text-feature text-balance">
              <Link href={href} className="rule-link">
                {caseCopy.title}
              </Link>
            </h3>
            <p className="mt-6 max-w-[42ch] text-lede text-bone/75">{caseCopy.oneLiner}</p>

            {caseCopy.figures && (
              <Counters
                figures={caseCopy.figures}
                orientation="column"
                className="mt-10 md:mt-14"
              />
            )}
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
    <Reveal className="case-field mb-24 md:mb-40" style={field(meta.tint)} from={from}>
      <Frame
        href={href}
        title={caseCopy.title}
        media={meta.media}
        tint={meta.tint}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 76vw"
        placeholder={copy.labels.noFootage}
      />
      <div className="grid md:grid-cols-12">
        <div className="relative z-10 -mt-6 bg-ink pt-8 pr-6 md:col-span-7 md:-mt-16 md:pt-10 md:pr-12">
          <Credits meta={meta} copy={caseCopy} labels={copy.labels} href={href} />
        </div>

        {caseCopy.figures && (
          <Counters
            figures={caseCopy.figures}
            orientation="column"
            className="mt-12 md:col-span-4 md:col-start-9 md:mt-16"
          />
        )}
      </div>
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
  from,
}: Common & { meta: CaseMeta; from?: "up" | "left" | "right" }) {
  const caseCopy = copy.cases[meta.slug];
  const href = caseHref(lang, meta.slug);

  return (
    <Reveal
      className="case-field border-t border-rule py-12 first:border-t-0 md:py-16"
      style={field(meta.tint)}
      from={from}
    >
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
