// @/app/restaurant/[id].tsx

import { Tables } from '@/lib/database.types';
import { createPrivateClient } from '@/lib/supabase/private';
import { createClient } from '@/lib/supabase/server';

import CommentBox from '@/components/CommentBox';
import Header from '@/components/Header';
import MealCalendar from '@/components/MealCalendar';
import OrderCalendar from '@/components/OrderCalander';
import RestaurantTabs from '@/components/RestaurantTabs';

export async function generateStaticParams() {
  const supabase = createPrivateClient();
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .order('restaurant_id');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return restaurants!.map((restaurant) => ({
    id: restaurant.restaurant_id.toString(),
  }));
}

type Restaurant = Tables<'restaurants'>;

const OrderItemReviewPage = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
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
        selectedRestaurant={id}
      ></RestaurantTabs>
      {restaurants &&
      restaurants.find((restaurant) => restaurant.restaurant_id == id)?.type ===
        'meal' ? (
        <MealCalendar restaurantId={id} />
      ) : (
        <OrderCalendar restaurantId={id} />
      )}
      <CommentBox restaurant_id={id}></CommentBox>
    </div>
  );
};

export default OrderItemReviewPage;
