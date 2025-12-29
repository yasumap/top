"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SupportEntry } from "@/lib/supabase";

type SurveyState = {
  penName: string;
  penNamePrivate: boolean;
  reasons: string[];
  otherReason: string;
  appImpression: string;
  note: string;
};

type SubmitState = "idle" | "submitting" | "submitted" | "skipped" | "error";

type ThanksClientProps = {
  token: string;
  entry: SupportEntry;
  preview?: boolean;
  previewDone?: boolean;
};

const reasonOptions = [
  "このサービスが広まってほしいと思った",
  "学生の取り組みを応援したいと思った",
  "自分自身もベンチに困った経験があった",
  "コンセプトに共感した",
  "実際に使って役に立ったから",
  "その他",
];

const appImpressionOptions = [
  "とても使いやすかった",
  "まあ使いやすかった",
  "使いづらかった",
  "使っていない",
];

const resultMessages: Record<string, string> = {
  service: "広がりを願う想い、しっかり受け取っています。",
  team: "応援の気持ちが励みになります。小さく前へ進みます。",
  empathy: "同じ体験を感じてくださって、心強いです。",
  concept: "考え方に共感してくださる気持ちを大切にします。",
  product: "実感の声が、次の改善のヒントになります。",
  default: "静かな応援が、次の一歩につながります。",
};

