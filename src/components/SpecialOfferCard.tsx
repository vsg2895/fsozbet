import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * The bonus type whose offers carry a Claim button.
 *
 * WHY A TYPE AND NOT THE LINK. Claim used to appear on any offer that happened
 * to carry an affiliate URL, which made the primary action a property of the
 * data rather than an editorial decision: filing a bonus under "Free Spins"
 * or "Cashback" still produced a Claim button, because those offers have links
 * too. Claim now means one thing — this is a Special Offer — and whether the
 * offer has a link of its own no longer decides it.
 */
export const CLAIMABLE_BONUS_CATEGORY = 'special-offers'

/** What the first column names: the casino (listings) or the bonus type (a casino's own page). */
type Lead = 'casino' | 'type'

/** Up to two initials, for a casino with no logo artwork. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const TH = 'px-[18px] py-3.5 text-left font-mono text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted'

/**
 * The offers table — `.tbox` in sites/fsozbet-redesign.html: casino (or bonus
 * type), offer, bonus and the way in, one offer per row. Below `md` the header
 * row is dropped and every row becomes a stacked card, so nothing scrolls
 * sideways on a phone.
 */
export function OfferTable({
  offers,
  lead = 'casino',
  logo,
  claim = true,
  caption,
}: {
  offers: SpecialOffer[]
  lead?: Lead
  logo?: string | null
  claim?: boolean
  caption?: string
}) {
  if (offers.length === 0) return null

  return (
    <div className="overflow-hidden rounded-lg border-[1.5px] border-line">
      <table className="w-full border-collapse">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-paper max-md:hidden">
          <tr className="border-b border-line">
            <th scope="col" className={TH}>{lead === 'casino' ? 'Casino' : 'Type'}</th>
            <th scope="col" className={TH}>Offer</th>
            <th scope="col" className={TH}>{lead === 'casino' ? 'Bonus' : 'Details'}</th>
            <th scope="col" className={TH}><span className="sr-only">Action</span></th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <SpecialOfferCard key={offer.id} offer={offer} lead={lead} logo={logo} claim={claim} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * One offer as a row of the offers table: whose it is, its name (the link to
 * its page), the amount in lime, and the action.
 *
 * Claim belongs to the Special Offers bonus type and to nothing else:
 *   Special Offers + link   →  Claim → the casino (the title is the way to the
 *                              details)
 *   Special Offers, NO link →  Claim → the offer's own page
 *   any other bonus type    →  "Details →"
 *
 * `logo` lets a casino page pass its own logo: the offers it lists arrive
 * without their casino attached. `claim={false}` is that page's list, which
 * has only ever led to each offer's own page — never straight to the casino.
 */
export default function SpecialOfferCard({
  offer,
  lead = 'casino',
  logo: logoOverride,
  claim = true,
}: {
  offer: SpecialOffer
  lead?: Lead
  logo?: string | null
  claim?: boolean
}) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const casinoName = offer.casino?.name ?? ''
  const href = `/special-offers/${offer.slug}`

  // Claim is a property of the bonus TYPE, not of whether a link happens
  // to be filled in. See CLAIMABLE_BONUS_CATEGORY.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY

  return (
    <tr className="border-b border-line transition-colors last:border-b-0 hover:bg-surface max-md:grid max-md:grid-cols-[minmax(0,1fr)_auto] max-md:items-center max-md:gap-x-3 max-md:gap-y-1.5 max-md:p-4">
      <td className="px-[18px] py-3.5 align-middle max-md:col-span-2 max-md:p-0">
        {lead === 'casino' ? (
          <span className="flex items-center gap-3 font-bold text-ink">
            <span aria-hidden className="flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-white p-1 text-[11px] font-extrabold text-brand-ink">
              {logo ? (
                <Image src={logo} alt="" width={96} height={72} sizes="48px" className="h-full w-full object-contain" />
              ) : (
                initials(casinoName || offer.title)
              )}
            </span>
            <span className="min-w-0 [overflow-wrap:anywhere]">{casinoName}</span>
          </span>
        ) : (
          offer.bonus_category_name && (
            <span className="font-mono text-xs uppercase text-muted">{offer.bonus_category_name}</span>
          )
        )}
      </td>
      <td className="px-[18px] py-3.5 align-middle max-md:col-span-2 max-md:p-0">
        <Link href={href} className="-my-3 inline-block py-3 font-bold text-ink [overflow-wrap:anywhere] hover:text-brand max-md:-my-2 max-md:py-2">
          {offer.title}
        </Link>
      </td>
      <td className="px-[18px] py-3.5 align-middle font-display font-bold text-brand [overflow-wrap:anywhere] max-md:p-0">
        {offer.bonuses}
      </td>
      <td className="px-[18px] py-3.5 text-right align-middle max-md:p-0">
        {claim && claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-l min-h-11 whitespace-nowrap px-4 text-sm">
              Claim
            </a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={href} className="btn-l min-h-11 whitespace-nowrap px-4 text-sm">
              Claim
            </Link>
          )
        ) : (
          <Link href={href} className="btn-o min-h-11 whitespace-nowrap px-3.5 text-sm hover:bg-brand hover:text-brand-ink">
            {lead === 'casino' ? 'Details' : 'View offer'}<span className="sr-only"> — {offer.title}</span> <span aria-hidden>→</span>
          </Link>
        )}
      </td>
    </tr>
  )
}
