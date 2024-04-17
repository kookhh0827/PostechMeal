// @/components/Header.tsx

import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';

import LatestNotice from '@/components/LatestNotice';
import LinkWrapper from '@/components/LinkWrapper';
import LogoutButton from '@/components/LogoutButton';

export const revalidate = 0;

const Header: React.FC = async () => {
  const supabase = createClient();

  const { data: userData } = await supabase
    .from('accounts')
    .select('nickname')
    .maybeSingle();

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <Link href='/'>
          <h1 className='text-2xl font-bold'>포스텍 식당정보</h1>
        </Link>
        <div>
          {userData?.nickname ? (
            <div className='flex items-center space-x-4'>
              <span className='text-gray-700'>{userData.nickname}</span>
              <LogoutButton></LogoutButton>
            </div>
          ) : (
            <div className='space-x-4'>
              <LinkWrapper href='/login'>
                <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                  로그인
                </button>
              </LinkWrapper>
              <LinkWrapper href='/signup'>
                <button className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
                  회원가입
                </button>
              </LinkWrapper>
            </div>
          )}
        </div>
      </div>
      <LatestNotice></LatestNotice>
    </div>
  );
};

export default Header;
