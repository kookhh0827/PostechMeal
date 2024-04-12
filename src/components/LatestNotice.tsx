// @/components/LatestNotice.tsx

import { JSDOM } from 'jsdom';
import { cache } from 'react';

const LatestNotice: React.FC = async () => {
  const latestArticle = await extractLatestArticleTitle();

  return (
    latestArticle && (
      <div className='bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-4 text-xs md:text-base'>
        (복지회 최신 공지사항){' '}
        <a
          href={'https://dining.postech.ac.kr' + latestArticle.link}
          target='blank'
        >
          {latestArticle.title}
        </a>
      </div>
    )
  );
};

const extractLatestArticleTitle = cache(async () => {
  const response = await fetch('https://dining.postech.ac.kr/notice/', {
    cache: 'force-cache',
  });
  const htmlContent = await response.text();
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
});

export default LatestNotice;
