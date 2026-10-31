"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * Первый экран целиком (решение владельца 02.09.2026).
 *
 * Герой занимает ровно экран — по ширине и по высоте, — и на первом же движении
 * колеса откатывается: отходит вглубь, гаснет и уступает место следующим блокам.
 * Прокрутка при этом обычная, страница не «приклеена»: сцена просто теряет вес
 * по мере ухода, поэтому переход к оглавлению читается как смена плана, а не
 * как обрыв кадра.
 *
 * Липкий герой, поверх которого наезжает контент, здесь не годится: перекрыть
 * его можно было бы только непрозрачной заливкой следующего блока, а она
 * закрыла бы фиксированные слои света и крапчатости под страницей —
 * см. запрет на заливку вне `html` в `CLAUDE.md`.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Прогресс считаем от «верх сцены у верха экрана» до «низ сцены у верха
  // экрана»: это ровно один экран прокрутки, и весь откат укладывается в него.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /*
    Гаснет раньше, чем уходит: к моменту, когда от сцены остаётся полоска, она
    уже не спорит с текстом, который приехал снизу.

    «Уменьшение анимации» гасит само движение, а не ветку разметки: `style`
    ставится всегда. Иначе сервер, который системной настройки не знает, отдал
    бы `motion.div` со стилями, а клиент — без них, и React увидел бы
    несовпадение гидрации. На нулевой прокрутке все три величины единичные,
    поэтому разметка совпадает в любом случае.
  */
  const still = reduced === true;
  const opacity = useTransform(scrollYProgress, [0.08, 0.8], still ? [1, 1] : [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], still ? [1, 1] : [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["0%", "-6%"]);

  /*
    Ушедшая сцена перестаёт ловить курсор. Кадр прячет системную стрелку
    (`cursor: none` в `.room-stage`), и без этого над погасшим героем — а он
    ещё занимает верх экрана — указатель пропадал уже над оглавлением.
    С `pointer-events: none` кадр выпадает из проверки попадания, и курсор
    берётся от того, что под ним: заодно гаснет и сам фонарик.
  */
  const [gone, setGone] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setGone(v > 0.2));

  return (
    <section ref={ref} className="hero-stage">
      <motion.div
        className="hero-stage-inner"
        style={{ opacity, scale, y }}
        data-gone={gone || undefined}
      >
        {children}
      </motion.div>
    </section>
  );
}
