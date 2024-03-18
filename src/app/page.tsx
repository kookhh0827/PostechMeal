// src/page.tsx

import * as React from 'react';
import '@/lib/env';

import MealCalendar from '@/components/MealCalendar';


export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <MealCalendar restaurantId={1} />
      <MealCalendar restaurantId={2} />
    </div>
  )
}