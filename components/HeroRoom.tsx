"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { quadBounds, screenTransform } from "@/lib/homography";
import { ROOM, ROOM_SCREENS, expand, shrink } from "@/lib/hero-room";
import { DESK_LIGHTS, RACK_LIGHTS, blinkVars } from "@/lib/hero-lights";

/**
 * Кадр героя: тёмная серверная, в которой ничего не работает, пока по ней не
 * ведут курсором.
 *
 * Правило сцены (решение владельца 02.09.2026): курсор — единственный источник
 * жизни. Картинка снята полностью выключенной, весь свет добавляется поверх, и
 * ни один элемент не анимируется сам по себе. Отсюда три слоя:
 *
 *  1. `room-plate`  — сама комната, мёртвая;
 *  2. `room-lit`    — та же комната в осветлённой копии, видимая только сквозь
 *                     маску вокруг курсора: это и есть «фонарик»;
 *  3. экраны        — шесть демок, вписанных в нарисованное стекло через
 *                     `matrix3d`; видео грузится и играет только под курсором.
 *
 * Вес на старте — одна картинка (~80 КБ в AVIF). Шесть роликов лежат с
 * `preload="none"` и не трогают сеть, пока на экран не навели: без этого герой
 * повторил бы ошибку clevante.cz с её загрузкой в две минуты пятьдесят секунд
 * (замер в `REFERENCES.md`).
 */

/**
 * Ролик «живой комнаты»: та же сцена, где мерцают индикаторы стоек, горит
 * подсветка клавиатуры и мыши, в воздухе идёт пыль. Он ложится поверх мёртвой
 * картинки и виден только сквозь круг под курсором.
 *
 * Ролик снят из той же картинки, поэтому кадр совпадает пиксель в пиксель и
 * врезанные демки остаются на своих местах. Водяной знак Veo из правого нижнего
 * угла вычищен при кодировании, звуковая дорожка убрана.
 *
 * Пока файла нет, сквозь ту же маску показывается осветлённая копия картинки —
 * эффект слабее, но механика та же, и подмена ничего не ломает.
 */
const ALIVE_CLIP = true;

