'use client';
// src/page.tsx
import Link from 'next/link';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '@/lib/env';

import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';

import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';
import MealCalendar from '@/components/MealCalendar';
import OrderCalendar from '@/components/OrderCalander';

type Comment = Tables<'comments_with_nickname'>;
type OrderingOption = 'latest' | 'oldest' | 'mostLiked';

export default function HomePage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(
    null
  );
  const [restaurants, setRestaurants] = useState<
    { restaurant_id: number; name: string; type: string }[]
  >([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedOrdering, setSelectedOrdering] =
    useState<OrderingOption>('latest');
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (!authError && authData.user) {
        const { data: userData, error: userError } = await supabase
          .from('accounts')
          .select('nickname')
          .maybeSingle();

        if (!userError && userData) {
          setNickname(userData.nickname);
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRestaurant, selectedOrdering]);

  const fetchRestaurants = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('restaurants')
      .select('restaurant_id, name, type');

    if (!error) {
      setRestaurants(data || []);
      setSelectedRestaurant(data?.[0]?.restaurant_id || null);
    }
  };

  const handleRestaurantClick = (restaurantId: number) => {
    setSelectedRestaurant(restaurantId);
  };

  const fetchComments = async () => {
    if (selectedRestaurant) {
      const supabase = createClient();
      let query = supabase
        .from('comments_with_nickname')
        .select('*')
        .eq('restaurant_id', selectedRestaurant);

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
        title: '댓글 길이 제한',
        text: '댓글 길이는 5글자 이상 100글자 이하로 제한되어 있습니다.',
      });
      return;
    }

    await supabase.from('comments').insert({
      restaurant_id: selectedRestaurant,
      message: comment,
    });
    fetchComments();
  };

  const handleSignout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setNickname(null);
    }
  };

  return (
    <div className='container mx-auto py-8 px-1.5'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold'>포스텍 식당정보</h1>
        <div>
          {nickname ? (
            <div className='flex items-center space-x-4'>
              <span className='text-gray-700'>{nickname}</span>
              <button
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
                onClick={handleSignout}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className='space-x-4'>
              <Link href='/login'>
                <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                  로그인
                </button>
              </Link>
              <Link href='/signup'>
                <button className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
                  회원가입
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className='bg-gray-200 p-4 mb-4'>
        <ul className='flex space-x-4 text-xs md:text-lg'>
          {restaurants.map((restaurant) => (
            <li
              key={restaurant.restaurant_id}
              className={`cursor-pointer ${
                selectedRestaurant === restaurant.restaurant_id
                  ? 'font-bold'
                  : ''
              }`}
              onClick={() => handleRestaurantClick(restaurant.restaurant_id)}
            >
              {restaurant.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {selectedRestaurant && (
          <div>
            {restaurants.find(
              (restaurant) => restaurant.restaurant_id === selectedRestaurant
            )?.type === 'meal' ? (
              <MealCalendar restaurantId={selectedRestaurant} />
            ) : (
              <OrderCalendar restaurantId={selectedRestaurant} />
            )}
            <div className='flex justify-between items-center mb-4 mt-4'>
              <h3 className='text-lg font-semibold'>댓글 목록</h3>
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
          </div>
        )}
      </div>
    </div>
  );
}
