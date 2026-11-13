import Image from "next/image";
import { cn } from "@/lib/utils";
import { PRIVACY_SUMMARY_ICONS, type PrivacySummaryIconId } from "../content/policy";

/** Decorative Mochi icons (ChatGPT, from the app's Mochi) for the summary cards and the on-device callout. */
export function PrivacySummaryIcon({ id, className }: { id: PrivacySummaryIconId; className?: string }) {
  return <Image src={PRIVACY_SUMMARY_ICONS[id]} width={256} height={256} alt="" className={cn("object-contain", className)} />;
}
