'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

import { checkNicknameExists } from '@/app/api/private/auth';

// Email validation regex pattern
const emailPattern = /^[A-Z0-9._%+-]+@postech\.ac\.kr$/i;

export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      message: null,
      error: '로그인 실패. 이메일이나 패스워드를 확인 해주세요.',
    };
  }

  revalidatePath('/', 'layout');
  return { message: '로그인 성공', error: null };
}

export async function signup(
  email: string,
  nickname: string,
  password: string
) {
  const supabase = createClient();

  // Validate email format
  if (!emailPattern.test(email)) {
    return {
      message: null,
      error: 'Invalid email format. Please use a postech.ac.kr email address.',
    };
  }

  // Validate password format
  if (password.length < 6) {
    return {
      message: null,
      error: 'Password must be at least 6 characters long',
    };
  }

  // Validate nickname
  if (!nickname || nickname.trim().length === 0) {
    return { message: null, error: 'Nickname is required.' };
  }

  const nicknameExists = await checkNicknameExists(nickname);

  if (nicknameExists) {
    return {
      message: null,
      error: 'Nickname already exists. Please choose a different one.',
    };
  }

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        nickname: nickname,
      },
    },
  });

  if (error) {
    return { message: null, error: 'Signup failed. Please try again.' };
  }

  revalidatePath('/', 'layout');
  return { message: 'Signup successful', error: null };
}
