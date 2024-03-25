'use client';

import { addDays, endOfWeek, format, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';

import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';

type Restaurant = Tables<'restaurants'>;
type Meal = Tables<'meals'>;
type MenuItem = Tables<'menuitems'>;

interface MealCalendarProps {
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

const MealCalendar: React.FC<MealCalendarProps> = ({ restaurantId }) => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);

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

    const fetchMealsForWeek = async (week: Date) => {
      const supabase = createClient();
      const startDate = format(
        startOfWeek(week, { weekStartsOn: 1 }),
        'yyyy-MM-dd'
      );
      const endDate = format(
        endOfWeek(week, { weekStartsOn: 1 }),
        'yyyy-MM-dd'
      );

      const { data: mealData, error: mealError } = await supabase
        .from('meals')
        .select(
          `
          *,
          menuitems (
            *
          )
        `
        )
        .eq('restaurant_id', restaurantId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('meal_type');

      if (mealError) {
        return;
      }

      setMeals(mealData || []);
      setMenuItems(mealData?.flatMap((meal) => meal.menuitems) || []);
    };

    fetchRestaurant();
    fetchMealsForWeek(selectedWeek);
  }, [restaurantId, selectedWeek]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Check initial window size
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderMealsByDate = (date: string) => {
    const mealsForDate = meals.filter((meal) => meal.date === date);

    const groupedMeals = mealsForDate.reduce((acc, meal) => {
      if (meal.meal_type) {
        if (!acc[meal.meal_type]) {
          acc[meal.meal_type] = [];
        }
        acc[meal.meal_type].push(meal);
      }
      return acc;
    }, {} as Record<string, Meal[]>);

    return (
      <div>
        <h3 className='text-xl font-bold mb-2'>
          {format(new Date(date), 'yyyy-MM-dd(EEE)', { locale: ko })}
        </h3>
        {['breakfast', 'lunch', 'dinner'].map((mealType) => (
          <div key={mealType} className='mb-4'>
            <h4 className='text-lg font-bold mb-2'>
              {mealtypetokorean(mealType)}
            </h4>
            {groupedMeals[mealType]?.map((meal) => (
              <div key={meal.meal_id} className='border p-4 mb-2'>
                <h5 className='text-md font-bold mb-2'>{meal.name}</h5>
                <ul className='space-y-1'>
                  {menuItems
                    .filter((item) => item.meal_id === meal.meal_id)
                    .map((item) => (
                      <li key={item.menu_item_id} className='text-gray-700'>
                        {item.name}
                      </li>
                    ))}
                </ul>
                <p className='mt-2'>가격: {meal.price}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (!restaurant) {
    return <div>로딩중...</div>;
  }

  const startOfWeekDate = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(selectedWeek, { weekStartsOn: 1 });

  const handlePrevDay = () => {
    setSelectedWeek((prevDate) => addDays(prevDate, -1));
  };

  const handleNextDay = () => {
    setSelectedWeek((prevDate) => addDays(prevDate, 1));
  };

  return (
    <div className='mx-auto'>
      {/* {<h2 className='text-2xl font-bold mb-4'>{restaurant.name} 식단</h2>} */}
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
      {!isMobile ? (
        <>
          <div className='mb-4'>
            <button
              className='px-4 py-2 bg-blue-500 text-white rounded mr-2'
              onClick={() => {
                const prevWeek = startOfWeek(addDays(selectedWeek, -7), {
                  weekStartsOn: 1,
                });
                setSelectedWeek(prevWeek);
              }}
            >
              이전주
            </button>
            <button
              className='px-4 py-2 bg-blue-500 text-white rounded'
              onClick={() => {
                const nextWeek = startOfWeek(addDays(selectedWeek, 7), {
                  weekStartsOn: 1,
                });
                setSelectedWeek(nextWeek);
              }}
            >
              다음주
            </button>
          </div>
          <div className='text-lg font-bold mb-4'>
            {format(startOfWeekDate, 'yyyy-MM-dd')} 부터{' '}
            {format(endOfWeekDate, 'yyyy-MM-dd')} 까지
          </div>
          <div className='grid grid-cols-7 gap-4'>
            {Array.from({ length: 7 }).map((_, index) => {
              const date = format(
                addDays(startOfWeekDate, index),
                'yyyy-MM-dd'
              );
              return (
                <div key={date} className='border p-4'>
                  {renderMealsByDate(date)}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className='border p-4'>
          <div className='flex justify-between items-center mb-4'>
            <button
              className='px-4 py-2 bg-blue-500 text-white rounded'
              onClick={handlePrevDay}
            >
              이전날
            </button>
            <button
              className='px-4 py-2 bg-blue-500 text-white rounded'
              onClick={handleNextDay}
            >
              다음날
            </button>
          </div>
          {renderMealsByDate(format(selectedWeek, 'yyyy-MM-dd'))}
        </div>
      )}
    </div>
  );
};

export default MealCalendar;
