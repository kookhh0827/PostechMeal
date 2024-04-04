'use client';
// @/components/Header.tsx

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

const Header: React.FC = () => {
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (!authError && authData.user) {
        const { data: userData, error: userError } = await supabase
          .from('accounts')
          .select('nickname')
          .maybeSingle();

        if (!userError && userData) {
          setNickname(userData.nickname);
        }
      }
    };

    fetchUser();
  }, []);

  const handleSignout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setNickname(null);
    }
  };

  return (
    <div className='flex justify-between items-center mb-8'>
      <Link href='/'>
        <h1 className='text-2xl font-bold'>포스텍 식당정보</h1>
      </Link>
      <div>
        {nickname ? (
          <div className='flex items-center space-x-4'>
            <span className='text-gray-700'>{nickname}</span>
            <button
              className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
              onClick={handleSignout}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className='space-x-4'>
            <Link href='/login'>
              <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                로그인
              </button>
            </Link>
            <Link href='/signup'>
              <button className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
                회원가입
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
