"use client";

import { usePathname } from "next/navigation";
import { LANGS, type Lang } from "@/lib/content";

/**
 * Переключатель языка. Меняет первый сегмент пути и запоминает выбор в куке —
 * иначе middleware на следующем заходе снова уведёт по Accept-Language.
 */
/** Запись живёт вне компонента: это обращение к внешней системе, а не состояние. */
function rememberLang(lang: Lang) {
  document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;
}

export function LangSwitch({ current }: { current: Lang }) {
  const pathname = usePathname();

  const swap = (lang: Lang) => {
    const rest = pathname.split("/").slice(2).join("/");
    return `/${lang}${rest ? `/${rest}` : ""}`;
  };

  return (
    <div className="flex items-center gap-2">
      {LANGS.map((lang, index) => (
        <span key={lang} className="flex items-center gap-2">
          {index > 0 && (
            <span aria-hidden className="text-muted">
              /
            </span>
          )}
          <a
            href={swap(lang)}
            onClick={() => rememberLang(lang)}
            aria-current={lang === current ? "true" : undefined}
            className={`slate transition-colors ${
              lang === current ? "text-bone" : "hover:text-bone"
            }`}
          >
            {lang}
          </a>
        </span>
      ))}
    </div>
  );
}
