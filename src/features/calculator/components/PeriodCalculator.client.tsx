"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { createTranslator } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { addDays, CYCLE_LENGTH, daysBetween, estimateCycles, PERIOD_LENGTH, type CycleEstimate } from "../content/calculate";

export type CalculatorCopy = {
  form: { legend: string; lastPeriod: string; cycleLength: string; cycleHint: string; periodLength: string; periodHint: string; submit: string; reset: string };
  picker: { placeholder: string; previousMonth: string; nextMonth: string; today: string; change: string; decrease: string; increase: string; days: string };
  results: {
    heading: string;
    empty: string;
    nextPeriod: string;
    upcoming: string;
    periodRange: string;
    ovulation: string;
    fertile: string;
    fertileRange: string;
    daysUntil: string;
    glance: string;
    legend: { period: string; fertile: string; ovulation: string; today: string };
  };
  disclaimer: string;
};

type Translator = (key: string, values?: Record<string, string | number>) => string;

/** Today as a UTC calendar day in the visitor's own time zone. */
function localToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
}

const asDate = (day: string) => new Date(`${day}T00:00:00Z`);
/** Monday-first column (0–6) of a UTC day. */
const weekdayIndex = (day: string) => (asDate(day).getUTCDay() + 6) % 7;
const monthStart = (day: string) => `${day.slice(0, 7)}-01`;
function shiftMonth(month: string, by: number) {
  const date = asDate(month);
  date.setUTCMonth(date.getUTCMonth() + by);
  return date.toISOString().slice(0, 10);
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
      <rect x="3.5" y="5" width="17" height="15.5" rx="4" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
      <path d="M12 13.2c-.9-1-2.6-.5-2.6.9 0 1.3 1.6 2.3 2.6 3 1-.7 2.6-1.7 2.6-3 0-1.4-1.7-1.9-2.6-.9Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Chevron({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-[18px]", flip && "rotate-180")} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  );
}

