type SupabaseEnv = {
  url: string;
  serviceRoleKey: string;
};

export type SupportEntry = {
  token: string;
  created_at: string;
  answered_at: string | null;
  pen_name: string | null;
  discovery: string | null;
  motive: string | null;
  impression: string | null;
  note: string | null;
};

const SUPABASE_HEADERS = {
  "Content-Type": "application/json",
} as const;

function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase環境変数が未設定です。");
  }

  return { url, serviceRoleKey };
}

export function getSupabaseRequestInit() {
  const { serviceRoleKey } = getSupabaseEnv();

  return {
    ...SUPABASE_HEADERS,
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
}

export function getSupabaseBaseUrl() {
  const { url } = getSupabaseEnv();
  return url.replace(/\/$/, "");
}

export async function fetchSupportEntry(
  token: string
): Promise<SupportEntry | null> {
  const baseUrl = getSupabaseBaseUrl();
  const headers = getSupabaseRequestInit();

  const response = await fetch(
    `${baseUrl}/rest/v1/support_entries?select=token,created_at,answered_at,pen_name,discovery,motive,impression,note&token=eq.${encodeURIComponent(
      token
    )}&limit=1`,
    {
      headers,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Supabaseの取得に失敗しました。");
  }

  const data = (await response.json()) as SupportEntry[];
  return data[0] ?? null;
}
