// @/components/ReviewSection.tsx

'use client';

import { revalidatePath } from 'next/cache';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';

const ReviewSection = ({ orderItemId }: { orderItemId: number }) => {
  const [refreshReviews, setRefreshReviews] = useState(false);
  const pathname = usePathname();

  const handleReviewSubmit = () => {
    setRefreshReviews(!refreshReviews);
    revalidatePaths();
  };

  const revalidatePaths = () => {
    revalidatePath(pathname);
    revalidatePath('/restaurant/[id]', 'page');
  };

  return (
    <div>
      <ReviewForm
        orderItemId={orderItemId}
        onReviewSubmit={handleReviewSubmit}
      />
      <div className='mb-10'></div>
      <ReviewList
        orderItemId={orderItemId}
        refreshReviews={refreshReviews}
        onReviewEdit={revalidatePaths}
        onReviewDelete={revalidatePaths}
      />
    </div>
  );
};

export default ReviewSection;
