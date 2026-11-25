import Image from "next/image";
import { cn } from "@/lib/utils";
import { PRIVACY_SUMMARY_ICONS, type PrivacySummaryIconId } from "../content/policy";

/** Decorative Mochi icons (ChatGPT, from the app's Mochi) for the summary cards and the on-device callout. `alt` is passed in because the callout renders inside a client component. */
export function PrivacySummaryIcon({ id, alt, className }: { id: PrivacySummaryIconId; alt: string; className?: string }) {
  return <Image src={PRIVACY_SUMMARY_ICONS[id]} width={256} height={256} alt={alt} aria-hidden="true" className={cn("object-contain", className)} />;
}
