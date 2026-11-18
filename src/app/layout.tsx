import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Manrope, Schibsted_Grotesk } from 'next/font/google'
import Link from 'next/link'
import ScrollToTopOnNavigate from '@/components/ScrollToTopOnNavigate'
import NewsletterForm from '@/components/NewsletterForm'
import SocialIcons from '@/components/SocialIcons'
import CookieConsent from '@/components/CookieConsent'
import ToastProvider from '@/components/ToastProvider'
import CookieSettingsButton from '@/components/CookieSettingsButton'
import Logo from '@/components/Logo'
import { getSocialLinks, hasSpecialOffers, getCategories, getBonusArea } from '@/lib/api'
import { buildOrganizationSchema, buildWebSiteSchema, jsonLdScript, SHARE_IMAGES } from '@/lib/seo'
import { SITE_URL } from '@/lib/config'
import { COPY } from '@/constants/copy'
import NavDropdown from '@/components/NavDropdown'
import FooterNavGroup from '@/components/FooterNavGroup'
import MobileNav from '@/components/MobileNav'
import { resolveImageUrl } from '@/lib/images'
import { LEGAL_PAGES } from '@/constants/legalPages'
import type { SocialLink } from '@shared/types/socialLink'
import './globals.css'

// The mockup's three faces (sites/fsozbet-redesign.html): Manrope for text,
// Schibsted Grotesk for every heading, IBM Plex Mono for the labels, the
// terminal index and the small print.
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const schibsted = Schibsted_Grotesk({ variable: '--font-schibsted', subsets: ['latin'], weight: ['500', '700', '800', '900'] })
const plexMono = IBM_Plex_Mono({ variable: '--font-plex-mono', subsets: ['latin'], weight: ['500', '600'] })

/**
 * Subscribe capture: every entry point on this site — the newsletter form and,
 * where the site has one, the timed subscribe modal.
 *
 * The components, the /api/newsletter route and the backend double-opt-in flow
 * are never touched by this; it only decides whether they are rendered. That is
 * the point of a flag rather than deleted markup: turning capture off and back
 * on is one edit, and nothing has to be rebuilt from memory.
 */
const SUBSCRIBE_ENABLED = true

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'fsozbet'

// Both strings live in COPY so this site's wording is defined in exactly one
// place — the same place the page-level titles and descriptions come from.
// The previous SITE_DESCRIPTION here was byte-identical to a sibling domain's,
// which made this site's default meta/og/twitter description duplicate content
// on every page that falls back to it.
const SITE_TITLE = `${SITE_NAME} — ${COPY.site.titleTail}`
const SITE_DESCRIPTION = `${SITE_NAME} ${COPY.site.description}`

export const metadata: Metadata = {
  // THE origin every relative canonical and og:url in the app resolves
  // against. `SITE_URL` is validated at module load (see lib/config), so the
  // old `|| 'https://…'` literal is gone: a second hardcoded host here is
  // exactly how the canonical and the sitemap drifted onto different hosts.
  metadataBase: new URL(SITE_URL),
  // Root default. Every page overrides it with its own path, so each URL
  // gets a SELF-referencing canonical rather than inheriting the homepage's.
  alternates: { canonical: '/' },
  title: {
    // Home & inner pages set their own; this is the SEO-friendly fallback title.
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Terms that describe what THIS site publishes. The generic set that was
  // here was shared with a sibling domain and described neither in particular.
  keywords: [...COPY.site.keywords, SITE_NAME],
  // Tab icon.
  //
  // This used to offer ONLY icon.svg. Browsers that do not take an SVG favicon
  // — Safari most visibly — then had nothing to fall back to, because
  // /favicon.ico 404'd, so they showed a placeholder or a stale cached icon
  // instead of this site's own mark. app/favicon.ico now holds 16/32/48 rasters
  // cut from that same artwork, and Next links it automatically from the file
  // convention, so it is deliberately NOT repeated here.
  //
  // `apple` DOES have to be listed: an explicit icons object suppresses the
  // apple-icon file convention, so app/apple-icon.tsx was generating a 180x180
  // PNG at /apple-icon that no page ever linked to.
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Relative on purpose: Next resolves it against metadataBase, so og:url
    // and the canonical can never disagree about the host.
    url: '/',
    images: SHARE_IMAGES,
  },
  // The card TYPE only. A title and description here were inherited by every
  // page that does not set `twitter` itself — nearly all of them — so a shared
  // /casinos or /about went out on X under the HOME page's title. With these
  // tags absent, X reads the page's own og:title, og:description and og:image.
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // Search-engine ownership verification, supplied per environment. Absent env
  // vars simply produce no tag, so nothing has to be committed to the repo.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION
        ? { 'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION }
        : {}),
    },
  },
}

