// @/app/review/[id].tsx

import Image from 'next/image';

import { createClient } from '@/lib/supabase/server';

import Header from '@/components/Header';
import ReturnButton from '@/components/ReturnButton';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import StarRating from '@/components/StarRating';

const OrderItemReviewPage = async ({ params }: { params: { id: number } }) => {
  const supabase = createClient();
  const { data: orderitem } = await supabase
    .from('orderitem_with_avg_rating')
    .select('*')
    .eq('orderitem_id', params.id)
    .maybeSingle();

  return (
    <div className='container mx-auto py-8 px-1.5'>
      <Header></Header>
      <ReturnButton></ReturnButton>
      <div className='text-center'>
        <h1 className='text-3xl font-bold mb-4'>{orderitem?.name}</h1>
        <p className='text-lg mb-8'>{orderitem?.description}</p>
        <div className='flex justify-center mb-4'>
          <StarRating
            rating={orderitem?.avg_rating || 0}
            size='lg'
          ></StarRating>
        </div>
        <div className='flex justify-center mb-8'>
          <div className='w-64 h-64 relative'>
            {orderitem.thumbnail_url ? (
              <Image
                src={orderitem.thumbnail_url}
                alt='Thumbnail'
                layout='fill'
                objectFit='cover'
                className='rounded-lg'
              />
            ) : (
              <div className='flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 rounded-lg'>
                No Image
              </div>
            )}
          </div>
        </div>
      </div>
      <ReviewForm orderItemId={params.id} />
      <div className='mb-10'></div>
      <ReviewList orderItemId={params.id} />
    </div>
  );
};

export default OrderItemReviewPage;
