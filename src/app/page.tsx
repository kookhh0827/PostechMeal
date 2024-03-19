'use client';
// src/page.tsx
import * as React from 'react';
import { useEffect, useState } from 'react';
import '@/lib/env';

import { createClient } from '@/lib/supabase';

import MealCalendar from '@/components/MealCalendar';
import OrderCalendar from '@/components/OrderCalander';

export default function HomePage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(
    null
  );
  const [restaurants, setRestaurants] = useState<
    { restaurant_id: number; name: string; type: string }[]
  >([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

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

  return (
    <div className='container mx-auto py-8 px-1.5'>
      <div className='bg-gray-200 p-4 mb-4'>
        <ul className='flex space-x-4'>
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
          </div>
        )}
      </div>
    </div>
  );
}
