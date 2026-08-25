/**
 * Таймкод в монтажной записи: часы:минуты:секунды:кадры при 25 к/с.
 * Кадры — не декоративность: это то, чем на самом деле подписан монтажный стол.
 */
const FPS = 25;

const pad = (value: number) => String(Math.floor(value)).padStart(2, "0");

export const timecode = (seconds: number) => {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const whole = Math.floor(safe);
  const frames = Math.floor((safe - whole) * FPS);

  return `${pad(whole / 3600)}:${pad((whole % 3600) / 60)}:${pad(whole % 60)}:${pad(frames)}`;
};
