import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY, SUPABASE_ROLE_KEY} from "./envs";

if (!SUPABASE_URL || !SUPABASE_ROLE_KEY) {
  throw new Error(
    "Supabase URL or Key is not defined in environment variables",
  );
}
export const supabase = createClient(SUPABASE_URL, SUPABASE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
});
