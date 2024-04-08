'use client';
// @/components/LogoutButton.tsx

import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const handleSignout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button
      className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
      onClick={handleSignout}
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;
