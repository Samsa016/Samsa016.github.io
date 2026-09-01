import type { Figure } from "@/lib/content";

type Props = {
  figures: readonly Figure[];
  /**
   * `column` — столбиком сбоку от кадра, как счётчики запусков в референсе
   * SpaceX. `row` — строкой во всю ширину на странице разбора, где числа
   * работают переломом между двумя массивами текста.
   */
  orientation?: "row" | "column";
  className?: string;
};

/**
 * Крупные цифры кейса (`DESIGN.md` §5).
 *
 * Число набирается моноширинным на ступень заголовка кейса, подпись уходит
 * вниз мелким капсом. Единица измерения отделена от цифры и набирается мельче:
 * «850 КБ» одним куском на кегле 4rem не читается как величина — читается как
 * заголовок, и разваливает колонку.
 *
 * Подпись называет единицу измерения, а не пересказывает факт: строка
 * «чем доказано» с тем же фактом стоит на том же экране, и дублировать её
 * под цифрой значит сказать одно и то же дважды.
 *
 * Цвета здесь нет намеренно. Цифры — единственный крупный элемент страницы,
 * который не является работой, и подсвечивать их тинтом значит выдать
 * счётчик за кадр.
 *
 * Разметка — `dl`: подпись это термин, число — его значение. В DOM они идут
 * в этом порядке, а `flex-col-reverse` ставит число сверху; скринридер тогда
 * читает «теста — 133», а не «133» без всякого контекста.
 */
export function Counters({ figures, orientation = "row", className = "" }: Props) {
  if (figures.length === 0) return null;

  return (
    <dl
      className={`grid gap-x-gutter gap-y-8 ${
        orientation === "row" ? "sm:grid-cols-2 lg:grid-cols-3" : ""
      } ${className}`}
    >
      {figures.map((figure) => (
        <div key={figure.label} className="flex flex-col-reverse border-t border-rule pt-4">
          <dt className="slate mt-3 normal-case tracking-[0.14em]">{figure.label}</dt>
          <dd className="font-mono text-feature leading-none tracking-normal tabular-nums text-bone">
            {figure.value}
            {figure.unit && (
              <span className="ml-2 align-baseline text-lede text-muted">{figure.unit}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
