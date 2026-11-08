import { getTranslations } from "next-intl/server";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { APP_STORE_URL, FAQ_IDS, SITE_NAME, SITE_URL, STRUCTURED_FEATURE_IDS } from "@/features/landing/content/landing";
import { LOCALE_META, localePath, type AppLocale } from "@/i18n/routing";

type StructuredDataProps = {
  locale: AppLocale;
};

/** Machine-readable facts are generated from the same localized messages as visible copy. */
export async function StructuredData({ locale }: StructuredDataProps) {
  const [metadata, faq, structured] = await Promise.all([
    getTranslations({ locale, namespace: "Metadata" }),
    getTranslations({ locale, namespace: "FAQ" }),
    getTranslations({ locale, namespace: "StructuredData" }),
  ]);
  const pageUrl = `${SITE_URL}${localePath(locale)}`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${pageUrl}#website`,
        url: pageUrl,
        name: SITE_NAME,
        description: metadata("description"),
        inLanguage: locale,
      },
      {
        "@type": "MobileApplication",
        "@id": `${pageUrl}#app`,
        name: "Mochi: period tracker",
        description: metadata("description"),
        applicationCategory: "HealthApplication",
        operatingSystem: "iOS 17 or later",
        image: `${SITE_URL}${LANDING_ASSETS.appIcon}`,
        url: APP_STORE_URL.startsWith("http") ? APP_STORE_URL : pageUrl,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: LOCALE_META[locale].currency,
          description: structured("offer"),
        },
        featureList: STRUCTURED_FEATURE_IDS.map((id) => structured(`features.${id}`)),
        inLanguage: locale,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage: locale,
        mainEntity: FAQ_IDS.map((id) => ({
          "@type": "Question",
          name: faq(`items.${id}.question`),
          acceptedAnswer: {
            "@type": "Answer",
            text: faq(`items.${id}.answer`),
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
