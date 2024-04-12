'use client';

import { addDays, endOfWeek, format, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';

import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';

type Restaurant = Tables<'restaurants'>;
type MenuItem = Tables<'menuitems'>;
type Meal = Tables<'meals'> & {
  menuitems: MenuItem[];
};

interface MealCalendarProps {
  restaurantInfo: Restaurant;
  initialMeals: Meal[] | null;
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

const MealCalendar: React.FC<MealCalendarProps> = ({
  restaurantInfo,
  initialMeals,
}) => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [meals, setMeals] = useState<Meal[] | null>(initialMeals);

  useEffect(() => {
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
        .eq('restaurant_id', restaurantInfo.restaurant_id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('meal_type');

      if (mealError) {
        return;
      }

      setMeals(mealData);
    };
    fetchMealsForWeek(selectedWeek);
  }, [restaurantInfo, selectedWeek]);

  const renderMealsByDate = (date: string) => {
    if (!meals) {
      return;
    }
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
                  {meal.menuitems.map((item) => (
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
      {restaurantInfo.location && (
        <p className='text-lg mb-4'>위치: {restaurantInfo.location}</p>
      )}
      <div className='mb-4'>
        {restaurantInfo.serving_breakfast && (
          <p>
            아침 식사 시간: {restaurantInfo.breakfast_start_time} -{' '}
            {restaurantInfo.breakfast_end_time}
          </p>
        )}
        {restaurantInfo.serving_lunch && (
          <p>
            점심 식사 시간: {restaurantInfo.lunch_start_time} -{' '}
            {restaurantInfo.lunch_end_time}
          </p>
        )}
        {restaurantInfo.serving_dinner && (
          <p>
            저녁 식사 시간: {restaurantInfo.dinner_start_time} -{' '}
            {restaurantInfo.dinner_end_time}
          </p>
        )}
      </div>
      <div className='mb-4 flex justify-between items-center'>
        <button
          className='px-4 py-2 bg-blue-500 text-white rounded hidden sm:block'
          onClick={() => {
            const prevWeek = startOfWeek(addDays(selectedWeek, -7), {
              weekStartsOn: 1,
            });
            setSelectedWeek(prevWeek);
          }}
        >
          이전주
        </button>
        <div className='text-lg font-bold hidden sm:block'>
          {format(startOfWeekDate, 'yyyy-MM-dd')} 부터{' '}
          {format(endOfWeekDate, 'yyyy-MM-dd')} 까지
        </div>
        <button
          className='px-4 py-2 bg-blue-500 text-white rounded hidden sm:block'
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
      <div className='grid grid-cols-1 sm:grid-cols-7 gap-4'>
        {Array.from({ length: 7 }).map((_, index) => {
          const date = format(addDays(startOfWeekDate, index), 'yyyy-MM-dd');
          const isShown = date === format(selectedWeek, 'yyyy-MM-dd');
          return (
            <div
              key={date}
              className={`border p-4 ${isShown ? 'block' : 'hidden'} sm:block`}
            >
              <div className='flex justify-between items-center mb-4 sm:hidden'>
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
              {renderMealsByDate(date)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealCalendar;