export function HeroRoom() {
  const stage = useRef<HTMLDivElement>(null);
  const alive = useRef<HTMLVideoElement>(null);

  // Масштаб сцены. Разметка экранов задана в пикселях исходника, поэтому
  // внутренний слой рисуется в натуральные 2752×1536 и сжимается целиком —
  // так координаты остаются теми же числами, что были сняты по кадру.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      // Кадр закрывает экран целиком, поэтому масштаб берём по большей стороне
      // и центрируем: лишнее уходит за края, как при `object-fit: cover`.
      // Разметка экранов при этом не сбивается — она живёт внутри слоя, и
      // смещение применяется ко всему слою сразу.
      const k = Math.max(width / ROOM.width, height / ROOM.height);
      el.style.setProperty("--k", String(k));
      el.style.setProperty("--ox", `${(width - ROOM.width * k) / 2}px`);
      el.style.setProperty("--oy", `${(height - ROOM.height * k) / 2}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Позиция луча. Пишем в переменные вместо состояния: перерисовывать React на
  // каждое движение мыши незачем, маску двигает композитор.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let frame = 0;
    // Цель — где курсор сейчас; луч — где он светит. Луч догоняет цель с
    // задержкой: жёстко приклеенный к курсору круг читается как вырезанная
    // дырка, а отстающий — как тяжёлый фонарь, который ведут по комнате.
    let tx = 0, ty = 0, lx = 0, ly = 0, started = false;

    const tick = () => {
      lx += (tx - lx) * 0.14;
      ly += (ty - ly) * 0.14;
      el.style.setProperty("--mx", `${lx}px`);
      el.style.setProperty("--my", `${ly}px`);
      frame = Math.abs(tx - lx) > 0.4 || Math.abs(ty - ly) > 0.4 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // Переводим в пиксели исходника: маски живут внутри слоя, сжатого
      // `scale(--k)`, и координаты вьюпорта там промахнулись бы мимо курсора.
      const k = Math.max(r.width / ROOM.width, r.height / ROOM.height);
      const ox = (r.width - ROOM.width * k) / 2;
      const oy = (r.height - ROOM.height * k) / 2;
      tx = (e.clientX - r.left - ox) / k;
      ty = (e.clientY - r.top - oy) / k;
      // Свой курсор идёт без задержки — иначе он отстаёт от руки и мешает.
      el.style.setProperty("--cx", `${e.clientX - r.left}px`);
      el.style.setProperty("--cy", `${e.clientY - r.top}px`);
      if (!started) { started = true; lx = tx; ly = ty; }
      // Мышь, стоявшая внутри кадра ещё до загрузки, не даёт `pointerenter`:
      // зажигаем сцену и по первому же движению, иначе она остаётся тёмной.
      if (!el.hasAttribute("data-lit")) onEnter();
      if (!frame) frame = requestAnimationFrame(tick);
    };
    // Ролик подтягивается только когда курсор впервые вошёл в кадр: на старте
    // герой весит одну картинку, и сеть не трогается вовсе.
    // Ролик зациклен и не отматывается: разгорание из него вырезано при
    // кодировании, осталось установившееся мерцание. Попытка привязать
    // разгорание к приходу курсора давала обратный эффект — первые секунды
    // под лучом комната была почти погашена, и мерцание читалось «с перебоями».
    const onEnter = () => {
      el.setAttribute("data-lit", "");
      const v = alive.current;
      if (v) {
        // Ускоряем: на исходной скорости паузы между вспышками длинные, и
        // стойка под лучом выглядит почти погасшей.
        v.playbackRate = 1.8;
        v.play().catch(() => {});
      }
    };
    const onLeave = () => {
      el.removeAttribute("data-lit");
      alive.current?.pause();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={stage} className="room-stage">
      <div className="room-inner">
        <RoomPlate className="room-plate" fetchPriority="high" />

        {/*
          Осветлённая копия — проявляется только в круге вокруг курсора.
          Та же разметка источников, что и у плиты: браузер выбирает тот же
          файл и берёт его из кэша. Захардкоженная картинка в `background`
          качалась вдобавок к выбранному AVIF, а на широких экранах ещё и
          растягивала 1920 поверх плиты 2752.
        */}
        <RoomPlate className="room-lit" />

        {/*
          Собственные огни поверх ролика. В генерации вспышки редкие и с
          провалами — под курсором стойка выглядела погасшей. Эти точки мерцают
          часто, каждая в своём ритме, и видны через ту же маску.
        */}
        <div className="room-lights" aria-hidden>
          {RACK_LIGHTS.map(([x, y, r]) => (
            <i
              key={`r${x}-${y}`}
              style={{ left: `${x}px`, top: `${y}px`, width: `${r * 2}px`, height: `${r * 2}px`, ...blinkVars(x, y) }}
            />
          ))}
          {/*
            Мягкое зарево под клавиатурой и мышью. Одних точек мало: луч
            осветляет и сам стол, и подсветка клавиш терялась в нём — свет
            фонаря перебивал свет клавиатуры. Зарево даёт ей собственный объём.
          */}
          <span className="desk-glow keys" />
          <span className="desk-glow mouse" />

          {DESK_LIGHTS.map(([x, y, r]) => (
            <i
              key={`d${x}-${y}`}
              className="desk"
              style={{ left: `${x}px`, top: `${y}px`, width: `${r * 2}px`, height: `${r * 2}px`, ...blinkVars(x, y) }}
            />
          ))}
        </div>

        {ALIVE_CLIP && (
          <video
            ref={alive}
            className="room-alive"
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
          >
            <source src="/hero/room-alive.webm" type="video/webm" />
            <source src="/hero/room-alive.mp4" type="video/mp4" />
          </video>
        )}

        {ROOM_SCREENS.map(({ slug, quad, inset }) => {
          const hit = shrink(quad, inset);
          const b = quadBounds(quad);
          return (
            <div key={slug} className="room-screen" data-slug={slug}>
              <video
                className="room-video"
                style={
                  {
                    transform: screenTransform(quad, 1280, 720),
                    "--lift": screenTransform(expand(quad, 1.045), 1280, 720),
                  } as CSSProperties
                }
                width={1280}
                height={720}
                muted
                loop
                playsInline
                preload="none"
                poster={`/poster/${slug}@640.jpg`}
              >
                <source src={`/video/${slug}.webm`} type="video/webm" />
                <source src={`/video/${slug}.mp4`} type="video/mp4" />
              </video>

              {/* Полоса развёртки в момент включения — геометрия та же. */}
              <div
                className="room-flash"
                style={{ transform: screenTransform(quad, 100, 100), width: "100px", height: "100px" }}
                aria-hidden
              />

              {/* Ореол по контуру стекла — свет, а не рамка. */}
              <div
                className="room-halo"
                style={{
                  left: `${b.left}px`,
                  top: `${b.top}px`,
                  width: `${b.width}px`,
                  height: `${b.height}px`,
                }}
                aria-hidden
              />

              {/*
                Зона наведения уже стекла: экраны стоят вплотную, и без
                зазора один луч включал бы сразу два. Зона намеренно не кнопка
                и не в обходе Tab: включать её нечем — обработчики только
                указательные, — а шесть остановок со слагами вместо названий
                вставали впереди всего содержимого страницы. К этим работам
                клавиатура доходит ниже, ссылками в списке.
              */}
              <div
                className="room-hit"
                style={{ transform: screenTransform(hit, 100, 100) }}
                aria-hidden
                onPointerEnter={(e) => {
                  const box = e.currentTarget.closest(".room-screen");
                  const v = box?.querySelector("video");
                  box?.setAttribute("data-on", "");
                  v?.play().catch(() => {});
                }}
                onPointerLeave={(e) => {
                  const box = e.currentTarget.closest(".room-screen");
                  const v = box?.querySelector("video");
                  box?.removeAttribute("data-on");
                  v?.pause();
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Свой курсор. Системная стрелка поверх тёмной сцены ломает картину,
          поэтому она спрятана, а вместо неё — точка в цвете луча. */}
      <div className="room-cursor" aria-hidden />
    </div>
  );
}

/*
  Плита серверной. Один набор источников на два слоя — саму картинку и её
  осветлённую копию под лучом.
*/
function RoomPlate({
  className,
  fetchPriority,
}: {
  className: string;
  fetchPriority?: "high" | "low" | "auto";
}) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet="/hero/room-1280.avif 1280w, /hero/room-1920.avif 1920w, /hero/room-2752.avif 2752w"
        sizes="100vw"
      />
      <img
        className={className}
        src="/hero/room-1920.webp"
        srcSet="/hero/room-1280.webp 1280w, /hero/room-1920.webp 1920w, /hero/room-2752.webp 2752w"
        sizes="100vw"
        width={ROOM.width}
        height={ROOM.height}
        alt=""
        aria-hidden
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}
