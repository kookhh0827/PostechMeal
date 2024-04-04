// @/components/StarRating.tsx

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size: 'lg' | 'sm';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  if (size === 'lg') {
    return (
      <div className='flex items-center'>
        {[...Array(fullStars)].map((_, index) => (
          <Star key={`full-${index}`} className='w-6 h-6 text-yellow-500' />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <Star key={`empty-${index}`} className='w-6 h-6 text-gray-300' />
        ))}
        <span className='ml-2 text-xl font-semibold'>{rating.toFixed(1)}</span>
      </div>
    );
  } else if (size === 'sm') {
    return (
      <div className='flex items-center'>
        {[...Array(fullStars)].map((_, index) => (
          <Star key={`full-${index}`} className='w-4 h-4 text-yellow-500' />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <Star key={`empty-${index}`} className='w-4 h-4 text-gray-300' />
        ))}
        <span className='ml-2 text-sm font-semibold'>{rating.toFixed(1)}</span>
      </div>
    );
  }
};

export default StarRating;
