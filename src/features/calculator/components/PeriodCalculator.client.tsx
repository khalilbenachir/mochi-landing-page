"use client";

import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { createTranslator } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { CYCLE_LENGTH, daysBetween, estimateCycles, PERIOD_LENGTH, type CycleEstimate } from "../content/calculate";

export type CalculatorCopy = {
  form: { legend: string; lastPeriod: string; cycleLength: string; cycleHint: string; periodLength: string; periodHint: string; submit: string; reset: string };
  results: { heading: string; empty: string; nextPeriod: string; upcoming: string; periodRange: string; ovulation: string; fertile: string; fertileRange: string; daysUntil: string };
  disclaimer: string;
};

const FIELD = "mt-[6px] w-full rounded-[12px] border-2 border-blog-border bg-white px-[14px] py-[10px] text-[17px] font-bold text-ink-navy outline-none focus-visible:border-blog-purple";

/** Today as a UTC calendar day in the visitor's own time zone. */
function localToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
}

/** Runs entirely in the browser: nothing typed here is stored or sent anywhere. */
export function PeriodCalculator({ copy, locale }: { copy: CalculatorCopy; locale: AppLocale }) {
  const id = useId();
  // The page is prerendered, so "today" must come from the visitor's browser, never the build.
  const [today, setToday] = useState<string | undefined>();
  useEffect(() => setToday(localToday()), []);
  const [lastStart, setLastStart] = useState("");
  const [cycle, setCycle] = useState<number>(CYCLE_LENGTH.fallback);
  const [period, setPeriod] = useState<number>(PERIOD_LENGTH.fallback);
  const [estimate, setEstimate] = useState<CycleEstimate | undefined>();

  const t = useMemo(() => createTranslator({ locale, messages: { Results: copy.results }, namespace: "Results" }), [copy.results, locale]);
  const day = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }), [locale]);
  const show = (value: string) => day.format(new Date(`${value}T00:00:00Z`));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = localToday();
    setToday(now);
    setEstimate(estimateCycles(lastStart, cycle, period, now));
  }

  function reset() {
    setLastStart("");
    setCycle(CYCLE_LENGTH.fallback);
    setPeriod(PERIOD_LENGTH.fallback);
    setEstimate(undefined);
  }

  const [next, ...upcoming] = estimate?.periods ?? [];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-[28px] max-nav:grid-cols-1">
      <form onSubmit={submit} className="rounded-[24px] bg-white p-[28px] max-phone:p-[20px]">
        <fieldset className="grid gap-[18px]">
          <legend className="mb-[6px] text-[22px] font-max leading-[1.1]">{copy.form.legend}</legend>
          <label className="text-[15px] font-heavy" htmlFor={`${id}-start`}>
            {copy.form.lastPeriod}
            <input id={`${id}-start`} type="date" required max={today} value={lastStart} onChange={(event) => setLastStart(event.target.value)} className={FIELD} />
          </label>
          <label className="text-[15px] font-heavy" htmlFor={`${id}-cycle`}>
            {copy.form.cycleLength}
            <input id={`${id}-cycle`} type="number" inputMode="numeric" required min={CYCLE_LENGTH.min} max={CYCLE_LENGTH.max} value={cycle} onChange={(event) => setCycle(event.target.valueAsNumber)} aria-describedby={`${id}-cycle-hint`} className={FIELD} />
            <span id={`${id}-cycle-hint`} className="mt-[6px] block text-[13px] font-semibold text-blog-muted">{copy.form.cycleHint}</span>
          </label>
          <label className="text-[15px] font-heavy" htmlFor={`${id}-period`}>
            {copy.form.periodLength}
            <input id={`${id}-period`} type="number" inputMode="numeric" required min={PERIOD_LENGTH.min} max={PERIOD_LENGTH.max} value={period} onChange={(event) => setPeriod(event.target.valueAsNumber)} aria-describedby={`${id}-period-hint`} className={FIELD} />
            <span id={`${id}-period-hint`} className="mt-[6px] block text-[13px] font-semibold text-blog-muted">{copy.form.periodHint}</span>
          </label>
          <div className="flex flex-wrap gap-[12px]">
            <button type="submit" className="cursor-pointer rounded-full bg-blog-purple px-[22px] py-[12px] text-[16px] font-heavy text-white">
              {copy.form.submit}
            </button>
            <button type="button" onClick={reset} className="cursor-pointer rounded-full px-[18px] py-[12px] text-[15px] font-heavy text-ink-navy underline-offset-4 hover:underline">
              {copy.form.reset}
            </button>
          </div>
        </fieldset>
      </form>

      <section aria-labelledby={`${id}-results`} aria-live="polite" className="rounded-[24px] bg-blog-pink p-[28px] max-phone:p-[20px]">
        <h2 id={`${id}-results`} className="text-[22px] font-max leading-[1.1]">{copy.results.heading}</h2>
        {estimate && next ? (
          <div className="mt-[16px] grid gap-[14px]">
            <div className="rounded-[18px] bg-white p-[18px]">
              <p className="text-[14px] font-heavy uppercase tracking-[0.08em] text-cycle-period-ink">{copy.results.nextPeriod}</p>
              <p className="mt-[4px] text-[24px] font-max leading-[1.15]">{t("periodRange", { start: show(next.start), end: show(next.end) })}</p>
              <p className="mt-[2px] text-[15px] font-bold">{today ? t("daysUntil", { days: daysBetween(today, next.start) }) : null}</p>
            </div>
            <div className="grid grid-cols-2 gap-[14px] max-phone:grid-cols-1">
              <div className="rounded-[18px] bg-cycle-ovulation-tint p-[16px]">
                <p className="text-[14px] font-heavy">{copy.results.ovulation}</p>
                <p className="mt-[4px] text-[18px] font-max">{show(estimate.ovulation)}</p>
              </div>
              <div className="rounded-[18px] bg-cycle-fertile-tint p-[16px]">
                <p className="text-[14px] font-heavy text-cycle-fertile-ink">{copy.results.fertile}</p>
                <p className="mt-[4px] text-[18px] font-max">{t("fertileRange", { start: show(estimate.fertile.start), end: show(estimate.fertile.end) })}</p>
              </div>
            </div>
            <div>
              <p className="text-[15px] font-heavy">{copy.results.upcoming}</p>
              <ul className="mt-[6px] grid gap-[4px] text-[16px] font-bold">
                {upcoming.map((range) => (
                  <li key={range.start}>{t("periodRange", { start: show(range.start), end: show(range.end) })}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-[12px] text-[16px] font-semibold">{copy.results.empty}</p>
        )}
        <p className="mt-[18px] text-[13px] font-semibold leading-[1.4] text-ink-navy/80">{copy.disclaimer}</p>
      </section>
    </div>
  );
}
