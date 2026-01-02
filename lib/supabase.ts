type SupabaseEnv = {
  url: string;
  serviceRoleKey: string;
};

export type SupportEntry = {
  id: number;
  created_at: string;
  email: string | null;
  pen_name: string | null;
  pen_name_public: boolean | null;
  motive: string | null;
  motive_other: string | null;
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
