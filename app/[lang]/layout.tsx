import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Unbounded, Golos_Text, JetBrains_Mono } from "next/font/google";
import { LANGS, getCopy, type Lang } from "@/lib/content";
import { DEFAULT_LANG, isLang } from "@/lib/lang";
import { SITE_URL } from "@/lib/site";
import "../globals.css";
import { CursorBeam } from "@/components/CursorBeam";
import { SiteFooter } from "@/components/SiteFooter";

/*
  Шрифты берутся через next/font: файлы скачиваются на сборке и раздаются
  с нашего домена. В рантайме внешних запросов нет.
*/
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  display: "swap",
});

const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  display: "swap",
  // Моноширинный держит только мелкие титры — в первый экран он не спешит
  // и не должен соревноваться за канал с текстовым шрифтом.
  preload: false,
});

export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const copy = getCopy(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...Object.fromEntries(LANGS.map((l) => [l, `/${l}`])),
        "x-default": `/${DEFAULT_LANG}`,
      },
    },
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      locale: lang === "ru" ? "ru_RU" : "en_US",
      type: "website",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html
      lang={lang as Lang}
      className={`${unbounded.variable} ${golos.variable} ${jetbrains.variable}`}
    >
      <body className="relative min-h-dvh">
        {/* Сетка под страницей и луч, который её проявляет. */}
        <CursorBeam />
        {children}
        {/*
          Подвал общий для всех страниц: с разбора работы и со страницы «как я
          работаю» контакты должны быть достижимы так же, как с главной.
        */}
        <SiteFooter lang={lang} copy={getCopy(lang)} />
      </body>
    </html>
  );
}
