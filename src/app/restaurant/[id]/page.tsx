// @/app/restaurant/[id].tsx

import { endOfWeek, format, startOfWeek } from 'date-fns';

import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/server';

import CommentBox from '@/components/CommentBox';
import MealCalendar from '@/components/MealCalendar';
import OrderCalendar from '@/components/OrderCalander';
import RestaurantTabs from '@/components/RestaurantTabs';

const fetchMealsForWeek = async (week: Date, restaurant_id: number) => {
  const supabase = createClient();
  const startDate = format(
    startOfWeek(week, { weekStartsOn: 1 }),
    'yyyy-MM-dd'
  );
  const endDate = format(endOfWeek(week, { weekStartsOn: 1 }), 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from('meals')
    .select(
      `
      *,
      menuitems (
        *
      )
    `
    )
    .eq('restaurant_id', restaurant_id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('meal_type');

  if (error) {
    return null;
  }
  return data;
};

const fetchOrders = async (restaurant_id: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders_with_orderitem_and_avg_rating')
    .select('*')
    .eq('restaurant_id', restaurant_id)
    .order('avg_rating', { ascending: false })
    .order('num_rating', { ascending: false });

  if (error) {
    return null;
  }
  return data;
};

const fetchRestaurants = async () => {
  const supabase = createClient();
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .order('restaurant_id');
  return restaurants;
};

type Restaurant = Tables<'restaurants'>;

const OrderItemReviewPage = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
  const restaurants = await fetchRestaurants();
  const restaurantInfo = restaurants?.filter(
    (restaurant) => restaurant.restaurant_id === id
  )[0];

  return (
    <div className='container mx-auto py-8 px-1.5'>
      <RestaurantTabs
        restaurants={restaurants as Restaurant[]}
        selectedRestaurant={id}
      ></RestaurantTabs>
      {restaurantInfo && restaurantInfo.type === 'meal' ? (
        <MealCalendar
          restaurantInfo={restaurantInfo}
          initialMeals={await fetchMealsForWeek(new Date(), id)}
        />
      ) : (
        restaurantInfo && (
          <OrderCalendar
            restaurantInfo={restaurantInfo}
            initialOrders={await fetchOrders(id)}
          />
        )
      )}
      <CommentBox restaurant_id={id}></CommentBox>
    </div>
  );
};

export default OrderItemReviewPage;
