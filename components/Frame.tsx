"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Media } from "@/lib/content";
import { playExclusively, release } from "@/lib/video-conductor";
import { timecode } from "@/lib/timecode";

/*
  AV1 в webm. Явные коды нужны, чтобы canPlayType дал честный ответ:
  без них Safari отвечает "maybe" на контейнер, который не умеет декодировать,
  и вместо одного файла качаются два.
*/
const WEBM = 'video/webm; codecs="av01.0.05M.08"';

type Props = {
  href: string;
  title: string;
  media?: Media;
  /** Крупные кадры грузят постер сразу, остальные — лениво. */
  priority?: boolean;
  /** Ширина кадра в раскладке — нужна, чтобы srcset не тянул лишние пиксели. */
  sizes?: string;
  placeholder: string;
  className?: string;
};

export function Frame({ href, title, media, priority, sizes, placeholder, className }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rootRef = useRef<HTMLAnchorElement | null>(null);

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
        // На тач-устройствах наведения нет: играет кадр, дошедший до центра экрана.
        if (touch.matches && !reduced.matches) void start();
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
  const tint = media?.tint;

  return (
    <Link
      ref={rootRef}
      href={href}
      data-frame
      data-playing={playing || undefined}
      className={`group relative block overflow-hidden bg-ink-raised ${className ?? ""}`}
      style={tint ? ({ "--case-tint": tint } as React.CSSProperties) : undefined}
      onPointerEnter={start}
      onPointerLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
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
            boxShadow: "inset 0 -6rem 5rem -5rem var(--case-tint)",
            borderBottom: "1px solid var(--case-tint)",
          }}
        />
      </span>

      <span className="pointer-events-none absolute bottom-0 left-0 flex w-full items-end justify-between gap-4 p-4">
        <span className="slate text-bone/70">{title}</span>
        {duration > 0 && (
          <span className="slate tabular-nums">{timecode(playing ? elapsed : duration)}</span>
        )}
      </span>
    </Link>
  );
}
