'use client';
import { Suspense } from 'react';
import RegisterFormWithParams from '@/components/RegisterForm'

export default function RoommateProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterFormWithParams />
    </Suspense>
  );
}