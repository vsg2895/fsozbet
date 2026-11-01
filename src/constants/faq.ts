/**
 * Frequently asked questions for this site.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data from
 * this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes. Here they
 * explain how a spin offer is valued, because that is what this brand is —
 * free spins rated after the terms, not on the headline number.
 *
 * Nothing below claims a figure this site cannot show. "Each casino carries the
 * date of its last reading" is a statement about method; a specific payout time
 * would be a measurement no reader could check and no column here holds.
 */
export const FAQ_ITEMS = [
  {
    question: 'What makes a spin offer worth claiming?',
    answer:
      'Its value after the terms are applied. 100 spins at 0.10 with 40x wagering and a 50 cap can be worth less than 20 spins at 0.50 with 10x and no cap.',
  },
  {
    question: 'What exactly do you check?',
    answer:
      'Spin value, eligible slots, wagering and what it applies to, max bet, cashout cap, expiry, and withdrawal verification — all from the operator’s own terms.',
  },
  {
    question: 'Why read the terms instead of the promo?',
    answer:
      'Because they often disagree, and the terms are what you’re held to. A max-bet rule hidden there is the most common way a bonus is voided.',
  },
  {
    question: 'What is a max-bet rule?',
    answer:
      'A cap on your stake per spin while bonus funds are active. Go over it once and many operators void the bonus and its winnings.',
  },
  {
    question: 'Does a casino pay to rank higher?',
    answer:
      'No. We may earn a commission from sign-ups, but it never changes the order. Offers with worse terms drop regardless.',
  },
  {
    question: 'Why do some casinos have no offer listed?',
    answer:
      'Nothing live is worth recommending. Expired offers come off the list rather than sitting there with an old date.',
  },
] as const
