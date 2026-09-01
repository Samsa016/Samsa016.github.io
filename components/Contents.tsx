import Link from "next/link";
import { CHAPTER_YEAR, caseTotal, type ChapterCopy, type ChapterId, type SiteCopy } from "@/lib/content";
import { Reveal } from "./Reveal";

type Props = {
  chapters: readonly { id: ChapterId; copy: ChapterCopy }[];
  copy: SiteCopy;
};

/**
 * Светлая полоса-оглавление (`DESIGN.md` §4).
 *
 * Единственное место на сайте, где фон становится светлым. Причина не в
 * декоре: лента из четырнадцати тысяч пикселей в одном тоне читается мёртвой,
 * и лечится это переломом, а не осветлением фона целиком.
 *
 * Заодно закрывает дыру в навигации: 29 работ жили без оглавления, добраться
 * до Года 1 можно было только прокруткой.
 */
export function Contents({ chapters, copy }: Props) {
  return (
    <section className="band-light py-chapter">
      <div className="mx-auto w-full max-w-frame px-gutter">
        <Reveal>
          <div className="flex items-baseline justify-between gap-6 border-b border-ink/15 pb-4">
            <p className="slate">{copy.contents.title}</p>

            {/*
              Большие цифры — референс счётчиков SpaceX (`DESIGN.md` §5).
              Только настоящие величины: число работ считается из данных,
              число лет — из глав. Выдуманных метрик на сайте нет.
            */}
            <p className="flex items-baseline gap-6 font-mono tabular-nums">
              <span className="text-2xl md:text-4xl">
                {caseTotal}
                <span className="slate ml-2">{copy.contents.works}</span>
              </span>
              <span className="text-2xl md:text-4xl">
                {chapters.length}
                <span className="slate ml-2">{copy.contents.years}</span>
              </span>
            </p>
          </div>

          <ul className="mt-10 flex flex-col gap-2 md:mt-16">
            {chapters.map(({ id, copy: chapter }) => (
              <li key={id}>
                <Link
                  href={`#chapter-${id}`}
                  className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-4 py-2 md:grid-cols-[7rem_1fr]"
                >
                  <span className="slate tabular-nums">{CHAPTER_YEAR[id]}</span>
                  {/*
                    `hyphens` и перенос по словам обязательны: «Агенты
                    и автоматизация» дисплейным кеглем шире 360px и без переноса
                    вытаскивает за вьюпорт всю страницу, а не только себя.
                  */}
                  <span className="min-w-0 hyphens-auto break-words font-display text-chapter text-ink/60 transition-colors duration-(--duration-develop) ease-(--ease-reel) group-hover:text-ink group-focus-visible:text-ink">
                    {chapter.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
