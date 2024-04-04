import { createClient } from '@supabase/supabase-js';

import { Database } from '@/lib/database.types';

export function createPrivateClient() {
  return createClient<Database>(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PRIVATE_SUPABASE_SERVICE_KEY!
  );
}
