import { NextResponse } from "next/server";
import { getSupabaseBaseUrl, getSupabaseRequestInit } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    token,
    email,
    penName,
    reasons,
    otherReason,
    appImpression,
    note,
  } = body ?? {};

  const normalizedEmail = typeof email === "string" ? email.trim() : "";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !token ||
    !normalizedEmail ||
    !emailPattern.test(normalizedEmail) ||
    !Array.isArray(reasons) ||
    reasons.length === 0 ||
    !appImpression
  ) {
    return NextResponse.json(
      { ok: false, error: "必須項目が不足しています。" },
      { status: 400 }
    );
  }

  const normalizedReasons = reasons
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  const trimmedOtherReason =
    typeof otherReason === "string" ? otherReason.trim() : "";
  if (trimmedOtherReason) {
    normalizedReasons.push(`その他: ${trimmedOtherReason}`);
  }
  const motive =
    normalizedReasons.length > 0 ? normalizedReasons.join(" / ") : null;

  const baseUrl = getSupabaseBaseUrl();
  const headers = {
    ...getSupabaseRequestInit(),
    Prefer: "return=representation",
  };

  const response = await fetch(
    `${baseUrl}/rest/v1/support_entries?token=eq.${encodeURIComponent(
      token
    )}&answered_at=is.null`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        answered_at: new Date().toISOString(),
        email: normalizedEmail,
        pen_name: typeof penName === "string" ? penName.trim() || null : null,
        discovery: null,
        motive,
        impression: appImpression,
        note: typeof note === "string" ? note.trim() || null : null,
      }),
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: "保存に失敗しました。" },
      { status: 500 }
    );
  }

  const updated = (await response.json()) as Array<{ token: string }>;
  if (updated.length === 0) {
    return NextResponse.json(
      { ok: false, error: "このアンケートは回答済みです。" },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
