import { Metadata } from 'next';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main>
      <section className='bg-white'>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
          <RiAlarmWarningFill
            size={60}
            className='drop-shadow-glow animate-flicker text-red-500'
          />
          <h1 className='mt-8 text-3xl md:text-4xl'>
            페이지를 찾을 수 없습니다.
          </h1>
          <a href='/'>메인 페이지로 돌아가기</a>
        </div>
      </section>
    </main>
  );
}
