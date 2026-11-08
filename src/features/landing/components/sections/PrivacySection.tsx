import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
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
    <svg className={cn("h-[calc(46*var(--u))] w-[calc(23*var(--u))] flex-none overflow-visible", side === "right" && "[transform:scaleX(-1)]")} viewBox="0 0 30 60" aria-hidden="true">
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
    <div className="mt-[calc(14*var(--u))] flex min-h-[calc(50*var(--u))] items-center justify-center gap-[calc(1*var(--u))] text-privacy-gold">
      <Laurel side="left" />
      <p className="relative z-1 -mx-[calc(5*var(--u))] m-0 grid min-w-[calc(56*var(--u))] text-[calc(11*var(--u))] leading-[1.12] text-white">{lines.map((line, index) => index < 2 ? <b key={line} className="whitespace-nowrap font-[1000]">{line}</b> : line ? <span key={line} className="text-[calc(10*var(--u))] font-[650]">{line}</span> : null)}</p>
      <Laurel side="right" />
    </div>
  );
}

function PromiseIcon({ name }: { name: "lock" | "offline" | "cloud" }) {
  return (
    <span className="mt-[calc(1*var(--u))] grid h-[calc(32*var(--u))] w-[calc(32*var(--u))] place-items-center rounded-[50%] bg-white" aria-hidden="true">
      <svg className="h-[62%] w-[62%]" viewBox="0 0 24 24">
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

function Rays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M12 4 17 15" /><path d="M27 8 24 19" /><path d="M36 22 26 25" />
      </g>
    </svg>
  );
}

