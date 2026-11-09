import Image from "next/image";
import { Slash, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/features/landing/components/shared/Button";
import { Rays, Sparkle } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";
import { localePath } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { PRIVACY_CONTACT_EMAIL } from "../content/contact-email";
import { POLICY_SECTION_IDS, POLICY_UPDATED_AT, PRIVACY_ASSETS } from "../content/policy";
import { PolicyIcon } from "./PolicyIcon";
import { PrivacyContent } from "./PrivacyContent";

const SUMMARY_CARDS = [
  { id: "device", color: "text-brand-coral", key: "device" },
  { id: "collect", color: "text-policy-purple", key: "account" },
  { id: "analytics", color: "text-policy-purple", key: "analytics" },
  { id: "backup", color: "text-policy-blue", key: "backup" },
] as const;

export function PrivacyPage() {
  const locale = useLocale();
  const t = useTranslations("PrivacyPolicy");
  const home = localePath(locale);
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(POLICY_UPDATED_AT));
  const sections = POLICY_SECTION_IDS.map((id) => ({ id, nav: t(`sections.${id}.nav`), title: t(`sections.${id}.title`), body: t(`sections.${id}.body`), detail: t(`sections.${id}.detail`) }));

  return (
    <main id="top" className="flex-1 bg-white text-ink-navy">
      <div className="relative z-20 bg-hero-band text-white">
        <PosterStage spacing="none" className="max-poster:px-[clamp(20px,4vw,40px)]"><SiteHeader homeHref={home} sectionBase={home} localeRoute="/privacy" /></PosterStage>
      </div>

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
            <Sparkle className="absolute -left-4 top-30 z-1 w-42 text-sun max-nav:left-0 max-nav:top-[30px] max-nav:w-[32px]" />
            <Rays shape="privacy" className="absolute -right-5 top-40 z-1 w-48 rotate-45 text-sun max-nav:right-0 max-nav:top-[46px] max-nav:w-[40px]" />
            <Image src={PRIVACY_ASSETS.hero} width={1024} height={819} alt={t("heroAlt")} priority sizes="(max-width: 760px) 360px, (max-width: 1440px) 38vw, 550px" className="relative -mb-4 h-278 w-full object-contain object-bottom max-nav:mb-[-3px] max-nav:h-auto" />
          </div>
        </PosterStage>
      </section>

      <section aria-labelledby="privacy-summary" className="bg-policy-mint">
        <PosterStage spacing="none" className="px-32 pt-15 pb-23 max-nav:px-[20px] max-nav:py-[26px]">
          <h2 id="privacy-summary" className="mb-13 flex items-center gap-12 text-u-28 font-max leading-[0.98] tracking-[-0.015em] max-poster:text-[clamp(30px,5vw,40px)] max-nav:mb-[22px] max-nav:justify-center max-nav:gap-[8px] max-phone:text-[28px]">
            <Rays shape="burst" className="w-32 text-sun max-nav:w-[26px]" /><span>{t("short")}</span><Rays shape="burst" flip className="w-32 text-sun max-nav:w-[26px]" />
          </h2>
          <div className="grid grid-cols-4 gap-17 max-nav:grid-cols-2 max-nav:gap-[14px]">
            {SUMMARY_CARDS.map(({ id, color, key }) => (
              <a key={key} href={`#${id}`} className="flex min-h-180 flex-col items-center rounded-u-26 bg-white px-18 pt-12 pb-15 text-center [box-shadow:0_5px_10px_var(--color-policy-shadow)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-policy-purple max-nav:min-h-[184px] max-nav:px-[12px] max-nav:py-[18px]">
                <span className="relative mb-6 flex h-48 items-center justify-center max-nav:mb-[10px] max-nav:h-[40px]">
                  {key === "account" ? <UserRound className="size-44 text-policy-purple max-nav:size-[40px]" strokeWidth={2.3} aria-hidden="true" /> : <PolicyIcon id={id} className={cn("size-44 max-nav:size-[40px]", color)} />}
                  {key === "account" || key === "analytics" ? <Slash className="absolute size-50 text-brand-coral max-nav:size-[46px]" strokeWidth={2.6} aria-hidden="true" /> : null}
                  {key === "device" ? <Rays shape="privacy" className="absolute -right-18 -top-4 w-20 text-sun" /> : null}
                </span>
                <h3 className="w-full max-w-190 whitespace-pre-line wrap-anywhere text-u-18 font-max leading-[1.12] tracking-[-0.01em] max-poster:text-[18px]">{t(`cards.${key}.title`)}</h3>
                <p className="mt-7 w-full max-w-200 wrap-anywhere text-u-12 font-demibold leading-[1.27] max-poster:text-[15px] max-nav:mt-[10px] max-phone:text-[14px]">{t(`cards.${key}.body`)}</p>
              </a>
            ))}
          </div>
        </PosterStage>
      </section>

      <PosterStage spacing="none" className="px-31 pt-24 pb-28 max-nav:px-[20px] max-nav:py-[28px]">
        <PrivacyContent sections={sections} navLabel={t("onThisPage")} callout={t("callout")} email={PRIVACY_CONTACT_EMAIL} />
      </PosterStage>

      <section aria-labelledby="privacy-contact-title">
        <PosterStage spacing="none" className="px-20 pb-25 max-nav:px-[20px] max-nav:pb-[28px]">
          <div className="relative flex min-h-130 items-center gap-26 rounded-u-26 bg-policy-cream px-25 max-nav:flex-col max-nav:gap-[18px] max-nav:px-[22px] max-nav:pt-[24px] max-nav:pb-[28px]">
            <Image src={PRIVACY_ASSETS.contact} width={600} height={400} alt="" sizes="(max-width: 760px) 180px, 21vw" className="-mb-10 -ml-5 w-196 self-end max-nav:order-2 max-nav:mx-auto max-nav:mb-[-28px] max-nav:w-[180px] max-nav:self-center" />
            <div className="flex min-h-85 flex-1 flex-col justify-center border-l border-ink-navy/30 pl-26 max-nav:min-h-0 max-nav:border-0 max-nav:pl-0 max-nav:text-center">
              <h2 id="privacy-contact-title" className="text-u-29.5 font-max leading-[0.96] tracking-[-0.015em] max-poster:text-[34px] max-phone:text-[31px]">{t("contactTitle")}</h2>
              <p className="mt-8 wrap-anywhere text-center text-u-[13.6] font-demibold leading-[1.27] max-poster:text-[17px] max-nav:mt-[12px] max-phone:text-[15px]">{t("contactEmail", { email: PRIVACY_CONTACT_EMAIL ?? "[YOUR EMAIL]" })}</p>
            </div>
            <Button asChild variant="flat" className="h-49 bg-brand-coral px-28 text-u-17 font-ultra text-white hover:bg-mochi-pink-ink max-poster:text-[18px] max-nav:h-[48px] max-nav:px-[28px]">
              <a href={PRIVACY_CONTACT_EMAIL ? `mailto:${PRIVACY_CONTACT_EMAIL}` : "#contact"}>{t("contactButton")}</a>
            </Button>
          </div>
        </PosterStage>
      </section>
    </main>
  );
}
