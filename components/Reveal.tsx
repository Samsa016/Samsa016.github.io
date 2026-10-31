"use client";

import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Сдвиг внутри группы, чтобы список проявлялся по очереди. */
  delay?: number;
  className?: string;
  /** Нужен, чтобы блок работы принёс с собой свой `--case-tint`. */
  style?: CSSProperties;
  /**
   * Откуда приходит блок. Работы выезжают по очереди то справа, то слева
   * (решение владельца 02.09.2026): одинаковый подъём у всех блоков читался
   * как один длинный список, чередование задаёт странице ритм.
   */
  from?: "up" | "left" | "right";
};

/**
 * Проявление при скролле: fade и лёгкий подъём. Ничего резкого.
 *
 * Подъём здесь ни при чём, если кажется, что страницу трясёт: `transform`
 * раскладку не меняет. Тряску вбок давала шкала глав — она анимировала
 * собственную ширину и толкала колонку работ, см. `ChapterRail`.
 *
 * При «уменьшении анимации» блок обязан просто стоять на месте видимым.
 * Отдельной ветки под это здесь нет намеренно: она отдавала бы на сервере одно
 * дерево, а на клиенте с включённой настройкой — другое, и React ругался бы на
 * несовпадение гидрации (настройку системы сервер знать не может). За видимость
 * отвечает правило `[data-reveal]` в `globals.css`: `!important` в таблице
 * стилей перебивает инлайновый стиль motion, и порядок гидрации перестаёт
 * что-либо решать.
 */
export function Reveal({ children, delay = 0, className, style, from = "up" }: Props) {
  // Боковой заезд заметно длиннее подъёма: короткий сдвиг вбок читается как
  // рывок, а не как движение.
  const offset =
    from === "left" ? { x: -72, y: 0 } : from === "right" ? { x: 72, y: 0 } : { x: 0, y: 24 };

  return (
    <motion.div
      data-reveal
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{
        duration: from === "up" ? 0.6 : 0.85,
        ease: [0.22, 0.61, 0.36, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
