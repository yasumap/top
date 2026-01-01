import ThanksClient from "../thanks-client";
import type { SupportEntry } from "@/lib/supabase";

const previewEntry: SupportEntry = {
  token: "preview",
  created_at: new Date().toISOString(),
  answered_at: null,
  email: "",
  pen_name: "",
  discovery: "",
  motive: "",
  impression: "",
  note: "",
};

type ThanksPreviewPageProps = {
  searchParams?: { done?: string };
};

export default function ThanksPreviewPage({
  searchParams,
}: ThanksPreviewPageProps) {
  const previewDone = searchParams?.done === "1";
  return (
    <ThanksClient
      token="preview"
      entry={previewEntry}
      preview
      previewDone={previewDone}
    />
  );
}
