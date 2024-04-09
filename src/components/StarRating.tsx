// @/components/StarRating.tsx

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  num_rating: number;
  size: 'lg' | 'sm';
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  num_rating,
  size,
}) => {
  const fullStars = Math.floor(rating);
  const partialStarPercentage = (rating - fullStars) * 100;
  const emptyStars = 5 - Math.ceil(rating);

  const starSize = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  const textSize = size === 'lg' ? 'text-xl' : 'text-sm';

  return (
    <div className='flex items-center'>
      {[...Array(fullStars)].map((_, index) => (
        <Star key={`full-${index}`} className={`${starSize} text-yellow-500`} />
      ))}
      {partialStarPercentage > 0 && (
        <div className={`${starSize} relative`}>
          <Star className={`${starSize} text-gray-300`} />
          <div
            className='absolute inset-0 overflow-hidden'
            style={{ width: `${partialStarPercentage}%` }}
          >
            <Star className={`${starSize} text-yellow-500`} />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <Star key={`empty-${index}`} className={`${starSize} text-gray-300`} />
      ))}
      <span className={`ml-2 ${textSize} font-semibold`}>
        {rating.toFixed(1)} ({num_rating})
      </span>
    </div>
  );
};

export default StarRating;
