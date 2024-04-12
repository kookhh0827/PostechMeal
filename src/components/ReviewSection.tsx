// @/components/ReviewSection.tsx

'use client';

import { useState } from 'react';

import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';

const ReviewSection = ({ orderItemId }: { orderItemId: number }) => {
  const [refreshReviews, setRefreshReviews] = useState(false);

  const handleReviewSubmit = () => {
    setRefreshReviews(!refreshReviews);
  };

  return (
    <div>
      <ReviewForm
        orderItemId={orderItemId}
        onReviewSubmit={handleReviewSubmit}
      />
      <div className='mb-10'></div>
      <ReviewList orderItemId={orderItemId} refreshReviews={refreshReviews} />
    </div>
  );
};

export default ReviewSection;
