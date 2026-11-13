import { useTranslations } from "next-intl";
import { CheckBadge } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";

/** One laurel branch: a curved stem with paired leaves, mirrored for the right side. */
const bez = (t: number, a: number, b: number, c: number) => (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t ** 2 * c;
const LEAVES = Array.from({ length: 7 }, (_, i) => {
  const t = 0.08 + i * 0.135;
  const x = bez(t, 20, -7, 18);
  const y = bez(t, 58, 32, 4);
  const dx = 2 * (1 - t) * (-7 - 20) + 2 * t * (18 + 7);
  const dy = 2 * (1 - t) * (32 - 58) + 2 * t * (4 - 32);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // leaf axis along the stem
  return { x: +x.toFixed(2), y: +y.toFixed(2), angle: Math.round(angle), s: 1 - i * 0.05 };
});

function Laurel({ side }: { side: "left" | "right" }) {
  return (
    <svg className={cn("h-46 w-23 flex-none overflow-visible", side === "right" && "-scale-x-100")} viewBox="0 0 30 60" aria-hidden="true">
      <path d="M20 58Q-7 32 18 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {LEAVES.map((leaf, i) => (
        <g key={i} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.s})`}>
          <ellipse cx="-5" cy="-1.8" rx="5.4" ry="2.5" transform="rotate(-38 -5 -1.8)" fill="currentColor" />
          <ellipse cx="4.4" cy="-2" rx="4.6" ry="2.2" transform="rotate(38 4.4 -2)" fill="currentColor" />
        </g>
      ))}
      <ellipse cx="18.5" cy="3.5" rx="2.3" ry="4.4" transform="rotate(25 18.5 3.5)" fill="currentColor" />
    </svg>
  );
}

function Badge({ lines }: { lines: readonly string[] }) {
  return (
    <div className="mt-14 flex min-h-50 items-center justify-center gap-1 text-privacy-gold">
      <Laurel side="left" />
      <p className="relative z-1 -mx-5 grid min-w-56 text-u-11 leading-[1.12] text-white">{lines.map((line, index) => index < 2 ? <b key={line} className="whitespace-nowrap font-max">{line}</b> : line ? <span key={line} className="text-u-10 font-demibold">{line}</span> : null)}</p>
      <Laurel side="right" />
    </div>
  );
}

function PromiseIcon({ name }: { name: "lock" | "offline" | "cloud" }) {
  return (
    <span className="mt-1 grid size-32 place-items-center rounded-full bg-white" aria-hidden="true">
      <svg className="size-[62%]" viewBox="0 0 24 24" aria-hidden="true">
        <g className="stroke-ink-deep" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {name === "lock" && <><rect x="5" y="10.5" width="14" height="10" rx="2.2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /><path d="M12 14.5v2.5" /></>}
          {name === "offline" && <><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 15.8a5 5 0 0 1 6.8 0" /><circle className="fill-ink-deep" cx="12" cy="19" r="1" /><path d="M4 3.5 20 20.5" /></>}
        </g>
        {name === "cloud" && <path className="fill-ink-deep" d="M7.5 19h10a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 6.6 9.1 5 5 0 0 0 7.5 19Z" />}
      </svg>
    </span>
  );
}

const PROMISES = [
  { id: "private", icon: "lock" },
  { id: "offline", icon: "offline" },
  { id: "account", icon: "cloud" },
] as const;

const STAYS = [["dates"], ["logs"], ["reminders1", "reminders2"]] as const;

/** Section 6: what stays on the phone, in the app's own privacy wording. */
export function PrivacySection() {
  const t = useTranslations("Privacy");

  return (
    <section id="privacy" className="relative overflow-hidden bg-privacy-band text-white">
      <PosterStage className="grid items-center justify-start pl-52 grid-cols-[calc(318*var(--spacing))_calc(360*var(--spacing))_auto] grid-rows-[1fr_auto] max-poster:block max-poster:px-[clamp(16px,4vw,40px)]">
        <div className="relative z-2 self-start pr-22 col-start-1 row-start-1 max-poster:pr-0 max-poster:max-w-[640px] max-poster:mx-auto max-poster:text-center">
          <h2 className="poster:text-balance text-white text-u-33.5 font-max leading-[0.98] tracking-[-0.015em] max-poster:text-[clamp(34px,6vw,50px)] max-phone:text-[32px]">
            <span className="block max-poster:inline">{t("title1")}</span> <span className="block max-poster:inline">{t("title2")}</span>
          </h2>
          <p className="poster:text-balance mt-5 text-privacy-body-text text-u-[14.6] font-demibold leading-[1.2] max-poster:max-w-[480px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">
            <span className="block max-poster:inline">{t("body1")}</span> <span className="block max-poster:inline">{t("body2")}</span>
          </p>
        </div>

        <ul className="relative grid col-start-2 row-start-1 row-end-3 w-360 grid-cols-[repeat(3,minmax(0,1fr))] max-poster:[--spacing:calc(min(100vw-32px,600px)/360)] max-poster:mx-auto max-poster:mb-0 max-poster:mt-[30px]">
          {PROMISES.map((item) => (
            <li key={item.id} className="relative flex flex-col items-center text-center not-first:before:absolute not-first:before:left-0 not-first:before:top-10 not-first:before:h-62 not-first:before:border-l-[length:calc(1*var(--spacing))] not-first:before:border-l-privacy-promise-divider">
              <PromiseIcon name={item.icon} />
              <b className="mt-4 text-u-[12.8] font-max">{t(`promises.${item.id}.title`)}</b>
              <span className="mt-1 flex-1 text-privacy-promise-detail-text text-u-[10.4] font-demibold leading-[1.22]"><span className="block">{t(`promises.${item.id}.line1`)}</span><span className="block text-balance">{t(`promises.${item.id}.line2`)}</span></span>
              <Badge lines={[t(`promises.${item.id}.badge1`), t(`promises.${item.id}.badge2`), t(`promises.${item.id}.badge3`)]} />
            </li>
          ))}
        </ul>

        <div className="relative ml-12 w-236 col-start-3 row-start-1 row-end-3 pb-14 pl-18 pr-16 pt-12 rounded-u-14 bg-white text-ink-deep max-poster:[--spacing:calc(min(100vw-32px,330px)/236)] max-poster:mx-auto max-poster:mt-[28px] max-poster:mb-0">
          <h3 className="mb-8 text-u-21.5 font-max tracking-[-0.01em]">{t("staysTitle")}</h3>
          <ul className="grid gap-7">
            {STAYS.map((line) => (
              <li key={line[0]} className="flex items-start gap-9 text-u-[12.4] font-black leading-[1.25]">
                <CheckBadge className="-mt-2 size-19" />
                <span>{line.map((part) => <span key={part} className="block">{t(`stays.${part}`)}</span>)}</span>
              </li>
            ))}
          </ul>
        </div>
      </PosterStage>
    </section>
  );
}
