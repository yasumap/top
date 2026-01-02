"use client";

export default function AdminTokensPage() {
  return (
    <div className="min-h-screen bg-[#0f0a1d] px-6 py-16 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            Admin
          </p>
          <h1 className="text-3xl font-semibold">トークン発行</h1>
          <p className="text-base text-white/70">
            現在はトークン運用を停止しています。
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 text-sm text-white/70">
          トークンを使わず、誰でも回答できるアンケート運用に切り替えています。
        </section>
      </div>
    </div>
  );
}
