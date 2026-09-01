import { notFound } from "next/navigation";
import {
  CHAPTERS_IN_ORDER,
  CHAPTER_YEAR,
  casesOfChapter,
  caseIndex,
  caseTotal,
  getCopy,
  heroCase,
  type CaseMeta,
  type ChapterId,
  type Lang,
  type SiteCopy,
} from "@/lib/content";
import { isLang } from "@/lib/lang";
import { Chapter } from "@/components/Chapter";
import { ClientCase, FeatureCase } from "@/components/CaseBlocks";
import { ChapterRail } from "@/components/ChapterRail";
import { Contact } from "@/components/Contact";
import { Contents } from "@/components/Contents";
import { Hero } from "@/components/Hero";
import { SetOfMarks } from "@/components/SetOfMarks";
import { SiteHeader } from "@/components/SiteHeader";
import { WorkIndex, type WorkRow } from "@/components/WorkIndex";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const copy = getCopy(lang);
  const rail = CHAPTERS_IN_ORDER.map((id) => ({ id, copy: copy.chapters[id] }));
  const hero = heroCase();

  return (
    <>
      <SetOfMarks />

      <div className="mx-auto w-full max-w-frame px-gutter">
        <SiteHeader lang={lang} copy={copy} />
      </div>

      <main>
        {/* Ракорд */}
        <section className="mx-auto w-full max-w-frame px-gutter pt-16 pb-16 md:pt-28 md:pb-24">
          <div className="grid gap-x-gutter gap-y-8 md:grid-cols-12">
            <p className="slate md:col-span-3 md:pt-5">{copy.hero.role}</p>

            <h1 className="min-w-0 font-display text-chapter text-balance md:col-span-9">
              {copy.hero.statement}
            </h1>

            <p className="min-w-0 max-w-[46ch] text-lede text-bone/75 md:col-span-6 md:col-start-4">
              {copy.hero.lede}
            </p>

            <div className="flex items-baseline justify-between gap-6 border-t border-rule pt-4 md:col-span-9 md:col-start-4 md:mt-8">
              <p className="slate">{copy.hero.count(caseTotal)}</p>
              <p className="slate">{copy.hero.scrollHint}</p>
            </div>
          </div>
        </section>

        {/*
          Кадр героя. Есть только если хоть одна работа снята: пустой бокс 16:9
          хуже отсутствия кадра, и тогда первый экран остаётся текстовым.
        */}
        {hero && (
          <div className="mx-auto w-full max-w-frame px-gutter">
            <Hero meta={hero} lang={lang} copy={copy} />
          </div>
        )}

        {/* Светлая полоса на всю ширину — перелом страницы, см. DESIGN.md §4. */}
        <Contents chapters={rail} copy={copy} />

        <div className="mx-auto flex w-full max-w-frame gap-gutter px-gutter">
          <ChapterRail chapters={rail} />

          <div className="min-w-0 flex-1">
            {CHAPTERS_IN_ORDER.map((id) => (
              <ChapterSection
                key={id}
                id={id}
                lang={lang}
                copy={copy}
                heroSlug={hero?.slug}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-frame px-gutter">
          <Contact copy={copy} />
        </div>
      </main>
    </>
  );
}

function ChapterSection({
  id,
  lang,
  copy,
  heroSlug,
}: {
  id: ChapterId;
  lang: "ru" | "en";
  copy: ReturnType<typeof getCopy>;
  heroSlug?: string;
}) {
  const cases = casesOfChapter(id);
  if (cases.length === 0) return null;

  /*
    Работа, ушедшая в кадр героя, остаётся в своей главе — хронология важнее, —
    но строкой списка, а не вторым крупным кадром. Один и тот же кадр дважды
    на странице читается как ошибка вёрстки.
  */
  const features = cases.filter((c) => c.weight === "feature" && c.slug !== heroSlug);
  const clients = cases.filter((c) => c.weight === "client");
  const listed = cases.filter(
    (c) =>
      c.weight === "medium" ||
      c.weight === "archive" ||
      (c.weight === "feature" && c.slug === heroSlug),
  );

  return (
    <Chapter id={id} copy={copy.chapters[id]}>
      {features.map((meta) => (
        <FeatureCase key={meta.slug} meta={meta} lang={lang} copy={copy} />
      ))}

      <WorkIndex
        rows={toRows(listed, lang, copy)}
        heading={copy.labels.allWork}
        noFootage={copy.labels.noFootage}
      />

      {clients.map((meta) => (
        <ClientCase key={meta.slug} meta={meta} lang={lang} copy={copy} />
      ))}
    </Chapter>
  );
}

/**
 * Данные работы → строка списка.
 *
 * Собирается здесь, на сервере: `WorkIndex` клиентский, а в `SiteCopy` лежат
 * функции (`labels.caseOf`), которые через границу сервер → клиент не проходят.
 * Заодно на клиент уезжают только показанные строки, а не весь контент сайта.
 */
function toRows(
  cases: readonly CaseMeta[],
  lang: Lang,
  copy: SiteCopy,
): readonly WorkRow[] {
  return cases.map((meta) => {
    const index = caseIndex(meta.slug);

    return {
      slug: meta.slug,
      href: `/${lang}/case/${meta.slug}`,
      title: copy.cases[meta.slug].title,
      number: String(index).padStart(2, "0"),
      meta: [
        copy.chapters[meta.chapter].index,
        CHAPTER_YEAR[meta.chapter],
        ...meta.stack.slice(0, 2),
      ].join(" · "),
      tint: meta.tint,
      poster: meta.media
        ? {
            src: meta.media.poster,
            srcSet: `${meta.media.poster.replace(/\.jpg$/, "@640.jpg")} 640w, ${meta.media.poster} 1280w`,
          }
        : undefined,
      caption: copy.labels.caseOf(index, caseTotal),
    };
  });
}
