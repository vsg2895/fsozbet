import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_GRID } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusTabs from '@/components/BonusTabs'
import CategoryNav from '@/components/CategoryNav'
import FaqAccordion from '@/components/FaqAccordion'
import MethodStepper from '@/components/MethodStepper'
import { OfferTable } from '@/components/SpecialOfferCard'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { SITE_URL } from '@/lib/config'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses tab — three table rows. */
const HOME_BONUSES_PER_CATEGORY = 3

/** A section's mono label and heading — the mockup's `.lab` over `.sh2 h2`. */
const LABEL = 'font-mono text-xs font-semibold uppercase tracking-[0.08em] text-brand'
const H2 = 'font-display text-[32px] font-extrabold leading-none text-ink sm:text-[clamp(32px,4.4vw,56px)]'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (three rows of its table).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* Hero — the mockup's `.hero`: a mono chip, the claim with the
            highlighter over "checked", the lead and the two ways in. */}
        <section className="border-b border-line">
          <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-12 sm:pb-16 sm:pt-[72px]">
            <div className="max-w-[820px]">
              <p className="inline-block rounded border border-brand/40 px-2.5 py-1.5 font-mono text-xs uppercase tracking-[0.06em] text-brand">
                {COPY.home.heroEyebrow}
              </p>
              <h1 className="mt-[22px] font-display text-[clamp(38px,11vw,42px)] font-black leading-[0.98] text-balance text-ink sm:text-[clamp(42px,6.2vw,82px)]">
                {COPY.home.heroHeadline} <span className="hl">{COPY.home.heroHighlight}</span> {COPY.home.heroTail}
              </h1>
              <p className="mt-[22px] max-w-[520px] text-lg text-ink-soft">{COPY.home.heroSubtitle}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/casinos" className="btn-l min-h-12 px-[22px] text-[15px]">
                  {COPY.home.featuredCasinos}
                </Link>
                {anyOffersVisible && (
                  <Link href="/special-offers" className="btn-o min-h-12 px-[22px] text-[15px]">
                    {COPY.home.specialOffers}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* The ranking — category filters, then the casinos two across. */}
        <section className="py-14 sm:py-[72px]" aria-labelledby="top-casinos-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className={LABEL}>{COPY.home.rankingLabel}</p>
            <h2 id="top-casinos-heading" className={`mt-2.5 ${H2}`}>
              {COPY.home.topCasinosTitle}
            </h2>
            <p className="mt-3 max-w-[520px] text-ink-soft">{COPY.home.topCasinosSubtitle}</p>

            {categories.length > 0 && selected && (
              <div className="mt-6">
                <CategoryNav categories={categories} selected={selected} />
              </div>
            )}

            {casinos.length === 0 ? (
              <p className="mt-6 rounded-lg border border-dashed border-line bg-paper p-10 text-center text-muted">
                {COPY.casinos.noResults}
              </p>
            ) : (
              <ol className={`mt-[22px] ${CASINO_GRID}`}>
                {casinos.map((casino, i) => (
                  <CasinoCard key={casino.id} casino={casino} rank={i + 1} />
                ))}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-6">
                <Link href={`/categories/${selected}`} className="btn-o min-h-12 px-[22px] text-[15px]">
                  See more casinos<span className="sr-only"> — {casinosHeading(activeCategory.name)}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Bonus types as a terminal index. Renders nothing without a Bonus area. */}
        {bonusSections.length > 0 && (
          <section className="pb-14 sm:pb-[72px]">
            <div className="mx-auto max-w-[1200px] px-4">
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* How we test a spin offer — claim → spin → cash out as a stepper. */}
        <section className="pb-14 sm:pb-[72px]" aria-labelledby="method-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className={LABEL}>{COPY.home.methodLabel}</p>
            <h2 id="method-heading" className={`mt-2.5 ${H2}`}>
              {COPY.home.methodTitle}
            </h2>
            <p className="mt-3 max-w-[520px] text-ink-soft">{COPY.home.methodSubtitle}</p>
            <MethodStepper />
          </div>
        </section>

        {/* Bonuses — a tab per type over that type's offers table, built from
            the same getBonusArea payload as the index and the menus. A site
            without the Bonus area keeps the flat table below. */}
        {bonusSections.length > 0 ? (
          <section className="pb-14 sm:pb-[72px]" aria-labelledby="bonus-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className={LABEL}>{COPY.home.offersLabel}</p>
                  <h2 id="bonus-heading" className={`mt-2.5 ${H2}`}>
                    {COPY.home.bonus}
                  </h2>
                </div>
                <Link href="/special-offers" className="-my-3 inline-flex min-h-11 items-center py-3 font-bold text-brand transition-colors hover:text-brand-soft">
                  {COPY.home.viewAll}<span className="sr-only"> bonuses</span> <span aria-hidden className="ml-1">→</span>
                </Link>
              </div>
              <BonusTabs sections={bonusSections} />
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="pb-14 sm:pb-[72px]" aria-labelledby="offers-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className={LABEL}>{COPY.home.offersLabel}</p>
                  <h2 id="offers-heading" className={`mt-2.5 ${H2}`}>
                    {COPY.home.specialOffers}
                  </h2>
                </div>
                <Link href="/special-offers" className="-my-3 inline-flex min-h-11 items-center py-3 font-bold text-brand transition-colors hover:text-brand-soft">
                  {COPY.home.viewAll}<span className="sr-only"> special offers</span> <span aria-hidden className="ml-1">→</span>
                </Link>
              </div>
              <div className="mt-6">
                <OfferTable offers={topOffers} caption={COPY.home.specialOffers} />
              </div>
            </div>
          </section>
        )}

        {/* FAQ — numbered questions. Every answer is in the HTML, which the
            FAQPage schema above requires. */}
        <section aria-labelledby="faq-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className={LABEL}>{COPY.home.faqLabel}</p>
            <h2 id="faq-heading" className={`mt-2.5 ${H2}`}>
              {COPY.home.faqTitle}
            </h2>
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
    </>
  )
}
