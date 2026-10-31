"use client";

import { Fragment } from "react";
import { motion } from "motion/react";

type Props = {
  children: string;
  className?: string;
  /** Чем собирается строка: по буквам (заголовок) или по словам (абзац). */
  unit?: "char" | "word";
  /** Задержка между соседними частицами. */
  step?: number;
  /** Сдвиг всей сборки — чтобы абзац начинался после заголовка. */
  delay?: number;
};

/**
 * Тезис, собирающийся из пикселей (решение владельца 02.09.2026).
 *
 * Заголовки глав и абзацы под ними получают своё движение, отличное от общего
 * `Reveal`: строка не выезжает целиком, а собирается — каждая частица приходит
 * из своей точки, размытая и сжатая до пятна, и на месте становится буквой.
 * Приём стоит дорого по кадрам, поэтому живёт только на тезисах: четыре
 * заголовка глав и четыре абзаца под ними, по разу за прокрутку.
 *
 * Разброс детерминированный, а не `Math.random()`: разметка приезжает с сервера
 * уже со стилями `initial`, и случайные числа на клиенте дали бы другие — React
 * ругался бы на расхождение гидрации на каждой букве.
 *
 * «Уменьшение анимации» гасится в `globals.css` правилом `[data-pixel]`, а не
 * веткой в коде. Ветка отдавала бы на сервере разложенную по буквам разметку,
 * а на клиенте — цельную строку, и React считал бы это несовпадением гидрации:
 * настройку системы сервер знать не может.
 */

/**
 * Смещение частицы в пикселях по её номеру и амплитуде.
 *
 * Значение целое намеренно. motion сериализует `transform` в разметку с шестью
 * значащими цифрами, а на клиенте в объекте стилей лежит полная дробь, и React
 * считал это расхождением гидрации на каждой букве. Целые пиксели совпадают
 * с обеих сторон, а разброс от округления не страдает — он и так на глаз.
 */
const scatter = (n: number, amp: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return Math.round((x - Math.floor(x) - 0.5) * amp);
};

export function PixelText({ children, className, unit = "char", step = 0.02, delay = 0 }: Props) {
  const words = children.split(" ");
  let n = 0;

  return (
    <span className={className}>
      {/*
        Текст для чтения с экрана лежит отдельной строкой: разложенный по
        буквам, он у части читалок произносится по одной букве.
      */}
      <span className="sr-only">{children}</span>

      <span aria-hidden>
        {words.map((word, w) => (
          <Fragment key={`${word}-${w}`}>
            <span className="pixel-word">
              {(unit === "char" ? [...word] : [word]).map((part, p) => {
                const i = n++;
                const ax = scatter(i, 30);
                const ay = scatter(i + 97, 34);

                return (
                  <motion.span
                    key={p}
                    data-pixel
                    className="pixel-cell"
                    initial={{ opacity: 0, scale: 0.42, x: ax, y: ay, filter: "blur(7px)" }}
                    whileInView={{ opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-12% 0px" }}
                    transition={{
                      duration: 0.62,
                      ease: [0.22, 0.61, 0.36, 1],
                      delay: delay + i * step,
                    }}
                  >
                    {part}
                  </motion.span>
                );
              })}
            </span>
            {w < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
