// @app/components/OrderCalendar.tsx
'use client';

import { format, isWithinInterval, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase';

type Restaurant = Tables<'restaurants'>;
type Order = Tables<'orders'>;

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) {
        return;
      }

      setOrders(data || []);
    };

    fetchRestaurant();
    fetchOrders();
  }, [restaurantId]);

  const renderOrdersByMealType = (mealType: string) => {
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
        <div className='space-y-4 md:space-y-0 md:flex md:space-x-4'>
          {filteredOrders.map((order) => (
            <div key={order.id} className='border p-4'>
              <h5 className='text-md font-bold mb-2'>{order.name}</h5>
              <p className='text-gray-600'>{order.description}</p>
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
      <h2 className='text-2xl font-bold mb-4'>{restaurant.name} 메뉴</h2>
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
      {/* <h3 className="text-xl font-bold mb-4">{format(selectedDate, 'yyyy-MM-dd (EEE)')}</h3> */}
      {renderOrdersByMealType('breakfast')}
      {renderOrdersByMealType('lunch')}
      {renderOrdersByMealType('dinner')}
    </div>
  );
};

export default OrderCalendar;
