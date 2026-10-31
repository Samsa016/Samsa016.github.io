"use client";

import { useEffect, useState } from "react";
import type { ChapterCopy, ChapterId } from "@/lib/content";

type Props = {
  chapters: readonly { id: ChapterId; copy: ChapterCopy }[];
};

/**
 * Липкая шкала глав слева — положение в фильмографии.
 * На узких экранах прячется: там роль ориентира выполняют сами заголовки глав.
 *
 * Из потока выведена намеренно: стоя в одном флексе с колонкой работ, она
 * съедала её ширину слева, и вся страница выглядела прижатой вправо.
 */
export function ChapterRail({ chapters }: Props) {
  const [active, setActive] = useState<ChapterId>(chapters[0]?.id);

  useEffect(() => {
    const sections = chapters
      .map(({ id }) => document.getElementById(`chapter-${id}`))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible) setActive(visible.target.id.replace("chapter-", "") as ChapterId);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav
      aria-label="Главы"
      /*
        Шкала стоит в поле слева от контейнера, а не внутри него: внутри она
        наезжала на названия работ. Поле появляется только на широких экранах,
        поэтому там же включается и она — ниже ориентиром служат заголовки глав.

        Порог 2048, а не 2000: контейнер шириной 112rem центрируется, слева от
        него остаётся (100vw − 1792) / 2, и на шкалу в 112 px этого хватает
        ровно с 2048. На 2000 её левый край уходил за вьюпорт — раньше это
        давало горизонтальную прокрутку, теперь обрезалось бы `.hero-clip`.
      */
      className="pointer-events-none absolute inset-y-0 -left-32 z-20 hidden w-28 min-[2048px]:block"
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-center gap-6">
      {chapters.map(({ id, copy }) => {
        const current = id === active;
        return (
          <a
            key={id}
            href={`#chapter-${id}`}
            className="pointer-events-auto flex items-center gap-3 transition-colors duration-300"
            aria-current={current ? "true" : undefined}
          >
            {/*
              Линейка всегда шириной 8, короткой её делает `scale-x`, а не `w-3`.
              Анимация ширины здесь стоила бы дорого: шкала стоит в одном флексе
              с колонкой работ, её собственная ширина считается по самому широкому
              пункту, и пока линейка ехала с 12px до 32px, шкала «дышала», а вся
              колонка с блоками ползла вбок долями пикселя за кадр. Замер
              31.08.2026: шкала 147.25 → 148.84, колонка 261.97 → 264.03.
              Владелец видел это как тряску блоков вбок. `transform` раскладку
              не трогает, поэтому двигается только сама линейка.
            */}
            <span
              aria-hidden
              className={`h-px w-8 origin-left transition-[transform,background-color] duration-500 ease-(--ease-reel) ${
                current ? "scale-x-100 bg-bone" : "scale-x-[0.375] bg-rule-strong"
              }`}
            />
            <span
              className={`slate transition-colors duration-300 ${
                current ? "text-bone" : "text-muted"
              }`}
            >
              {copy.index}
            </span>
          </a>
        );
      })}
      </div>
    </nav>
  );
}
