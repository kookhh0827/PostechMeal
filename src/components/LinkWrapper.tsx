// src/components/LinkWrapper.tsx

'use client';

import Link, { LinkProps } from 'next/link';
import { useState } from 'react';

const LinkWrapper: React.FC<LinkProps & { children: React.ReactNode }> = ({
  children,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <>
      <Link {...props} onClick={handleClick}>
        {children}
      </Link>
      {isLoading && (
        <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white bg-opacity-50 z-50'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      )}
    </>
  );
};

export default LinkWrapper;
