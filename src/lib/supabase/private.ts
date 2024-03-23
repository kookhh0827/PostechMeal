import { createClient } from '@supabase/supabase-js';

export function createPrivateClient() {
  return createClient(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PRIVATE_SUPABASE_SERVICE_KEY!
  );
}
