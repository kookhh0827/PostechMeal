// ReviewForm.tsx

'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

import { createClient } from '@/lib/supabase/client';

interface ReviewFormProps {
  orderItemId: number;
  initialRating?: number;
  initialMessage?: string;
  onSave?: (rating: number, message: string) => void;
  onCancel?: () => void;
  onReviewSubmit?: () => void;
}

const ReviewForm = ({
  orderItemId,
  initialRating = 0,
  initialMessage = '',
  onSave,
  onCancel,
  onReviewSubmit,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(initialRating);
  const [message, setMessage] = useState(initialMessage);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (onSave) {
      onSave(rating, message);
    } else {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        Swal.fire({
          icon: 'warning',
          title: '로그인이 필요한 기능입니다.',
          confirmButtonText: 'OK',
        });
        return;
      }

      if (message.length < 5 || message.length > 100) {
        Swal.fire({
          icon: 'warning',
          title: '리뷰 길이 제한',
          text: '리뷰 길이는 5글자 이상 100글자 이하로 제한되어 있습니다.',
        });
        return;
      }

      const { data: dup_review } = await supabase
        .from('reviews')
        .select('*')
        .eq('orderitem_id', orderItemId)
        .eq('users_id', authData.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (dup_review && dup_review.length > 0) {
        const lastReviewTimestamp = new Date(
          dup_review[0].created_at
        ).getTime();
        const currentTimestamp = new Date().getTime();
        const timeDifferenceInHours =
          (currentTimestamp - lastReviewTimestamp) / 1000 / 60 / 60;

        if (timeDifferenceInHours < 24) {
          Swal.fire({
            icon: 'warning',
            title: '리뷰 작성 제한',
            text: '한 메뉴에 대한 리뷰는 24시간에 하나만 작성하실 수 있습니다.',
          });
          return;
        }
      }

      const { error } = await supabase
        .from('reviews')
        .insert({ rating, message, orderitem_id: orderItemId });

      if (!error) {
        setRating(0);
        setMessage('');
        if (onReviewSubmit) {
          onReviewSubmit();
        }
      }
    }
  };

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  return (
    <form onSubmit={handleSubmit} className='bg-white shadow-md rounded-lg p-4'>
      <div className='mb-4'>
        <label htmlFor='rating' className='block mb-2 font-bold text-gray-700'>
          점수:
        </label>
        <div className='flex'>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-8 h-8 cursor-pointer ${
                index < rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => handleStarClick(index + 1)}
            />
          ))}
        </div>
      </div>
      <div className='mb-4'>
        <label htmlFor='message' className='block mb-2 font-bold text-gray-700'>
          내용:
        </label>
        <textarea
          id='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none resize-none'
          rows={4}
        ></textarea>
      </div>
      <div className='flex justify-end'>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 font-bold text-gray-500 rounded-full hover:text-gray-700 focus:outline-none mr-2'
          >
            취소
          </button>
        )}
        <button
          type='submit'
          className='px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none'
        >
          {onSave ? '수정' : '리뷰 작성'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
