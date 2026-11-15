import Link from 'next/link'
import { COPY } from '@/constants/copy'
import { OfferTable } from '@/components/SpecialOfferCard'
import type { BonusSection } from '@/lib/api'

/**
 * The home page's Bonuses, from sites/fsozbet-redesign.html (`.otabs` over a
 * `.tbox`): a row of tabs, one per bonus type with its count, over that type's
 * offers as a table.
 *
 * CSS-only tabs — radio inputs, no client JavaScript — so EVERY type's offers
 * are in the server HTML, where crawlers read them; only the checked panel is
 * displayed. The rules tying each radio to its panel are generated, because the
 * number of types comes from the admin.
 *
 * Each panel keeps the `#bonus-<slug>` anchor every site's home page exposes,
 * and a link to one OPENS it (until a tab is picked — see `anchored`).
 */
export default function BonusTabs({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  // An anchored panel (/#bonus-<slug>) is shown only while the tabs are still
  // untouched — first tab checked. Once a visitor picks a tab, the radios rule
  // again; and while the anchor rules, its tab is the one drawn as selected.
  const anchored = '.fz-bonus:has(#bt-0:checked):has([data-bt]:target)'
  const rules = [
    ...sections.map((_, i) => `.fz-bonus:has(#bt-${i}:checked) [data-bt="${i}"]{display:block}`),
    `${anchored} [data-bt]{display:none!important}`,
    `${anchored} [data-bt]:target{display:block!important}`,
    `${anchored}:not(:has([data-bt="0"]:target)) label[for="bt-0"]{background:transparent;color:var(--color-ink-soft);border-color:var(--color-line-soft)}`,
    ...sections.map((_, i) => `.fz-bonus:has(#bt-0:checked):has([data-bt="${i}"]:target) label[for="bt-${i}"]{background:var(--color-brand);color:var(--color-brand-ink);border-color:var(--color-brand)}`),
  ].join('')

  return (
    <div className="fz-bonus mt-6">
      <style>{rules}</style>
      <fieldset className="min-w-0">
        <legend className="sr-only">Bonus types</legend>
        <div className="flex flex-wrap gap-1.5">
          {sections.map((section, i) => (
            <span key={section.id} className="relative">
              <input type="radio" name="bonus-tabs" id={`bt-${i}`} defaultChecked={i === 0} className="peer sr-only" />
              <label
                htmlFor={`bt-${i}`}
                className="flex min-h-11 cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border-[1.5px] border-line-soft px-3.5 text-sm font-semibold text-ink-soft transition-colors hover:border-brand hover:text-ink peer-checked:border-brand peer-checked:bg-brand peer-checked:text-brand-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
              >
                {section.name}
                <span className="font-mono text-xs opacity-70">{section.offers_count}</span>
              </label>
            </span>
          ))}
        </div>
      </fieldset>

      {sections.map((section, i) => (
        <div key={section.id} id={`bonus-${section.slug}`} data-bt={i} className="hidden scroll-mt-24">
          <div className="mb-4 mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-xl font-bold text-ink">{section.name}</h3>
            <Link href={`/bonuses/${section.slug}`} className="-my-3 inline-flex min-h-11 items-center py-3 text-sm font-bold text-brand transition-colors hover:text-brand-soft">
              {COPY.home.seeMore}<span className="sr-only"> {section.name}</span> <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
          {section.description && <p className="mb-4 text-sm text-ink-soft">{section.description}</p>}
          <OfferTable offers={section.offers} caption={section.name} />
        </div>
      ))}
    </div>
  )
}
