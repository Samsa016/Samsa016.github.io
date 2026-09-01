import type { ChapterCopy, ChapterId } from "@/lib/content";
import { Reveal } from "./Reveal";

type Props = {
  id: ChapterId;
  copy: ChapterCopy;
  children: React.ReactNode;
};

export function Chapter({ id, copy, children }: Props) {
  return (
    <section id={`chapter-${id}`} className="chapter-field scroll-mt-24 py-chapter">
      <Reveal className="mb-16 md:mb-24">
        <div className="grid gap-x-gutter gap-y-6 md:grid-cols-12">
          <p className="slate md:col-span-2 md:pt-4">{copy.index}</p>
          {/*
            Десять колонок, а не семь. «Автоматизация» дисплейным кеглем —
            769px при кегле 79px, и в семи колонках (597px) слово не помещалось:
            заголовок уезжал в три строки с переносом «автома-тизация».
            Замерено на 768/1024/1280/1440/1920 — на всех ширинах слово теперь
            влезает в строку, и перенос в заголовке главы не срабатывает.
          */}
          <h2 className="min-w-0 font-display text-chapter text-balance md:col-span-10">
            {copy.title}
          </h2>
          {/*
            Лид намеренно уезжает в правую колонку под заголовок, а не центрируется
            под ним: асимметрия ломает ритм «заголовок — абзац — заголовок».
          */}
          <p className="min-w-0 max-w-[52ch] text-lede text-bone/70 md:col-span-8 md:col-start-3">
            {copy.lede}
          </p>
        </div>
      </Reveal>

      {children}
    </section>
  );
}
