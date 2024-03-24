// src/components/CommentList.tsx
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';

type Comment = Tables<'comments_with_nickname'>;

interface CommentListProps {
  comments: Comment[];
}

interface LikeButtonProps {
  liked: boolean;
  likeCount: number;
  onClick: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  liked,
  likeCount,
  onClick,
}) => {
  return (
    <button
      className={`flex items-center space-x-1 focus:outline-none ${
        liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
      }`}
      onClick={onClick}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className={`h-5 w-5 ${
          liked ? 'fill-current text-red-500' : 'stroke-current text-gray-500'
        }`}
        viewBox='0 0 24 24'
        fill={liked ? 'currentColor' : 'none'}
        stroke={liked ? 'none' : 'currentColor'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
      </svg>
      <span>좋아요 ({likeCount})</span>
    </button>
  );
};

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const [likedComments, setLikedComments] = useState<number[]>([]);
  const [commentLikeCounts, setCommentLikeCounts] = useState<{
    [commentId: number]: number;
  }>({});

  useEffect(() => {
    const initialLikedComments = comments
      .filter((comment) => comment.liked_by_current_user)
      .map((comment) => comment.comment_id || -1);
    setLikedComments(initialLikedComments);

    const initialLikeCounts: { [commentId: number]: number } = {};
    comments.forEach((comment) => {
      if (comment.comment_id) {
        initialLikeCounts[comment.comment_id] = comment.like_count || 0;
      }
    });
    setCommentLikeCounts(initialLikeCounts);
  }, [comments]);

  const handleLike = async (commentId: number) => {
    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      Swal.fire({
        icon: 'warning',
        title: '로그인이 필요한 기능입니다.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const userId = authData.user.id;

    if (likedComments.includes(commentId)) {
      // Unlike the comment
      await supabase
        .from('users_like_comments')
        .delete()
        .eq('comment_id', commentId)
        .eq('users_id', userId);
      setLikedComments((prevLikedComments) =>
        prevLikedComments.filter((id) => id !== commentId)
      );
      setCommentLikeCounts((prevLikeCounts) => ({
        ...prevLikeCounts,
        [commentId]: prevLikeCounts[commentId] - 1,
      }));
    } else {
      // Like the comment
      await supabase
        .from('users_like_comments')
        .insert({ comment_id: commentId, users_id: userId });
      setLikedComments((prevLikedComments) => [
        ...prevLikedComments,
        commentId,
      ]);
      setCommentLikeCounts((prevLikeCounts) => ({
        ...prevLikeCounts,
        [commentId]: prevLikeCounts[commentId] + 1,
      }));
    }
  };

  return (
    <div>
      {comments.map(
        (comment) =>
          comment.comment_id && (
            <div key={comment.comment_id} className='mb-6'>
              <p className='text-sm text-gray-500'>
                {comment.nickname} (작성일시:{' '}
                {comment.created_at &&
                  format(new Date(comment.created_at), 'yyyy-MM-dd HH:mm:ss')}
                )
              </p>
              <p className='text-gray-700 mb-2'>{comment.message}</p>
              <LikeButton
                liked={likedComments.includes(comment.comment_id)}
                likeCount={commentLikeCounts[comment.comment_id] || 0}
                onClick={() =>
                  comment.comment_id && handleLike(comment.comment_id)
                }
              />
            </div>
          )
      )}
    </div>
  );
};

export default CommentList;
