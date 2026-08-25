import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CASES_BY_SLUG,
  DEEP_CASES,
  LANGS,
  caseIndex,
  caseTotal,
  getCopy,
} from "@/lib/content";
import { isLang } from "@/lib/lang";
import { Frame } from "@/components/Frame";
import { SiteHeader } from "@/components/SiteHeader";

export const generateStaticParams = () =>
  LANGS.flatMap((lang) => DEEP_CASES.map((c) => ({ lang, slug: c.slug })));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};

  const copy = getCopy(lang).cases[slug as keyof ReturnType<typeof getCopy>["cases"]];
  if (!copy) return {};

  return {
    title: `${copy.title} — ${getCopy(lang).hero.name}`,
    description: copy.oneLiner,
    alternates: {
      canonical: `/${lang}/case/${slug}`,
      languages: Object.fromEntries(LANGS.map((l) => [l, `/${l}/case/${slug}`])),
    },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();

  const meta = CASES_BY_SLUG.get(slug as never);
  if (!meta || meta.weight === "archive") notFound();

  const copy = getCopy(lang);
  const caseCopy = copy.cases[meta.slug];

  return (
    <div className="mx-auto w-full max-w-frame px-gutter">
      <SiteHeader lang={lang} copy={copy} />

      <main className="pt-12 pb-chapter md:pt-20">
        <div className="grid gap-x-gutter gap-y-8 md:grid-cols-12">
          <p className="slate md:col-span-3 md:pt-5">
            {copy.labels.caseOf(caseIndex(meta.slug), caseTotal)}
          </p>

          <div className="md:col-span-9">
            <h1 className="min-w-0 font-display text-chapter text-balance">{caseCopy.title}</h1>
            <p className="mt-6 max-w-[54ch] text-lede text-bone/75">{caseCopy.oneLiner}</p>
          </div>
        </div>

        {/*
          Кадр показываем только когда он есть. У клиентских кейсов съёмки нет
          принципиально, у остальных — пока не снята; в обоих случаях пустой
          бокс 16:9 только мешает читать разбор.
        */}
        {meta.media && (
          <div className="mt-16 md:mt-24">
            <Frame
              href={meta.links.live ?? meta.links.repo ?? `/${lang}/case/${meta.slug}`}
              title={caseCopy.title}
              media={meta.media}
              priority
              placeholder={copy.labels.noFootage}
            />
          </div>
        )}

        <div className="mt-16 grid gap-x-gutter gap-y-12 md:mt-24 md:grid-cols-12">
          {caseCopy.task && (
            <section className="md:col-span-5">
              <h2 className="slate mb-4">{copy.labels.task}</h2>
              <p className="max-w-[52ch] leading-relaxed text-bone/80">{caseCopy.task}</p>
            </section>
          )}

          {caseCopy.solution && (
            <section className="md:col-span-6 md:col-start-7">
              <h2 className="slate mb-4">{copy.labels.solution}</h2>
              <p className="max-w-[56ch] leading-relaxed text-bone/80">
                {caseCopy.solution}
              </p>
            </section>
          )}
        </div>

        <section className="mt-16 grid gap-x-gutter gap-y-8 md:mt-24 md:grid-cols-12">
          <h2 className="slate md:col-span-3 md:pt-1">{copy.labels.proof}</h2>
          <ul className="flex flex-col md:col-span-9">
            {caseCopy.proof.map((item) => (
              <li
                key={item}
                className="border-b border-rule py-4 text-lede text-bone/85 first:border-t first:border-rule"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 grid gap-x-gutter gap-y-6 md:mt-24 md:grid-cols-12">
          <h2 className="slate md:col-span-3">{copy.labels.stack}</h2>
          <p className="font-mono text-credit text-bone/70 md:col-span-9">
            {meta.stack.join(" · ")}
          </p>
        </section>

        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-rule pt-8">
          <Link href={`/${lang}`} className="rule-link slate text-bone">
            {copy.labels.backHome}
          </Link>
          {meta.links.live && (
            <a href={meta.links.live} target="_blank" rel="noreferrer" className="rule-link slate">
              {copy.labels.live}
            </a>
          )}
          {meta.links.repo && (
            <a href={meta.links.repo} target="_blank" rel="noreferrer" className="rule-link slate">
              {copy.labels.repo}
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
