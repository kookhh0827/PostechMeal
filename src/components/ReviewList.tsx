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
              {format(new Date(review.created_at), 'yyyy-MM-dd HH:mm:ss')}
            </p>
          </div>
          <div className='flex items-center mb-2'>
            <span className='text-yellow-500'>{'★'.repeat(review.rating)}</span>
            <span className='text-gray-500'>
              {'★'.repeat(5 - review.rating)}
            </span>
          </div>
          <p className='text-gray-700'>{review.message}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
