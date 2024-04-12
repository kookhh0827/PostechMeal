// @/components/Header.tsx

import { JSDOM } from 'jsdom';
import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';

import LinkWrapper from '@/components/LinkWrapper';
import LogoutButton from '@/components/LogoutButton';

const Header: React.FC = async () => {
  const supabase = createClient();

  const { data: userData } = await supabase
    .from('accounts')
    .select('nickname')
    .maybeSingle();

  // Fetch the HTML content from the URL
  const response = await fetch('https://dining.postech.ac.kr/notice/');
  const htmlContent = await response.text();

  // Extract the most recent article's title from the HTML content
  const latestArticle = extractLatestArticleTitle(htmlContent);

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
      {latestArticle && (
        <div className='bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-4 text-xs md:text-base'>
          (복지회 최신 공지사항){' '}
          <a
            href={'https://dining.postech.ac.kr' + latestArticle.link}
            target='blank'
          >
            {latestArticle.title}
          </a>
        </div>
      )}
    </div>
  );
};

// Function to extract the latest article's title from the HTML content
const extractLatestArticleTitle = (htmlContent: string) => {
  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;
  const latestArticle = doc.querySelector(
    'tr:not(.kboard-list-notice) .kboard-list-title a'
  );

  if (latestArticle) {
    const title = latestArticle.textContent?.trim() || '';
    const link = latestArticle.getAttribute('href') || '';
    return { title, link };
  }

  return null;
};

export default Header;
