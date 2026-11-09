import { Crown, HeartPulse, Image, Mail, RefreshCw, ShieldCheck, Smartphone } from "lucide-react";
import type { TermsSectionId } from "../content/terms";

const ICONS = {
  using: Smartphone,
  health: HeartPulse,
  subscriptions: Crown,
  content: Image,
  "acceptable-use": ShieldCheck,
  changes: RefreshCw,
  contact: Mail,
} as const;

export function TermsIcon({ id, className }: { id: TermsSectionId; className?: string }) {
  const Icon = ICONS[id];
  return <Icon className={className} strokeWidth={2.25} aria-hidden="true" />;
}

/** Decorative summary pictograms use the same theme palette as the rest of the page. */
export function TermsSummaryIcon({ id, className }: { id: "medical" | "contraception" | "plus" | "privacy" | "warning"; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
      {id === "medical" || id === "warning" ? (
        <>
          <path className="fill-brand-coral" d="M40 72C30 66 7 48 7 28 7 17 15 10 25 10c7 0 12 4 15 9 3-5 8-9 15-9 10 0 18 7 18 18 0 20-23 38-33 44Z" />
          <path className="fill-white/35" d="M15 26c1-6 5-10 11-10 3 0 5 1 6 3-7-1-12 2-17 7Z" />
          {id === "medical" ? <path className="stroke-white" d="M40 30v23M28.5 41.5h23" fill="none" strokeWidth="8" strokeLinecap="round" /> : <><path className="stroke-white" d="M40 29v18" fill="none" strokeWidth="7" strokeLinecap="round" /><circle className="fill-white" cx="40" cy="57" r="4" /></>}
        </>
      ) : null}
      {id === "contraception" ? (
        <>
          <rect className="fill-policy-purple/15 stroke-policy-purple" x="11" y="17" width="58" height="54" rx="9" strokeWidth="5" />
          <path className="stroke-policy-purple fill-policy-purple/25" d="M12 31h56M24 10v15M56 10v15" strokeWidth="6" strokeLinecap="round" />
          <path className="fill-brand-coral" d="M40 38c-4 6-10 12-10 17a10 10 0 0 0 20 0c0-5-6-11-10-17Z" />
        </>
      ) : null}
      {id === "plus" ? (
        <>
          <path className="fill-sun stroke-terms-orange" d="m8 28 17 11 15-25 15 25 17-11-9 37H17Z" strokeWidth="5" strokeLinejoin="round" />
          <path className="stroke-white/65" d="M22 58h35" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : null}
      {id === "privacy" ? (
        <>
          <path className="stroke-policy-blue" d="M22 33V22a18 18 0 0 1 36 0v11" fill="none" strokeWidth="6" />
          <rect className="fill-policy-blue" x="11" y="29" width="58" height="44" rx="11" />
          <path className="stroke-white" d="M40 49v10" strokeWidth="6" strokeLinecap="round" /><circle className="fill-white" cx="40" cy="47" r="7" />
        </>
      ) : null}
    </svg>
  );
}
