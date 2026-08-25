import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    Статический экспорт: сайт раздаётся как набор файлов, без Node на хосте.
    Это то, что умеет GitHub Pages, и это же делает площадку заменяемой —
    те же файлы лягут куда угодно, если хостинг однажды окажется недоступен.
  */
  output: "export",

  // Оптимизатор картинок Next требует сервер. Постеры вместо него отдаются
  // готовым srcset из двух размеров — их собирает scripts/encode.sh.
  images: { unoptimized: true },

  // Каждый маршрут становится каталогом с index.html — так статика отдаётся
  // без правил переписывания на стороне хостинга.
  trailingSlash: true,
};

export default nextConfig;
