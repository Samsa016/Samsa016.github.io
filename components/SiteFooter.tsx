import Link from "next/link";
import { DEEP_CASES, type Lang, type SiteCopy } from "@/lib/content";

/**
 * Подвал: бегущая строка с названиями работ и имя во всю ширину.
 *
 * Приём владельца из `REFERENCES.md` (redis.agency): «названия,
 * перематывающиеся вбок, в footer» плюс гигантское имя, уходящее за обрез.
 * Бегут именно названия работ, а не контакты: контакты стоят статикой в секции
 * «Связаться» прямо над подвалом, и второй раз подряд, да ещё дисплейным
 * кеглем, они читались как сбой, а не как приём. Развести их отступом не вышло —
 * на 1440×900 оба списка всё равно попадали в один экран.
 *
 * Лента набрана в один ряд и продублирована — второй прогон нужен только затем,
 * чтобы шов не был виден: пока первый уходит влево, второй уже занял его место,
 * и на `-50%` дорожка возвращается в исходное положение. Дубль скрыт от чтения
 * с экрана и выключен из обхода по Tab: названия в нём те же самые.
 *
 * Берём `DEEP_CASES`, а не все работы: у архивных нет своей страницы разбора,
 * и в ленте они стали бы ссылками в никуда.
 */
export function SiteFooter({ lang, copy }: { lang: Lang; copy: SiteCopy }) {
  const runs = [0, 1] as const;

  return (
    <footer className="site-footer">
      <div className="ticker">
        <div className="ticker-track">
          {runs.map((run) => (
            <div className="ticker-run" key={run} aria-hidden={run === 1 || undefined}>
              {DEEP_CASES.map((meta) => (
                <Link
                  key={meta.slug}
                  href={`/${lang}/case/${meta.slug}`}
                  className="ticker-item"
                  tabIndex={run === 1 ? -1 : undefined}
                >
                  <span className="ticker-value">{copy.cases[meta.slug].title}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/*
        Имя набрано так, что задевает края экрана. Держится очень слабым тоном:
        на полной яркости оно кричало бы громче любой работы на странице,
        а его роль — подпись под фильмографией, а не заголовок.
      */}
      <p className="footer-name">{copy.hero.name}</p>

      <div className="mx-auto w-full max-w-frame px-gutter">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-rule pt-6">
          <p className="slate normal-case tracking-[0.12em]">{copy.footer.note}</p>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href={`/${lang}#chapter-y4`} className="rule-link slate">
              {copy.nav.work}
            </Link>
            <Link href={`/${lang}/about`} className="rule-link slate">
              {copy.nav.about}
            </Link>
            <Link href={`/${lang}#contact`} className="rule-link slate">
              {copy.nav.contact}
            </Link>
            {/* Ссылка на сам маршрут: переход на текущую страницу возвращает
                прокрутку в начало, отдельного якоря для этого не нужно. */}
            <Link href={`/${lang}`} className="rule-link slate">
              {copy.footer.top}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
