// src/components/CommentForm.tsx
import { useState } from 'react';

interface CommentFormProps {
  onSubmit: (comment: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(comment);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className='mt-4 mb-4'>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className='w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none'
        rows={4}
        placeholder='리뷰 내용을 입력 해주세요'
      ></textarea>
      <button
        type='submit'
        className='block ml-auto px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none'
      >
        리뷰 작성
      </button>
    </form>
  );
};

export default CommentForm;
