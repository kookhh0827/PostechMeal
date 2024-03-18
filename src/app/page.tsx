'use client';
// src/page.tsx
import * as React from 'react';
import { useState } from 'react';
import '@/lib/env';

import MealCalendar from '@/components/MealCalendar';
import OrderCalendar from '@/components/OrderCalander';

export default function HomePage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<number>(1);

  const restaurants = [
    { id: 1, name: '학생식당', type: 'meal' },
    { id: 2, name: 'RIST식당', type: 'meal' },
    { id: 3, name: '해동-아우름홀', type: 'order' },
  ];

  const handleRestaurantClick = (restaurantId: number) => {
    setSelectedRestaurant(restaurantId);
  };

  return (
    <div className='container mx-auto py-8 px-1.5'>
      <div className='bg-gray-200 p-4 mb-4'>
        <ul className='flex space-x-4'>
          {restaurants.map((restaurant) => (
            <li
              key={restaurant.id}
              className={`cursor-pointer ${
                selectedRestaurant === restaurant.id ? 'font-bold' : ''
              }`}
              onClick={() => handleRestaurantClick(restaurant.id)}
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
              (restaurant) => restaurant.id === selectedRestaurant
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
