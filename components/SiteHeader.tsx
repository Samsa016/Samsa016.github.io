import Link from "next/link";
import type { Lang, SiteCopy } from "@/lib/content";
import { LangSwitch } from "./LangSwitch";

export function SiteHeader({ lang, copy }: { lang: Lang; copy: SiteCopy }) {
  return (
    <header className="flex items-baseline justify-between gap-6 py-8">
      <Link href={`/${lang}`} className="slate text-bone">
        {copy.hero.name}
      </Link>

      <nav className="flex items-center gap-6">
        <Link href={`/${lang}#chapter-y4`} className="rule-link slate">
          {copy.nav.work}
        </Link>
        <Link href={`/${lang}/about`} className="rule-link slate">
          {copy.nav.about}
        </Link>
        <LangSwitch current={lang} />
      </nav>
    </header>
  );
}