export default function ThanksClient({
  token,
  entry,
  preview = false,
  previewDone = false,
}: ThanksClientProps) {
  const isLocked = Boolean(entry.answered_at);
  const parsedReasons = (entry.motive ?? "")
    .split(" / ")
    .map((item) => item.trim())
    .filter(Boolean);
  const otherReasonItem = parsedReasons.find((item) =>
    item.startsWith("その他:")
  );
  const otherReason = otherReasonItem
    ? otherReasonItem.replace(/^その他:\s*/, "")
    : "";
  const baseReasons = parsedReasons.filter(
    (item) => !item.startsWith("その他:")
  );
  const initialReasons = otherReason
    ? Array.from(new Set([...baseReasons, "その他"]))
    : baseReasons;

  const [survey, setSurvey] = useState<SurveyState>({
    penName: entry.pen_name ?? "",
    penNamePrivate: false,
    reasons: initialReasons,
    otherReason,
    appImpression: entry.impression ?? "",
    note: entry.note ?? "",
  });
  const [status, setStatus] = useState<SubmitState>(
    previewDone ? "submitted" : isLocked ? "submitted" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const resultMessage = useMemo(() => {
    if (survey.reasons.includes("実際に使って役に立ったから")) {
      return resultMessages.product;
    }
    if (survey.reasons.includes("コンセプトに共感した")) {
      return resultMessages.concept;
    }
    if (survey.reasons.includes("学生の取り組みを応援したいと思った")) {
      return resultMessages.team;
    }
    if (survey.reasons.includes("自分自身もベンチに困った経験があった")) {
      return resultMessages.empathy;
    }
    if (survey.reasons.includes("このサービスが広まってほしいと思った")) {
      return resultMessages.service;
    }
    return resultMessages.default;
  }, [survey.reasons]);

  const handleChange = (
    key: keyof SurveyState,
    value: string | boolean
  ): void => {
    setSurvey((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (preview) {
      setStatus("submitted");
      return;
    }
    setStatus("submitting");
    setErrorMessage("");

    try {
      const normalizedNote =
        typeof survey.note === "string" ? survey.note.trim() : "";
      const noteWithPreference = survey.penNamePrivate
        ? normalizedNote
          ? `${normalizedNote}\n（ペンネーム非公開希望）`
          : "（ペンネーム非公開希望）"
        : normalizedNote;

      const response = await fetch("/api/thanks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          penName: survey.penName,
          reasons: survey.reasons,
          otherReason: survey.otherReason,
          appImpression: survey.appImpression,
          note: noteWithPreference,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("このアンケートはすでに回答済みです。");
        }
        throw new Error("送信に失敗しました。時間をおいてお試しください。");
      }

      setStatus("submitted");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "送信に失敗しました。時間をおいてお試しください。";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  const isComplete = survey.reasons.length > 0 && survey.appImpression;

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

      <main className="relative mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 pb-24 pt-16">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">
            Thanks
          </p>
          <h1 className="text-[clamp(2rem,6vw,3rem)] leading-tight text-[#fffaf3] drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
            ご支援ありがとうございます
          </h1>
          <p className="max-w-2xl text-[clamp(1rem,3.4vw,1.1rem)] leading-7 text-white/85 drop-shadow-[0_8px_22px_rgba(0,0,0,0.3)]">
            やすまっぷの活動は、みなさまからの応援で成り立っています。
            <br />
            これからの運用をより良くするため、感想をお聞かせいただけると幸いです。
          </p>
        </header>

        <section className="rounded-3xl border border-white/12 bg-white/10 px-6 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur">
          <div className="flex flex-col gap-3 text-sm text-white/70">
            {preview && (
              <p className="text-[#ffd1a1]">
                プレビュー表示中です。送信は行われません。
              </p>
            )}
            <p>全4問です。ご回答よろしくお願いします！(所要時間1分程度)</p>
          </div>

          {status === "submitted" || status === "skipped" ? (
            <div className="mt-8 space-y-5">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-6">
                <h2 className="mt-3 text-xl font-semibold text-white">
                  {survey.penName
                    ? `${survey.penName}さん、ありがとうございました。`
                    : "ありがとうございました。"}
                </h2>
                {status === "submitted" && (
                  <>
                    <p className="mt-3 text-sm tracking-[0.25em] text-white/60">
                      支援タイプ
                    </p>
                    <p className="mt-3 text-base leading-7 text-white/80">
                      {resultMessage}
                    </p>
                  </>
                )}
                {status === "skipped" && (
                  <p className="mt-3 text-base leading-7 text-white/80">
                    みなさまのご支援が、活動の大きな励みになります。
                  </p>
                )}
              </div>

              {(status === "submitted" || isLocked) && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-sm text-white/80">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    回答内容
                  </p>
                  <dl className="mt-4 space-y-3">
                    <div>
                      <dt className="text-white/60">ペンネーム</dt>
                      <dd>{survey.penName || "未記入"}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">ペンネーム公開</dt>
                      <dd>
                        {survey.penNamePrivate ? "非公開希望" : "公開可"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/60">支援理由</dt>
                      <dd>
                        {survey.reasons.length > 0
                          ? survey.reasons
                              .map((reason) =>
                                reason === "その他" && survey.otherReason
                                  ? `その他: ${survey.otherReason}`
                                  : reason
                              )
                              .join(" / ")
                          : "未記入"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/60">利用した印象</dt>
                      <dd>{survey.appImpression || "未記入"}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">ひとこと</dt>
                      <dd>{survey.note || "未記入"}</dd>
                    </div>
                  </dl>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/80 px-5 py-2 text-sm font-semibold text-[#6b4b3a] transition hover:bg-white"
                >
                  トップへ戻る
                </Link>
                {status === "skipped" && !isLocked && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    onClick={() => setStatus("idle")}
                  >
                    アンケートに回答する
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-16" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-end gap-3">
                  <label className="text-base font-semibold text-white">
                    ペンネーム
                  </label>
                  <span className="text-xs text-white/60">任意</span>
                  <span className="ml-auto text-xs text-white/60">
                    今後のSNS上の活動報告で、ペンネームをご紹介する場合があります。
                  </span>
                </div>
                <input
                  type="text"
                  value={survey.penName}
                  onChange={(event) =>
                    handleChange("penName", event.target.value)
                  }
                  placeholder="例：やすみん"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                />
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={survey.penNamePrivate}
                    onChange={(event) =>
                      handleChange("penNamePrivate", event.target.checked)
                    }
                    className="sr-only"
                  />
                  <span className="flex h-4 w-4 items-center justify-center rounded border border-white/50 bg-white/10 text-[11px] font-semibold text-white">
                    {survey.penNamePrivate ? "✓" : ""}
                  </span>
                  <span>
                    ペンネームを非公開にする
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <p className="text-base font-semibold text-white">
                    ご支援いただいた理由（複数回答可）
                  </p>
                  <span className="text-xs text-white/60">必須</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {reasonOptions.map((option) => {
                    const isChecked = survey.reasons.includes(option);
                    return (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                          isChecked
                            ? "border-white/70 bg-white/20 text-white"
                            : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="reasons"
                          value={option}
                          checked={isChecked}
                          onChange={(event) => {
                            const checked = event.target.checked;
                            setSurvey((prev) => {
                              const next = checked
                                ? [...prev.reasons, option]
                                : prev.reasons.filter((item) => item !== option);
                              return {
                                ...prev,
                                reasons: next,
                                otherReason:
                                  option === "その他" && !checked
                                    ? ""
                                    : prev.otherReason,
                              };
                            });
                          }}
                          className="hidden"
                        />
                        <span className="mt-0.5 h-3 w-3 rounded border border-white/50 bg-white/20">
                          <span
                            className={`block h-full w-full rounded ${
                              isChecked ? "bg-white" : "bg-transparent"
                            }`}
                          />
                        </span>
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
                {survey.reasons.includes("その他") && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={survey.otherReason}
                      onChange={(event) =>
                        handleChange("otherReason", event.target.value)
                      }
                      placeholder="その他（自由記述・未入力でも送信可能）"
                      className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <p className="text-base font-semibold text-white">
                    やすまっぷを使ってみた印象
                  </p>
                  <span className="text-xs text-white/60">必須</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {appImpressionOptions.map((option) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                        survey.appImpression === option
                          ? "border-white/70 bg-white/20 text-white"
                          : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="appImpression"
                        value={option}
                        checked={survey.appImpression === option}
                        onChange={() => handleChange("appImpression", option)}
                        className="hidden"
                      />
                      <span className="h-2.5 w-2.5 rounded-full border border-white/50 bg-white/20">
                        <span
                          className={`block h-full w-full rounded-full ${
                            survey.appImpression === option
                              ? "bg-white"
                              : "bg-transparent"
                          }`}
                        />
                      </span>
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <p className="text-base font-semibold text-white">
                    自由記述（任意）
                  </p>
                  <span className="text-xs text-white/60">任意</span>
                </div>
                <textarea
                  value={survey.note}
                  onChange={(event) => handleChange("note", event.target.value)}
                  rows={4}
                  placeholder="例：改善してほしい点や、新たなサービス案など。"
                  className="w-full resize-none rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-[#ffd1a1]">{errorMessage}</p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={!isComplete || status === "submitting"}
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/85 px-6 py-3 text-sm font-semibold text-[#6b4b3a] shadow-[0_14px_32px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "送信中..." : "回答を送る"}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                  onClick={() => setStatus("skipped")}
                >
                  今回はスキップ
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
