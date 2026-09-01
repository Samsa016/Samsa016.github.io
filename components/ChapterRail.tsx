"use client";

import { useEffect, useState } from "react";
import type { ChapterCopy, ChapterId } from "@/lib/content";

type Props = {
  chapters: readonly { id: ChapterId; copy: ChapterCopy }[];
};

/**
 * Липкая шкала глав слева — положение в фильмографии.
 * На узких экранах прячется: там роль ориентира выполняют сами заголовки глав.
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
      className="pointer-events-none sticky top-0 hidden h-dvh shrink-0 flex-col justify-center gap-6 pl-gutter lg:flex"
    >
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
    </nav>
  );
}