/**
 * Viewport + theme colour.
 *
 * Next 14 moved these out of `metadata` into their own export; leaving
 * themeColor in `metadata` is silently ignored, which is why the sites had no
 * theme-color at all. `viewport-fit=cover` is deliberately omitted — nothing
 * here draws into the notch area.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c0e11',
}

const NAV_LINKS = [
  { href: '/casinos', label: COPY.nav.casinos },
  { href: '/special-offers', label: COPY.nav.specialOffers },
  { href: '/categories', label: COPY.nav.categories },
]

/** A header link — the mockup's `nav.main a`: fills with the panel grey on hover. */
const NAV_LINK = 'flex min-h-11 items-center whitespace-nowrap rounded-md px-3 py-2 text-[15px] font-semibold text-ink transition-colors hover:bg-surface'

/** A footer link — the mockup's `.fc a`: marked in lime on hover. */
const FOOTER_LINK = 'inline-flex min-h-11 min-w-11 items-center text-sm text-night-ink transition-colors hover:bg-brand hover:text-brand-ink'

const FOOTER_HEAD = 'font-mono text-xs font-medium text-brand'

// The 11 legal pages split into the footer's three columns, as in the mockup.
// Every page in LEGAL_PAGES lands in exactly one of them.
const FOOTER_EXPLORE = ['about', 'contact']
const FOOTER_LEGAL = ['privacy-policy', 'terms', 'cookie-policy', 'disclaimer']
const FOOTER_POLICIES = ['responsible-gambling', 'affiliate-disclosure', 'editorial-policy', 'aml-policy', 'kyc-policy']

function footerPages(slugs: string[]) {
  return LEGAL_PAGES.filter(({ slug }) => slugs.includes(slug))
}

/** The header dropdown panel, in this site's own palette. */
const NAV_PANEL = {
  panelClassName: 'bg-paper ring-1 ring-line',
  itemClassName: 'text-ink-soft hover:bg-brand/10 hover:text-brand',
  allItemClassName: 'text-ink hover:bg-brand/10 hover:text-brand',
  arrowClassName: 'text-brand',
}

