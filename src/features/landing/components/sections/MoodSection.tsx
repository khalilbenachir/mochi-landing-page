import Image from "next/image";
import { useTranslations } from "next-intl";
import { MOOD_ASSETS } from "@/features/landing/content/assets";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";

const MOODS = [
  {
    id: "happy",
    width: 377,
    height: 327,
    item: "w-98 max-poster:left-0",
    image: "-mr-6",
  },
  {
    id: "sleepy",
    width: 362,
    height: 361,
    item: "w-94 max-poster:left-[calc(103*var(--m))]",
    image: "",
  },
  {
    id: "crampy",
    width: 363,
    height: 360,
    item: "w-94 max-poster:left-[calc(201*var(--m))]",
    image: "",
  },
  {
    id: "cozy",
    width: 399,
    height: 337,
    item: "w-104 max-poster:left-[calc(300*var(--m))]",
    image: "-ml-4",
  },
] as const;

/** Section 3: four mood Mochis. */
export function MoodSection() {
  const t = useTranslations("Moods");

  return (
    <section id="moods" className="relative overflow-hidden bg-mood-band text-white">
      <PosterStage className="grid items-center px-58 grid-cols-[calc(339*var(--spacing))_1fr] max-poster:block max-poster:px-[clamp(20px,4vw,40px)]">
        <div className="relative z-3 pr-16 max-poster:mx-auto max-poster:max-w-[640px] max-poster:pr-0 max-poster:text-center">
          <h2 className="text-balance text-white text-u-28 font-max leading-[1.03] tracking-[-0.015em] max-poster:text-[clamp(36px,6.4vw,52px)] max-phone:text-[30px]">
            <span className="block">{t("title1")}</span> <span className="block">{t("title2")}</span>
          </h2>
          <p className="mt-9 w-252 text-u-[12.8] font-demibold leading-[1.3] max-poster:w-auto max-poster:max-w-[460px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">{t("body")}</p>
        </div>

        <ul className="flex justify-center gap-16 poster:ml-24 poster:scale-[1.2] max-poster:block max-poster:[--m:calc(min(100vw-32px,700px)/410)] max-poster:relative max-poster:h-[calc(130*var(--m))] max-poster:w-[calc(410*var(--m))] max-poster:mt-[26px] max-poster:mb-0 max-poster:mx-auto">
          {MOODS.map((mood) => (
            <li
              key={mood.id}
              className={cn(
                "group relative z-2 flex h-144 flex-col items-center justify-end max-poster:absolute max-poster:top-0 max-poster:[--spacing:var(--m)]",
                mood.item,
              )}
            >
              <Image
                className={cn("h-auto w-full origin-[50%_100%] cursor-pointer group-hover:animate-squish", mood.image)}
                src={MOOD_ASSETS[mood.id]}
                alt={`${t(`moodNames.${mood.id}`)} Mochi`}
                width={mood.width}
                height={mood.height}
                sizes="(max-width: 1099px) 24vw, 10vw"
              />
              <span className="relative z-1 inline-flex items-center gap-4 h-22 -mt-3 pl-8 pr-11 rounded-full bg-white text-ink-slate text-u-12 font-black whitespace-nowrap [box-shadow:0_calc(2*var(--spacing))_0_var(--color-mood-pill-shadow)]">{t(`moodNames.${mood.id}`)}</span>
            </li>
          ))}
        </ul>
      </PosterStage>
    </section>
  );
}
