import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS, getCopy } from "@/lib/content";
import { isLang } from "@/lib/lang";
import { Contact } from "@/components/Contact";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";

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
    title: `${copy.about.title} — ${copy.hero.name}`,
    description: copy.about.lede,
    alternates: {
      canonical: `/${lang}/about`,
      languages: Object.fromEntries(LANGS.map((l) => [l, `/${l}/about`])),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const copy = getCopy(lang);

  return (
    <div className="mx-auto w-full max-w-frame px-gutter">
      <SiteHeader lang={lang} copy={copy} />

      <main className="pt-12 md:pt-20">
        <div className="grid gap-x-gutter gap-y-8 md:grid-cols-12">
          <h1 className="min-w-0 font-display text-chapter text-balance md:col-span-7">
            {copy.about.title}
          </h1>
          <p className="max-w-[46ch] text-lede text-bone/75 md:col-span-5 md:pt-4">
            {copy.about.lede}
          </p>
        </div>

        <div className="mt-24 md:mt-32">
          {copy.about.sections.map((section, index) => (
            <Reveal key={section.heading} delay={index * 0.06}>
              <section className="grid gap-x-gutter gap-y-4 border-t border-rule py-10 md:grid-cols-12 md:py-14">
                <h2 className="slate md:col-span-3 md:pt-1">{section.heading}</h2>
                <p className="max-w-[62ch] leading-relaxed text-bone/80 md:col-span-8 md:col-start-5">
                  {section.body}
                </p>
              </section>
            </Reveal>
          ))}
        </div>

        <Contact copy={copy} />
      </main>
    </div>
  );
}
