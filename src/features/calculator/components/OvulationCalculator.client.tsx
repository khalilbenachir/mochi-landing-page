"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { createTranslator } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { CYCLE_LENGTH, daysBetween, estimateOvulation, LUTEAL_DAYS, type OvulationCycle } from "../content/calculate";
import { asDate, CycleGlance, DatePicker, localToday, Stepper, type CalculatorCopy, type Translator } from "./PeriodCalculator.client";

export type OvulationCopy = {
  form: { legend: string; lastPeriod: string; cycleLength: string; cycleHint: string; submit: string; reset: string };
  picker: CalculatorCopy["picker"];
  results: {
    heading: string;
    empty: string;
    ovulation: string;
    cycleDay: string;
    daysUntil: string;
    fertile: string;
    peak: string;
    range: string;
    nextPeriod: string;
    upcoming: string;
    glance: string;
    legend: CalculatorCopy["results"]["legend"];
  };
  disclaimer: string;
};

/** Runs entirely in the browser: nothing chosen here is stored or sent anywhere. */
export function OvulationCalculator({ copy, locale }: { copy: OvulationCopy; locale: AppLocale }) {
  const id = useId();
  // The page is prerendered, so "today" must come from the visitor's browser, never the build.
  const [today, setToday] = useState<string | undefined>();
  useEffect(() => setToday(localToday()), []);
  const [lastStart, setLastStart] = useState("");
  const [cycle, setCycle] = useState<number>(CYCLE_LENGTH.fallback);
  const [cycles, setCycles] = useState<OvulationCycle[] | undefined>();
  const results = useRef<HTMLElement>(null);

  const t = useMemo(() => createTranslator({ locale, messages: { Copy: { results: copy.results, picker: copy.picker } }, namespace: "Copy" }), [copy.results, copy.picker, locale]) as unknown as Translator;
  const day = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }), [locale]);
  const long = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }), [locale]);
  const short = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" }), [locale]);
  const show = (value: string) => day.format(asDate(value));
  const range = ({ start, end }: { start: string; end: string }) => t("results.range", { start: short.format(asDate(start)), end: short.format(asDate(end)) });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = localToday();
    setToday(now);
    setCycles(estimateOvulation(lastStart, cycle, now));
    if (window.matchMedia("(max-width: 760px)").matches) requestAnimationFrame(() => results.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function reset() {
    setLastStart("");
    setCycle(CYCLE_LENGTH.fallback);
    setCycles(undefined);
  }

  const [current, ...later] = cycles ?? [];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-[40px] max-nav:grid-cols-1 max-nav:gap-[28px]">
      <form onSubmit={submit}>
        <fieldset className="grid gap-[22px]">
          <legend className="mb-[4px] flex items-center gap-[10px] text-[24px] font-max leading-[1.1]">
            <span aria-hidden="true" className="grid size-[30px] place-items-center rounded-full bg-sun text-[15px] text-ink-black">1</span>
            {copy.form.legend}
          </legend>
          <DatePicker id={`${id}-start`} label={copy.form.lastPeriod} value={lastStart} onChange={setLastStart} today={today} locale={locale} copy={copy.picker} />
          <div className="max-w-[320px] max-phone:max-w-none">
            <Stepper id={`${id}-cycle`} label={copy.form.cycleLength} hint={copy.form.cycleHint} value={cycle} onChange={setCycle} bounds={CYCLE_LENGTH} t={t} copy={copy.picker} />
          </div>
          <div className="flex flex-wrap items-center gap-[12px]">
            <button type="submit" disabled={!lastStart} className="cursor-pointer rounded-full bg-cycle-ovulation px-[28px] py-[15px] text-[17px] font-heavy text-white transition-transform hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">
              {copy.form.submit}
            </button>
            <button type="button" onClick={reset} className="cursor-pointer rounded-full px-[14px] py-[12px] text-[15px] font-heavy text-ink-navy underline-offset-4 hover:underline">
              {copy.form.reset}
            </button>
          </div>
        </fieldset>
      </form>

      <section ref={results} aria-labelledby={`${id}-results`} aria-live="polite" className="flex scroll-mt-[90px] flex-col">
        <h2 id={`${id}-results`} className="flex items-center gap-[10px] text-[24px] font-max leading-[1.1]">
          <span aria-hidden="true" className="grid size-[30px] place-items-center rounded-full bg-sun text-[15px] text-ink-black">2</span>
          {copy.results.heading}
        </h2>
        {current && today ? (
          <div key={`${lastStart}-${cycle}`} className="mt-[16px] grid gap-[12px] *:animate-rise *:nth-2:[animation-delay:60ms] *:nth-3:[animation-delay:120ms] *:nth-4:[animation-delay:180ms]">
            <div className="rounded-[20px] bg-cycle-ovulation p-[20px] text-white">
              <p className="text-[13px] font-heavy uppercase tracking-[0.1em] text-white/85">{copy.results.ovulation}</p>
              <p className="mt-[4px] text-[26px] font-max leading-[1.12] first-letter:uppercase">{long.format(asDate(current.ovulation))}</p>
              <div className="mt-[8px] flex flex-wrap gap-[8px]">
                <span className="inline-flex rounded-full bg-white px-[12px] py-[3px] text-[14px] font-heavy text-cycle-ovulation">{t("results.daysUntil", { days: daysBetween(today, current.ovulation) })}</span>
                <span className="inline-flex rounded-full bg-white/15 px-[12px] py-[3px] text-[14px] font-heavy">{t("results.cycleDay", { day: cycle - LUTEAL_DAYS + 1 })}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[12px] max-phone:grid-cols-1">
              <div className="rounded-[20px] border-2 border-blog-border p-[16px]">
                <p className="flex items-center gap-[8px] text-[14px] font-heavy"><span aria-hidden="true" className="size-[10px] rounded-full bg-cycle-fertile" />{copy.results.fertile}</p>
                <p className="mt-[4px] text-[18px] font-max">{range(current.fertile)}</p>
              </div>
              <div className="rounded-[20px] border-2 border-blog-border p-[16px]">
                <p className="flex items-center gap-[8px] text-[14px] font-heavy"><span aria-hidden="true" className="size-[10px] rounded-full bg-cycle-ovulation" />{copy.results.peak}</p>
                <p className="mt-[4px] text-[18px] font-max">{range(current.peak)}</p>
              </div>
            </div>
            <CycleGlance
              estimate={{ periods: [{ start: current.nextPeriod, end: current.nextPeriod }], ovulation: current.ovulation, fertile: current.fertile }}
              today={today}
              locale={locale}
              copy={copy.results}
            />
            <div className="rounded-[20px] border-2 border-blog-border p-[16px]">
              <p className="text-[14px] font-heavy">{copy.results.upcoming}</p>
              <ul className="mt-[6px] grid gap-[6px] text-[16px] font-bold">
                {later.map((next) => (
                  <li key={next.ovulation} className="flex flex-wrap items-center gap-x-[10px]">
                    <span aria-hidden="true" className="size-[10px] flex-none rounded-full bg-cycle-ovulation" />
                    {show(next.ovulation)}
                    <span className="text-[14px] font-semibold text-blog-muted">{range(next.fertile)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-[10px] flex items-center gap-[8px] border-t-2 border-blog-border pt-[10px] text-[14px] font-heavy">
                <span aria-hidden="true" className="size-[10px] rounded-full bg-cycle-period" />
                {copy.results.nextPeriod}: {show(current.nextPeriod)}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-[16px] grid flex-1 content-center justify-items-center gap-[18px] rounded-[24px] border-2 border-dashed border-blog-border px-[20px] py-[36px] text-center">
            <div aria-hidden="true" className="grid grid-cols-7 gap-[6px]">
              {Array.from({ length: 21 }, (_, index) => (
                <span
                  key={index}
                  className={cn(
                    "size-[20px] rounded-[6px] max-phone:size-[16px]",
                    index === 13 ? "bg-cycle-ovulation" : index >= 8 && index <= 12 ? "bg-cycle-fertile-tint" : index === 0 ? "bg-cycle-period" : "bg-blog-border/70",
                  )}
                />
              ))}
            </div>
            <p className="max-w-[330px] text-[15px] font-semibold leading-[1.45]">{copy.results.empty}</p>
          </div>
        )}
        <p className="mt-[14px] text-[12.5px] font-semibold leading-[1.45] text-ink-navy/65">{copy.disclaimer}</p>
      </section>
    </div>
  );
}
