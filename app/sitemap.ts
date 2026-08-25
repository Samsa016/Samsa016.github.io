import type { MetadataRoute } from "next";
import { DEEP_CASES, LANGS } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Статический экспорт: файл собирается на сборке, а не по запросу.
export const dynamic = "force-static";

/** Обе языковые версии каждой страницы, со ссылками друг на друга. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", ...DEEP_CASES.map((c) => `/case/${c.slug}`)];

  return LANGS.flatMap((lang) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          LANGS.map((other) => [other, `${SITE_URL}/${other}${path}`]),
        ),
      },
    })),
  );
}
