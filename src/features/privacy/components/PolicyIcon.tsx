import { ChartNoAxesColumnIncreasing, CloudUpload, CreditCard, FileText, LockKeyhole, Mail, ShieldCheck, Smartphone, UsersRound } from "lucide-react";
import type { PolicySectionId } from "../content/policy";

const ICONS = {
  collect: FileText,
  device: Smartphone,
  analytics: ChartNoAxesColumnIncreasing,
  backup: CloudUpload,
  subscriptions: CreditCard,
  rights: ShieldCheck,
  children: UsersRound,
  contact: Mail,
} as const;

export function PolicyIcon({ id, className }: { id: PolicySectionId | "lock"; className?: string }) {
  const Icon = id === "lock" ? LockKeyhole : ICONS[id];
  return <Icon className={className} strokeWidth={2.25} aria-hidden="true" />;
}
