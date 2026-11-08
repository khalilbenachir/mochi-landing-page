import { APP_STORE_URL, asset } from "@/content/mochi";
import { FAQS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/content/landing";

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": "MobileApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Mochi: period tracker",
      description: SITE_DESCRIPTION,
      applicationCategory: "HealthApplication",
      operatingSystem: "iOS 17 or later",
      image: `${SITE_URL}${asset.appIcon}`,
      url: APP_STORE_URL.startsWith("http") ? APP_STORE_URL : SITE_URL,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free to download. Optional Mochi Plus subscription available in the app.",
      },
      featureList: [
        "Period and ovulation predictions",
        "Pad change reminders in the Dynamic Island and on the Lock Screen",
        "Mood, symptom and flow logging",
        "Offline use without an account",
        "Optional account backup and sync",
        "Streaks and 12 collectible Mochi flavors",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

/** Machine-readable facts mirror visible page copy; JSON escaping prevents closing the script tag. */
export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}

