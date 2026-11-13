import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Rays } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";
import { LegalContactBanner } from "@/features/legal/components/LegalContactBanner";
import { LegalSummaryCard } from "@/features/legal/components/LegalSummaryCard";
import { LegalSummaryHeading } from "@/features/legal/components/LegalSummaryHeading";
import { localePath } from "@/i18n/routing";
import { PRIVACY_CONTACT_EMAIL } from "../content/contact-email";
import { POLICY_SECTION_IDS, POLICY_UPDATED_AT, PRIVACY_ASSETS, PRIVACY_HERO_SIZE } from "../content/policy";
import { PrivacyContent } from "./PrivacyContent";
import { PrivacySummaryIcon } from "./PrivacySummaryIcon";

const SUMMARY_CARDS = [
  { id: "device", key: "device" },
  { id: "collect", key: "account" },
  { id: "analytics", key: "analytics" },
  { id: "backup", key: "backup" },
] as const;

export function PrivacyPage() {
  const locale = useLocale();
  const t = useTranslations("PrivacyPolicy");
  const home = localePath(locale);
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(POLICY_UPDATED_AT));
  const sections = POLICY_SECTION_IDS.map((id) => ({ id, nav: t(`sections.${id}.nav`), title: t(`sections.${id}.title`), body: t(`sections.${id}.body`), detail: t(`sections.${id}.detail`) }));

  return (
    <main id="top" className="flex-1 bg-white text-ink-navy">
      <SiteHeader homeHref={home} sectionBase={home} localeRoute="/privacy" />

      <section aria-labelledby="privacy-title" className="overflow-hidden bg-policy-hero text-white">
        <PosterStage spacing="none" className="grid min-h-287 grid-cols-[56fr_44fr] items-center px-56 max-nav:grid-cols-1 max-nav:px-[24px] max-nav:pt-[28px]">
          <div className="relative z-1 py-24 max-nav:py-0">
            <div className="relative inline-flex -rotate-3 rounded-full bg-sun px-21 py-3 text-u-13 font-ultra uppercase leading-[1.35] tracking-[0.12em] text-ink-black max-poster:text-[13px]">
              {t("eyebrow")}<Rays shape="privacy" className="absolute -right-42 -top-8 w-40 rotate-35 text-sun" />
            </div>
            <h1 id="privacy-title" className="mt-9 wrap-anywhere text-u-41 font-max leading-[0.95] tracking-[-0.015em] max-poster:text-[clamp(42px,8.4vw,66px)] max-nav:mt-[16px] max-phone:text-[40px]">{t("title")}</h1>
            <p className="mt-10 max-w-500 text-u-[13.6] font-demibold leading-[1.27] max-poster:text-[17px] max-nav:mt-[14px] max-nav:text-[16px] max-phone:text-[15px]">{t("intro")}</p>
            <p className="mt-10 text-u-[11.6] font-semibold italic max-poster:text-[14px] max-nav:mt-[16px]">{t("updated", { date: updated })}</p>
          </div>
          <div className="relative -mr-8 flex self-end justify-center max-nav:mx-auto max-nav:mt-[18px] max-nav:w-[min(100%,360px)]">
            <Image src={PRIVACY_ASSETS.hero} width={PRIVACY_HERO_SIZE.width} height={PRIVACY_HERO_SIZE.height} alt={t("heroAlt")} priority sizes="(max-width: 760px) 360px, (max-width: 1440px) 38vw, 550px" className="relative -mb-4 h-278 w-full object-contain object-bottom max-nav:mb-[-3px] max-nav:h-auto" />
          </div>
        </PosterStage>
      </section>

      <section aria-labelledby="privacy-summary" className="bg-policy-mint">
        <PosterStage spacing="none" className="px-32 pt-15 pb-23 max-nav:px-[20px] max-nav:py-[26px]">
          <div className="mx-auto max-w-840 max-poster:max-w-[680px]">
            <LegalSummaryHeading id="privacy-summary" title={t("short")} decoration="paired" />
            <div className="grid grid-cols-4 gap-14 max-poster:grid-cols-2 max-poster:gap-[16px] max-phone:gap-[12px]">
              {SUMMARY_CARDS.map(({ id, key }) => (
                <LegalSummaryCard
                  key={key}
                  href={`#${id}`}
                  prominence="featured"
                  icon={<PrivacySummaryIcon id={key} className="size-52 max-nav:size-[46px]" />}
                  title={t(`cards.${key}.title`)}
                  description={t(`cards.${key}.body`)}
                />
              ))}
            </div>
          </div>
        </PosterStage>
      </section>

      <PosterStage spacing="none" className="px-31 pt-24 pb-28 max-nav:px-[20px] max-nav:py-[28px]">
        <PrivacyContent sections={sections} navLabel={t("onThisPage")} callout={t("callout")} email={PRIVACY_CONTACT_EMAIL} />
      </PosterStage>

      <LegalContactBanner.Root headingId="privacy-contact-title">
        <LegalContactBanner.Artwork src={PRIVACY_ASSETS.contact} />
        <LegalContactBanner.Content>
          <LegalContactBanner.Title id="privacy-contact-title">{t("contactTitle")}</LegalContactBanner.Title>
          <LegalContactBanner.Description>{t("contactEmail", { email: PRIVACY_CONTACT_EMAIL })}</LegalContactBanner.Description>
        </LegalContactBanner.Content>
        <LegalContactBanner.Action href={`mailto:${PRIVACY_CONTACT_EMAIL}`}>{t("contactButton")}</LegalContactBanner.Action>
      </LegalContactBanner.Root>
    </main>
  );
}
