import Image from "next/image";
import { useTranslations } from "next-intl";
import { FLAVOR_CATALOG } from "@/features/landing/content/product-catalog";
import { FLAVOR_CARD_ASSETS } from "@/features/landing/content/assets";
import { FLAVOR_PILL_CLASS } from "@/features/landing/content/visual-variants";
import { cn } from "@/lib/utils";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";

/** Where each flavor lands in the machine's glass dome: a soft pile, bottom row first. */
const PILE = [
  "left-[4%] top-[66%] -rotate-12", "left-[27%] top-[70%] rotate-6", "left-[50%] top-[68%] -rotate-3", "left-[73%] top-[64%] rotate-12",
  "left-[14%] top-[44%] rotate-8", "left-[38%] top-[47%] -rotate-6", "left-[62%] top-[43%] rotate-3",
  "left-[3%] top-[22%] -rotate-6", "left-[26%] top-[25%] rotate-12", "left-[51%] top-[21%] -rotate-12", "left-[74%] top-[26%] rotate-6",
] as const;

/** A candy capsule machine holding the collection; Ube pops out of the chute as today's reward. */
function MochiMachine() {
  const t = useTranslations("Flavors");
  const inDome = FLAVOR_CATALOG.filter((flavor) => flavor.id !== "ube");

  return (
    <div className="relative mx-auto w-330 max-poster:w-[min(100%,330px)]" aria-hidden="true">
      <div className="relative z-1 mx-auto h-30 w-150 rounded-t-[24px] bg-mochi-pink-ink max-poster:h-[30px] max-poster:w-[150px]" />
      <div className="relative aspect-[330/270] overflow-hidden rounded-t-[50%_44%] border-6 border-white bg-white/35 [box-shadow:inset_0_-12px_0_rgb(255_255_255/0.35)] max-poster:border-[6px]">
        <span className="absolute top-[10%] left-[12%] h-[34%] w-[9%] -rotate-12 rounded-full bg-white/70" />
        {inDome.map((flavor, index) => (
          <Image key={flavor.id} src={FLAVOR_CARD_ASSETS[flavor.id]} alt="" width={380} height={262} sizes="90px" className={cn("absolute h-auto w-[25%]", PILE[index])} />
        ))}
      </div>
      <div className="relative -mt-6 rounded-u-30 bg-brand-coral px-26 pt-20 pb-24 [box-shadow:0_8px_0_var(--color-flavors-card-shadow)] max-poster:-mt-[6px] max-poster:rounded-[30px] max-poster:px-[26px] max-poster:pt-[20px] max-poster:pb-[24px]">
        <div className="flex items-center justify-between">
          <span className="relative grid size-62 place-items-center rounded-full bg-white [box-shadow:0_4px_0_rgb(0_0_0/0.15)] max-poster:size-[62px]">
            <span className="h-10 w-46 rotate-[-30deg] rounded-full bg-mochi-pink-ink max-poster:h-[10px] max-poster:w-[46px]" />
          </span>
          <span className="relative grid h-74 w-120 place-items-end justify-center overflow-visible rounded-u-22 bg-ink-deep pb-6 max-poster:h-[74px] max-poster:w-[120px] max-poster:rounded-[22px] max-poster:pb-[6px]">
            <Image src={FLAVOR_CARD_ASSETS.ube} alt="" width={380} height={262} sizes="90px" className="h-auto w-84 -mb-2 animate-float max-poster:w-[84px]" />
          </span>
        </div>
      </div>
      <p className="absolute -right-20 bottom-110 z-2 rotate-6 rounded-full bg-white px-12 py-6 text-u-[11] font-max text-ink-deep [box-shadow:0_4px_0_var(--color-flavors-card-shadow)] max-poster:right-0 max-poster:bottom-[110px] max-poster:px-[12px] max-poster:py-[6px] max-poster:text-[13px]">
        {t("unlocked")}
      </p>
    </div>
  );
}

/** Section 4: the 12 collectible flavors and how each one unlocks. */
export function FlavorsSection() {
  const t = useTranslations("Flavors");

  return (
    <section id="flavors" className="relative overflow-hidden bg-flavors-band text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[6%] top-[10%] size-[min(55vw,640px)] rounded-full bg-flavors-sun/30 blur-3xl" />
      <PosterStage className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-56 px-56 max-poster:block max-poster:px-[clamp(16px,4vw,40px)]">
        <div className="relative z-2 min-w-0 max-poster:mx-auto max-poster:max-w-[640px] max-poster:text-center">
          <h2 className="text-balance text-u-31 font-max leading-[1.03] tracking-[-0.015em] max-poster:text-[clamp(36px,6.4vw,52px)] max-phone:text-[32px]">
            {t("title1")} {t("title2")} <span className="text-ink-deep">{t("title3")}</span>
          </h2>
          <p className="mt-10 max-w-380 text-u-15.5 font-bold leading-[1.3] max-poster:mx-auto max-poster:mt-[14px] max-poster:max-w-[420px] max-poster:text-[17px] max-phone:text-[15px]">{t("body")}</p>

          <ul className="mt-20 grid grid-cols-3 gap-8 max-poster:mt-[26px] max-poster:gap-[8px] max-tablet:grid-cols-2">
            {FLAVOR_CATALOG.map((flavor) => (
              <li key={flavor.id} className="group flex min-w-0 items-center gap-8 rounded-full bg-flavors-card-bg py-4 pr-10 pl-4 text-left text-ink-slate [box-shadow:0_3px_0_var(--color-flavors-card-shadow)] max-poster:gap-[8px] max-poster:py-[5px] max-poster:pr-[12px] max-poster:pl-[5px]">
                <span className="grid size-36 flex-none place-items-center rounded-full bg-white max-poster:size-[40px]">
                  <Image
                    src={FLAVOR_CARD_ASSETS[flavor.id]}
                    alt={`${t(`items.${flavor.id}.name`)} Mochi`}
                    width={380}
                    height={262}
                    sizes="48px"
                    className="h-auto w-[82%] [transition:translate_0.3s_var(--spring,ease),rotate_0.3s_var(--spring,ease)] group-hover:-translate-y-1 group-hover:-rotate-12 motion-reduce:group-hover:translate-none motion-reduce:group-hover:rotate-none"
                  />
                </span>
                <span className="flex min-w-0 flex-col">
                  <b className="truncate text-u-[11.4] font-max leading-[1.1] max-poster:text-[14px]">{t(`items.${flavor.id}.name`)}</b>
                  <span className={cn("mt-2 w-fit max-w-full rounded-full px-6 py-1 text-u-[8.4] font-black leading-[1.2] max-poster:mt-[2px] max-poster:px-[6px] max-poster:py-[1px] max-poster:text-[10.5px]", flavor.kind === "challenge" ? "whitespace-normal" : "whitespace-nowrap", FLAVOR_PILL_CLASS[flavor.id])}>
                    {t(`items.${flavor.id}.unlock`)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-poster:mt-[36px]">
          <MochiMachine />
        </div>
      </PosterStage>
    </section>
  );
}
