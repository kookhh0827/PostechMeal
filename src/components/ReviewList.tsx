'use client';
// ReviewList.tsx

import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';

import ReviewForm from '@/components/ReviewForm';

type Reviews = Tables<'reviews_with_nickname'>;

interface ReviewListProps {
  orderItemId: number;
  refreshReviews: boolean;
  onReviewEdit?: () => void;
  onReviewDelete?: () => void;
}

const supabase = createClient();

const ReviewList = ({
  orderItemId,
  refreshReviews,
  onReviewEdit,
  onReviewDelete,
}: ReviewListProps) => {
  const [users_id, setUsersId] = useState<string | undefined>();
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        return;
      } else {
        setUsersId(userData.user?.id);
      }
    };

    const fetchReviews = async () => {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews_with_nickname')
        .select('*')
        .eq('orderitem_id', orderItemId);
      if (reviewsError) {
        return;
      } else {
        setReviews(reviewsData || []);
      }
    };

    fetchUser();
    fetchReviews();
  }, [orderItemId, refreshReviews]);

  const handleEditClick = (reviewId: number) => {
    setEditingReviewId(reviewId);
  };

  const handleCancelClick = () => {
    setEditingReviewId(null);
  };

  const handleDeleteClick = async (reviewId: number) => {
    const result = await Swal.fire({
      title: '리뷰 삭제',
      text: '리뷰를 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('review_id', reviewId);

      if (!error) {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.review_id !== reviewId)
        );
        if (onReviewDelete) {
          onReviewDelete();
        }
      }
    }
  };

  const handleSaveClick = async (
    reviewId: number,
    rating: number,
    message: string
  ) => {
    const { error } = await supabase
      .from('reviews')
      .update({ rating, message })
      .eq('review_id', reviewId);

    if (!error) {
      setEditingReviewId(null);
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.review_id === reviewId
            ? { ...review, rating, message }
            : review
        )
      );
      if (onReviewEdit) {
        onReviewEdit();
      }
    }
  };

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
          {editingReviewId && editingReviewId === review.review_id ? (
            <ReviewForm
              orderItemId={orderItemId}
              initialRating={review.rating || 0}
              initialMessage={review.message || ''}
              onSave={(rating, message) =>
                handleSaveClick(editingReviewId, rating, message)
              }
              onCancel={handleCancelClick}
            />
          ) : (
            <>
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
              {review.users_id === users_id && (
                <div className='mt-2'>
                  <button
                    onClick={() =>
                      review.review_id && handleEditClick(review.review_id)
                    }
                    className='text-blue-500 hover:underline mr-2'
                  >
                    수정
                  </button>
                  <button
                    onClick={() =>
                      review.review_id && handleDeleteClick(review.review_id)
                    }
                    className='text-red-500 hover:underline'
                  >
                    삭제
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
      {reviews?.length == 0 && (
        <div>아직 리뷰가 없어요! 첫 번째 리뷰를 작성 해보세요.</div>
      )}
    </div>
  );
};

export default ReviewList;
