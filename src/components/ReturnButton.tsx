'use client';
// @/components/ReturnButton.tsx

import { useRouter } from 'next/navigation';

const ReturnButton: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <button
      className='mb-4 px-4 py-2 font-semibold text-blue-500 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent focus:outline-none'
      onClick={handleClick}
    >
      뒤로가기
    </button>
  );
};

export default ReturnButton;
