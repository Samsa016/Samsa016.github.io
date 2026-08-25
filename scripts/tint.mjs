import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

/*
  Доминанта постер-кадра → `--case-tint`.

  Берём не средний цвет (он всегда уходит в грязно-серый), а самый насыщенный
  из заметных: усредняем картинку до сетки, отбрасываем тусклые ячейки и берём
  медиану оттенка. Затем принудительно поднимаем насыщенность и опускаем
  светлоту — цвет идёт в свечение под кадром, а не в текст.
*/

const POSTER_DIR = new URL("../public/poster/", import.meta.url).pathname;
const GRID = 12;

const toHsl = (r, g, b) => {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
  else if (max === gg) h = ((bb - rr) / d + 2) / 6;
  else h = ((rr - gg) / d + 4) / 6;
  return [h * 360, s, l];
};

export async function tintOf(file) {
  const { data } = await sharp(file)
    .resize(GRID, GRID, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cells = [];
  for (let i = 0; i < data.length; i += 3) {
    const [h, s, l] = toHsl(data[i], data[i + 1], data[i + 2]);
    // Отбрасываем почти-серое и совсем тёмное: там оттенок случаен.
    if (s > 0.18 && l > 0.12 && l < 0.9) cells.push({ h, s, l });
  }

  if (cells.length === 0) return null;

  /*
    Медиана по всем ячейкам уводит в цвет интерфейсного хрома: тёмно-синей
    панели много, а яркого графика мало. Запоминается при этом график.
    Поэтому берём верхнюю треть по насыщенности и медиану оттенка уже внутри неё.
  */
  const vivid = [...cells].sort((a, b) => b.s - a.s).slice(0, Math.max(3, Math.ceil(cells.length / 3)));
  vivid.sort((a, b) => a.h - b.h);

  const hue = vivid[Math.floor(vivid.length / 2)].h;
  const mean = vivid.reduce((sum, c) => sum + c.s, 0) / vivid.length;
  const sat = Math.min(0.72, Math.max(0.42, mean));

  return `hsl(${hue.toFixed(0)} ${(sat * 100).toFixed(0)}% 58%)`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = (await readdir(POSTER_DIR)).filter((f) => f.endsWith(".jpg"));
  const result = {};
  for (const file of files.sort()) {
    result[path.basename(file, ".jpg")] = await tintOf(path.join(POSTER_DIR, file));
  }
  console.log(JSON.stringify(result, null, 2));
}
