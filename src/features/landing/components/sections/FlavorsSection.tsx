import Image from "next/image";
import { useTranslations } from "next-intl";
import { FLAVOR_CATALOG } from "@/features/landing/content/product-catalog";
import { FLAVOR_CARD_ASSETS } from "@/features/landing/content/assets";
import { FLAVOR_PILL_CLASS } from "@/features/landing/content/visual-variants";
import { cn } from "@/lib/utils";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";

function Rays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 30" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M27 4 23 14" /><path d="M37 9 29 17" /><path d="M5 18 19 21" />
      </g>
    </svg>
  );
}

/** Section 4: the 12 collectible flavors and how each one unlocks. */
export function FlavorsSection() {
  const t = useTranslations("Flavors");

  return (
    <section id="flavors" className="relative overflow-hidden bg-flavors-band text-white">
      <PosterStage className="grid items-start px-[calc(47*var(--u))] [grid-template-columns:calc(277*var(--u))_calc(663*var(--u))] max-poster:block max-poster:px-[clamp(16px,4vw,40px)]">
        <div className="relative z-2 pr-[calc(12*var(--u))] pt-[calc(2*var(--u))] max-poster:pr-0 max-poster:mx-auto max-poster:max-w-[640px] max-poster:pt-0 max-poster:text-center">
          <h2 className="text-balance m-0 text-white text-[calc(31*var(--u))] font-[1000] leading-[1.03] tracking-[-0.015em] max-poster:text-[clamp(36px,6.4vw,52px)] max-phone:text-[32px]">
            <span className="block max-poster:inline">
              {t("title1")}
              {/* Zero-width anchor so the rays follow the last word of the line, whatever its length. */}
              <span className="relative inline-block h-[1em] w-0 align-top max-poster:hidden">
                <Rays className="absolute left-[0.1em] top-[-0.42em] w-[1.1em] text-flavors-sun" />
              </span>
            </span>{" "}
            <span className="block max-poster:inline">{t("title2")}</span>{" "}
            <span className="block max-poster:inline">{t("title3")}</span>
          </h2>
          <p className="mt-[calc(11*var(--u))] mb-0 mx-0 w-[calc(215*var(--u))] text-[calc(15.5*var(--u))] font-[700] leading-[1.3] max-poster:w-auto max-poster:max-w-[420px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">{t("body")}</p>
        </div>

        <ul className="grid w-[calc(663*var(--u))] [grid-template-columns:repeat(6,1fr)] [grid-auto-rows:1fr] gap-[calc(7*var(--u))] m-0 p-0 list-none max-poster:[--u:calc(min(100vw-32px,760px)/445)] max-poster:w-full max-poster:max-w-[760px] max-poster:mt-[26px] max-poster:mb-0 max-poster:mx-auto max-poster:[grid-template-columns:repeat(4,1fr)] max-tablet:[--u:calc((100vw-32px)/330)] max-tablet:[grid-template-columns:repeat(3,1fr)]">
          {FLAVOR_CATALOG.map((flavor) => (
            <li
              key={flavor.id}
              className="group flex min-w-0 flex-col items-center pt-[calc(6*var(--u))] pb-[calc(8*var(--u))] rounded-[calc(12*var(--u))] bg-flavors-card-bg text-ink-slate [box-shadow:0_calc(3*var(--u))_calc(6*var(--u))_var(--color-flavors-card-shadow)] text-center"
            >
              <Image
                className="h-auto w-[calc(62*var(--u))] mb-[calc(3*var(--u))] [transition:transform_0.3s_var(--spring,ease)] group-hover:[transform:translateY(calc(-3*var(--u)))_rotate(-4deg)] motion-reduce:transition-none motion-reduce:group-hover:[transform:none]"
                src={FLAVOR_CARD_ASSETS[flavor.id]}
                alt={`${t(`items.${flavor.id}.name`)} Mochi`}
                width={380}
                height={262}
                sizes="(max-width: 1099px) 22vw, 7vw"
              />
              <b className="flex items-center gap-[calc(3*var(--u))] text-[calc(12.4*var(--u))] font-[1000] tracking-[-0.01em] whitespace-nowrap">{t(`items.${flavor.id}.name`)}</b>
              <span
                className={cn(
                  "whitespace-nowrap mt-[calc(4*var(--u))] py-[calc(2*var(--u))] px-[calc(8*var(--u))] rounded-[calc(8*var(--u))] text-[calc(9.6*var(--u))] font-[900] leading-[1.12]",
                  flavor.kind === "challenge" && "max-w-[calc(78*var(--u))] whitespace-normal",
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