/** A month grid in a popover: friendlier than the native field and identical in every browser. */
function DatePicker({ id, label, value, onChange, today, locale, copy }: { id: string; label: string; value: string; onChange: (day: string) => void; today: string | undefined; locale: AppLocale; copy: CalculatorCopy["picker"] }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => monthStart(value || today || "2026-01-01"));
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const go = (by: number) => {
    setDirection(by > 0 ? "next" : "prev");
    setMonth(shiftMonth(month, by));
  };
  const root = useRef<HTMLDivElement>(null);
  const long = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }), [locale]);
  const monthLabel = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }), [locale]);
  const weekday = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" }), [locale]);
  const fullDay = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "full", timeZone: "UTC" }), [locale]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function toggle() {
    if (!open) setMonth(monthStart(value || today || month));
    setOpen(!open);
  }

  function pick(day: string) {
    onChange(day);
    setOpen(false);
  }

  const lead = weekdayIndex(month);
  const length = daysBetween(month, shiftMonth(month, 1));
  const cells = [...Array.from({ length: lead }, () => undefined), ...Array.from({ length }, (_, index) => addDays(month, index))];
  const canGoNext = !today || shiftMonth(month, 1) <= today;

  return (
    <div ref={root} className="relative" onKeyDown={(event: KeyboardEvent) => event.key === "Escape" && setOpen(false)}>
      <span id={`${id}-label`} className="text-[15px] font-heavy">
        {label}
      </span>
      <button
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}`}
        onClick={toggle}
        className={cn(
          "mt-[8px] flex w-full cursor-pointer items-center gap-[14px] rounded-[18px] border-2 bg-white p-[10px] pr-[16px] text-left transition-colors",
          open ? "border-closing-band" : "border-blog-border hover:border-closing-band/60",
        )}
      >
        <span className="grid size-[46px] flex-none place-items-center rounded-[14px] bg-closing-band text-white">
          <CalendarIcon className="size-[26px]" />
        </span>
        <span className={cn("min-w-0 flex-1 text-[17px] font-heavy first-letter:uppercase", !value && "text-blog-muted")}>{value ? long.format(asDate(value)) : copy.placeholder}</span>
        <span className="text-[13px] font-heavy text-closing-band max-phone:hidden">{value ? copy.change : null}</span>
      </button>

      {open ? (
        <div role="dialog" aria-label={label} className="absolute top-[calc(100%+10px)] left-0 z-20 origin-top-left animate-pop-in w-[340px] max-w-[calc(100vw-48px)] rounded-[24px] border-2 border-blog-border bg-white p-[16px] [box-shadow:0_24px_48px_-20px_var(--color-blog-shadow)]">
          <div className="flex items-center justify-between">
            <button type="button" aria-label={copy.previousMonth} onClick={() => go(-1)} className="grid size-[36px] cursor-pointer place-items-center rounded-full bg-blog-pink text-cycle-period-ink">
              <Chevron />
            </button>
            <p aria-live="polite" className="text-[16px] font-max first-letter:uppercase">{monthLabel.format(asDate(month))}</p>
            <button type="button" aria-label={copy.nextMonth} disabled={!canGoNext} onClick={() => go(1)} className="grid size-[36px] cursor-pointer place-items-center rounded-full bg-blog-pink text-cycle-period-ink disabled:cursor-not-allowed disabled:opacity-35">
              <Chevron flip />
            </button>
          </div>
          <div key={month} className={cn("mt-[12px] grid grid-cols-7 gap-[4px] text-center", direction === "next" ? "animate-slide-next" : "animate-slide-prev")}>
            {Array.from({ length: 7 }, (_, index) => (
              <span key={index} aria-hidden="true" className="pb-[4px] text-[12px] font-heavy uppercase text-blog-muted">
                {weekday.format(asDate(addDays("2024-01-01", index)))}
              </span>
            ))}
            {cells.map((day, index) =>
              day ? (
                <button
                  key={day}
                  type="button"
                  disabled={Boolean(today && day > today)}
                  aria-pressed={day === value}
                  aria-label={fullDay.format(asDate(day))}
                  onClick={() => pick(day)}
                  className={cn(
                    "aspect-square cursor-pointer rounded-full text-[14px] font-heavy transition-[background-color,color,scale] duration-150 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30",
                    day === value ? "bg-closing-band text-white" : "hover:bg-blog-pink",
                    day === today && day !== value && "ring-2 ring-closing-band ring-inset",
                  )}
                >
                  {Number(day.slice(8))}
                </button>
              ) : (
                <span key={`blank-${index}`} />
              ),
            )}
          </div>
          {today ? (
            <button type="button" onClick={() => pick(today)} className="mt-[10px] w-full cursor-pointer rounded-full bg-blog-pink py-[8px] text-[14px] font-heavy text-cycle-period-ink">
              {copy.today}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** − value + with the unit spelled out; replaces the bare number field. */
function Stepper({ id, label, hint, value, onChange, bounds, t, copy }: { id: string; label: string; hint: string; value: number; onChange: (value: number) => void; bounds: { min: number; max: number }; t: Translator; copy: CalculatorCopy["picker"] }) {
  const step = (by: number) => onChange(Math.min(bounds.max, Math.max(bounds.min, value + by)));
  const round = "grid size-[40px] flex-none cursor-pointer place-items-center rounded-full bg-blog-pink text-[22px] font-max leading-none text-cycle-period-ink disabled:cursor-not-allowed disabled:opacity-35";
  return (
    <div>
      <p id={`${id}-label`} className="flex min-h-[44px] items-end text-[15px] font-heavy leading-[1.3] max-phone:min-h-0">
        {label}
      </p>
      <div role="group" aria-labelledby={`${id}-label`} aria-describedby={`${id}-hint`} className="mt-[8px] flex items-center justify-between gap-[8px] rounded-[18px] border-2 border-blog-border bg-white p-[8px]">
        <button type="button" aria-label={copy.decrease} disabled={value <= bounds.min} onClick={() => step(-1)} className={round}>
          −
        </button>
        <output id={id} aria-live="polite" className="text-center text-[18px] font-max">
          {t("picker.days", { count: value })}
        </output>
        <button type="button" aria-label={copy.increase} disabled={value >= bounds.max} onClick={() => step(1)} className={round}>
          +
        </button>
      </div>
      <p id={`${id}-hint`} className="mt-[6px] text-[13px] font-semibold leading-[1.4] text-blog-muted">
        {hint}
      </p>
    </div>
  );
}

type DayKind = "period" | "fertile" | "ovulation" | "plain";

/** Week rows from this week to the end of the next period, coloured like the app's cycle wheel. */
function CycleGlance({ estimate, today, locale, copy }: { estimate: CycleEstimate; today: string; locale: AppLocale; copy: CalculatorCopy["results"] }) {
  const next = estimate.periods[0]!;
  // Start at whichever comes first, this week or the fertile window, so every marked day shows.
  const from = estimate.fertile.start < today ? estimate.fertile.start : today;
  const start = addDays(from, -weekdayIndex(from));
  const end = addDays(next.end, 6 - weekdayIndex(next.end));
  const days = Array.from({ length: daysBetween(start, end) + 1 }, (_, index) => addDays(start, index));
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
  const full = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" });
  const kind = (day: string): DayKind =>
    day === estimate.ovulation ? "ovulation" : day >= next.start && day <= next.end ? "period" : day >= estimate.fertile.start && day <= estimate.fertile.end ? "fertile" : "plain";
  const label = { period: copy.legend.period, fertile: copy.legend.fertile, ovulation: copy.legend.ovulation, plain: "" };

  return (
    <div className="rounded-[20px] border-2 border-blog-border p-[16px]">
      <p className="text-[15px] font-heavy">{copy.glance}</p>
      <div className="mt-[10px] grid grid-cols-7 gap-[5px]">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index} aria-hidden="true" className="text-center text-[11px] font-heavy uppercase text-blog-muted">
            {weekday.format(asDate(addDays("2024-01-01", index)))}
          </span>
        ))}
        {days.map((day) => {
          const type = kind(day);
          const past = day < today;
          return (
            <span
              key={day}
              title={`${full.format(asDate(day))}${label[type] ? ` · ${label[type]}` : ""}`}
              className={cn(
                "grid h-[34px] place-items-center rounded-[10px] text-[12px] font-heavy max-phone:h-[30px]",
                type === "period" && "bg-cycle-period text-white",
                type === "fertile" && "bg-cycle-fertile-tint text-cycle-fertile-ink",
                type === "ovulation" && "bg-cycle-ovulation text-white",
                type === "plain" && "bg-policy-cream text-ink-navy/70",
                past && "opacity-40",
                day === today && "ring-2 ring-ink-navy ring-offset-1",
              )}
            >
              {Number(day.slice(8))}
            </span>
          );
        })}
      </div>
      <ul className="mt-[12px] flex flex-wrap gap-x-[14px] gap-y-[6px] text-[12.5px] font-heavy">
        <li className="flex items-center gap-[6px]"><span aria-hidden="true" className="size-[10px] rounded-[3px] bg-cycle-period" />{copy.legend.period}</li>
        <li className="flex items-center gap-[6px]"><span aria-hidden="true" className="size-[10px] rounded-[3px] bg-cycle-fertile-tint ring-1 ring-cycle-fertile-ink/30" />{copy.legend.fertile}</li>
        <li className="flex items-center gap-[6px]"><span aria-hidden="true" className="size-[10px] rounded-[3px] bg-cycle-ovulation" />{copy.legend.ovulation}</li>
        <li className="flex items-center gap-[6px]"><span aria-hidden="true" className="size-[10px] rounded-[3px] ring-2 ring-ink-navy" />{copy.legend.today}</li>
      </ul>
    </div>
  );
}

/** Runs entirely in the browser: nothing chosen here is stored or sent anywhere. */
export function PeriodCalculator({ copy, locale }: { copy: CalculatorCopy; locale: AppLocale }) {
  const id = useId();
  // The page is prerendered, so "today" must come from the visitor's browser, never the build.
  const [today, setToday] = useState<string | undefined>();
  useEffect(() => setToday(localToday()), []);
  const [lastStart, setLastStart] = useState("");
  const [cycle, setCycle] = useState<number>(CYCLE_LENGTH.fallback);
  const [period, setPeriod] = useState<number>(PERIOD_LENGTH.fallback);
  const [estimate, setEstimate] = useState<CycleEstimate | undefined>();
  const results = useRef<HTMLElement>(null);

  const t = useMemo(() => createTranslator({ locale, messages: { Copy: { results: copy.results, picker: copy.picker } }, namespace: "Copy" }), [copy.results, copy.picker, locale]) as unknown as Translator;
  const day = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }), [locale]);
  const show = (value: string) => day.format(asDate(value));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = localToday();
    setToday(now);
    setEstimate(estimateCycles(lastStart, cycle, period, now));
    if (window.matchMedia("(max-width: 760px)").matches) requestAnimationFrame(() => results.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function reset() {
    setLastStart("");
    setCycle(CYCLE_LENGTH.fallback);
    setPeriod(PERIOD_LENGTH.fallback);
    setEstimate(undefined);
  }

  const [next, ...upcoming] = estimate?.periods ?? [];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-[40px] max-nav:grid-cols-1 max-nav:gap-[28px]">
      <form onSubmit={submit}>
        <fieldset className="grid gap-[22px]">
          <legend className="mb-[4px] flex items-center gap-[10px] text-[24px] font-max leading-[1.1]">
            <span aria-hidden="true" className="grid size-[30px] place-items-center rounded-full bg-sun text-[15px] text-ink-black">1</span>
            {copy.form.legend}
          </legend>
          <DatePicker id={`${id}-start`} label={copy.form.lastPeriod} value={lastStart} onChange={setLastStart} today={today} locale={locale} copy={copy.picker} />
          <div className="grid grid-cols-2 gap-[16px] max-phone:grid-cols-1">
            <Stepper id={`${id}-cycle`} label={copy.form.cycleLength} hint={copy.form.cycleHint} value={cycle} onChange={setCycle} bounds={CYCLE_LENGTH} t={t} copy={copy.picker} />
            <Stepper id={`${id}-period`} label={copy.form.periodLength} hint={copy.form.periodHint} value={period} onChange={setPeriod} bounds={PERIOD_LENGTH} t={t} copy={copy.picker} />
          </div>
          <div className="flex flex-wrap items-center gap-[12px]">
            <button type="submit" disabled={!lastStart} className="cursor-pointer rounded-full bg-closing-band px-[28px] py-[15px] text-[17px] font-heavy text-white transition-transform hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">
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
        {estimate && next && today ? (
          <div key={`${lastStart}-${cycle}-${period}`} className="mt-[16px] grid gap-[12px] *:animate-rise *:nth-2:[animation-delay:60ms] *:nth-3:[animation-delay:120ms] *:nth-4:[animation-delay:180ms]">
            <div className="rounded-[20px] bg-closing-band p-[20px] text-white">
              <p className="text-[13px] font-heavy uppercase tracking-[0.1em] text-white/85">{copy.results.nextPeriod}</p>
              <p className="mt-[4px] text-[26px] font-max leading-[1.12]">{t("results.periodRange", { start: show(next.start), end: show(next.end) })}</p>
              <p className="mt-[8px] inline-flex rounded-full bg-white px-[12px] py-[3px] text-[14px] font-heavy text-closing-band">{t("results.daysUntil", { days: daysBetween(today, next.start) })}</p>
            </div>
            <div className="grid grid-cols-2 gap-[12px] max-phone:grid-cols-1">
              <div className="rounded-[20px] border-2 border-blog-border p-[16px]">
                <p className="flex items-center gap-[8px] text-[14px] font-heavy"><span aria-hidden="true" className="size-[10px] rounded-full bg-cycle-ovulation" />{copy.results.ovulation}</p>
                <p className="mt-[4px] text-[18px] font-max">{show(estimate.ovulation)}</p>
              </div>
              <div className="rounded-[20px] border-2 border-blog-border p-[16px]">
                <p className="flex items-center gap-[8px] text-[14px] font-heavy"><span aria-hidden="true" className="size-[10px] rounded-full bg-cycle-fertile" />{copy.results.fertile}</p>
                <p className="mt-[4px] text-[18px] font-max">{t("results.fertileRange", { start: show(estimate.fertile.start), end: show(estimate.fertile.end) })}</p>
              </div>
            </div>
            <CycleGlance estimate={estimate} today={today} locale={locale} copy={copy.results} />
            <div className="rounded-[20px] border-2 border-blog-border p-[16px]">
              <p className="text-[14px] font-heavy">{copy.results.upcoming}</p>
              <ul className="mt-[6px] grid gap-[6px] text-[16px] font-bold">
                {upcoming.map((range) => (
                  <li key={range.start} className="flex items-center gap-[10px]">
                    <span aria-hidden="true" className="size-[10px] flex-none rounded-full bg-cycle-period" />
                    {t("results.periodRange", { start: show(range.start), end: show(range.end) })}
                  </li>
                ))}
              </ul>
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
                    index >= 15 && index <= 18 ? "bg-cycle-period" : index >= 5 && index <= 9 ? "bg-cycle-fertile-tint" : index === 10 ? "bg-cycle-ovulation" : "bg-blog-border/70",
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
