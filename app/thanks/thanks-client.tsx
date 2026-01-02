"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type SurveyState = {
  email: string;
  penName: string;
  penNamePrivate: boolean;
  reasons: string[];
  otherReason: string;
  appImpression: string;
  note: string;
};

type SubmitState = "idle" | "submitting" | "submitted" | "skipped" | "error";

type ThanksClientProps = {
  preview?: boolean;
  previewDone?: boolean;
};

const reasonOptions = [
  "このサービスが広まってほしいと思った",
  "学生の取り組みを応援したいと思った",
  "自分自身もベンチに困った経験があった",
  "コンセプトに共感した",
  "実際に使って役に立った",
  "その他",
];

const appImpressionOptions = [
  "とても使いやすかった",
  "まあ使いやすかった",
  "使いづらかった",
  "使っていない",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ThanksClient({
  preview = false,
  previewDone = false,
}: ThanksClientProps) {
  const [survey, setSurvey] = useState<SurveyState>({
    email: "",
    penName: "",
    penNamePrivate: false,
    reasons: [],
    otherReason: "",
    appImpression: "",
    note: "",
  });
  const [status, setStatus] = useState<SubmitState>(
    previewDone ? "submitted" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const trimmedEmail = survey.email.trim();
  const isEmailValid = emailPattern.test(trimmedEmail);
  const showEmailFormatError = trimmedEmail.length > 0 && !isEmailValid;
  const showEmailRequiredError = status === "error" && trimmedEmail.length === 0;

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
    if (!trimmedEmail) {
      setErrorMessage("メールアドレスを入力してください。");
      setStatus("error");
      return;
    }
    if (!isEmailValid) {
      setErrorMessage("メールアドレスの形式を確認してください。");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/thanks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          penName: survey.penName,
          penNamePublic: !survey.penNamePrivate,
          reasons: survey.reasons,
          otherReason: survey.otherReason,
          appImpression: survey.appImpression,
          note: survey.note,
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

  const isComplete =
    survey.reasons.length > 0 &&
    survey.appImpression &&
    trimmedEmail.length > 0 &&
    isEmailValid;
  const showFormIntro =
    status === "idle" || status === "submitting" || status === "error";

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

      <main
        className={`relative mx-auto flex min-h-screen max-w-4xl flex-col px-6 pb-24 pt-16 ${
          status === "submitted" || status === "skipped" ? "gap-6" : "gap-10"
        }`}
      >
        <header className="space-y-8">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">
            Thanks
          </p>
          <h1 className="text-[clamp(2rem,6vw,3rem)] leading-tight text-[#fffaf3] drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
            ご覧いただきありがとうございます
          </h1>
          <p className="max-w-2xl text-[clamp(1rem,3.4vw,1.1rem)] leading-7 text-white/85 drop-shadow-[0_8px_22px_rgba(0,0,0,0.3)]">
            現在決済機能を実装中です。完成までもうしばらくお待ちください。
            <br />
            今後より良いものにするため、皆様のお声をお聞かせいただけると幸いです。
          </p>
        </header>

        <section className="rounded-3xl border border-white/12 bg-white/10 px-6 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur">
          {showFormIntro && (
            <div className="flex flex-col gap-3 text-sm text-white/70">
              {preview && (
                <p className="text-[#ffd1a1]">
                  プレビュー表示中です。送信は行われません。
                </p>
              )}
              <p>
                最後に1分ほどお時間をいただけましたら、皆様のご意見をお聞かせください。
              </p>
              <p>スキップも可能です。</p>
            </div>
          )}

          {status === "submitted" || status === "skipped" ? (
            <div className="mt-4 space-y-5">
              <div className="space-y-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-6">
                <h2 className="text-xl font-semibold text-white">
                  {survey.penName
                    ? `${survey.penName}さん、ありがとうございました。`
                    : "ありがとうございました。"}
                </h2>
                {status === "submitted" && (
                  <p className="text-base leading-7 text-white/80">
                    ご協力心から感謝いたします。
                    <br />
                    これからも私たちの活動を温かく見守っていただけますと幸いです。
                  </p>
                )}
                {status === "skipped" && (
                  <p className="text-base leading-7 text-white/80">
                    みなさまのご支援が、活動の大きな励みになります。
                  </p>
                )}
              </div>

              {status === "submitted" && (
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
                      <dt className="text-white/60">メールアドレス</dt>
                      <dd>{survey.email || "未記入"}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">共感したところ</dt>
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
                {status === "skipped" && (
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
              <div className="space-y-2">
                <div className="flex flex-wrap items-end gap-3">
                  <label className="text-base font-semibold text-white">
                    ペンネーム
                  </label>
                  <span className="text-xs text-white/60">任意</span>
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

              <div className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <label className="text-base font-semibold text-white">
                    メールアドレス
                  </label>
                  <span className="text-xs text-white/60">必須</span>
                </div>
                <input
                  type="email"
                  required
                  value={survey.email}
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                  placeholder="example@yasumap.jp"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                  aria-invalid={showEmailFormatError || showEmailRequiredError}
                />
                {showEmailRequiredError && (
                  <p className="text-xs text-[#ffd1a1]">
                    メールアドレスを入力してください。
                  </p>
                )}
                {showEmailFormatError && (
                  <p className="text-xs text-[#ffd1a1]">
                    メールアドレスの形式を確認してください。
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <p className="text-base font-semibold text-white">
                    この活動に共感できる部分（複数回答可）
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
                  placeholder="例：改善してほしい点、新たなサービス案など"
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