/** The phone menu (below `md`), in this site's own palette. */
const NAV_MOBILE = {
  triggerClassName: 'text-ink hover:bg-surface hover:text-brand',
  panelClassName: 'bg-paper border-line',
  rowClassName: 'text-ink hover:bg-brand/10 hover:text-brand',
  rowExpandedClassName: 'bg-brand/10 text-brand',
  allClassName: 'text-ink hover:bg-brand/10 hover:text-brand',
  childClassName: 'text-ink-soft hover:bg-brand/10 hover:text-brand',
  guideClassName: 'border-line',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  /*
   * Widened to `string` deliberately.
   *
   * COPY is `as const`, so this would otherwise carry the LITERAL type of
   * whatever address is written in copy.ts — and TypeScript then rejects
   * `!== ''` as a comparison that can never be true. The check is not
   * pointless: a freshly cloned site ships with this blank, and the footer has
   * to omit the whole <address> element rather than print an empty one.
   */
  const postalAddress: string = COPY.footer.postalAddress

  let socialLinks: SocialLink[] = []
  try {
    socialLinks = (await getSocialLinks()).data
  } catch {
    socialLinks = []
  }

  // "Special Offers" only earns its slot in the nav when this site actually has
  // a visible offer to show; with none, the link would lead to an empty page,
  // so both the header and the footer drop it.
  const showSpecialOffers = await hasSpecialOffers()
  const navLinks = NAV_LINKS.filter(({ href }) => href !== '/special-offers' || showSpecialOffers)

  // Children for the Casinos and Bonuses entries, header and footer
  // alike. Each carries the icon its chip shows, resolved here on the server so
  // the client menus never need the storage URL. A failed fetch yields no
  // items, and the entry then stays the plain link it always was.
  const categoryMenuItems = await getCategories()
    .then((res) => res.data.map((c) => ({ slug: c.slug, name: c.name, icon: resolveImageUrl(c.logo_path) })))
    .catch(() => [])
  // Bonus types with at least one visible offer on this site (the API drops
  // empty ones). getBonusArea already falls back to [] on failure.
  const bonusMenuItems = (await getBonusArea()).map((section) => ({
    slug: section.slug,
    name: section.name,
    icon: resolveImageUrl(section.icon_path),
  }))

  // Site-wide structured data, rendered once here so every page carries it.
  // Next.js manages the document <head> (manual <head> tags in a root layout are
  // discouraged), so per the framework's JSON-LD guide the <script> is rendered
  // in the layout body — crawlers read JSON-LD from anywhere in the document.
  // The `<` escaping keeps the payload XSS-safe.
  //
  // Two nodes, cross-referenced by @id: the publisher (Organization) and the
  // site (WebSite). socialLinks is already fetched above for the footer, so
  // `sameAs` costs no extra request.
  const siteGraph = [buildOrganizationSchema(socialLinks), buildWebSiteSchema()]

  return (
    <html lang="en" className={`${manrope.variable} ${schibsted.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {/* Opens every page at its top — see the component. */}
        <ScrollToTopOnNavigate />
        <ToastProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(siteGraph),
          }}
        />
        {/* Header — the mockup's `header.top`: translucent black over the
            page, blurred, with a hairline underneath. */}
        <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-3">
            <Logo />
            <nav aria-label="Main navigation" className="hidden md:block">
              <ul className="flex items-center gap-0.5" role="list">
                {navLinks.map(({ href, label }) =>
                  href === '/casinos' && categoryMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : (
                    <li key={href}>
                      <Link href={href} className={NAV_LINK}>
                        {label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
            {/* Below md the strip above is hidden and this menu replaces it. */}
            <MobileNav
              links={navLinks}
              groups={{
                '/casinos': { allLabel: COPY.nav.allCasinos, items: categoryMenuItems, itemBasePath: '/categories' },
                '/special-offers': { allLabel: COPY.nav.allOffers, items: bonusMenuItems, itemBasePath: '/bonuses' },
              }}
              theme={NAV_MOBILE}
            />
          </div>
        </header>

        {/* Newsletter strip — the mockup's `.news` band, rendered while
            SUBSCRIBE_ENABLED is true. */}
        {SUBSCRIBE_ENABLED && (
          <section className="border-b border-line bg-paper" aria-label="Newsletter">
            <div className="mx-auto max-w-[1200px] px-4 py-3.5">
              <NewsletterForm />
            </div>
          </section>
        )}

        <div className="flex-1">{children}</div>

        {/* Footer — the mockup's `footer.ft`: the lime 18+ band, the brand and
            its claim → spin → cash-out line beside Explore / Legal /
            Policies, and the legal bar. */}
        <footer className="mt-14 border-t border-line bg-night">
          {/* Not `aria-hidden`: the sentence beside it never says the age, so
              a screen reader needs the "18+" too. */}
          <div className="bg-brand text-brand-ink">
            <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-4 py-4">
              <span className="shrink-0 rounded bg-brand-ink px-2.5 py-1.5 font-mono font-semibold text-brand">18+</span>
              <p className="min-w-0 flex-[1_1_300px] text-sm font-medium">
                <b>Gamble responsibly.</b> {COPY.footer.disclaimer}
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[1200px] px-4 pb-6 pt-12">
            <div className="grid grid-cols-1 gap-8 min-[61.25rem]:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] min-[61.25rem]:gap-12">
              <div>
                {/* The Logo component itself, so the mark and wordmark here can
                    never drift from the header's. */}
                <Logo onDark />
                <p className="mt-4 max-w-[380px] text-sm text-night-ink">{COPY.footer.tagline}</p>
                <p className="mt-5 flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="sr-only">{COPY.footer.stepsLabel}: </span>
                  {COPY.footer.steps.map((step, i) => (
                    <span key={step} className="contents">
                      {i > 0 && <span aria-hidden className="text-brand">→</span>}
                      <span className="rounded border border-line-soft px-2.5 py-1 text-ink">{step}</span>
                    </span>
                  ))}
                </p>
                {socialLinks.length > 0 && (
                  <div className="mt-5">
                    <p className={`${FOOTER_HEAD} mb-2.5`}>{'// follow'}</p>
                    <SocialIcons links={socialLinks} onDark />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                <div>
                  <p className={FOOTER_HEAD}>{'// explore'}</p>
                  <ul className="mt-3 flex flex-col">
                    {navLinks.map(({ href, label }) =>
                      href === '/casinos' && categoryMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : (
                        <li key={href}>
                          <Link href={href} className={FOOTER_LINK}>{label}</Link>
                        </li>
                      ),
                    )}
                    {footerPages(FOOTER_EXPLORE).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
                <nav aria-label="Legal">
                  <p className={FOOTER_HEAD}>{'// legal'}</p>
                  <ul className="mt-3 flex flex-col">
                    {footerPages(FOOTER_LEGAL).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                    <li>
                      <CookieSettingsButton className={`${FOOTER_LINK} text-left`} />
                    </li>
                  </ul>
                </nav>
                <nav aria-label="Policies">
                  <p className={FOOTER_HEAD}>{'// policies'}</p>
                  <ul className="mt-3 flex flex-col">
                    {footerPages(FOOTER_POLICIES).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* The mockup's giant outlined wordmark sat here. Removed — it is
                decoration only, and `mt-11` is the gap it used to open above
                the legal bar. */}
            <div className="mt-11 flex flex-wrap justify-between gap-3 border-t border-line pt-[18px] font-mono text-xs text-night-muted">
              <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
              {/* Rendered only when an address exists: a freshly cloned site
                  ships with this blank, and an empty <address> is worse than
                  none. `not-italic` is load-bearing — Preflight does not reset
                  the tag's italic default. */}
              {postalAddress !== '' && <address className="not-italic">{postalAddress}</address>}
            </div>
          </div>
        </footer>

        <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
