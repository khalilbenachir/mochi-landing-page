import Image from "next/image";
import { cn } from "@/lib/utils";
import { TERMS_SUMMARY_ICONS, type TermsSummaryIconId } from "../content/terms";

/** Decorative Mochi icons (ChatGPT, from the app's Mochi) for the summary cards and the health callout. `alt` is passed in because the callout renders inside a client component. */
export function TermsSummaryIcon({ id, alt, className }: { id: TermsSummaryIconId; alt: string; className?: string }) {
  return <Image src={TERMS_SUMMARY_ICONS[id]} width={256} height={270} alt={alt} aria-hidden="true" className={cn("object-contain", className)} />;
}
