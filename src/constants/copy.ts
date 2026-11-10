/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across every site in the network — same
 * groups, same keys, same order — so the apps stay interchangeable and a
 * component written for one works on all of them.
 *
 * The WORDS are deliberately unique to this site. That is not decoration: the
 * nine brands are separate domains serving the same catalogue, and if they
 * shipped the same titles, descriptions and headings, Google would treat them as
 * duplicate content and suppress all but one. Every string that reaches a
 * <title>, a meta description, an <h1>/<h2> or a JSON-LD field must therefore
 * read differently here than on the sibling sites.
 *
 * fsozbet's angle: free spins, valued after the terms. A big spin count means
 * little until the wagering, the max-bet rule and the cashout cap are applied,
 * so every string here talks about what an offer is worth once those are read.
 * Taken from the brief in sites/fsozbet.html.
 *
 * ── One line this file does not cross ───────────────────────────────────────
 * The mockup's casino page shows a "Payout speed" tile. Nothing records a timed
 * withdrawal per operator, so no wording here promises a figure of that kind;
 * the only score shown is `casino.rating`, which is real.
 */
export const COPY = {
  // SEO identity. These three reach the <title>, the meta description and the
  // keywords tag on EVERY page that does not set its own — which is most of
  // them — so they are the strings most likely to be read as duplicate content
  // if a sibling domain ships the same words.
  site: {
    titleTail: 'Free Spins, Fairly Rated',
    description:
      'rates casino free-spin offers on what they are worth after the wagering, the max-bet rule and the cashout cap — not on the headline spin count.',
    keywords: [
      'free spins casinos',
      'free spins wagering explained',
      'free spins no deposit terms',
      'max bet rule bonus',
      'free spins cashout cap',
    ],
  },
  nav: {
    casinos: 'Casinos',
    // The page lists every visible bonus, flat and ungrouped, so the menu says
    // what is behind it. winpalack keeps "Special Offers": its page is the
    // grouped bonus-area view and is a different thing.
    specialOffers: 'Bonuses',
    categories: 'Categories',
    // First row inside the header and footer dropdowns: the parent's own page.
    allCasinos: 'All Casinos',
    allOffers: 'All Offers',
  },
  home: {
    bonus: 'Bonuses',
    seeMore: 'See more',
    seeAllBonuses: 'See All Bonuses',
    /**
     * The VISIBLE heading over the bonus-type row.
     *
     * The row used to carry no heading at all — the chips were taken to
     * speak for themselves. They do not: arriving mid-page at a band of
     * unlabelled buttons between the hero and the casino list, there is
     * nothing saying what the set IS, and nothing a screen reader can
     * announce for the landmark beyond a generic label nobody wrote for
     * this page.
     *
     * Worded differently on every domain, like every other <h2> here:
     * eleven sites serve one catalogue, and a shared heading is
     * duplicate content.
     */
    bonusTypesTitle: 'Spins By Bonus Type',
    heroEyebrow: 'Lime-rated spin offers',
    // Split in two so the JSX keeps its emphasised highlight while the words
    // change. The highlight is the brand's own phrase.
    heroHeadline: 'Free spins,',
    heroHighlight: 'checked for real value',
    heroSubtitle:
      'A big headline number means little until you see the wagering, max-bet rule and cashout cap. We claim each offer, play it through, and rate what’s left.',
    topCasinosTitle: 'Top Spin Casinos',
    topCasinosSubtitle: 'Ranked by what their spin offers are really worth. Filter by category.',
    featuredCasinos: 'Browse rankings',
    specialOffers: 'See bonus offers',
    viewAll: 'View all',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'Free Spins Casinos, Checked For Real Value',
    faqTitle: 'Spin Offers, Explained',
    metaDescription:
      'Free-spin offers rated on their real value: wagering, max-bet rule and cashout cap read from the terms, not the promo banner.',
    // ── The "How we test a spin offer" band ───────────────────────────────
    // Three steps, numbered, because they ARE a sequence: each one happens
    // after the one before it. Numbering a set that is not ordered is
    // decoration; numbering this one is information.
    methodTitle: 'How we test a spin offer',
    methodSubtitle: 'Three steps, the same for every casino on the list.',
    methodSteps: [
      {
        kicker: '01 — Claim',
        title: 'Claim the spins',
        body:
          'A fresh account, opened the way any new player would, and the offer claimed exactly as advertised — including anything bundled into signup.',
      },
      {
        kicker: '02 — Spin',
        title: 'Play the wagering',
        body:
          'Spin value, eligible games, max-bet rule and the multiplier — all checked against the terms page, not the promo banner.',
      },
      {
        kicker: '03 — Cash out',
        title: 'Take the winnings out',
        body:
          'What the cap allows, what verification needs, and which payout methods really work. If you can’t withdraw, it’s worth nothing.',
      },
    ],
  },
  casinos: {
    pageTitle: 'Every Spin Casino We Rate',
    pageDescription:
      'The full list of casinos we rate on their spin offers: the bonus on offer, the terms behind it, and where it places in its category.',
    // H2 over the offers block on a casino page. The literal 'Special Offers'
    // was hardcoded in the component on all six sites — an identical H2 on
    // every review page in the network.
    offersHeading: 'Spin Offers At This Casino',
    // Tail of the summary-panel H2: `{casino.name} at a glance`.
    glanceHeadingTail: 'at a glance',
    reviewTitleTail: 'Spin Offer Review',
    reviewSignature: 'Spin value, wagering and cashout cap read from the terms.',
    reviewSummary: 'rated on what its spin offers are worth after the wagering, the max-bet rule and the cashout cap.',
    visitCasino: 'Play Now',
    readReview: 'Read Review',
    rating: 'Spin rating',
    noResults: 'No casinos match this filter yet. Try another category.',
  },
  /**
   * The page behind one bonus type (/bonuses/[slug]).
   *
   * `metaSuffix` is appended to the type's name when the admin wrote no
   * description, so the meta line is still specific to the page rather than
   * boilerplate shared by eight of them.
   */
  bonusCategory: {
    metaSuffix: 'every live offer of this kind, with the wagering and cashout cap that come with it.',
    countOne: 'bonus',
    countMany: 'bonuses',
  },

  specialOffers: {
    pageTitle: 'Spin Offers Worth Claiming',
    pageDescription:
      'Every live spin offer we list, with the wagering, the minimum deposit and the cashout cap stated wherever the operator states them.',
    // Appended to an offer's (shared) bonus text so the nine sites do not ship
    // an identical meta description for the same offer.
    offerMetaSuffix: 'Wagering, max bet and cashout cap read from the operator’s own terms.',
    claim: 'Claim Bonus',
    noResults: 'No spin offers are live right now.',
  },
  categories: {
    pageTitle: 'Casino Categories',
    pageDescription:
      'The same spin-value check behind every list — pick the category you came for.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the nine sites distinct there.
    categoryMetaSuffix: 'ranked by what their spin offers are worth once the terms are applied.',
    noResults: 'No casinos in this category yet.',
  },
  newsletter: {
    title: 'Fresh spin offers, every Friday.',
    subtitle: 'What’s new this week, what the terms really say, and which offers got quietly worse.',
    placeholder: 'Email address',
    button: 'Subscribe',
    // Shown while the address is being checked. The subscribe request waits on
    // a live address-validation call, so the button has to say so rather than
    // just dimming for a second or two.
    checking: 'Checking…',
    // The spam line is NOT optional wording. This is a double opt-in list: an
    // unconfirmed subscriber never receives anything again, and the verify mail
    // is the single most likely message to be filtered — new sender, one link,
    // no history. Telling people where to look is the difference between a
    // signup and a dead row.
    success:
      'Nearly there — check your inbox and confirm your address to finish. '
      + 'If nothing arrives, it may be sitting in spam or junk.',
    // Shown when the API reports email_sent=false — the site is still
    // collecting addresses but its sending is switched off in the admin.
    // Promising an inbox (and a spam folder to search) for mail that will
    // never arrive is worse than not collecting the address at all.
    successNoEmail:
      'You’re on the list. We are not sending confirmation emails from this site at the moment.',
    error: 'That did not send. Please try again.',
  },
  footer: {
    // Short brand blurb in the footer's first column. The mockup gives that
    // column 1.6fr of a four-track grid — roughly 360px — so this runs to two
    // or three lines there by design, unlike the two-column siblings where the
    // same string had to stay on one.
    tagline:
      'Independent ratings of casino spin offers — claimed, played and cashed out. We may earn a commission from links on this site; it never changes a placement.',
    // Registered postal address, shown under the copyright line, as supplied
    // by the operator. Keep it identical to the site's "Registered address"
    // setting in the admin, which feeds the legal pages and the Organization
    // JSON-LD, and to the postal address in this site's email templates.
    // The postcode's space is a NO-BREAK space ( ): on a phone the line
    // wrapped between "NG5" and "3JL", splitting one postcode over two lines.
    postalAddress: '48 Meadowfield Drive, Nottingham, NG5 3JL, United Kingdom',
    disclaimer:
      'Gambling is for adults 18+ and carries real financial risk. Set deposit limits, never chase losses, and only stake what you can afford to lose.',
  },
  errors: {
    notFound: 'No spins here — this page does not exist.',
    apiError: 'Could not load this content. Please try again in a moment.',
  },
  reviews: {
    heading: 'Player Spin Reports',
    empty: 'No reports yet — be the first to say how these spins played out.',
    formTitle: 'Add Your Report',
    formIntro: 'Your report appears on this page as soon as you post it.',
    nameLabel: 'Your name',
    emailLabel: 'Email (optional, never published)',
    ratingLabel: 'Rating',
    titleLabel: 'Headline (optional)',
    bodyLabel: 'Your report',
    bodyPlaceholder: 'How did the spins go — wagering, max bet, cashing out?',
    submit: 'Post Report',
    // Two outcomes, because the site can run pre- or post-moderation
    // (Sites -> Publish reviews immediately). The API reports which one
    // applied; promising the wrong one is a promise the page then breaks.
    success: 'Thanks — your report is now live. Scroll up to see it.',
    successPending: 'Thanks — your report has been submitted and will appear once approved.',
    error: 'That did not send. Please check the form and try again.',
    ratingSummary: (avg: number, total: number) =>
      `${avg.toFixed(1)} out of 5 from ${total} ${total === 1 ? 'report' : 'reports'}`,
  },
  // Labels on the phone-only hide / show toggle above each chip list.
  collapse: {
    casinoCategories: 'Casino categories',
    bonusTypes: 'Bonus types',
  },
} as const
