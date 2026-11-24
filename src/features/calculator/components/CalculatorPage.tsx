import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";
import { APP_STORE_URL, SITE_NAME, SITE_URL } from "@/features/landing/content/landing";
import { localePath, type AppLocale } from "@/i18n/routing";
import { CALCULATOR_SLUG } from "../content/calculate";
import { calculatorPath } from "../metadata";
import { PeriodCalculator, type CalculatorCopy } from "./PeriodCalculator.client";

const FAQ_IDS = ["next", "ovulation", "accuracy", "irregular"] as const;
const HOW_IDS = ["first", "second", "third"] as const;

export async function CalculatorPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "PeriodCalculator" });
  const home = localePath(locale);
  const storeHref = APP_STORE_URL === "#get" ? `${home}#get` : APP_STORE_URL;
  const copy: CalculatorCopy = {
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
    },
    disclaimer: t("disclaimer"),
  };
  const faq = FAQ_IDS.map((id) => ({ id, question: t(`faq.${id}.question`), answer: t(`faq.${id}.answer`) }));
  const url = `${SITE_URL}${calculatorPath(locale)}`;
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
    ],
  };

  return (
    <main id="top" className="flex-1 bg-journal-canvas text-ink-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
      <SiteHeader homeHref={home} sectionBase={home} localeRoute={`/${CALCULATOR_SLUG}`} />
      <div className="mx-auto w-full max-w-[1100px] px-[48px] pt-[40px] pb-[64px] max-nav:px-[24px] max-phone:px-[20px]">
        <p className="inline-flex -rotate-2 rounded-full bg-sun px-[16px] py-[4px] text-[13px] font-ultra uppercase tracking-[0.12em] text-ink-black">{t("eyebrow")}</p>
        <h1 className="mt-[14px] text-pretty text-[48px] font-max leading-[1.02] tracking-[-0.03em] max-poster:text-[40px] max-phone:text-[34px]">{t("title")}</h1>
        <p className="mt-[12px] max-w-[720px] text-[19px] font-semibold leading-[1.35] max-phone:text-[17px]">{t("intro")}</p>

        <div className="mt-[32px]">
          <PeriodCalculator copy={copy} locale={locale} />
        </div>

        <section aria-labelledby="calculator-how" className="mt-[56px] max-w-[760px]">
          <h2 id="calculator-how" className="text-[30px] font-max leading-[1.1] max-phone:text-[26px]">{t("how.title")}</h2>
          {HOW_IDS.map((id) => (
            <p key={id} className="mt-[14px] text-[17px] font-semibold leading-[1.55]">
              {t(`how.${id}`)}
            </p>
          ))}
        </section>

        <section aria-labelledby="calculator-faq" className="mt-[48px] max-w-[760px]">
          <h2 id="calculator-faq" className="text-[30px] font-max leading-[1.1] max-phone:text-[26px]">{t("faq.title")}</h2>
          <div className="mt-[12px] divide-y-2 divide-blog-border">
            {faq.map(({ id, question, answer }, index) => (
              <details key={id} name="faq-calculator" open={index === 0} className="group py-[4px]">
                <summary className="flex cursor-pointer items-start justify-between gap-[18px] py-[11px] text-[18px] font-heavy leading-[1.25] [&::-webkit-details-marker]:hidden">
                  {question}
                  <span aria-hidden="true" className="text-[22px] leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-[12px] text-[16px] font-semibold leading-[1.5]">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <aside className="mt-[48px] rounded-[24px] bg-blog-lavender p-[28px] max-phone:p-[20px]">
          <h2 className="text-[26px] font-max leading-[1.1]">{t("cta.title")}</h2>
          <p className="mt-[8px] max-w-[640px] text-[17px] font-semibold leading-[1.45]">{t("cta.body")}</p>
          <a href={storeHref} className="mt-[16px] inline-flex rounded-full bg-ink-navy px-[22px] py-[12px] text-[16px] font-heavy text-white">
            {t("cta.button")}
          </a>
        </aside>
      </div>
    </main>
  );
}
