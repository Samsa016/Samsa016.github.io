/**
 * Перспективная привязка прямоугольника к четырём точкам.
 *
 * Экраны в кадре героя нарисованы под углом: боковые развёрнуты внутрь, и их
 * грани — не прямоугольники, а трапеции. Обычным `scale`/`rotate` видео в такую
 * форму не сажается, нужна проективная матрица.
 *
 * Считаем гомографию, переводящую единичный квадрат в заданный четырёхугольник
 * (алгоритм Хекберта), и раскладываем её в `matrix3d`, который понимает CSS.
 * Дальше остаётся домножить на масштаб самого элемента — этим занимается
 * `screenTransform`.
 */

export type Point = readonly [number, number];
/** Углы приёмника по часовой стрелке от левого верхнего. */
export type Quad = readonly [Point, Point, Point, Point];

/**
 * Матрица, переводящая единичный квадрат `(0,0) (1,0) (1,1) (0,1)` в `quad`.
 * Возвращает девять коэффициентов 3×3 в порядке `a b c d e f g h 1`.
 */
function unitSquareTo(quad: Quad): number[] {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad;

  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;

  // Вырожденный случай: противоположные стороны параллельны, перспективы нет.
  if (dx3 === 0 && dy3 === 0) {
    return [x1 - x0, x2 - x1, x0, y1 - y0, y2 - y1, y0, 0, 0, 1];
  }

  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const h = (dx1 * dy3 - dx3 * dy1) / den;

  return [
    x1 - x0 + g * x1, x3 - x0 + h * x3, x0,
    y1 - y0 + g * y1, y3 - y0 + h * y3, y0,
    g, h, 1,
  ];
}

/**
 * CSS-трансформация для элемента размером `w × h`, который должен точно лечь
 * в `quad`. Порядок множителей важен: `scale` применяется первым и сжимает
 * элемент в единичный квадрат, гомография растягивает его по углам.
 */
export function screenTransform(quad: Quad, w: number, h: number): string {
  const [a, b, c, d, e, f, g, hh] = unitSquareTo(quad);
  const m = [a, d, 0, g, b, e, 0, hh, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${m.join(",")}) scale(${1 / w},${1 / h})`;
}

/** Габариты четырёхугольника — нужны для зоны наведения и ореола. */
export function quadBounds(quad: Quad) {
  const xs = quad.map((p) => p[0]);
  const ys = quad.map((p) => p[1]);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
}
