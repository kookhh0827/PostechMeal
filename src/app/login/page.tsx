'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';

import Button from '@/components/buttons/Button';

import { login } from '@/app/api/public/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('이메일을 입력 해주세요');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('패스워드를 입력 해주세요');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);

      const { error } = await login(new FormData(e.currentTarget));

      setIsLoading(false);

      if (error) {
        Swal.fire({
          icon: 'error',
          title: '로그인 실패',
          text: error,
        });
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-[95%] md:max-w-md'>
        <h2 className='text-2xl font-bold mb-6'>로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block mb-2 font-bold text-gray-700'
            >
              이메일
            </label>
            <input
              type='email'
              id='email'
              name='email'
              className={`w-full px-3 py-2 border ${
                emailError ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:border-blue-500`}
              placeholder='이메일 입력'
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <p className='text-red-500 text-sm mt-1'>{emailError}</p>
            )}
          </div>
          <div className='mb-6'>
            <label
              htmlFor='password'
              className='block mb-2 font-bold text-gray-700'
            >
              패스워드
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className={`w-full px-3 py-2 border ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:border-blue-500`}
              placeholder='패스워드 입력'
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <p className='text-red-500 text-sm mt-1'>{passwordError}</p>
            )}
          </div>
          <Button
            type='submit'
            variant='primary'
            size='base'
            isLoading={isLoading}
            className='block mx-auto'
          >
            로그인
          </Button>
        </form>
        <p className='mt-4 text-center'>
          아직 계정이 없으신가요?{' '}
          <Link href='/signup' className='text-blue-500 hover:underline'>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
