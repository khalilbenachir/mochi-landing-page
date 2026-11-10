import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { LANDING_ASSETS } from "@/features/landing/content/assets";

export function AccountSection() {
  const t = useTranslations("Account");

  return (
    <section id="account" className="relative overflow-hidden bg-landing-account-band text-landing-account-text">
      <div className="relative mx-auto grid w-[min(100%,1200px)] items-center gap-[36px] [--section-space:clamp(112px,9.375vw,144px)] py-(--section-space) px-[clamp(20px,4vw,54px)] max-poster:[--section-space:112px] max-phone:[--section-space:88px] grid-cols-[1fr_0.7fr_0.55fr] max-nav:gap-[28px] max-nav:px-[20px] max-nav:pb-0 max-nav:text-center max-nav:grid-cols-1">
        <div>
          <p className="max-w-[620px] mb-[12px] text-[13px] font-ultra uppercase leading-[1.35] tracking-[0.12em] max-nav:mx-auto">{t("kicker")}</p>
          <h2 className="mb-[10px] text-[clamp(35px,4vw,50px)] font-ultra leading-[0.96] tracking-[-0.035em]">{t("title")}</h2>
          <p className="max-w-[620px] text-[17px] leading-[1.35] max-nav:mx-auto max-phone:text-[15px]">{t("body")}</p>
        </div>
        <div className="flex items-center gap-[13px] rounded-[20px] bg-white p-[18px] [box-shadow:0_12px_30px_var(--color-landing-account-card-shadow)] max-nav:mx-auto max-nav:w-[min(100%,440px)] max-nav:text-left">
          <ShieldCheck className="text-landing-account-icon" size={32} aria-hidden="true" />
          <span className="grid flex-1"><b className="text-[16px]">{t("backup")}</b><small className="text-landing-account-caption">{t("synced")}</small></span>
          <i className="grid size-[29px] place-items-center rounded-full bg-landing-account-badge-bg text-landing-account-badge-text not-italic">✓</i>
        </div>
        <Image className="h-auto w-[300px] self-center justify-self-center max-nav:mx-auto max-nav:mb-0 max-nav:mt-[12px] max-nav:w-[240px]" src={LANDING_ASSETS.accountMochi} alt={t("imageAlt")} width={435} height={348} />
      </div>
    </section>
  );
}
