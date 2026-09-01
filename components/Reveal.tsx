"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Сдвиг внутри группы, чтобы список проявлялся по очереди. */
  delay?: number;
  className?: string;
  /** Нужен, чтобы блок работы принёс с собой свой `--case-tint`. */
  style?: CSSProperties;
};

/**
 * Проявление при скролле: fade и лёгкий подъём. Ничего резкого.
 *
 * Подъём здесь ни при чём, если кажется, что страницу трясёт: `transform`
 * раскладку не меняет. Тряску вбок давала шкала глав — она анимировала
 * собственную ширину и толкала колонку работ, см. `ChapterRail`.
 *
 * При «уменьшении анимации» блок обязан просто стоять на месте видимым.
 * Одного `useReducedMotion` для этого мало: хук отдаёт значение только после
 * монтирования, а motion к этому моменту уже отрисовал `initial` и, увидев
 * системную настройку, отказался анимировать — блок оставался на `opacity: 0`
 * навсегда, то есть страница просто пустела. Поэтому за видимость отвечает
 * правило `[data-reveal]` в `globals.css`: `!important` в таблице стилей
 * перебивает инлайновый стиль motion, и порядок гидрации перестаёт что-либо
 * решать.
 */
export function Reveal({ children, delay = 0, className, style }: Props) {
  const reduced = useReducedMotion();

  if (reduced)
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );

  return (
    <motion.div
      data-reveal
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
