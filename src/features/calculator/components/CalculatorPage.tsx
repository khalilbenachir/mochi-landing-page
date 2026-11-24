import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Heart, Rays, Sparkle } from "@/features/landing/components/shared/decor";
import { FaqAccordion } from "@/features/landing/components/sections/FaqAccordion";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";
import { LegalSummaryHeading } from "@/features/legal/components/LegalSummaryHeading";
import { SITE_NAME, SITE_URL } from "@/features/landing/content/landing";
import { localePath, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CALCULATOR_ART } from "../content/assets";
import { CALCULATORS, calculatorPath, type CalculatorKind } from "../metadata";
import { OvulationCalculator, type OvulationCopy } from "./OvulationCalculator.client";
import { PeriodCalculator, type CalculatorCopy } from "./PeriodCalculator.client";

/** Per-calculator differences; everything else on the page is shared. */
const PAGES = {
  period: { faq: ["next", "ovulation", "accuracy", "irregular"], hero: "bg-calculator-hero", sibling: "ovulation" },
  ovulation: { faq: ["calculate", "fertile", "signs", "irregular", "contraception"], hero: "bg-ovulation-hero", sibling: "period" },
} as const satisfies Record<CalculatorKind, { faq: readonly string[]; hero: string; sibling: CalculatorKind }>;
const HOW_IDS = ["first", "second", "third"] as const;
const CONFETTI = [
  "left-[4%] top-[14%] size-[38px] rotate-12",
  "left-[22%] bottom-[10%] size-[22px] -rotate-6",
  "left-[47%] top-[8%] size-[28px] rotate-[20deg]",
  "right-[30%] bottom-[18%] size-[46px] -rotate-12 max-nav:hidden",
  "right-[6%] top-[10%] size-[26px] rotate-6",
  "left-[38%] top-[62%] size-[16px] rotate-45 max-nav:hidden",
] as const;
const HOW_TONES = ["bg-blog-pink", "bg-blog-lavender", "bg-cycle-fertile-tint"] as const;

