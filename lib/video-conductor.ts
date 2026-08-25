/**
 * Дирижёр воспроизведения: на странице играет ровно одно видео.
 *
 * Нужен по двум причинам. На десктопе быстрый проход курсором по сетке успевает
 * запустить несколько роликов раньше, чем отработают их `pointerleave`. На тач-
 * устройствах наведения нет вообще, и кадры стартуют по попаданию в центр экрана —
 * там пересечение соседних кейсов гарантировано.
 */

let current: HTMLVideoElement | null = null;

export function playExclusively(el: HTMLVideoElement): Promise<void> {
  if (current && current !== el) {
    current.pause();
    current.currentTime = 0;
  }
  current = el;

  // Safari до 17 не возвращает промис из play().
  return Promise.resolve(el.play());
}

export function release(el: HTMLVideoElement) {
  el.pause();
  el.currentTime = 0;
  if (current === el) current = null;
}

export function isCurrent(el: HTMLVideoElement) {
  return current === el;
}
