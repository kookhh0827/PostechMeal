'use client';
import Link from 'next/link';
import { useState } from 'react';
import Swal from 'sweetalert2';

import Button from '@/components/buttons/Button';

import { checkNicknameExists } from '@/app/api/private/auth';
import { signup } from '@/app/api/public/auth';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [password1, setPassword1] = useState('');
  const [password1Error, setPassword1Error] = useState('');
  const [password2, setPassword2] = useState('');
  const [password2Error, setPassword2Error] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('이메일을 입력 해주세요.');
      return false;
    } else if (!value.endsWith('@postech.ac.kr')) {
      setEmailError('postech.ac.kr 도메인만 사용 가능합니다.');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validateNickname = (value: string) => {
    if (!value) {
      setNicknameError('닉네임을 입력 해주세요.');
      return false;
    }

    setNicknameError('');
    return true;
  };

  const validateDuplicateNickname = async (value: string) => {
    const nicknameExists = await checkNicknameExists(value);

    if (nicknameExists) {
      setNicknameError('이미 사용중인 닉네임입니다.');
      return false;
    }

    // setNicknameError('');
    return true;
  };

  const validatePassword1 = (value: string) => {
    if (!value) {
      setPassword1Error('패스워드를 입력 해주세요.');
      return false;
    } else if (value.length < 6) {
      setPassword1Error('패스워드는 6자 이상이어야 합니다.');
      return false;
    } else {
      setPassword1Error('');
      return true;
    }
  };

  const validatePassword2 = (value: string) => {
    if (!value) {
      setPassword2Error('패스워드 확인을 입력 해주세요.');
      return false;
    } else if (value !== password1) {
      setPassword2Error('패스워드가 일치하지 않습니다.');
      return false;
    } else {
      setPassword2Error('');
      return true;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    validateNickname(value);
  };

  const handlePassword1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword1(value);
    validatePassword1(value);
  };

  const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword2(value);
    validatePassword2(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isNicknameValid = validateNickname(nickname);
    const isNicknameUnique =
      isNicknameValid && (await validateDuplicateNickname(nickname));
    const isPassword1Valid = validatePassword1(password1);
    const isPassword2Valid = validatePassword2(password2);

    if (
      isEmailValid &&
      isNicknameValid &&
      isNicknameUnique &&
      isPassword1Valid &&
      isPassword2Valid
    ) {
      setIsLoading(true);

      const { error } = await signup(email, nickname, password1);

      setIsLoading(false);

      if (error) {
        Swal.fire({
          icon: 'error',
          title: '회원가입 실패',
          text: '오류가 발생했습니다. 잠시 후 다시 시도해주시기 바랍니다.',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '회원가입 성공',
          text: '회원가입에 성공하였습니다. 이메일 인증 후 로그인 하실 수 있습니다. 우편함을 확인 해주세요.',
        }).then(() => {
          // Reset form fields
          setEmail('');
          setNickname('');
          setPassword1('');
          setPassword2('');
        });
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-[95%] md:max-w-md'>
        <h2 className='text-2xl font-bold mb-6'>회원가입</h2>
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
              className={`w-full px-3 py-2 border ${
                emailError ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:border-blue-500`}
              placeholder='포스텍 이메일을 입력 해주세요'
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <p className='text-red-500 text-sm mt-1'>{emailError}</p>
            )}
          </div>
          <div className='mb-4'>
            <label
              htmlFor='nickname'
              className='block mb-2 font-bold text-gray-700'
            >
              닉네임
            </label>
            <input
              type='text'
              id='nickname'
              className={`w-full px-3 py-2 border ${
                nicknameError ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:border-blue-500`}
              placeholder='사용하실 닉네임을 입력 해주세요'
              value={nickname}
              onChange={handleNicknameChange}
            />
            {nicknameError && (
              <p className='text-red-500 text-sm mt-1'>{nicknameError}</p>
            )}
          </div>
          <div className='mb-4'>
            <label
              htmlFor='password1'
              className='block mb-2 font-bold text-gray-700'
            >
              패스워드
            </label>
            <input
              type='password'
              id='password1'
              className={`w-full px-3 py-2 border ${
                password1Error ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:border-blue-500`}
              placeholder='패스워드를 입력 해주세요'
              value={password1}
              onChange={handlePassword1Change}
            />
            {password1Error && (
              <p className='text-red-500 text-sm mt-1'>{password1Error}</p>
            )}
          </div>
          <div className='mb-6'>
            <label
              htmlFor='password2'
              className='block mb-2 font-bold text-gray-700'
            >
              패스워드 확인
            </label>
            <input
              type='password'
              id='password2'
              className={`w-full px-3 py-2 border ${
                password2Error ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:border-blue-500`}
              placeholder='패스워드 확인을 입력 해주세요'
              value={password2}
              onChange={handlePassword2Change}
            />
            {password2Error && (
              <p className='text-red-500 text-sm mt-1'>{password2Error}</p>
            )}
          </div>
          <Button
            type='submit'
            variant='primary'
            size='base'
            isLoading={isLoading}
            className='block mx-auto'
          >
            회원가입
          </Button>
        </form>
        <p className='mt-4 text-center'>
          이미 계정이 있으신가요?{' '}
          <Link href='/login' className='text-blue-500 hover:underline'>
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
