import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckBadge } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { PRIVACY_ASSETS, PRIVACY_HERO_SIZE, PRIVACY_SUMMARY_ICONS } from "@/features/privacy/content/policy";

/** Each promise gets the matching Mochi icon from the privacy page. */
const PROMISES = [
  { id: "private", icon: PRIVACY_SUMMARY_ICONS.lock },
  { id: "offline", icon: PRIVACY_SUMMARY_ICONS.device },
  { id: "account", icon: PRIVACY_SUMMARY_ICONS.account },
] as const;

const STAYS = [["dates"], ["logs"], ["reminders1", "reminders2"]] as const;

/** Section 6: what stays on the phone, in the app's own privacy wording, with Mochi keeping it cozy. */
export function PrivacySection() {
  const t = useTranslations("Privacy");

  return (
    <section id="privacy" className="relative overflow-hidden bg-privacy-band text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] top-1/2 size-[min(60vw,760px)] -translate-y-1/2 rounded-full bg-privacy-hug-highlight/10 blur-3xl" />
      <PosterStage className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-56 px-60 max-poster:grid-cols-1 max-poster:gap-[34px] max-poster:px-[clamp(16px,4vw,40px)]">
        <div className="min-w-0 max-poster:mx-auto max-poster:max-w-[640px] max-poster:text-center">
          <h2 className="text-balance text-u-33.5 font-max leading-[0.98] tracking-[-0.015em] max-poster:text-[clamp(34px,6vw,50px)] max-phone:text-[32px]">
            {t("title1")} <span className="text-privacy-hug-highlight">{t("title2")}</span>
          </h2>
          <p className="mt-8 max-w-470 text-pretty text-u-[14.6] font-demibold leading-[1.25] text-privacy-body-text max-poster:mx-auto max-poster:mt-[14px] max-poster:max-w-[480px] max-poster:text-[17px] max-phone:text-[15px]">
            {t("body1")} {t("body2")}
          </p>

          <ul className="mt-22 grid grid-cols-3 gap-12 max-poster:mt-[26px] max-poster:gap-[12px] max-phone:grid-cols-1">
            {PROMISES.map(({ id, icon }) => (
              <li key={id} className="relative flex flex-col items-center rounded-u-22 border-2 border-white/10 bg-white/6 px-10 pt-12 pb-13 text-center max-poster:px-[12px] max-poster:py-[16px] max-phone:flex-row max-phone:gap-[14px] max-phone:text-left">
                <Image src={icon} alt="" width={256} height={256} className="size-64 flex-none -rotate-3 max-poster:size-[64px] max-phone:size-[56px]" />
                <div className="mt-4 flex flex-col items-center max-phone:mt-0 max-phone:items-start">
                  <b className="text-u-[13.6] font-max leading-[1.1] max-poster:text-[17px]">{t(`promises.${id}.title`)}</b>
                  <span className="mt-2 text-u-[10.6] font-demibold leading-[1.25] text-privacy-promise-detail-text max-poster:mt-[4px] max-poster:text-[13.5px]">
                    {t(`promises.${id}.line1`)} {t(`promises.${id}.line2`)}
                  </span>
                  <span className="mt-8 rounded-full bg-privacy-gold px-9 py-3 text-u-[9.6] font-max uppercase leading-none tracking-[0.06em] text-ink-deep max-poster:mt-[10px] max-poster:px-[10px] max-poster:py-[5px] max-poster:text-[11px]">
                    {t(`promises.${id}.badge1`)} {t(`promises.${id}.badge2`)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-300 pt-150 max-poster:w-full max-poster:max-w-[340px] max-poster:pt-[170px]">
          <Image
            src={PRIVACY_ASSETS.hero}
            width={PRIVACY_HERO_SIZE.width}
            height={PRIVACY_HERO_SIZE.height}
            alt={t("mascotAlt")}
            sizes="(max-width: 1100px) 220px, 22vw"
            className="absolute top-0 left-1/2 z-1 w-200 -translate-x-1/2 animate-float max-poster:w-[220px]"
          />
          <div className="relative z-2 rounded-u-26 bg-white px-20 pt-18 pb-20 text-ink-deep [box-shadow:0_8px_0_rgb(0_0_0/0.18)] max-poster:px-[22px] max-poster:py-[20px]">
            <h3 className="text-u-21.5 font-max tracking-[-0.01em] max-poster:text-[24px]">{t("staysTitle")}</h3>
            <ul className="mt-10 grid gap-8 max-poster:mt-[12px] max-poster:gap-[10px]">
              {STAYS.map((line) => (
                <li key={line[0]} className="flex items-start gap-9 rounded-u-14 bg-policy-pink px-10 py-8 text-u-[12.4] font-black leading-[1.25] max-poster:gap-[10px] max-poster:px-[12px] max-poster:py-[10px] max-poster:text-[15px]">
                  <CheckBadge className="mt-0.5 size-19 flex-none max-poster:size-[20px]" />
                  <span>{line.map((part) => t(`stays.${part}`)).join(" ")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PosterStage>
    </section>
  );
}
