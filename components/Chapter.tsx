import { CHAPTER_YEAR, type ChapterCopy, type ChapterId } from "@/lib/content";
import { PixelText } from "./PixelText";

type Props = {
  id: ChapterId;
  copy: ChapterCopy;
  children: React.ReactNode;
};

/**
 * Шапка главы — тезис года.
 *
 * Общего `Reveal` здесь нет намеренно: заголовок и абзац под ним собираются
 * из пикселей (`PixelText`), и подъём блока целиком спорил бы с этой сборкой —
 * читалось бы как два движения подряд вместо одного.
 *
 * Абзац кончается заметно раньше правого края колонки: строки, дотянутые до
 * границы контейнера, читаются как текст, упёршийся в стену. Отсюда шесть
 * колонок под лид при девяти под заголовок, а не восемь.
 */
export function Chapter({ id, copy, children }: Props) {
  return (
    <section id={`chapter-${id}`} className="chapter-field scroll-mt-24 py-chapter">
      <header className="mb-16 grid gap-x-gutter gap-y-8 md:mb-24 md:grid-cols-12">
        <div className="flex items-baseline gap-4 md:col-span-2 md:flex-col md:gap-2 md:pt-4">
          <p className="slate">{copy.index}</p>
          <p className="slate tabular-nums">{CHAPTER_YEAR[id]}</p>
        </div>

        {/*
          Девять колонок, а не десять: заголовок больше не дотягивается до
          правого края контейнера, где рядом идёт вертикаль фоновой сетки.
          «Автоматизация» на верхней ступени кегля занимает 1013 px, девять
          колонок дают 1306 — запас есть на всех замеренных ширинах
          (768 / 1024 / 1280 / 1440 / 1920), перенос в заголовке не срабатывает.
        */}
        <h2 className="min-w-0 font-display text-chapter md:col-span-9">
          <PixelText>{copy.title}</PixelText>
        </h2>

        <p className="min-w-0 max-w-[46ch] text-lede text-bone/70 md:col-span-6 md:col-start-3">
          {/*
            Абзац собирается по словам, а не по буквам: на трёх строках
            побуквенная сборка тянулась бы дольше, чем читается сам текст.
            Стартует после заголовка — сначала имя года, потом пояснение.
          */}
          <PixelText unit="word" step={0.03} delay={0.28}>
            {copy.lede}
          </PixelText>
        </p>
      </header>

      {children}
    </section>
  );
}
