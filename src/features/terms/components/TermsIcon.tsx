import Image from "next/image";
import { cn } from "@/lib/utils";
import { TERMS_SUMMARY_ICONS, type TermsSummaryIconId } from "../content/terms";

/** Decorative Mochi icons (ChatGPT, from the app's Mochi) for the summary cards and the health callout. */
export function TermsSummaryIcon({ id, className }: { id: TermsSummaryIconId; className?: string }) {
  return <Image src={TERMS_SUMMARY_ICONS[id]} width={256} height={270} alt="" className={cn("object-contain", className)} />;
}
