import { COPY } from '@/constants/copy'

/**
 * "How we test a spin offer", from sites/fsozbet-redesign.html (`.stepper`):
 * three step tabs — number, verb, title — beside one lime panel holding the
 * picked step's title and what happens in it.
 *
 * CSS-only, like the Bonuses tabs: a radio per step, so all three panels are
 * in the server HTML and only the checked one is displayed (`.stepper` in
 * globals.css). From 980px the tabs stack beside the panel; below it they sit
 * three across above it, the title dropped so each still fits a 320px phone.
 */
export default function MethodStepper() {
  const steps = COPY.home.methodSteps
  return (
    <div className="stepper mt-7 grid grid-cols-1 gap-3 min-[61.25rem]:grid-cols-[300px_minmax(0,1fr)] min-[61.25rem]:gap-5">
      <fieldset className="min-w-0">
        <legend className="sr-only">Test steps</legend>
        <div className="grid grid-cols-3 gap-2 min-[61.25rem]:grid-cols-1">
          {steps.map((step, i) => (
            <span key={step.no} className="relative">
              <input type="radio" name="method-step" id={`step-${i}`} defaultChecked={i === 0} className="peer sr-only" />
              <label
                htmlFor={`step-${i}`}
                className="group flex h-full min-h-[72px] cursor-pointer flex-col justify-center gap-1 rounded-lg border-[1.5px] border-line bg-paper px-3 py-3 text-ink transition-colors hover:border-line-soft peer-checked:border-brand peer-checked:bg-surface peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand min-[61.25rem]:grid min-[61.25rem]:grid-cols-[52px_minmax(0,1fr)] min-[61.25rem]:items-center min-[61.25rem]:gap-3 min-[61.25rem]:px-3.5"
              >
                <b className="font-mono text-lg font-semibold text-muted min-[61.25rem]:text-[22px]">{step.no}</b>
                <span className="font-display text-base font-bold leading-tight min-[61.25rem]:text-lg">
                  {step.verb}
                  <small className="mt-0.5 hidden font-mono text-[11px] font-medium tracking-[0.06em] text-muted min-[61.25rem]:block">{step.title}</small>
                </span>
              </label>
            </span>
          ))}
        </div>
      </fieldset>
      {steps.map((step, i) => (
        <div key={step.no} data-step={i} className="flex min-h-[260px] flex-col justify-between gap-5 rounded-lg bg-brand p-[22px] text-brand-ink sm:p-8">
          <p className="font-mono text-xs tracking-[0.08em]">STEP {step.no} / {String(steps.length).padStart(2, '0')}</p>
          <h3 className="font-display text-[34px] font-black leading-none sm:text-[clamp(34px,4.4vw,56px)]">{step.title}</h3>
          <p className="max-w-[560px] text-lg leading-relaxed">{step.body}</p>
        </div>
      ))}
    </div>
  )
}