/** Same anatomy as the privacy and terms pages: coloured hero band, then white content bands. */
export async function CalculatorPage({ locale, kind = "period" }: { locale: AppLocale; kind?: CalculatorKind }) {
  const page = PAGES[kind];
  // Both namespaces share the page keys (title, intro, how, faq, cta…); the form copy differs.
  const t = (await getTranslations({ locale, namespace: CALCULATORS[kind].namespace })) as unknown as Translate;
  const sibling = (await getTranslations({ locale, namespace: CALCULATORS[page.sibling].namespace })) as unknown as Translate;
  const home = localePath(locale);
  const art = CALCULATOR_ART[kind];
  const picker = {
    placeholder: t("picker.placeholder"),
    previousMonth: t("picker.previousMonth"),
    nextMonth: t("picker.nextMonth"),
    today: t("picker.today"),
    change: t("picker.change"),
    decrease: t("picker.decrease"),
    increase: t("picker.increase"),
    days: t.raw("picker.days"),
  };
  const legend = { period: t("results.legend.period"), fertile: t("results.legend.fertile"), ovulation: t("results.legend.ovulation"), today: t("results.legend.today") };
  const calculator =
    kind === "period" ? (
      <PeriodCalculator copy={periodCopy(t, picker, legend)} locale={locale} />
    ) : (
      <OvulationCalculator copy={ovulationCopy(t, picker, legend)} locale={locale} />
    );
  const faq = page.faq.map((id) => ({ id, question: t(`faq.${id}.question`), answer: t(`faq.${id}.answer`) }));
  const url = `${SITE_URL}${calculatorPath(locale, kind)}`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#calculator`,
        name: t("title"),
        description: t("metadataDescription"),
        url,
        applicationCategory: "HealthApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0" },
        inLanguage: locale,
        publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: locale,
        mainEntity: faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}${home}` },
          { "@type": "ListItem", position: 2, name: t("title"), item: url },
        ],
      },
    ],
  };

  return (
    <main id="top" className="flex-1 bg-white text-ink-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
      <SiteHeader homeHref={home} sectionBase={home} localeRoute={`/${CALCULATORS[kind].slug}`} activePage={kind === "ovulation" ? "ovulation" : "calculator"} />

      <section aria-labelledby="calculator-title" className={cn("relative overflow-hidden text-white", page.hero)}>
        {/* Calendar-cell confetti: the page's one playful flourish, decorative only. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {CONFETTI.map((cell) => (
            <span key={cell} className={cn("absolute rounded-[10px] bg-white/12", cell)} />
          ))}
        </div>
        <PosterStage spacing="none" className="grid min-h-287 grid-cols-[56fr_44fr] items-center px-56 max-nav:grid-cols-1 max-nav:px-[24px] max-nav:pt-[28px]">
          <div className="relative z-1 py-24 max-nav:py-0">
            <div className="relative inline-flex -rotate-3 rounded-full bg-sun px-21 py-3 text-u-13 font-ultra uppercase leading-[1.35] tracking-[0.12em] text-ink-black max-poster:text-[13px]">
              {t("eyebrow")}
              <Rays shape="privacy" className="absolute -right-42 -top-8 w-40 rotate-35 text-sun" />
            </div>
            <h1 id="calculator-title" className="mt-9 wrap-anywhere text-u-41 font-max leading-[0.95] tracking-[-0.015em] max-poster:text-[clamp(42px,8.4vw,66px)] max-nav:mt-[16px] max-phone:text-[40px]">
              {t("title")}
            </h1>
            <p className="mt-10 max-w-500 text-u-[13.6] font-demibold leading-[1.27] max-poster:text-[17px] max-nav:mt-[14px] max-nav:text-[16px] max-phone:text-[15px]">{t("intro")}</p>
          </div>
          <div className="relative -mr-8 flex self-end justify-center max-nav:mx-auto max-nav:mt-[18px] max-nav:w-[min(100%,320px)] max-phone:w-[min(100%,250px)]">
            <Heart className="absolute left-10 top-30 z-2 w-22 -rotate-12 animate-drift text-mochi-pink max-poster:left-[2%] max-poster:top-[18%] max-poster:w-[22px]" />
            <Heart className="absolute right-6 top-70 z-2 w-14 rotate-12 animate-drift text-white [animation-delay:-2.5s] max-poster:right-[2%] max-poster:top-[34%] max-poster:w-[15px]" />
            <Sparkle className="absolute left-36 bottom-40 z-2 w-16 animate-drift text-sun [animation-delay:-4s] max-poster:left-[8%] max-poster:bottom-[22%] max-poster:w-[18px]" />
            <Image
              src={art.src}
              width={art.width}
              height={art.height}
              alt={t("heroAlt")}
              priority
              sizes="(max-width: 760px) 320px, (max-width: 1440px) 38vw, 520px"
              className="relative z-1 -mb-4 h-268 w-full object-contain object-bottom max-nav:mb-[-3px] max-nav:h-auto"
            />
          </div>
        </PosterStage>
      </section>

      <section aria-label={t("form.legend")} className="bg-white">
        <PosterStage spacing="none" className="px-56 pt-24 pb-24 max-nav:px-[20px] max-nav:pt-[32px] max-nav:pb-[40px]">
          {calculator}
        </PosterStage>
      </section>

      <section aria-labelledby="calculator-how">
        <PosterStage spacing="none" className="px-56 pt-8 pb-20 max-nav:px-[20px] max-nav:py-[24px]">
          <div>
            <LegalSummaryHeading id="calculator-how" title={t("how.title")} decoration="single" />
            <div className="grid grid-cols-3 gap-14 max-nav:grid-cols-1 max-nav:gap-[14px]">
              {HOW_IDS.map((id, index) => (
                <div key={id} className={cn("rounded-u-12 p-14 max-poster:rounded-[18px] max-poster:p-[20px]", HOW_TONES[index])}>
                  <span aria-hidden="true" className="grid size-24 place-items-center rounded-full bg-sun text-u-12 font-max text-ink-black max-poster:size-[34px] max-poster:text-[17px]">
                    {index + 1}
                  </span>
                  <p className="mt-8 text-u-[10.5] font-semibold leading-[1.5] max-poster:mt-[12px] max-poster:text-[15px]">{t(`how.${id}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </PosterStage>
      </section>

      <section aria-labelledby="calculator-sibling">
        <PosterStage spacing="none" className="px-56 pb-12 max-nav:px-[20px] max-nav:pb-[16px]">
          <Link
            href={calculatorPath(locale, page.sibling)}
            className="group flex items-center gap-14 rounded-u-12 border-2 border-blog-border p-12 transition-colors hover:border-ink-navy max-poster:gap-[16px] max-poster:rounded-[18px] max-poster:p-[18px]"
          >
            <Image src={CALCULATOR_ART[page.sibling].src} width={CALCULATOR_ART[page.sibling].width} height={CALCULATOR_ART[page.sibling].height} alt="" sizes="120px" className="h-auto w-60 flex-none max-poster:w-[84px]" />
            <span className="min-w-0 flex-1">
              <span className="block text-u-[9] font-heavy uppercase tracking-[0.1em] text-blog-muted max-poster:text-[12px]">{t("sibling")}</span>
              <span id="calculator-sibling" className="mt-2 block text-u-[13] font-max leading-[1.15] max-poster:text-[20px]">
                {sibling("title")}
              </span>
            </span>
            <span aria-hidden="true" className="grid size-24 flex-none place-items-center rounded-full bg-sun text-u-12 font-max text-ink-black transition-transform group-hover:translate-x-1 max-poster:size-[38px] max-poster:text-[18px]">
              →
            </span>
          </Link>
        </PosterStage>
      </section>

      <section aria-labelledby="calculator-faq">
        <PosterStage spacing="none" className="px-56 pt-8 pb-28 max-nav:px-[20px] max-nav:pt-[24px] max-nav:pb-[40px]">
          <div>
            <LegalSummaryHeading id="calculator-faq" title={t("faq.title")} decoration="single" />
            <FaqAccordion items={faq} />
          </div>
        </PosterStage>
      </section>
    </main>
  );
}

