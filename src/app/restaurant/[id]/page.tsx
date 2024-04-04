// @/app/restaurant/[id].tsx

import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/server';

import CommentBox from '@/components/CommentBox';
import Header from '@/components/Header';
import MealCalendar from '@/components/MealCalendar';
import OrderCalendar from '@/components/OrderCalander';
import RestaurantTabs from '@/components/RestaurantTabs';

type Restaurant = Tables<'restaurants'>;

const OrderItemReviewPage = async ({ params }: { params: { id: number } }) => {
  const supabase = createClient();
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .order('restaurant_id');

  return (
    <div className='container mx-auto py-8 px-1.5'>
      <Header></Header>
      <RestaurantTabs
        restaurants={restaurants as Restaurant[]}
        selectedRestaurant={params.id}
      ></RestaurantTabs>
      {restaurants &&
      restaurants.find((restaurant) => restaurant.restaurant_id == params.id)
        ?.type === 'meal' ? (
        <MealCalendar restaurantId={params.id} />
      ) : (
        <OrderCalendar restaurantId={params.id} />
      )}
      <CommentBox restaurant_id={params.id}></CommentBox>
    </div>
  );
};

export default OrderItemReviewPage;
