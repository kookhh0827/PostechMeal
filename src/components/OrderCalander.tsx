'use client';

import { format, isWithinInterval, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';

import MealTypeTabs from '@/components/MealTypeTabs';
import StarRating from '@/components/StarRating';

type Restaurant = Tables<'restaurants'>;
type Order = Tables<'orders_with_orderitem_and_avg_rating'>;

interface OrderCalendarProps {
  restaurantId: number;
}

const OrderCalendar: React.FC<OrderCalendarProps> = ({ restaurantId }) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [mealTypes, setMealTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .single();

      if (error) {
        return;
      }

      setRestaurant(data);

      const availableMealTypes = ['breakfast', 'lunch', 'dinner'].filter(
        (mealType) => {
          if (mealType === 'breakfast' && data?.serving_breakfast) return true;
          if (mealType === 'lunch' && data?.serving_lunch) return true;
          if (mealType === 'dinner' && data?.serving_dinner) return true;
          return false;
        }
      );

      setMealTypes(availableMealTypes);
      setSelectedMealType(availableMealTypes[0]);
    };

    const fetchOrders = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders_with_orderitem_and_avg_rating')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) {
        return;
      }

      setOrders(data);
    };

    fetchRestaurant();
    fetchOrders();
  }, [restaurantId]);

  const renderOrdersByMealType = (mealType: string) => {
    if (!orders) {
      return null;
    }

    const filteredOrders = orders.filter(
      (order) =>
        order.meal_type === mealType &&
        order.start_date &&
        order.end_date &&
        isWithinInterval(selectedDate, {
          start: parseISO(order.start_date),
          end: parseISO(order.end_date),
        })
    );

    return (
      <div className='mb-6'>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
          {filteredOrders.map((order) => (
            <Link key={order.order_id} href={'/review/' + order.orderitem_id}>
              <div className='border p-4'>
                <div className='mb-2 w-full aspect-square relative'>
                  {order.orderitem_thumbnail_url ? (
                    <Image
                      src={order.orderitem_thumbnail_url}
                      alt={order.orderitem_name || 'Error'}
                      layout='fill'
                      objectFit='cover'
                    />
                  ) : (
                    <div className='flex items-center justify-center w-full h-full bg-gray-200 text-gray-500'>
                      No Image
                    </div>
                  )}
                </div>
                <h5 className='text-md font-bold mb-2'>
                  {order.orderitem_name}
                </h5>
                <p className='text-gray-600'>{order.orderitem_description}</p>
                <p className='mt-2'>가격: {order.price}</p>
                <StarRating
                  rating={order.avg_rating || 0}
                  size='sm'
                ></StarRating>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  if (!restaurant) {
    return <div>로딩중...</div>;
  }

  return (
    <div className='mx-auto'>
      {restaurant.location && (
        <p className='text-lg mb-4'>위치: {restaurant.location}</p>
      )}
      <div className='mb-4'>
        {restaurant.serving_breakfast && (
          <p>
            아침 식사 시간: {restaurant.breakfast_start_time} -{' '}
            {restaurant.breakfast_end_time}
          </p>
        )}
        {restaurant.serving_lunch && (
          <p>
            점심 식사 시간: {restaurant.lunch_start_time} -{' '}
            {restaurant.lunch_end_time}
          </p>
        )}
        {restaurant.serving_dinner && (
          <p>
            저녁 식사 시간: {restaurant.dinner_start_time} -{' '}
            {restaurant.dinner_end_time}
          </p>
        )}
      </div>
      <div className='mb-4'>
        <label htmlFor='date' className='block mb-2 font-bold'>
          날짜 선택
        </label>
        <input
          type='date'
          id='date'
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className='border border-gray-300 rounded px-2 py-1'
        />
      </div>
      <MealTypeTabs
        mealTypes={mealTypes}
        selectedMealType={selectedMealType || ''}
        onSelectMealType={setSelectedMealType}
      />
      {selectedMealType && renderOrdersByMealType(selectedMealType)}
    </div>
  );
};

export default OrderCalendar;
