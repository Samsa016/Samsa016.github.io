"use client";

import { useEffect, useState } from "react";

/*
  Сигнатура сайта.

  При первой загрузке по интерактивным элементам страницы пробегает та же
  разметка Set-of-Marks, которой браузерный агент из портфолио размечает чужие
  сайты: рамка и номер на каждом элементе. Через ~1.2 с гаснет.

  Главная компетенция показана тем, что страница проделывает её на себе.

  Ограничения: один раз за сессию, прерывается любым действием пользователя,
  полностью отключена при prefers-reduced-motion, рисуется поверх уже
  отрисованной страницы и на LCP не влияет.
*/

const SESSION_KEY = "marks-shown";
const LIFETIME = 1200;
const FADE = 400;
const MAX_MARKS = 14;

type Mark = { id: number; top: number; left: number; width: number; height: number };

function collectTargets(): Mark[] {
  return Array.from(document.querySelectorAll<HTMLElement>("a[href], button"))
    .map((element) => element.getBoundingClientRect())
    .filter(
      (rect) =>
        rect.width > 24 &&
        rect.height > 12 &&
        rect.top >= 0 &&
        rect.bottom <= window.innerHeight,
    )
    .slice(0, MAX_MARKS)
    .map((rect, index) => ({
      id: index + 1,
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }));
}

export function SetOfMarks() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Приватный режим блокирует sessionStorage — тогда просто не показываем.
      return;
    }

    /*
      Замеряем в следующем кадре, а не в теле эффекта: до первой отрисовки
      геометрия ещё не окончательная (шрифты, изображения), и рамки встанут мимо.
    */
    const frame = requestAnimationFrame(() => setMarks(collectTargets()));
    return () => cancelAnimationFrame(frame);
  }, []);

  /*
    Гашение живёт в отдельном эффекте. Если держать таймер рядом со сбором,
    повторный монтаж (StrictMode в разработке, возврат на страницу навигацией)
    снимет таймер на размонтировании, а новый проход выйдет по sessionStorage —
    и рамки останутся на экране навсегда.
  */
  useEffect(() => {
    if (marks.length === 0 || fading) return;

    const dismiss = () => setFading(true);
    const timer = window.setTimeout(dismiss, LIFETIME);
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("keydown", dismiss, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, [marks.length, fading]);

  useEffect(() => {
    if (!fading) return;
    const timer = window.setTimeout(() => setMarks([]), FADE);
    return () => window.clearTimeout(timer);
  }, [fading]);

  if (marks.length === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 transition-opacity ease-(--ease-reel)"
      style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE}ms` }}
    >
      {marks.map((mark, index) => (
        <span
          key={mark.id}
          className="absolute border border-bone/45"
          style={{
            top: mark.top,
            left: mark.left,
            width: mark.width,
            height: mark.height,
            animation: "mark-in 220ms var(--ease-reel) both",
            animationDelay: `${index * 45}ms`,
          }}
        >
          <span className="absolute -top-px -left-px bg-bone px-1 font-mono text-[10px] leading-[1.4] text-ink">
            {mark.id}
          </span>
        </span>
      ))}

      <style>{`
        @keyframes mark-in {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
