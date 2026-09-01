import Link from "next/link";
import type { CaseCopy, CaseMeta, SiteCopy } from "@/lib/content";

type Props = {
  meta: CaseMeta;
  copy: CaseCopy;
  labels: SiteCopy["labels"];
  href: string;
  /** Сколько фактов показывать в сетке. На странице разбора — все. */
  proofLimit?: number;
  /** Заголовок уже стоит выше по разметке — не дублируем его. */
  headless?: boolean;
  /**
   * Титры под кадром: заголовок и однострочник встают по центру кадра.
   * Ниже центровка не идёт — факты и стек читаются только с ровного левого края.
   */
  centered?: boolean;
};

/** Титры кейса: то, что стоит рядом с кадром. */
export function Credits({
  meta,
  copy,
  labels,
  href,
  proofLimit = 3,
  headless,
  centered,
}: Props) {
  const proof = copy.proof.slice(0, proofLimit);

  return (
    <div className="flex flex-col gap-5">
      {!headless && (
        <div className={`flex flex-col gap-3 ${centered ? "items-center text-center" : ""}`}>
          <h3 className="min-w-0 font-display text-case text-balance">
            <Link href={href} className="rule-link">
              {copy.title}
            </Link>
          </h3>
          <p className="max-w-[46ch] text-lede text-bone/75">{copy.oneLiner}</p>
        </div>
      )}

      {proof.length > 0 && (
        <ul className="flex flex-col gap-2 border-t border-rule pt-4">
          {proof.map((item) => (
            <li key={item} className="flex gap-3 text-credit text-bone/70">
              <span
                aria-hidden
                className="mt-[0.55em] h-px w-4 shrink-0 bg-(--case-tint)"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="slate max-w-[46ch] leading-relaxed tracking-[0.12em] normal-case">
        {meta.stack.join(" · ")}
      </p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link href={href} className="rule-link slate text-bone">
          {labels.openCase}
        </Link>
        {meta.links.live && (
          <a
            href={meta.links.live}
            target="_blank"
            rel="noreferrer"
            className="rule-link slate"
          >
            {labels.live}
          </a>
        )}
        {meta.links.repo && (
          <a
            href={meta.links.repo}
            target="_blank"
            rel="noreferrer"
            className="rule-link slate"
          >
            {labels.repo}
          </a>
        )}
      </div>
    </div>
  );
}