/** Section 6: what stays on the phone, in the app's own privacy wording. */
export function PrivacySection() {
  const t = useTranslations("Privacy");

  return (
    <section id="privacy" className="relative overflow-hidden bg-privacy-band text-white">
      <PosterStage className="grid items-center justify-start pl-[calc(52*var(--u))] [grid-template-columns:calc(318*var(--u))_calc(360*var(--u))_auto] [grid-template-rows:1fr_auto] max-poster:block max-poster:px-[clamp(16px,4vw,40px)]">
        <div className="relative z-2 self-start pr-[calc(22*var(--u))] [grid-area:1/1] max-poster:pr-0 max-poster:max-w-[640px] max-poster:mx-auto max-poster:text-center">
          <h2 className="poster:text-balance m-0 text-white text-[calc(33.5*var(--u))] font-[1000] leading-[0.98] tracking-[-0.015em] max-poster:text-[clamp(34px,6vw,50px)] max-phone:text-[32px]">
            <span className="block max-poster:inline">{t("title1")}</span> <span className="block max-poster:inline">{t("title2")}</span>
          </h2>
          <p className="poster:text-balance mt-[calc(5*var(--u))] mb-0 mx-0 text-privacy-body-text text-[calc(14.6*var(--u))] font-[650] leading-[1.2] max-poster:max-w-[480px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">
            <span className="block max-poster:inline">{t("body1")}</span> <span className="block max-poster:inline">{t("body2")}</span>
          </p>
        </div>

        <div className="relative z-1 ml-[calc(43*var(--u))] mt-[calc(4*var(--u))] -mb-[calc(var(--section-space)+17*var(--u))] w-[calc(86*var(--u))] self-end [grid-area:2/1] max-poster:[--u:calc(min(100vw-32px,420px)/236)] max-poster:mx-auto max-poster:mb-0 max-poster:mt-[10px] max-poster:h-[calc(46*var(--u))] max-poster:w-[calc(80*var(--u))] max-poster:overflow-visible max-poster:[clip-path:inset(-40px_-40px_0_-40px)]" aria-hidden="true">
          <Image className="h-auto w-full" src={LANDING_ASSETS.predictMochi} alt="" width={368} height={264} sizes="12vw" />
          <svg className="absolute left-[calc(48*var(--u))] top-[calc(17*var(--u))] w-[calc(32*var(--u))] [filter:drop-shadow(0_calc(1*var(--u))_0_var(--color-privacy-hug-shadow))]" viewBox="0 0 24 24"><path className="fill-brand-rose" d="M12 21.2C5.4 16.6 2 13 2 8.8 2 5.7 4.4 3.4 7.3 3.4c2 0 3.6 1 4.7 2.6 1.1-1.6 2.7-2.6 4.7-2.6 2.9 0 5.3 2.3 5.3 5.4 0 4.2-3.4 7.8-10 12.4Z" /><path className="fill-privacy-hug-highlight" d="M6.5 6.4c1.2-.8 2.6-.4 3.1.4-.9.1-1.9.6-2.6 1.6-.5-.5-.8-1.3-.5-2Z" /></svg>
          <Rays className="absolute left-[calc(90*var(--u))] top-[calc(5*var(--u))] w-[calc(24*var(--u))] text-privacy-gold max-poster:hidden" />
        </div>

        <ul className="relative m-0 grid [grid-area:1/2/3/3] w-[calc(360*var(--u))] list-none p-0 [grid-template-columns:repeat(3,minmax(0,1fr))] max-poster:[--u:calc(min(100vw-32px,600px)/360)] max-poster:mx-auto max-poster:mb-0 max-poster:mt-[30px]">
          {PROMISES.map((item) => (
            <li key={item.id} className="relative flex flex-col items-center text-center not-first:before:absolute not-first:before:left-0 not-first:before:top-[calc(10*var(--u))] not-first:before:h-[calc(62*var(--u))] not-first:before:[border-left:calc(1*var(--u))_solid_var(--color-privacy-promise-divider)] not-first:before:content-['']">
              <PromiseIcon name={item.icon} />
              <b className="mt-[calc(4*var(--u))] text-[calc(12.8*var(--u))] font-[1000]">{t(`promises.${item.id}.title`)}</b>
              <span className="mt-[calc(1*var(--u))] flex-1 text-privacy-promise-detail-text text-[calc(10.4*var(--u))] font-[650] leading-[1.22]"><span className="block">{t(`promises.${item.id}.line1`)}</span><span className="block text-balance">{t(`promises.${item.id}.line2`)}</span></span>
              <Badge lines={[t(`promises.${item.id}.badge1`), t(`promises.${item.id}.badge2`), t(`promises.${item.id}.badge3`)]} />
            </li>
          ))}
        </ul>

        <div className="relative ml-[calc(12*var(--u))] w-[calc(236*var(--u))] [grid-area:1/3/3/4] pb-[calc(14*var(--u))] pl-[calc(18*var(--u))] pr-[calc(16*var(--u))] pt-[calc(12*var(--u))] rounded-[calc(14*var(--u))] bg-white text-ink-deep max-poster:[--u:calc(min(100vw-32px,330px)/236)] max-poster:mx-auto max-poster:mt-[28px] max-poster:mb-0">
          <h3 className="mt-0 mx-0 mb-[calc(8*var(--u))] text-[calc(21.5*var(--u))] font-[1000] tracking-[-0.01em]">{t("staysTitle")}</h3>
          <ul className="m-0 grid list-none gap-[calc(7*var(--u))] p-0">
            {STAYS.map((line) => (
              <li key={line[0]} className="flex items-start gap-[calc(9*var(--u))] text-[calc(12.4*var(--u))] font-[900] leading-[1.25]">
                <svg className="mt-[calc(-2*var(--u))] h-[calc(19*var(--u))] w-[calc(19*var(--u))] flex-none" viewBox="0 0 24 24" aria-hidden="true"><circle className="fill-brand-coral" cx="12" cy="12" r="11" /><path className="stroke-white" d="M7 12.5l3.2 3.2L17 9" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span>{line.map((part) => <span key={part} className="block">{t(`stays.${part}`)}</span>)}</span>
              </li>
            ))}
          </ul>
        </div>
      </PosterStage>
    </section>
  );
}
