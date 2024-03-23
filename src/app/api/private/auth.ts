'use server';

import { createPrivateClient } from '@/lib/supabase/private';

export async function checkNicknameExists(nickname: string): Promise<boolean> {
  const supabase = createPrivateClient();

  const { data, error } = await supabase
    .from('accounts')
    .select('nickname')
    .eq('nickname', nickname)
    .limit(1);

  if (error) {
    throw new Error(
      'An error occurred while checking the nickname. Please try again.'
    );
  }

  return data !== null && data.length > 0;
}
