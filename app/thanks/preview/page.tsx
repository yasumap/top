import ThanksClient from "../thanks-client";

type ThanksPreviewPageProps = {
  searchParams?: { done?: string };
};

export default function ThanksPreviewPage({
  searchParams,
}: ThanksPreviewPageProps) {
  const previewDone = searchParams?.done === "1";
  return <ThanksClient preview previewDone={previewDone} />;
}
