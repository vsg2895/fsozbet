'use client'

import { useState } from 'react'
import { OfferTable } from '@/components/SpecialOfferCard'
import { COPY } from '@/constants/copy'
import type { SpecialOffer } from '@shared/types/specialOffer'

const PER_PAGE = 4

/**
 * A casino's attached special offers, shown 4 at a time with the total count —
 * the mockup's "Bonuses at this casino" table (sites/fsozbet-redesign.html):
 * the bonus type, the offer, its amount and "View offer →".
 * When there are more than 4, client-side pagination pages through them (the
 * offers already arrive with the casino, so no extra fetch is needed).
 */
export default function CasinoSpecialOffers({ offers, logo }: { offers: SpecialOffer[]; logo?: string | null }) {
  const [page, setPage] = useState(0)

  // The API may serialize an empty relation as {} rather than []; guard for it
  // so a casino with no offers doesn't crash (offers.slice is not a function).
  const list = Array.isArray(offers) ? offers : []
  const total = list.length
  if (total === 0) return null

  const pageCount = Math.ceil(total / PER_PAGE)
  const start = page * PER_PAGE
  const visible = list.slice(start, start + PER_PAGE)

  return (
    <section className="mt-11">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <h2 className="min-w-0 font-display text-[26px] font-extrabold leading-tight text-ink sm:text-[clamp(26px,3vw,36px)]">
          {COPY.casinos.offersHeading} <span className="font-sans text-lg font-semibold text-faint">({total})</span>
        </h2>
        {pageCount > 1 && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous offers"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md border-[1.5px] border-line-soft text-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-line-soft disabled:hover:text-ink"
            >
              ←
            </button>
            {/* `whitespace-nowrap`, and it is load-bearing: in a flex row next
                to a heading this is three tokens ("1", "/", "2"), and a long
                heading squeezed it into three stacked lines between the two
                arrows. The counter is one word, so it is told to behave like
                one. */}
            <span className="whitespace-nowrap font-mono text-sm tabular-nums text-muted">{page + 1} / {pageCount}</span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page === pageCount - 1}
              aria-label="More offers"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md border-[1.5px] border-line-soft text-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-line-soft disabled:hover:text-ink"
            >
              →
            </button>
          </div>
        )}
      </div>

      <OfferTable offers={visible} lead="type" logo={logo} claim={false} caption={COPY.casinos.offersHeading} />
    </section>
  )
}
