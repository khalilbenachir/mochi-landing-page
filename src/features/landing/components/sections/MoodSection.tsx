import Image from "next/image";
import { useTranslations } from "next-intl";
import { MOOD_ASSETS } from "@/features/landing/content/assets";
import {
  MOOD_FACE_CLASS,
  MOOD_TONES,
  SYMPTOM_CHIP_CLASS,
  SYMPTOM_IDS,
  type MoodTone,
} from "@/features/landing/content/visual-variants";
import { StatusIcons } from "@/features/landing/components/shared/decor";
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

/* Mood faces for the Log Today sheet, drawn to match the app's mood picker. */
function MoodFace({ tone }: { tone: MoodTone }) {
  return (
    <svg className={cn("size-[85%]", MOOD_FACE_CLASS[tone].ink)} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        {tone === "joy" && (
          <>
            <path d="M7 10.5q1.5-2 3 0M14 10.5q1.5-2 3 0" />
            <path d="M8.5 13.5q3.5 3.5 7 0Z" fill="currentColor" />
          </>
        )}
        {tone === "calm" && (
          <>
            <path d="M7 10.5q1.5-2 3 0M14 10.5q1.5-2 3 0" />
            <path d="M10 14q2 1.6 4 0" />
          </>
        )}
        {tone === "meh" && (
          <>
            <path d="M7.5 9.5l2 1.2M16.5 9.5l-2 1.2" />
            <path d="M10.5 15q1.5-1.2 3 0" />
          </>
        )}
        {tone === "sad" && (
          <>
            <circle cx="9" cy="10.5" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10.5" r="1" fill="currentColor" stroke="none" />
            <path d="M10 15.5q2-1.6 4 0" />
          </>
        )}
      </g>
    </svg>
  );
}

function SymptomIcon({
  name,
}: {
  name: "cramps" | "bloating" | "headache" | "tired";
}) {
  if (name === "cramps")
    return (
      <svg className="size-[70%]" viewBox="0 0 24 24" aria-hidden="true">
        <path className="fill-mood-symptom-cramps" d="M13.5 3 6.5 13h5l-1.5 8 7.5-10.5h-5L13.5 3Z" />
      </svg>
    );
  if (name === "bloating")
    return (
      <svg className="size-[70%]" viewBox="0 0 24 24" aria-hidden="true">
        <g className="stroke-mood-symptom-bloating" fill="none" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5 9q1.75-2 3.5 0t3.5 0 3.5 0 3.5 0" />
          <path d="M5 14q1.75-2 3.5 0t3.5 0 3.5 0 3.5 0" />
        </g>
      </svg>
    );
  if (name === "headache")
    return (
      <svg className="size-[70%]" viewBox="0 0 24 24" aria-hidden="true">
        <path className="fill-mood-symptom-headache" d="M5 16.5c0-5.2 3.1-8.5 7-8.5s7 3.3 7 8.5Z" />
      </svg>
    );
  return (
    <svg className="size-[70%]" viewBox="0 0 24 24" aria-hidden="true">
      <text className="fill-mood-symptom-tired" x="6" y="17" fontSize="11" fontWeight="900">
        z
      </text>
      <text className="fill-mood-symptom-tired" x="13" y="12" fontSize="8" fontWeight="900">
        z
      </text>
    </svg>
  );
}

function LogTodayPhone() {
  const t = useTranslations("Moods");
  const sheetLabel = "mt-7 mb-4 ml-2 text-u-9 font-max";
  const row = "flex justify-between px-2";

  return (
    <div
      className="relative z-2 ml-23 -mb-[calc(var(--section-space)+28*var(--spacing))] self-end h-176 w-172 p-6 border-mood-phone-border border-[length:calc(3*var(--spacing))] rounded-u-30 bg-mood-phone-bg [box-shadow:0_0_0_calc(1*var(--spacing))_var(--color-mood-phone-shadow),0_calc(8*var(--spacing))_calc(18*var(--spacing))_var(--color-mood-phone-shadow-2)] rotate-[4.5deg] max-poster:[--spacing:calc(min(62vw,290px)/172)] max-poster:h-150 max-poster:mt-[26px] max-poster:-mb-12 max-poster:mx-auto max-poster:rounded-b-none"
      role="img"
      aria-label={t("phoneLabel")}
    >
      <div className="h-full overflow-hidden px-11 pt-7 rounded-u-24 bg-mood-screen-bg text-ink-slate" aria-hidden="true">
        <div className="relative flex h-12 items-center justify-between px-4">
          <b className="text-u-6.5 font-black">9:41</b>
          <i className="absolute left-1/2 -top-1 h-10 w-36 rounded-full bg-black -translate-x-1/2" />
          <StatusIcons className="h-auto w-26 text-ink-slate" />
        </div>
        <div className="relative flex items-center justify-center mt-5">
          <span className="absolute left-2 top-1/2 text-u-13 font-bold leading-none -translate-y-[55%]">×</span>
          <b className="text-u-11 font-max tracking-[-0.01em]">{t("logToday")}</b>
        </div>
        <p className={sheetLabel}>{t("mood")}</p>
        <ul className={row}>
          {MOOD_TONES.map((tone) => (
            <li
              key={tone}
              className={cn(
                "grid size-21 place-items-center rounded-full [box-shadow:0_calc(1*var(--spacing))_calc(3*var(--spacing))_var(--color-mood-face-shadow)]",
                MOOD_FACE_CLASS[tone].chip,
              )}
            >
              <MoodFace tone={tone} />
            </li>
          ))}
        </ul>
        <p className={sheetLabel}>{t("symptoms")}</p>
        <ul className={row}>
          {SYMPTOM_IDS.map((id) => (
            <li key={id} className="grid justify-items-center gap-2 text-u-5 font-black">
              <span className={cn("grid size-21 place-items-center rounded-full", SYMPTOM_CHIP_CLASS[id])}>
                <SymptomIcon name={id} />
              </span>
              {t(`symptomNames.${id}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Section 3: four mood Mochis and the Log Today sheet. */
export function MoodSection() {
  const t = useTranslations("Moods");

  return (
    <section id="moods" className="relative overflow-hidden bg-mood-band text-white">
      <PosterStage bleed="bottom" className="grid items-center px-58 grid-cols-[calc(339*var(--spacing))_calc(404*var(--spacing))_1fr] max-poster:block max-poster:px-[clamp(20px,4vw,40px)]">
        <div className="relative z-3 pr-16 max-poster:mx-auto max-poster:max-w-[640px] max-poster:pr-0 max-poster:text-center">
          <h2 className="text-balance text-white text-u-28 font-max leading-[1.03] tracking-[-0.015em] max-poster:text-[clamp(36px,6.4vw,52px)] max-phone:text-[30px]">
            <span className="block">{t("title1")}</span> <span className="block">{t("title2")}</span>
          </h2>
          <p className="mt-9 w-252 text-u-[12.8] font-demibold leading-[1.3] max-poster:w-auto max-poster:max-w-[460px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">{t("body")}</p>
        </div>

        <ul className="flex justify-between max-poster:block max-poster:[--m:calc(min(100vw-32px,700px)/410)] max-poster:relative max-poster:h-[calc(130*var(--m))] max-poster:w-[calc(410*var(--m))] max-poster:mt-[26px] max-poster:mb-0 max-poster:mx-auto">
          {MOODS.map((mood) => (
            <li
              key={mood.id}
              className={cn(
                "group relative z-2 flex h-122 flex-col items-center justify-end max-poster:absolute max-poster:top-0 max-poster:[--spacing:var(--m)]",
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

        <LogTodayPhone />
      </PosterStage>
    </section>
  );
}
