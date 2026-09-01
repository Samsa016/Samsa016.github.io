"use client";

import Link from "next/link";
import { useState } from "react";
import { caseVars } from "@/lib/tint";
import { Reveal } from "./Reveal";

/**
 * Готовая строка списка.
 *
 * Компонент клиентский, поэтому получает не контент сайта, а ровно те строки,
 * которые рисует. Причина жёсткая: в `SiteCopy` лежат функции (`labels.caseOf`,
 * `hero.count`), а функцию через границу сервер → клиент передать нельзя —
 * сборка падает на пререндере. Заодно в RSC-поток не уезжает весь контент
 * обоих языков ради одного списка.
 */
export type WorkRow = {
  slug: string;
  href: string;
  title: string;
  /** Сквозной номер по всей фильмографии, уже с ведущим нулём. */
  number: string;
  /** Строка меты под названием: глава · год · стек. */
  meta: string;
  tint: string;
  poster?: { src: string; srcSet: string };
  /** Подпись под кадром: «работа 03 из 29». */
  caption: string;
};

type Props = {
  rows: readonly WorkRow[];
  heading: string;
  noFootage: string;
};

/**
 * Список работ — главная механика страницы (`DESIGN.md` §2).
 *
 * Строка на работу, активная светится цветом самой работы, рядом проявляется
 * её кадр. Заменяет и архивные строки, и двухколоночную сетку средних кейсов.
 *
 * Почему списком, а не плитками: работ 29. Плитками это стена, которую не
 * долистывают, и 29 постеров в сети. Списком глаз держит десять названий разом,
 * а кадр грузится ровно один — тот, на который навели.
 *
 * Кадр в панели — постер, без видео. Видео остаётся привилегией крупных кейсов:
 * панель меняется на каждом движении курсора по списку, и вешать на неё запуск
 * потока значит гарантированно нарушить правило «быстрый проход курсором не
 * оставляет играющих видео».
 */
export function WorkIndex({ rows, heading, noFootage }: Props) {
  const [active, setActive] = useState(0);
  if (rows.length === 0) return null;

  const current = Math.min(active, rows.length - 1);
  const shown = rows[current];

  return (
    <Reveal className="mb-24 md:mb-40">
      <p className="slate mb-6">{heading}</p>

      <div className="grid gap-x-gutter md:grid-cols-12">
        <ul className="border-t border-rule md:col-span-7">
          {rows.map((row, index) => {
            const isActive = index === current;

            return (
              <li key={row.slug} className="border-b border-rule">
                <Link
                  href={row.href}
                  style={caseVars(row.tint)}
                  onPointerEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-5 transition-colors duration-(--duration-develop) ease-(--ease-reel) md:py-7"
                >
                  {/*
                    Номер сквозной по всей фильмографии, а не по главе: это
                    позиция работы в четырёх годах, и обнулять её на каждой
                    главе значит потерять сам смысл нумерации.
                  */}
                  <span
                    className={`slate tabular-nums transition-colors duration-(--duration-develop) ${
                      isActive ? "text-bone" : ""
                    }`}
                  >
                    {row.number}
                  </span>

                  <span className="min-w-0">
                    <span
                      className={`block min-w-0 font-display text-index transition-colors duration-(--duration-develop) ease-(--ease-reel) ${
                        isActive ? "text-bone" : "text-bone/55"
                      }`}
                      style={
                        isActive
                          ? {
                              textShadow:
                                "0 0 2.5rem color-mix(in oklab, var(--case-lit) 45%, transparent)",
                            }
                          : undefined
                      }
                    >
                      {row.title}
                    </span>

                    {/*
                      Неактивная строка приглушена до 55%, а не до 22%, как
                      просил реф MALTA: на 22% контраст к фону 1.76:1, и список
                      из 29 названий становится нечитаемым для половины людей.
                      Иерархию держат не только светлота, но и свечение
                      активной строки — оно у неактивных выключено.
                    */}
                    {/* Строка меты — референс `Season 1 | 2019 | fantasy | 15+`. */}
                    <span className="slate mt-2 block normal-case tracking-[0.14em]">
                      {row.meta}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/*
          Кадр активной строки. Скрыт на узких экранах: наведения там нет,
          а показывать кадр работы, которую посетитель не выбирал, — врать
          ему про то, где он находится.
        */}
        <div aria-hidden className="hidden md:col-span-5 md:block">
          <div
            className="sticky top-24"
            style={caseVars(shown.tint)}
          >
            <div className="glow-frame relative aspect-video overflow-hidden bg-ink-raised">
              {shown.poster ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={shown.poster.src}
                  src={shown.poster.src}
                  srcSet={shown.poster.srcSet}
                  sizes="38vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover saturate-[0.45]"
                />
              ) : (
                /*
                  Съёмки нет. Вместо пустого бокса — плашка, залитая светом
                  работы: она честно говорит «кадра нет», но не выглядит дырой.
                */
                <div
                  className="grid h-full w-full place-content-center"
                  style={{
                    backgroundImage:
                      "radial-gradient(80% 80% at 50% 120%, color-mix(in oklab, var(--case-lit) 22%, transparent), transparent 70%)",
                  }}
                >
                  <span className="slate">{noFootage}</span>
                </div>
              )}
            </div>

            <p className="slate mt-4 flex items-baseline justify-between gap-4">
              <span className="text-bone/80">{shown.title}</span>
              <span className="tabular-nums">{shown.caption}</span>
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
