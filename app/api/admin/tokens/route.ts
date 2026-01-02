import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "トークン発行の運用は停止しています。" },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "トークン発行の運用は停止しています。" },
    { status: 410 }
  );
}
