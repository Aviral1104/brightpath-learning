import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (projectId ? `https://${projectId}.supabase.co` : undefined);
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isBackendConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const BACKEND_CONFIG_ERROR_MESSAGE =
  'Backend configuration is missing in this build. Please republish and ensure Lovable Cloud envs are available.';

let singleton: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (!isBackendConfigured) {
    throw new Error(BACKEND_CONFIG_ERROR_MESSAGE);
  }

  if (!singleton) {
    singleton = createClient<Database>(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return singleton;
}
