import Image from "next/image";
import { useTranslations } from "next-intl";
import { FLAVOR_CATALOG } from "@/features/landing/content/product-catalog";
import { FLAVOR_CARD_ASSETS } from "@/features/landing/content/assets";
import { FLAVOR_PILL_CLASS } from "@/features/landing/content/visual-variants";
import { cn } from "@/lib/utils";
import { Rays } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";

/** Section 4: the 12 collectible flavors and how each one unlocks. */
export function FlavorsSection() {
  const t = useTranslations("Flavors");

  return (
    <section id="flavors" className="relative overflow-hidden bg-flavors-band text-white">
      <PosterStage className="grid items-start px-47 grid-cols-[calc(277*var(--spacing))_calc(663*var(--spacing))] max-poster:block max-poster:px-[clamp(16px,4vw,40px)]">
        <div className="relative z-2 pr-12 pt-2 max-poster:pr-0 max-poster:mx-auto max-poster:max-w-[640px] max-poster:pt-0 max-poster:text-center">
          <h2 className="text-balance text-white text-u-31 font-max leading-[1.03] tracking-[-0.015em] max-poster:text-[clamp(36px,6.4vw,52px)] max-phone:text-[32px]">
            <span className="block max-poster:inline">
              {t("title1")}
              {/* Zero-width anchor so the rays follow the last word of the line, whatever its length. */}
              <span className="relative inline-block h-[1em] w-0 align-top max-poster:hidden">
                <Rays shape="flavors" className="absolute left-[0.1em] top-[-0.42em] w-[1.1em] text-flavors-sun" />
              </span>
            </span>{" "}
            <span className="block max-poster:inline">{t("title2")}</span>{" "}
            <span className="block max-poster:inline">{t("title3")}</span>
          </h2>
          <p className="mt-11 w-215 text-u-15.5 font-bold leading-[1.3] max-poster:w-auto max-poster:max-w-[420px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">{t("body")}</p>
        </div>

        <ul className="grid w-663 grid-cols-6 auto-rows-fr gap-7 max-poster:[--spacing:calc(min(100vw-32px,760px)/445)] max-poster:w-full max-poster:max-w-[760px] max-poster:mt-[26px] max-poster:mb-0 max-poster:mx-auto max-poster:grid-cols-4 max-tablet:[--spacing:calc((100vw-32px)/330)] max-tablet:grid-cols-3">
          {FLAVOR_CATALOG.map((flavor) => (
            <li
              key={flavor.id}
              className="group flex min-w-0 flex-col items-center pt-6 pb-8 rounded-u-12 bg-flavors-card-bg text-ink-slate [box-shadow:0_calc(3*var(--spacing))_calc(6*var(--spacing))_var(--color-flavors-card-shadow)] text-center"
            >
              <Image
                className="h-auto w-62 mb-3 [transition:translate_0.3s_var(--spring,ease),rotate_0.3s_var(--spring,ease)] group-hover:-translate-y-3 group-hover:-rotate-4 motion-reduce:group-hover:translate-none motion-reduce:group-hover:rotate-none"
                src={FLAVOR_CARD_ASSETS[flavor.id]}
                alt={`${t(`items.${flavor.id}.name`)} Mochi`}
                width={380}
                height={262}
                sizes="(max-width: 1099px) 22vw, 7vw"
              />
              <b className="flex items-center gap-3 text-u-[12.4] font-max tracking-[-0.01em] whitespace-nowrap">{t(`items.${flavor.id}.name`)}</b>
              <span
                className={cn(
                  "whitespace-nowrap mt-4 py-2 px-8 rounded-u-8 text-u-[9.6] font-black leading-[1.12]",
                  flavor.kind === "challenge" && "max-w-78 whitespace-normal",
                  FLAVOR_PILL_CLASS[flavor.id],
                )}
              >
                {t(`items.${flavor.id}.unlock`)}
              </span>
            </li>
          ))}
        </ul>
      </PosterStage>
    </section>
  );
}
