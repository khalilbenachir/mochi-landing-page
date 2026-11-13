import Image from "next/image";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { FLAVOR_CATALOG } from "@/features/landing/content/product-catalog";
import { FLAVOR_CARD_ASSETS } from "@/features/landing/content/assets";
import { FLAVOR_PILL_CLASS } from "@/features/landing/content/visual-variants";
import { cn } from "@/lib/utils";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";

const WEEK = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

/** A week of check-ins: six done, the seventh unlocks Ube, the 7-day streak reward. */
function StreakCard() {
  const t = useTranslations("Flavors");
  const days = useTranslations("Predictions.weekdays");

  return (
    <div className="relative mt-20 w-full max-w-300 rounded-u-22 bg-white px-16 pt-14 pb-16 text-ink-slate [box-shadow:0_6px_0_var(--color-flavors-card-shadow)] max-poster:mx-auto max-poster:mt-[24px] max-poster:max-w-[360px] max-poster:px-[18px] max-poster:py-[16px]">
      <div className="flex items-center justify-between gap-8">
        <b className="text-u-15 font-max tracking-[-0.01em] max-poster:text-[18px]">{t("items.ube.unlock")}</b>
        <span className="rounded-full bg-flavors-pill-starter px-8 py-3 text-u-[9.6] font-black leading-none max-poster:px-[9px] max-poster:py-[4px] max-poster:text-[11px]">7 / 7</span>
      </div>
      <ol className="mt-10 grid grid-cols-7 gap-4 max-poster:mt-[12px] max-poster:gap-[5px]">
        {WEEK.map((day, index) => (
          <li key={day} className="flex flex-col items-center gap-3 max-poster:gap-[4px]">
            <span className="text-u-[8.4] font-black uppercase text-ink-slate/60 max-poster:text-[10px]">{days(day).slice(0, 1)}</span>
            {index < 6 ? (
              <span className="grid size-26 place-items-center rounded-full bg-flavors-band text-white max-poster:size-[32px]">
                <Check className="size-[60%]" strokeWidth={3.4} aria-hidden="true" />
              </span>
            ) : (
              <Image src={FLAVOR_CARD_ASSETS.ube} alt="" width={380} height={262} className="h-auto w-32 -translate-y-2 animate-float max-poster:w-[38px]" />
            )}
          </li>
        ))}
      </ol>
      <p className="mt-10 rounded-u-12 bg-flavors-pill-streak px-10 py-6 text-center text-u-[10.6] font-max max-poster:mt-[12px] max-poster:py-[8px] max-poster:text-[13px]">{t("unlocked")}</p>
    </div>
  );
}

/** Section 4: the 12 collectible flavors and how each one unlocks. */
export function FlavorsSection() {
  const t = useTranslations("Flavors");

  return (
    <section id="flavors" className="relative overflow-hidden bg-flavors-band text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -left-[8%] -top-[30%] size-[min(55vw,640px)] rounded-full bg-flavors-sun/30 blur-3xl" />
      <PosterStage className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-36 px-47 max-poster:block max-poster:px-[clamp(16px,4vw,40px)]">
        <div className="relative z-2 max-poster:mx-auto max-poster:max-w-[640px] max-poster:text-center">
          <h2 className="text-balance text-u-31 font-max leading-[1.03] tracking-[-0.015em] max-poster:text-[clamp(36px,6.4vw,52px)] max-phone:text-[32px]">
            {t("title1")} {t("title2")} <span className="text-ink-deep">{t("title3")}</span>
          </h2>
          <p className="mt-10 max-w-260 text-u-15.5 font-bold leading-[1.3] max-poster:mx-auto max-poster:mt-[14px] max-poster:max-w-[420px] max-poster:text-[17px] max-phone:text-[15px]">{t("body")}</p>
          <StreakCard />
        </div>

        <div className="w-620 rounded-u-30 bg-flavors-card-bg p-16 [box-shadow:0_8px_0_var(--color-flavors-card-shadow)] max-poster:mx-auto max-poster:mt-[28px] max-poster:w-full max-poster:max-w-[760px] max-poster:p-[16px] max-phone:p-[12px]">
          <ul className="grid grid-cols-6 gap-x-6 gap-y-14 max-poster:grid-cols-4 max-poster:gap-x-[8px] max-poster:gap-y-[18px] max-tablet:grid-cols-3">
            {FLAVOR_CATALOG.map((flavor) => (
              <li key={flavor.id} className="group flex min-w-0 flex-col items-center text-center text-ink-slate">
                <div className="relative flex w-full justify-center pt-4">
                  <span aria-hidden="true" className="absolute bottom-0 h-10 w-56 rounded-[50%] bg-ink-slate/10 max-poster:h-[10px] max-poster:w-[62px]" />
                  <Image
                    className="relative h-auto w-64 [transition:translate_0.3s_var(--spring,ease),rotate_0.3s_var(--spring,ease)] group-hover:-translate-y-6 group-hover:-rotate-6 motion-reduce:group-hover:translate-none motion-reduce:group-hover:rotate-none max-poster:w-[72px]"
                    src={FLAVOR_CARD_ASSETS[flavor.id]}
                    alt={`${t(`items.${flavor.id}.name`)} Mochi`}
                    width={380}
                    height={262}
                    sizes="(max-width: 1099px) 22vw, 7vw"
                  />
                </div>
                <b className="mt-6 text-u-[12.4] font-max tracking-[-0.01em] whitespace-nowrap max-poster:mt-[8px] max-poster:text-[15px]">{t(`items.${flavor.id}.name`)}</b>
                <span
                  className={cn(
                    "mt-3 rounded-full px-7 py-2 text-u-[9] font-black leading-[1.12] max-poster:mt-[4px] max-poster:px-[8px] max-poster:py-[3px] max-poster:text-[11px]",
                    flavor.kind === "challenge" ? "max-w-80 whitespace-normal" : "whitespace-nowrap",
                    FLAVOR_PILL_CLASS[flavor.id],
                  )}
                >
                  {t(`items.${flavor.id}.unlock`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </PosterStage>
    </section>
  );
}
