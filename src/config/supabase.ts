import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./envs";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    "Supabase URL or Key is not defined in environment variables",
  );
}
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
