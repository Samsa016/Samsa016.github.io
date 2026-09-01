"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Media } from "@/lib/content";
import { playExclusively, release } from "@/lib/video-conductor";
import { timecode } from "@/lib/timecode";
import { caseVars } from "@/lib/tint";

/*
  AV1 в webm. Явные коды нужны, чтобы canPlayType дал честный ответ:
  без них Safari отвечает "maybe" на контейнер, который не умеет декодировать,
  и вместо одного файла качаются два.
*/
const WEBM = 'video/webm; codecs="av01.0.05M.08"';

/*
  Тач-устройства: автозапуск ждёт первого скролла.

  Без отсрочки кадр героя стартует прямо на загрузке — и забирает себе LCP.
  Браузер считает первый кадр видео главной отрисовкой экрана и приписывает
  ей всё время скачивания ролика: замер 31.08.2026 дал LCP 3.7 с и Lighthouse
  Performance 89 при пороге 90, хотя постер отрисовывался за 80 мс. Формально
  видео даже «крупнее» постера — на 27 пикселей округления, — поэтому и
  вытесняет его из кандидатов.

  Скролл и есть тот момент, когда посетитель начал смотреть: до него он видит
  постер, после — всё работает как раньше. Кадрам ниже первого экрана правило
  не меняет ничего: до них и так не добраться, не прокрутив страницу.
*/
let touchReady = false;
const pendingOnScroll = new Set<() => void>();

function releasePending() {
  touchReady = true;
  for (const cb of pendingOnScroll) cb();
  pendingOnScroll.clear();
}

function whenTouchReady(run: () => void) {
  /*
    Проверка `scrollY` обязательна, а не подстраховка. Кадр героя на телефоне
    виден меньше чем на 60%, поэтому наблюдатель по нему не срабатывает до
    прокрутки — и слушателя скролла на момент самой прокрутки ещё не
    существует. Без этой ветки первый кадр ждал бы второго скролла.
  */
  if (touchReady || window.scrollY > 0) {
    releasePending();
    run();
    return;
  }

  pendingOnScroll.add(run);
  if (pendingOnScroll.size === 1)
    window.addEventListener("scroll", releasePending, { once: true, passive: true });
}

type Props = {
  /*
    Куда ведёт кадр. На главной — в разбор кейса; на самом разборе — в живой
    проект, если он поднят. Ссылки нет — кадр остаётся кадром и не кликается:
    увести человека в репозиторий значит подсунуть код вместо продукта.
  */
  href?: string;
  title: string;
  media?: Media;
  /** Цвет работы: держит свечение кадра. */
  tint: string;
  /** Крупные кадры грузят постер сразу, остальные — лениво. */
  priority?: boolean;
  /** Ширина кадра в раскладке — нужна, чтобы srcset не тянул лишние пиксели. */
  sizes?: string;
  placeholder: string;
  className?: string;
};

export function Frame({ href, title, media, tint, priority, sizes, placeholder, className }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  /** Кадр в зоне видимости — до этого не грузим ничего, даже по наведению. */
  const inView = useRef(false);
  /**
   * Счётчик попыток запуска. play() асинхронный: если курсор ушёл, пока промис
   * ещё не разрешился, токен разойдётся и мы остановим уже стартовавшее видео.
   */
  const attempt = useRef(0);

  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const stop = useCallback(() => {
    attempt.current += 1;
    const video = videoRef.current;
    if (video) release(video);
    setPlaying(false);
    setElapsed(0);
  }, []);

  const start = useCallback(async () => {
    if (!media || !inView.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const video = videoRef.current;
    if (!video) return;

    if (!video.src) {
      video.src = video.canPlayType(WEBM) ? media.webm : media.mp4;
    }

    const token = ++attempt.current;
    setArmed(true);

    try {
      await playExclusively(video);
    } catch {
      // Автозапуск отклонён политикой браузера — остаётся постер, это допустимо.
      return;
    }

    if (attempt.current !== token) {
      release(video);
      return;
    }
    setPlaying(true);
  }, [media]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || !media) return;

    const touch = window.matchMedia("(hover: none)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;

        if (!entry.isIntersecting) {
          stop();
          return;
        }
        // На тач-устройствах наведения нет: играет кадр, дошедший до центра
        // экрана, — но не раньше первого скролла, см. `whenTouchReady`.
        if (touch.matches && !reduced.matches) whenTouchReady(() => void start());
      },
      { threshold: touch.matches ? 0.6 : 0.01 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [media, start, stop]);

  const duration = media?.duration ?? 0;

  /*
    Живой проект живёт на чужом домене — его открываем в новой вкладке,
    чтобы портфолио осталось на месте, пока клиент щупает продукт.
  */
  const external = href?.startsWith("http");

  const shell = {
    ref: (node: HTMLElement | null) => {
      rootRef.current = node;
    },
    "data-frame": true,
    "data-playing": playing || undefined,
    className: `glow-frame group relative block overflow-hidden bg-ink-raised ${className ?? ""}`,
    style: caseVars(tint),
    onPointerEnter: start,
    onPointerLeave: stop,
    onFocus: start,
    onBlur: stop,
  };

  const inner = (
    <>
      <span className="relative block aspect-video">
        {media ? (
          <>
            {/*
              Оптимизатор Next требует сервера, а сайт раздаётся статикой.
              Два размера постера собирает scripts/encode.sh — этого достаточно,
              чтобы телефон не тянул кадр шириной 1280.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.poster}
              srcSet={`${media.poster.replace(/\.jpg$/, "@640.jpg")} 640w, ${media.poster} 1280w`}
              sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
              alt=""
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              width={1280}
              height={720}
              className="absolute inset-0 h-full w-full object-cover saturate-[0.35] transition-[filter,opacity] duration-(--duration-develop) ease-(--ease-reel) group-hover:saturate-100 group-focus-visible:saturate-100"
            />
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              poster={media.poster}
              aria-hidden
              tabIndex={-1}
              onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-(--duration-develop) ease-(--ease-reel) ${
                playing ? "opacity-100" : "opacity-0"
              }`}
              data-armed={armed || undefined}
            />
          </>
        ) : (
          <span className="absolute inset-0 grid place-content-center border border-rule">
            <span className="slate">{placeholder}</span>
          </span>
        )}

        {/* Свечение работы. Единственное место, где на странице появляется цвет. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-(--duration-develop) ease-(--ease-reel) group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            boxShadow: "inset 0 -6rem 5rem -5rem var(--case-lit)",
            borderBottom: "1px solid var(--case-lit)",
          }}
        />
      </span>

      <span className="pointer-events-none absolute bottom-0 left-0 flex w-full items-end justify-between gap-4 p-4">
        <span className="slate text-bone/70">{title}</span>
        {duration > 0 && (
          <span className="slate tabular-nums">{timecode(playing ? elapsed : duration)}</span>
        )}
      </span>
    </>
  );

  if (!href) return <div {...shell}>{inner}</div>;

  if (external) {
    return (
      <a {...shell} href={href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <Link {...shell} href={href}>
      {inner}
    </Link>
  );
}
