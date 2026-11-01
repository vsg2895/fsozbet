import Link from 'next/link'

/**
 * fsozbet brand mark: a lime tile carrying "fs" in black, the wordmark with
 * "bet" in lime, and a monospaced tagline beneath. Taken from
 * sites/fsozbet.html.
 *
 * Type rather than an SVG drawing: the mockup's mark IS two letters on a tile,
 * so setting them in the display face keeps it crisp at any size with no
 * artwork to maintain. The Link carries the accessible name; the tile is
 * aria-hidden to avoid announcing "fs" before it.
 *
 * `onDark` is for the footer, which sits on a deeper black than the page: the
 * mark and the wordmark need no inversion, only the tagline shifts to the
 * footer's own muted tone.
 */
export default function Logo({
  className = '',
  onDark = false,
}: {
  className?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      aria-label="fsozbet home"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-night' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className="font-display grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-brand text-[16px] font-extrabold text-brand-ink sm:h-10 sm:w-10 sm:text-[18px]"
      >
        fs
      </span>

      <span className="grid gap-0.5 leading-none">
        <span className="font-display text-[20px] font-extrabold tracking-[-0.03em] text-ink sm:text-[22px]">
          fsoz<span className="text-brand">bet</span>
        </span>
        <span
          className={`font-mono text-[9px] font-bold uppercase tracking-[0.18em] sm:text-[10px] ${
            onDark ? 'text-night-muted' : 'text-muted'
          }`}
        >
          Free spins, fairly rated
        </span>
      </span>
    </Link>
  )
}
