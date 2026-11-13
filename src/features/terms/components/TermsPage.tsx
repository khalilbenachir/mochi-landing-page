import Image from "next/image";
import * as SideMenu from "@/components/side-menu/SideMenu";
import { useLocale, useTranslations } from "next-intl";
import { Rays } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";
import { LegalContactBanner } from "@/features/legal/components/LegalContactBanner";
import { LegalSummaryCard } from "@/features/legal/components/LegalSummaryCard";
import { LegalSummaryHeading } from "@/features/legal/components/LegalSummaryHeading";
import { PRIVACY_CONTACT_EMAIL } from "@/features/privacy/content/contact-email";
import { localePath, localeRoutePath } from "@/i18n/routing";
import { TERMS_ASSETS, TERMS_HERO_SIZE, TERMS_SECTION_IDS, TERMS_SUMMARY_CARDS, TERMS_UPDATED_AT, appleSubscriptionsUrl } from "../content/terms";
import * as TermsContent from "./TermsContent";
import { TermsSummaryIcon } from "./TermsIcon";

export function TermsPage() {
  const locale = useLocale();
  const t = useTranslations("TermsOfUse");
  const home = localePath(locale);
  const privacyHref = localeRoutePath(locale, "privacy");
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(TERMS_UPDATED_AT));
  const sections = TERMS_SECTION_IDS.map((id) => ({ id, nav: t(`sections.${id}.nav`), title: t(`sections.${id}.title`), body: t(`sections.${id}.body`), detail: t(`sections.${id}.detail`) }));

  return (
    <main id="top" className="flex-1 bg-white text-ink-navy">
      <SiteHeader homeHref={home} sectionBase={home} localeRoute="/terms" />

      <section aria-labelledby="terms-title" className="overflow-hidden bg-terms-hero text-white">
        <PosterStage spacing="none" className="grid min-h-287 grid-cols-[56fr_44fr] items-center px-56 max-nav:grid-cols-1 max-nav:px-[24px] max-nav:pt-[28px]">
          <div className="relative z-1 py-24 max-nav:py-0">
            <div className="relative inline-flex -rotate-3 rounded-full bg-ink-navy px-25 py-4 text-u-18 font-ultra uppercase leading-[1.35] tracking-[0.04em] max-poster:text-[18px]">
              {t("eyebrow")}<Rays shape="privacy" className="absolute -right-44 -top-10 w-40 rotate-35 text-sun" />
            </div>
            <h1 id="terms-title" className="mt-12 wrap-anywhere text-u-51 font-max leading-[0.98] tracking-[-0.025em] max-poster:text-[clamp(42px,7.4vw,72px)] max-nav:mt-[18px] max-phone:text-[44px]">{t("title")}</h1>
            <p className="mt-10 max-w-500 whitespace-pre-line text-u-18 font-demibold leading-[1.14] max-poster:text-[23px] max-nav:mt-[16px] max-nav:text-[20px] max-phone:text-[18px]">{t("intro")}</p>
            <p className="mt-13 text-u-[13.6] font-semibold italic max-poster:text-[16px] max-nav:mt-[16px]">{t("updated", { date: updated })}</p>
          </div>
          <div className="relative -mr-8 flex self-end justify-center max-nav:mx-auto max-nav:mt-[18px] max-nav:w-[min(100%,360px)]">
            <Image src={TERMS_ASSETS.hero} width={TERMS_HERO_SIZE.width} height={TERMS_HERO_SIZE.height} alt={t("heroAlt")} priority sizes="(max-width: 760px) 360px, (max-width: 1440px) 38vw, 550px" className="relative -mb-4 h-278 w-full object-contain object-bottom max-nav:mb-[-3px] max-nav:h-auto" />
          </div>
        </PosterStage>
      </section>

      <section aria-labelledby="terms-summary" className="bg-terms-summary">
        <PosterStage spacing="none" className="px-32 pt-15 pb-23 max-nav:px-[20px] max-nav:py-[26px]">
          <div className="mx-auto max-w-840 max-poster:max-w-[680px]">
            <LegalSummaryHeading id="terms-summary" title={t("short")} decoration="single" />
            <div className="grid grid-cols-4 gap-14 max-poster:grid-cols-2 max-poster:gap-[16px] max-phone:gap-[12px]">
              {TERMS_SUMMARY_CARDS.map(({ key, section }) => (
                <LegalSummaryCard
                  key={key}
                  href={section ? `#${section}` : privacyHref}
                  prominence="featured"
                  icon={<TermsSummaryIcon id={key} className="size-52 max-nav:size-[46px]" />}
                  title={t(`cards.${key}.title`)}
                  description={t(`cards.${key}.body`)}
                />
              ))}
            </div>
          </div>
        </PosterStage>
      </section>

      <PosterStage spacing="none" className="px-31 pt-24 pb-28 max-nav:px-[20px] max-nav:py-[28px]">
        <TermsContent.Root>
          <SideMenu.Root items={sections.map(({ id, nav }) => ({ id, label: nav }))}>
            <SideMenu.Header title={t("onThisPage")}>
              <SideMenu.Progress />
            </SideMenu.Header>
            <SideMenu.Body>
              <SideMenu.List label={t("onThisPage")} />
            </SideMenu.Body>
          </SideMenu.Root>
          <TermsContent.Article>
            {sections.map(({ id, title, body, detail }) => (
              <TermsContent.Section key={id} id={id}>
                <TermsContent.Heading id={`${id}-title`}>{title}</TermsContent.Heading>
                <TermsContent.Text>{body}</TermsContent.Text>
                <TermsContent.Text detail>{detail}</TermsContent.Text>
                {id === "health" ? <TermsContent.Callout>{t("callout")}</TermsContent.Callout> : null}
                {id === "subscriptions" || id === "content" ? <TermsContent.Link href={id === "subscriptions" ? appleSubscriptionsUrl(locale) : privacyHref}>{id === "subscriptions" ? t("subscriptionsLink") : t("privacyLink")}</TermsContent.Link> : null}
                {id === "contact" ? <TermsContent.ContactLink href={`mailto:${PRIVACY_CONTACT_EMAIL}`}>{PRIVACY_CONTACT_EMAIL}</TermsContent.ContactLink> : null}
              </TermsContent.Section>
            ))}
          </TermsContent.Article>
        </TermsContent.Root>
      </PosterStage>

      <LegalContactBanner.Root headingId="terms-contact-title">
        <LegalContactBanner.Artwork src={TERMS_ASSETS.contact} />
        <LegalContactBanner.Content>
          <LegalContactBanner.Title id="terms-contact-title">{t("contactTitle")}</LegalContactBanner.Title>
          <LegalContactBanner.Description>{t("contactEmail", { email: PRIVACY_CONTACT_EMAIL })}</LegalContactBanner.Description>
        </LegalContactBanner.Content>
        <LegalContactBanner.Action href={`mailto:${PRIVACY_CONTACT_EMAIL}`}>{t("contactButton")}</LegalContactBanner.Action>
      </LegalContactBanner.Root>
    </main>
  );
}
