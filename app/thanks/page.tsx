import Image from "next/image";
import Link from "next/link";
import { fetchSupportEntry } from "@/lib/supabase";
import ThanksClient from "./thanks-client";

type ThanksPageProps = {
  searchParams?: { t?: string };
};

async function loadSupportEntry(token: string) {
  try {
    const entry = await fetchSupportEntry(token);
    return { entry, failed: false };
  } catch {
    return { entry: null, failed: true };
  }
}

function GateMessage({
  title,
  description,
}: {
  title: React.ReactNode;
  description: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 -z-10 bg-[#CBA1A4]">
        <Image
          src="/夕日のベンチ_LP用背景画像.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "left bottom" }}
        />
        <div className="absolute inset-0 bg-black/24" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 pb-16 pt-24 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-white/70">
          Thanks
        </p>
        <h1 className="text-[clamp(1.9rem,5vw,2.6rem)] leading-tight text-[#fffaf3] drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
          {title}
        </h1>
        <p className="text-base leading-7 text-white/80 drop-shadow-[0_8px_22px_rgba(0,0,0,0.3)]">
          {description}
        </p>
        <div className="mt-4 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/80 px-6 py-3 text-sm font-semibold text-[#6b4b3a] transition hover:bg-white"
          >
            トップへ戻る
          </Link>
        </div>
      </main>
    </div>
  );
}

export default async function ThanksPage({ searchParams }: ThanksPageProps) {
  const token = typeof searchParams?.t === "string" ? searchParams.t : "";

  if (!token) {
    return (
      <GateMessage
        title={
          <>
            このページは支援者の方への
            <br />
            Thanksページです
          </>
        }
        description="ご支援の後お届けする専用URLからアクセスしてください"
      />
    );
  }

  const { entry, failed } = await loadSupportEntry(token);

  if (failed) {
    return (
      <GateMessage
        title="読み込みに失敗しました"
        description="時間をおいてもう一度お試しください。"
      />
    );
  }

  if (!entry) {
    return (
      <GateMessage
        title="URLを確認してください"
        description="このURLは無効か、期限切れの可能性があります。"
      />
    );
  }

  return <ThanksClient token={token} entry={entry} />;
}
