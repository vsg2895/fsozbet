import { ImageResponse } from 'next/og'
import { SHARE_IMAGE_ALT } from '@/lib/seo'

/**
 * Dynamic Open Graph / Twitter card image.
 *
 * Until now no og:image existed anywhere while twitter:card was set to
 * `summary_large_image`, so every share of these pages rendered as an empty
 * card — the single most visible SEO/social gap on the site. Generating it here
 * means it can never drift out of sync with the site name, and needs no binary
 * asset committed to the repo.
 *
 * Next.js links this file automatically on the home page only. Every other
 * page sets its own `openGraph`, which REPLACES the layout's (metadata
 * merges shallowly) and drops this card — so those pages restate it via
 * `SHARE_IMAGES` in lib/seo, which also holds the alt text below.
 */
export const alt = SHARE_IMAGE_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // The page black with one lime glow from above — the hero's own
          // treatment, so a shared link looks like the site it leads to.
          background: '#0c0e11',
          backgroundImage:
            'radial-gradient(60% 90% at 50% 0%, rgba(200,241,53,0.22), rgba(12,14,17,0) 70%)',
          color: '#eef0e8',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 10, color: '#9aa1ab', textTransform: 'uppercase' }}>
          Free Spins, Fairly Rated
        </div>
        {/* Satori needs an EXPLICIT display on any element with more than one
            child — the wordmark is two coloured spans, so this one says flex
            rather than relying on the browser default it never sees. */}
        <div
          style={{
            display: 'flex',
            fontSize: 104,
            fontWeight: 700,
            marginTop: 24,
            padding: '0 60px',
          }}
        >
          <span>fsoz</span>
          <span style={{ color: '#c8f135' }}>bet</span>
        </div>
        <div style={{ fontSize: 32, marginTop: 32, opacity: 0.7 }}>
          18+ · Gamble responsibly
        </div>
      </div>
    ),
    size,
  )
}
