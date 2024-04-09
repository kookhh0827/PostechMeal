// ReviewList.tsx

import { format } from 'date-fns';

import { createClient } from '@/lib/supabase/server';

const ReviewList = async ({ orderItemId }: { orderItemId: number }) => {
  const supabase = createClient();
  const { data: reviews } = await supabase
    .from('reviews_with_nickname')
    .select('*')
    .eq('orderitem_id', orderItemId);

  return (
    <div className='space-y-4'>
      {reviews?.map((review) => (
        <div
          key={review.review_id}
          className='bg-white shadow-md rounded-lg p-4'
        >
          <div className='flex justify-between items-center mb-2'>
            <p className='text-sm font-semibold text-gray-800'>
              {review.nickname}
            </p>
            <p className='text-xs text-gray-500'>
              {review.created_at &&
                format(new Date(review.created_at), 'yyyy-MM-dd HH:mm:ss')}
            </p>
          </div>
          <div className='flex items-center mb-2'>
            <span className='text-yellow-500'>
              {review.rating && review.rating > 0
                ? '★'.repeat(review.rating)
                : null}
            </span>
            <span className='text-gray-500'>
              {(review.rating == 0 || review.rating) &&
                '★'.repeat(5 - review.rating)}
            </span>
          </div>
          <p className='text-gray-700'>{review.message}</p>
        </div>
      ))}
      {reviews?.length == 0 && (
        <div>아직 리뷰가 없어요! 첫 번째 리뷰를 작성 해보세요.</div>
      )}
    </div>
  );
};

export default ReviewList;
