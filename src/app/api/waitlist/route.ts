import { NextResponse } from "next/server";
import { joinWaitlist } from "@/features/waitlist/content/waitlist";

export async function POST(request: Request) {
  const input = await request.json().catch(() => null);
  const { status, body } = await joinWaitlist(input, { url: process.env.WAITLIST_SUPABASE_URL, key: process.env.WAITLIST_SUPABASE_KEY });
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
