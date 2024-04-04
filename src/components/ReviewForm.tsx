// ReviewForm.tsx

'use client';

import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

const ReviewForm = ({ orderItemId }: { orderItemId: number }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('reviews')
      .insert({ rating, message, orderitem_id: orderItemId });

    if (!error) {
      setRating(0);
      setMessage('');
      router.refresh();
    }
  };

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  return (
    <form onSubmit={handleSubmit} className='bg-white shadow-md rounded-lg p-4'>
      <div className='mb-4'>
        <label htmlFor='rating' className='block mb-2 font-bold text-gray-700'>
          Rating:
        </label>
        <div className='flex'>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-8 h-8 cursor-pointer ${
                index < rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => handleStarClick(index + 1)}
            />
          ))}
        </div>
      </div>
      <div className='mb-4'>
        <label htmlFor='message' className='block mb-2 font-bold text-gray-700'>
          Message:
        </label>
        <textarea
          id='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none resize-none'
          rows={4}
          required
        ></textarea>
      </div>
      <button
        type='submit'
        className='px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none'
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
