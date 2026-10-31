import { notFound } from "next/navigation";
import {
  CHAPTERS_IN_ORDER,
  CHAPTER_YEAR,
  casesOfChapter,
  caseIndex,
  caseTotal,
  getCopy,
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
import { HeroRoom } from "@/components/HeroRoom";
import { HeroStage } from "@/components/HeroStage";
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

  return (
    <>
      <SetOfMarks />

      {/* Шапка лежит поверх кадра: герой должен занимать экран целиком. */}
      <div className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-frame px-gutter">
        <SiteHeader lang={lang} copy={copy} />
      </div>

      <main className="hero-clip">
        {/*
          Ракорд. Первый экран — не текст, а кадр: тёмная серверная, в которой
          ничего не работает, пока по ней не ведут курсором. Кадр занимает ровно
          экран, титры лежат поверх — сверху имя работы автора, снизу лид и
          счёт работ. На первом же движении колеса сцена откатывается и уступает
          место оглавлению (`HeroStage`).
        */}
        <HeroStage>
          <HeroRoom />

          {/* Затемнение по краям кадра: без него белые титры лежат на снятой
              комнате, и контраст держится только там, где она случайно тёмная. */}
          <div className="hero-scrim" aria-hidden />

          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between">
            <div className="mx-auto grid w-full max-w-frame gap-x-gutter gap-y-6 px-gutter pt-[14vh] md:grid-cols-12">
              <p className="slate md:col-span-3 md:pt-5">{copy.hero.role}</p>

              <h1 className="min-w-0 font-display text-chapter text-balance md:col-span-9">
                {copy.hero.statement}
              </h1>
            </div>

            <div className="mx-auto grid w-full max-w-frame gap-x-gutter gap-y-6 px-gutter pb-8 md:grid-cols-12 md:pb-10">
              <p className="min-w-0 max-w-[46ch] text-lede text-bone/75 md:col-span-6 md:col-start-4">
                {copy.hero.lede}
              </p>

              {/* На узком экране счёт и подсказка встают друг под друга:
                  в одну строку обе фразы переносились по три раза каждая. */}
              <div className="flex flex-col gap-1 border-t border-rule pt-4 md:col-span-9 md:col-start-4 md:flex-row md:items-baseline md:justify-between md:gap-6">
                <p className="slate">{copy.hero.count(caseTotal)}</p>
                <p className="slate">{copy.hero.scrollHint}</p>
              </div>
            </div>
          </div>
        </HeroStage>

        {/* Светлая полоса на всю ширину — перелом страницы, см. DESIGN.md §4. */}
        <Contents chapters={rail} copy={copy} />

        {/*
          Шкала глав выведена из потока. Пока она стояла в одном флексе с
          колонкой работ, та занимала не всю ширину контейнера, и блоки
          оказывались прижаты вправо: слева оставалось поле под шкалу, справа —
          ничего. Теперь колонка симметрична, а шкала висит поверх неё слева.
        */}
        <div className="relative mx-auto w-full max-w-frame px-gutter">
          <ChapterRail chapters={rail} />

          <div className="min-w-0">
            {CHAPTERS_IN_ORDER.map((id) => (
              <ChapterSection key={id} id={id} lang={lang} copy={copy} />
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
}: {
  id: ChapterId;
  lang: "ru" | "en";
  copy: ReturnType<typeof getCopy>;
}) {
  const cases = casesOfChapter(id);
  if (cases.length === 0) return null;

  /*
    В герое лежит снятая серверная, а не кадр конкретной работы, поэтому
    крупные кейсы больше ни с чем на странице не спорят и показываются все.
  */
  const features = cases.filter((c) => c.weight === "feature");
  const clients = cases.filter((c) => c.weight === "client");
  const listed = cases.filter(
    (c) => c.weight === "medium" || c.weight === "archive",
  );

  return (
    <Chapter id={id} copy={copy.chapters[id]}>
      {/*
        Работы выезжают по очереди то справа, то слева. Одинаковый подъём у всех
        блоков читался как один длинный список; чередование задаёт ритм.
        Счёт сквозной по главе, поэтому клиентские кейсы ниже продолжают его,
        а не начинают заново.
      */}
      {features.map((meta, i) => (
        <FeatureCase
          key={meta.slug}
          meta={meta}
          lang={lang}
          copy={copy}
          from={i % 2 === 0 ? "right" : "left"}
        />
      ))}

      <WorkIndex
        rows={toRows(listed, lang, copy)}
        heading={copy.labels.allWork}
        noFootage={copy.labels.noFootage}
      />

      {clients.map((meta, i) => (
        <ClientCase
          key={meta.slug}
          meta={meta}
          lang={lang}
          copy={copy}
          from={(features.length + i) % 2 === 0 ? "right" : "left"}
        />
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
