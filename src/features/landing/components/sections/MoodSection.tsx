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
import { StatusIcons } from "./IslandSection";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";

const MOODS = [
  {
    id: "happy",
    width: 377,
    height: 327,
    item: "left-[calc(397*var(--u))] w-[calc(98*var(--u))] max-poster:left-0",
    image: "mr-[calc(-6*var(--u))]",
  },
  {
    id: "sleepy",
    width: 362,
    height: 361,
    item: "left-[calc(500*var(--u))] w-[calc(94*var(--u))] max-poster:left-[calc(103*var(--m))]",
    image: "",
  },
  {
    id: "crampy",
    width: 363,
    height: 360,
    item: "left-[calc(598*var(--u))] w-[calc(94*var(--u))] max-poster:left-[calc(201*var(--m))]",
    image: "",
  },
  {
    id: "cozy",
    width: 399,
    height: 337,
    item: "left-[calc(697*var(--u))] w-[calc(104*var(--u))] max-poster:left-[calc(300*var(--m))]",
    image: "ml-[calc(-4*var(--u))]",
  },
] as const;

/* Mood faces for the Log Today sheet, drawn to match the app's mood picker. */
function MoodFace({ tone }: { tone: MoodTone }) {
  return (
    <svg className={cn("h-[85%] w-[85%]", MOOD_FACE_CLASS[tone].ink)} viewBox="0 0 24 24" aria-hidden="true">
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
      <svg className="h-[70%] w-[70%]" viewBox="0 0 24 24" aria-hidden="true">
        <path className="fill-mood-symptom-cramps" d="M13.5 3 6.5 13h5l-1.5 8 7.5-10.5h-5L13.5 3Z" />
      </svg>
    );
  if (name === "bloating")
    return (
      <svg className="h-[70%] w-[70%]" viewBox="0 0 24 24" aria-hidden="true">
        <g className="stroke-mood-symptom-bloating" fill="none" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5 9q1.75-2 3.5 0t3.5 0 3.5 0 3.5 0" />
          <path d="M5 14q1.75-2 3.5 0t3.5 0 3.5 0 3.5 0" />
        </g>
      </svg>
    );
  if (name === "headache")
    return (
      <svg className="h-[70%] w-[70%]" viewBox="0 0 24 24" aria-hidden="true">
        <path className="fill-mood-symptom-headache" d="M5 16.5c0-5.2 3.1-8.5 7-8.5s7 3.3 7 8.5Z" />
      </svg>
    );
  return (
    <svg className="h-[70%] w-[70%]" viewBox="0 0 24 24" aria-hidden="true">
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
  const sheetLabel = "mt-[calc(7*var(--u))] mr-0 mb-[calc(4*var(--u))] ml-[calc(2*var(--u))] text-[calc(9*var(--u))] font-[1000]";
  const row = "flex justify-between m-0 px-[calc(2*var(--u))] py-0 list-none";

  return (
    <div
      className="absolute z-2 left-[calc(824*var(--u))] top-[calc(-16*var(--u))] h-[calc(176*var(--u))] w-[calc(172*var(--u))] p-[calc(6*var(--u))] border-solid border-mood-phone-border [border-width:calc(3*var(--u))] rounded-[calc(30*var(--u))] bg-mood-phone-bg [box-shadow:0_0_0_calc(1*var(--u))_var(--color-mood-phone-shadow),0_calc(8*var(--u))_calc(18*var(--u))_var(--color-mood-phone-shadow-2)] [transform:rotate(4.5deg)] max-poster:[--u:calc(min(62vw,290px)/172)] max-poster:relative max-poster:left-auto max-poster:top-auto max-poster:h-[calc(150*var(--u))] max-poster:mt-[26px] max-poster:mb-[calc(-12*var(--u))] max-poster:mx-auto max-poster:rounded-b-none"
      role="img"
      aria-label={t("phoneLabel")}
    >
      <div className="h-full overflow-hidden px-[calc(11*var(--u))] pt-[calc(7*var(--u))] pb-0 rounded-[calc(24*var(--u))] bg-mood-screen-bg text-ink-slate" aria-hidden="true">
        <div className="relative flex h-[calc(12*var(--u))] items-center justify-between px-[calc(4*var(--u))]">
          <b className="text-[calc(6.5*var(--u))] font-[900]">9:41</b>
          <i className="absolute left-[50%] top-[calc(-1*var(--u))] h-[calc(10*var(--u))] w-[calc(36*var(--u))] rounded-[999px] bg-black [transform:translateX(-50%)]" />
          <StatusIcons className="h-auto w-[calc(26*var(--u))] text-ink-slate" />
        </div>
        <div className="relative flex items-center justify-center mt-[calc(5*var(--u))]">
          <span className="absolute left-[calc(2*var(--u))] top-[50%] text-[calc(13*var(--u))] font-[700] leading-none [transform:translateY(-55%)]">×</span>
          <b className="text-[calc(11*var(--u))] font-[1000] tracking-[-0.01em]">{t("logToday")}</b>
        </div>
        <p className={sheetLabel}>{t("mood")}</p>
        <ul className={row}>
          {MOOD_TONES.map((tone) => (
            <li
              key={tone}
              className={cn(
                "grid h-[calc(21*var(--u))] w-[calc(21*var(--u))] place-items-center rounded-[50%] [box-shadow:0_calc(1*var(--u))_calc(3*var(--u))_var(--color-mood-face-shadow)]",
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
            <li key={id} className="grid justify-items-center gap-[calc(2*var(--u))] text-[calc(5*var(--u))] font-[900]">
              <span className={cn("grid h-[calc(21*var(--u))] w-[calc(21*var(--u))] place-items-center rounded-[50%]", SYMPTOM_CHIP_CLASS[id])}>
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
      <PosterStage className="aspect-[1024/132] max-poster:px-[clamp(20px,4vw,40px)] max-poster:pb-0 max-poster:pt-[36px] max-phone:pt-[30px]">
        <div className="absolute z-3 left-[calc(58*var(--u))] top-[calc(12*var(--u))] max-poster:relative max-poster:left-auto max-poster:top-auto max-poster:mx-auto max-poster:my-0 max-poster:max-w-[640px] max-poster:text-center">
          <h2 className="m-0 text-white text-[calc(28*var(--u))] font-[1000] leading-[1.03] tracking-[-0.015em] max-poster:text-[clamp(36px,6.4vw,52px)] max-phone:text-[30px]">
            <span className="block whitespace-nowrap max-poster:whitespace-normal max-phone:whitespace-nowrap">{t("title1")}</span> <span className="block whitespace-nowrap max-poster:whitespace-normal max-phone:whitespace-nowrap">{t("title2")}</span>
          </h2>
          <p className="mt-[calc(9*var(--u))] mb-0 mx-0 w-[calc(252*var(--u))] text-[calc(12.8*var(--u))] font-[650] leading-[1.3] max-poster:w-auto max-poster:max-w-[460px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">{t("body")}</p>
        </div>

        <ul className="m-0 p-0 list-none max-poster:[--m:calc(min(100vw-32px,700px)/410)] max-poster:relative max-poster:h-[calc(130*var(--m))] max-poster:w-[calc(410*var(--m))] max-poster:mt-[26px] max-poster:mb-0 max-poster:mx-auto">
          {MOODS.map((mood) => (
            <li
              key={mood.id}
              className={cn(
                "group absolute z-2 top-0 flex h-[calc(122*var(--u))] flex-col items-center justify-end max-poster:[--u:var(--m)]",
                mood.item,
              )}
            >
              <Image
                className={cn("h-auto w-full origin-[50%_100%] cursor-pointer group-hover:animate-squish motion-reduce:group-hover:animate-none", mood.image)}
                src={MOOD_ASSETS[mood.id]}
                alt={`${t(`moodNames.${mood.id}`)} Mochi`}
                width={mood.width}
                height={mood.height}
                sizes="(max-width: 1099px) 24vw, 10vw"
              />
              <span className="relative z-1 inline-flex items-center gap-[calc(4*var(--u))] h-[calc(22*var(--u))] mt-[calc(-3*var(--u))] pl-[calc(8*var(--u))] pr-[calc(11*var(--u))] rounded-[999px] bg-white text-ink-slate text-[calc(12*var(--u))] font-[900] whitespace-nowrap [box-shadow:0_calc(2*var(--u))_0_var(--color-mood-pill-shadow)]">{t(`moodNames.${mood.id}`)}</span>
            </li>
          ))}
        </ul>

        <LogTodayPhone />
      </PosterStage>
    </section>
  );
}
