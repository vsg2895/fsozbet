import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

function Stars({ rating }: { rating: number }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at this size reads as a rendering fault.
  // The exact figure is printed beside it either way.
  const filled = Math.round(rating)

  return (
    <span
      className="inline-flex items-center tracking-[1px] text-[15px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? 'text-gold' : 'text-star-empty'} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/** The grid the cards sit in — the mockup's `.cgrid`: two across, one below 980px. */
export const CASINO_GRID = 'grid grid-cols-1 gap-4 min-[61.25rem]:grid-cols-2'

/**
 * A casino as a card — `.cc` in sites/fsozbet-redesign.html: the logo on a
 * white plate at the left, then the name and rating with the first region it
 * accepts, the headline offer under a mono label, and the two actions. Hover
 * or keyboard focus lifts the card and draws a lime rule along its bottom edge
 * (globals.css). Below 640px the logo moves above the text.
 *
 * NO RANK. The mockup prints "#01", "#02"… under each logo; the network rule
 * is that no casino card shows a rank — the `<ol>` order is the ranking.
 * `rank` is still accepted so callers did not have to change. The chip is
 * real attached data (`countries`), with a count for the rest.
 */
export default function CasinoCard({
  casino,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const firstRegion = regions[0]

  return (
    <li className="cc relative grid grid-cols-1 items-start gap-3.5 rounded-lg border-[1.5px] border-line bg-paper p-5 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-5">
      {/* The logo plate. WHITE: operator logos arrive with their own white
          ground baked in. The image fills the plate (contained), so a small
          logo file is never drawn smaller than its box. */}
      <div className="flex h-[72px] w-[104px] items-center justify-center overflow-hidden rounded-md bg-white p-2 sm:h-[84px] sm:w-[120px]">
        {image ? (
          <Image src={image} alt={`${casino.name} logo`} width={240} height={168} sizes="120px" className="h-full w-full object-contain" />
        ) : (
          <span className="text-center text-sm font-extrabold text-brand-ink [overflow-wrap:anywhere]">{casino.name}</span>
        )}
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0">
            <h3 className="font-display text-[clamp(20px,6.6vw,24px)] font-extrabold leading-[1.05] text-ink [overflow-wrap:anywhere]">{casino.name}</h3>
            <p className="mt-1.5 flex items-center gap-2 text-[13px] font-semibold text-ink-soft">
              <Stars rating={casino.rating} />
              <span className="tabular-nums">{casino.rating.toFixed(1)}</span>
            </p>
          </div>
          {firstRegion && (
            <span className="shrink-0 rounded border border-line-soft px-2 py-[3px] font-mono text-[11px] text-ink-soft">
              {firstRegion.name}
              {regions.length > 1 && <> +{regions.length - 1}<span className="sr-only"> more regions</span></>}
            </span>
          )}
        </div>

        {casino.bonuses && (
          <p className="mt-3.5 font-display text-[19px] font-bold leading-[1.35] text-ink [overflow-wrap:anywhere]">
            <span className="mb-1 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{COPY.casinos.headlineOffer}</span>
            {casino.bonuses}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={casino.attachment.affiliate_url}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="btn-l min-h-11 px-3 text-sm"
          >
            {COPY.casinos.visitCasino}
          </a>
          <Link href={`/casinos/${casino.slug}`} className="btn-o min-h-11 px-3 text-sm">
            {COPY.casinos.readReview}
          </Link>
        </div>
      </div>
    </li>
  )
}
