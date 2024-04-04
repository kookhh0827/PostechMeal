// src/components/RestaurantTabs.tsx

import Link from 'next/link';

import { Tables } from '@/lib/database.types';

type Restaurant = Tables<'restaurants'>;

interface RestaurantTabsProps {
  restaurants: Restaurant[];
  selectedRestaurant: number | null;
}

const RestaurantTabs: React.FC<RestaurantTabsProps> = ({
  restaurants,
  selectedRestaurant,
}) => {
  return (
    <div className='bg-gray-200 p-4 mb-4'>
      <ul className='flex space-x-4 text-xs md:text-lg'>
        {restaurants.map((restaurant) => (
          <li
            key={restaurant.restaurant_id}
            className={`cursor-pointer ${
              selectedRestaurant == restaurant.restaurant_id
                ? 'font-bold'
                : 'font-light'
            }`}
          >
            <Link href={`/restaurant/${restaurant.restaurant_id}`}>
              {restaurant.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantTabs;
