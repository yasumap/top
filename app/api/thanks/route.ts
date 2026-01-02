import { NextResponse } from "next/server";
import { getSupabaseBaseUrl, getSupabaseRequestInit } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      penName,
      penNamePublic,
      reasons,
      otherReason,
      appImpression,
      note,
    } = body ?? {};

    const normalizedEmail = typeof email === "string" ? email.trim() : "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
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
    const motive =
      normalizedReasons.length > 0 ? normalizedReasons.join(" / ") : null;
    const trimmedOtherReason =
      typeof otherReason === "string" ? otherReason.trim() : "";
    const motiveOther = trimmedOtherReason || null;
    const trimmedPenName = typeof penName === "string" ? penName.trim() : "";
    const hasPenName = trimmedPenName.length > 0;
    const penNamePublicValue =
      hasPenName && typeof penNamePublic === "boolean"
        ? penNamePublic
        : null;

    let baseUrl: string;
    let headers: Record<string, string>;
    try {
      baseUrl = getSupabaseBaseUrl();
      headers = {
        ...getSupabaseRequestInit(),
        Prefer: "return=representation",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Supabase設定に失敗しました。";
      console.error("Supabase env error:", message, {
        hasUrl: Boolean(process.env.SUPABASE_URL),
        hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      });
      return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }

    const response = await fetch(`${baseUrl}/rest/v1/support_entries`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: normalizedEmail,
        pen_name: hasPenName ? trimmedPenName : null,
        pen_name_public: penNamePublicValue,
        motive,
        motive_other: motiveOther,
        impression: appImpression,
        note: typeof note === "string" ? note.trim() || null : null,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase error:", errorText);
      return NextResponse.json(
        {
          ok: false,
          error:
            process.env.NODE_ENV !== "production" && errorText
              ? errorText
              : "保存に失敗しました。",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { ok: false, error: "保存に失敗しました。" },
      { status: 500 }
    );
  }
}
