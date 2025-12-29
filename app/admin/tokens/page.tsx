"use client";

import { useEffect, useMemo, useState } from "react";

type TokenItem = {
  token: string;
  createdAt: string;
};

export default function AdminTokensPage() {
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const origin = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return window.location.origin;
  }, []);

  const handleGenerate = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/tokens", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok || !data?.token) {
        throw new Error("トークンの発行に失敗しました。");
      }

      setTokens((prev) => [
        { token: data.token as string, createdAt: data.createdAt as string },
        ...prev,
      ]);
      setStatus("idle");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "トークンの発行に失敗しました。";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      setStatus("loading");
      setErrorMessage("");

      try {
        const response = await fetch("/api/admin/tokens", {
          method: "GET",
        });
        const data = await response.json();

        if (!response.ok || !Array.isArray(data?.entries)) {
          throw new Error("トークン一覧の取得に失敗しました。");
        }

        const mapped = data.entries.map(
          (entry: { token: string; created_at: string }) => ({
            token: entry.token,
            createdAt: entry.created_at,
          })
        );
        setTokens(mapped);
        setStatus("idle");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "トークン一覧の取得に失敗しました。";
        setErrorMessage(message);
        setStatus("error");
      }
    };

    fetchTokens();
  }, []);

  const copyText = async (value: string, token: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedToken(token);
      window.setTimeout(() => setCopiedToken(null), 1500);
    } catch {
      setErrorMessage("コピーに失敗しました。");
    }
  };

  const formatDate = (value: string) => {
    if (!value) {
      return "";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString("ja-JP");
  };

  return (
    <div className="min-h-screen bg-[#0f0a1d] px-6 py-16 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            Admin
          </p>
          <h1 className="text-3xl font-semibold">トークン発行</h1>
          <p className="text-base text-white/70">
            ボタンを押すと、支援者専用URLに使うトークンを発行します。
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={status === "loading"}
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/85 px-6 py-3 text-sm font-semibold text-[#6b4b3a] shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "発行中..." : "トークンを発行する"}
          </button>

          {errorMessage && (
            <p className="mt-4 text-sm text-[#ffd1a1]">{errorMessage}</p>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">発行済みトークン</h2>
          {tokens.length === 0 ? (
            <p className="text-sm text-white/60">
              {status === "loading"
                ? "読み込み中..."
                : "まだ発行されていません。"}
            </p>
          ) : (
            <div className="space-y-4">
              {tokens.map((item, index) => {
                const url = origin
                  ? `${origin}/thanks?t=${item.token}`
                  : `/thanks?t=${item.token}`;
                return (
                  <div
                    key={`${item.token}-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                      Token
                    </p>
                    <p className="mt-2 break-all font-mono text-sm text-white">
                      {item.token}
                    </p>
                    <p className="mt-2 text-xs text-white/50">
                      発行日時: {formatDate(item.createdAt)}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 transition hover:bg-white/15"
                        onClick={() => copyText(item.token, item.token)}
                      >
                        トークンをコピー
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 transition hover:bg-white/15"
                        onClick={() => copyText(url, item.token)}
                      >
                        URLをコピー
                      </button>
                      {copiedToken === item.token && (
                        <span className="text-xs text-[#ffd1a1]">
                          コピーしました
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-white/50">URL</p>
                    <p className="break-all text-sm text-white/85">{url}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
