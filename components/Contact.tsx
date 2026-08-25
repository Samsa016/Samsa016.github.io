import type { SiteCopy } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Contact({ copy }: { copy: SiteCopy }) {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-rule py-chapter">
      <Reveal>
        <div className="grid gap-x-gutter gap-y-10 md:grid-cols-12">
          <h2 className="min-w-0 font-display text-chapter md:col-span-6">{copy.contact.title}</h2>

          <div className="flex flex-col gap-10 md:col-span-5 md:col-start-8">
            <p className="max-w-[42ch] text-lede text-bone/75">{copy.contact.lede}</p>

            <ul className="flex flex-col">
              {copy.contact.channels.map((channel) => (
                <li
                  key={channel.label}
                  className="flex items-baseline justify-between gap-6 border-b border-rule py-4"
                >
                  <span className="slate">{channel.label}</span>
                  <a
                    href={channel.href}
                    className="rule-link font-mono text-credit text-bone"
                  >
                    {channel.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