type Translate = ((key: string) => string) & { raw: (key: string) => string };
type Legend = CalculatorCopy["results"]["legend"];

function periodCopy(t: Translate, picker: CalculatorCopy["picker"], legend: Legend): CalculatorCopy {
  return {
    form: {
      legend: t("form.legend"),
      lastPeriod: t("form.lastPeriod"),
      cycleLength: t("form.cycleLength"),
      cycleHint: t("form.cycleHint"),
      periodLength: t("form.periodLength"),
      periodHint: t("form.periodHint"),
      submit: t("form.submit"),
      reset: t("form.reset"),
    },
    // ICU templates stay raw so the client formats them with its own dates and counts.
    results: {
      heading: t("results.heading"),
      empty: t("results.empty"),
      nextPeriod: t("results.nextPeriod"),
      upcoming: t("results.upcoming"),
      periodRange: t.raw("results.periodRange"),
      ovulation: t("results.ovulation"),
      fertile: t("results.fertile"),
      fertileRange: t.raw("results.fertileRange"),
      daysUntil: t.raw("results.daysUntil"),
      glance: t("results.glance"),
      legend,
    },
    picker,
    disclaimer: t("disclaimer"),
  };
}

function ovulationCopy(t: Translate, picker: CalculatorCopy["picker"], legend: Legend): OvulationCopy {
  return {
    form: {
      legend: t("form.legend"),
      lastPeriod: t("form.lastPeriod"),
      cycleLength: t("form.cycleLength"),
      cycleHint: t("form.cycleHint"),
      submit: t("form.submit"),
      reset: t("form.reset"),
    },
    results: {
      heading: t("results.heading"),
      empty: t("results.empty"),
      ovulation: t("results.ovulation"),
      cycleDay: t.raw("results.cycleDay"),
      daysUntil: t.raw("results.daysUntil"),
      fertile: t("results.fertile"),
      peak: t("results.peak"),
      range: t.raw("results.range"),
      nextPeriod: t("results.nextPeriod"),
      upcoming: t("results.upcoming"),
      glance: t("results.glance"),
      legend,
    },
    picker,
    disclaimer: t("disclaimer"),
  };
}
