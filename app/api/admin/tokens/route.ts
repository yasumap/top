import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  createSupportEntry,
  fetchRecentSupportEntries,
} from "@/lib/supabase";

export async function GET() {
  try {
    const entries = await fetchRecentSupportEntries(20);
    return NextResponse.json({ ok: true, entries });
  } catch {
    return NextResponse.json(
      { ok: false, error: "トークン一覧の取得に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const token = crypto.randomBytes(16).toString("hex");
    const entry = await createSupportEntry(token);

    return NextResponse.json({
      ok: true,
      token: entry.token,
      createdAt: entry.created_at,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "トークンの発行に失敗しました。" },
      { status: 500 }
    );
  }
}
