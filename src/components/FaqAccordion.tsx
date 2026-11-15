type Item = { readonly question: string; readonly answer: string }

/**
 * The home FAQ, from sites/fsozbet-redesign.html (`.faq`): a stack of
 * question boxes numbered Q.01, Q.02… in mono, each opening on a lime + that
 * turns into a −, the open question marked in pale lime (globals.css). The
 * first is open.
 *
 * Native `<details>`, no client state: every answer is in the server HTML,
 * open or closed — which the FAQPage schema built from the same array needs.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="faq mt-[26px] flex flex-col gap-2">
      {items.map((item, i) => (
        <details key={item.question} open={i === 0} className="rounded-lg border-[1.5px] border-line bg-paper open:border-line-soft">
          <summary className="grid min-h-16 cursor-pointer grid-cols-[40px_minmax(0,1fr)_20px] items-center gap-3 p-4 sm:grid-cols-[60px_minmax(0,1fr)_24px] sm:px-5 sm:py-[18px]">
            <span aria-hidden className="font-mono text-[13px] text-muted">Q.{String(i + 1).padStart(2, '0')}</span>
            <h3 className="font-display text-[17px] font-bold leading-[1.3] text-ink sm:text-[19px]">
              <span className="faq-q">{item.question}</span>
            </h3>
          </summary>
          <p className="max-w-[880px] px-4 pb-[18px] text-base leading-[1.75] text-ink-soft sm:pb-5 sm:pl-[92px] sm:pr-5">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
