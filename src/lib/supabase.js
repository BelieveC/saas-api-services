import { createClient } from "@supabase/supabase-js";

if (!process.env.DB_URL) {
  throw new Error("Missing env.DB_URL");
}

if (!process.env.SUPABASE_KEY) {
  throw new Error("Missing env.SUPABASE_KEY");
}

export const supabase = createClient(
  process.env.DB_URL,
  process.env.SUPABASE_KEY
);
