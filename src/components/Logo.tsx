import Link from 'next/link'

/**
 * fsozbet brand mark, from sites/fsozbet-redesign.html (`.logo`): a sharp lime
 * tile carrying "fs" in black, the wordmark, and a monospaced tagline beneath.
 *
 * Type rather than an SVG drawing: the mark IS two letters on a tile, so
 * setting them in the display face keeps it crisp at any size with no artwork
 * to maintain. The tile is aria-hidden to avoid announcing "fs"; the link's
 * name is its visible text plus an sr-only " home" — never an aria-label,
 * which would drop the visible words from the name.
 *
 * Below 360px the tile and wordmark step down a size and the tagline drops,
 * so the burger beside them keeps its place on a 320px phone. `onDark` is for the footer, which
 * sits on a deeper black: only the tagline shifts to the footer's own grey.
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
      className={`inline-flex min-h-11 min-w-0 shrink items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-night' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className="font-display flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md bg-brand text-[15px] font-black text-brand-ink min-[22.5rem]:h-[38px] min-[22.5rem]:w-[38px] min-[22.5rem]:text-[17px]"
      >
        fs
      </span>

      <span className="grid min-w-0 gap-1 leading-none">
        <span className="font-display text-[18px] font-extrabold text-ink min-[22.5rem]:text-[20px]">
          fsozbet<span className="sr-only"> home</span>
        </span>
        <span
          className={`whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.06em] max-[22.5rem]:hidden ${
            onDark ? 'text-night-muted' : 'text-muted'
          }`}
        >
          Free spins, fairly rated
        </span>
      </span>
    </Link>
  )
}
