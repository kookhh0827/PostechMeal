// src/components/CommentForm.tsx
'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';

import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';

type Comment = Tables<'comments_with_nickname'>;
type OrderingOption = 'latest' | 'oldest' | 'mostLiked';

interface CommentBoxProps {
  restaurant_id: number;
}

const CommentBox: React.FC<CommentBoxProps> = ({ restaurant_id }) => {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedOrdering, setSelectedOrdering] =
    useState<OrderingOption>('latest');

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchComments = async () => {
    let query = supabase
      .from('comments_with_nickname')
      .select('*')
      .eq('restaurant_id', restaurant_id);

    switch (selectedOrdering) {
      case 'latest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'mostLiked':
        query = query.order('like_count', { ascending: false });
        break;
      default:
        break;
    }

    const { data, error } = await query;

    if (!error) {
      setComments(data || []);
    }
  };

  const handleCommentSubmit = async (comment: string) => {
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

    if (comment.length < 5 || comment.length > 100) {
      Swal.fire({
        icon: 'warning',
        title: '리뷰 길이 제한',
        text: '리뷰 길이는 5글자 이상 100글자 이하로 제한되어 있습니다.',
      });
      return;
    }

    await supabase.from('comments').insert({
      restaurant_id: restaurant_id,
      message: comment,
    });
    fetchComments();
  };

  return (
    <>
      <div className='flex justify-between items-center mb-4 mt-4'>
        <h3 className='text-lg font-semibold'>리뷰 목록</h3>
        <select
          value={selectedOrdering}
          onChange={(e) =>
            setSelectedOrdering(e.target.value as OrderingOption)
          }
          className='border border-gray-300 rounded py-1'
        >
          <option value='latest'>최신순</option>
          <option value='oldest'>오래된순</option>
          <option value='mostLiked'>좋아요순</option>
        </select>
      </div>
      <CommentForm onSubmit={handleCommentSubmit} />
      <CommentList comments={comments} />
    </>
  );
};

export default CommentBox;
