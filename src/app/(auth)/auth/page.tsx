'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * /auth redirects to the appropriate auth page based on URL params or defaults to /login.
 * Kept for compatibility with docs (e.g. redirect=verify-email, activeTab).
 */
function AuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = searchParams?.get('redirect');
    const activeTab = searchParams?.get('activeTab');
    const email = searchParams?.get('email');
    const token = searchParams?.get('token');

    if (redirect === 'verify-email' || email) {
      const params = new URLSearchParams();
      if (email) params.set('email', email);
      router.replace(`/verify-account?${params.toString()}`);
      return;
    }
    if (redirect === 'reset-password' && token) {
      router.replace(`/new-password?token=${encodeURIComponent(token)}`);
      return;
    }
    if (redirect === 'forgot-password') {
      router.replace('/forgot-password');
      return;
    }
    if (activeTab === 'register') {
      router.replace('/register');
      return;
    }

    router.replace('/login');
  }, [router, searchParams]);

  return null;
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthRedirect />
    </Suspense>
  );
}
