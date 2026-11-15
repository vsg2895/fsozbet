import { Fragment } from 'react'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the index deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
const CATCH_ALL_SLUG = 'special-offers'

/**
 * "Spins By Bonus Type", from sites/fsozbet-redesign.html (`.term`): a
 * terminal window listing one line per bonus type — a `>` prompt, the type's
 * slug, a dotted leader and its number of offers. Hover marks the slug with
 * the highlighter (globals.css). Each line opens that type's own page.
 *
 * The slug is what the terminal prints; the type's name follows it for screen
 * readers, so every link still says what it opens. The counts are the SITE's —
 * active, claimable, owned by a casino attached here — resolved server-side,
 * so a line never promises more than its page has. Renders nothing when the
 * site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  const total = types.reduce((sum, section) => sum + section.offers_count, 0)

  return (
    <div>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-brand">{COPY.home.indexLabel}</p>
      <h2 id="bonus-types-heading" className="mt-2.5 font-display text-[32px] font-extrabold leading-none text-ink sm:text-[clamp(32px,4.4vw,56px)]">
        {COPY.home.bonusTypesTitle}
      </h2>
      <nav aria-labelledby="bonus-types-heading" className="mt-[26px] rounded-lg border-[1.5px] border-line bg-paper py-2.5 font-mono">
        <div aria-hidden className="flex items-center gap-1.5 border-b border-line px-[18px] pb-3 pt-1">
          <i className="h-2.5 w-2.5 rounded-full bg-line-soft" />
          <i className="h-2.5 w-2.5 rounded-full bg-line-soft" />
          <i className="h-2.5 w-2.5 rounded-full bg-line-soft" />
          <span className="ml-2 min-w-0 truncate text-xs text-muted">
            bonus_types — {total} {total === 1 ? 'offer' : 'offers'}
          </span>
        </div>
        <ul role="list">
          {types.map((section) => {
            const label = section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany
            return (
              <li key={section.id}>
                <Link
                  href={`/bonuses/${section.slug}`}
                  className="tl flex min-h-12 items-baseline gap-3 px-[18px] py-3 text-[15px] text-ink transition-colors"
                >
                  {/* The type's own icon, as in the Bonus menu. A plain <img>: next/image
                      refuses SVG. alt="" because the label names it. */}
                  {section.icon_path && (
                    <img src={resolveImageUrl(section.icon_path)!} alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0 self-center" />
                  )}
                  {/* A break opportunity after each underscore, so a long slug wraps
                      between words ("no_deposit_ / offers") rather than mid-word. */}
                  <b className="tl-k min-w-0 font-medium [overflow-wrap:anywhere]">
                    {section.slug.split('-').map((word, i) => (
                      <Fragment key={i}>{i > 0 && <>_<wbr /></>}{word}</Fragment>
                    ))}
                  </b>
                  <span className="sr-only"> — {section.name},</span>
                  <i aria-hidden className="min-w-4 flex-1 -translate-y-1 border-b border-dotted border-line-soft" />
                  <em className="font-semibold not-italic text-brand">
                    {section.offers_count}
                    <span className="sr-only"> {label}</span>
                  </em>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
