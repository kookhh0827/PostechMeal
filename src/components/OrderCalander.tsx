'use client';

import { format, isWithinInterval, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';

type Restaurant = Tables<'restaurants'>;
type Order = Tables<'orders'>;
type OrderItem = Tables<'orderitem'>;

interface OrderWithOrderItem extends Order {
  orderitem: OrderItem;
}

interface OrderCalendarProps {
  restaurantId: number;
}

function mealtypetokorean(mealtype: string) {
  if (mealtype === 'breakfast') {
    return '아침';
  } else if (mealtype === 'lunch') {
    return '점심';
  } else if (mealtype === 'dinner') {
    return '저녁';
  }
}

const OrderCalendar: React.FC<OrderCalendarProps> = ({ restaurantId }) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [orders, setOrders] = useState<OrderWithOrderItem[] | null>(null);

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
    };

    const fetchOrders = async () => {
      const supabase = createClient();
      const ordersQuery = supabase
        .from('orders')
        .select('*, orderitem(name, description)')
        .eq('restaurant_id', restaurantId);

      const { data, error } = await ordersQuery;
      if (error) {
        throw error;
      }

      setOrders(data as OrderWithOrderItem[]);
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
        <h4 className='text-lg font-bold mb-2'>{mealtypetokorean(mealType)}</h4>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
          {filteredOrders.map((order) => (
            <div key={order.order_id} className='border p-4'>
              <h5 className='text-md font-bold mb-2'>{order.orderitem.name}</h5>
              <p className='text-gray-600'>{order.orderitem.description}</p>
              <p className='mt-2'>가격: {order.price}</p>
            </div>
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
      {restaurant.serving_breakfast && renderOrdersByMealType('breakfast')}
      {restaurant.serving_lunch && renderOrdersByMealType('lunch')}
      {restaurant.serving_dinner && renderOrdersByMealType('dinner')}
    </div>
  );
};

export default OrderCalendar;
