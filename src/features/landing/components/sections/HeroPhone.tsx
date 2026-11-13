import Image from "next/image";
import { CalendarDays, Droplet, Flame, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { StatusIcons } from "@/features/landing/components/shared/decor";
import { cn } from "@/lib/utils";

const WEEK = [
  { key: "sun", day: 15, dot: "bg-cycle-fertile" },
  { key: "mon", day: 16, dot: "bg-cycle-ovulation" },
  { key: "tue", day: 17, dot: "" },
  { key: "wed", day: 18, dot: "" },
  { key: "thu", day: 19, dot: "" },
  { key: "fri", day: 20, dot: "" },
  { key: "sat", day: 21, dot: "" },
] as const;
const TODAY = 18;
const ICON_BUTTON = "grid size-25 place-items-center rounded-full bg-app-bubble text-ink-navy";

/**
 * The app's Today screen (TodayView) on Wednesday June 18, the same cycle as the Predictions
 * section: header, "12 days until your period", the week strip and Mochi asking about your day.
 * The bottom of the phone runs off the band, so the screen stops after Mochi.
 */
export function HeroPhone({ className }: { className?: string }) {
  const t = useTranslations("Hero");

  return (
    <div className={cn("h-430 w-246 p-6 border-[length:calc(2.4*var(--spacing))] border-hero-phone-rim rounded-u-40 bg-hero-phone-frame", className)} role="img" aria-label={t("phoneAlt")}>
      <div className="relative h-full overflow-hidden rounded-u-33 bg-white px-12 pt-9 text-ink-navy" aria-hidden="true">
        <div className="absolute left-1/2 top-6 h-15 w-66 -translate-x-1/2 rounded-full bg-hero-phone-frame" />
        <div className="flex items-center justify-between px-8"><b className="text-u-9 font-black">9:41</b><StatusIcons className="h-auto w-34 text-ink-navy" /></div>

        <div className="mt-14 flex items-center gap-6">
          <span className="flex h-25 items-center gap-4 rounded-full bg-app-orange-tint px-9 text-u-[9.4] font-black text-app-orange-deep">
            <Flame className="size-10 fill-cycle-luteal text-cycle-luteal" strokeWidth={2} />{t("today.streak")}
          </span>
          <span className="flex-1" />
          <span className={ICON_BUTTON}><CalendarDays className="size-11" strokeWidth={2.6} /></span>
          <span className={ICON_BUTTON}><Settings className="size-11" strokeWidth={2.6} /></span>
        </div>

        <div className="mt-15 text-center">
          <p className="text-u-[7.4] font-black uppercase tracking-[0.12em] text-app-grey">{t("today.weekday")}</p>
          <p className="mt-3 text-u-[37.5] font-max leading-none tracking-[-0.02em]">{t("today.daysValue")}</p>
          <p className="mt-4 text-u-10 font-bold text-app-grey">{t("today.daysSubtitle")}</p>
          <span className="mt-8 inline-flex h-26 items-center gap-5 rounded-full bg-cycle-period px-13 text-u-[9.4] font-black text-white">
            <Droplet className="size-10 fill-white" strokeWidth={2.4} />{t("today.logPeriod")}
          </span>
        </div>

        <div className="mt-14 grid grid-cols-7 text-center">
          {WEEK.map(({ key, day, dot }) => (
            <span key={key} className="grid justify-items-center gap-3">
              <i className={cn("text-u-[7.4] not-italic font-black", day === TODAY ? "text-ink-navy" : "text-app-grey")}>{t(`today.week.${key}`)}</i>
              <b className={cn("grid size-25 place-items-center rounded-full text-u-[10.6] font-max", day === TODAY && "bg-ink-navy text-white")}>{day}</b>
              <i className={cn("size-4.5 rounded-full", dot)} />
            </span>
          ))}
        </div>

        <div className="relative mx-auto mt-13 w-fit rounded-u-16 bg-app-bubble px-9 py-8 text-center text-u-[8.8] font-bold leading-[1.25] after:absolute after:left-1/2 after:-bottom-5 after:size-10 after:-translate-x-1/2 after:rotate-45 after:rounded-u-2 after:bg-app-bubble">
          {t("today.bubble")}
        </div>
        <Image className="mx-auto mt-6 h-auto w-170" src={LANDING_ASSETS.todayMochi} alt="" width={660} height={345} sizes="(max-width: 1099px) 30vw, 12vw" />
        <div className="mt-6 flex items-center justify-between text-u-[8.6] font-bold">
          <span className="text-app-grey">{t("today.tapHint")}</span>
          <span className="font-black text-cycle-period-ink">{t("today.logMore")}</span>
        </div>
      </div>
    </div>
  );
}
