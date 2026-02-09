'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/** Routes that only team leaders (church/ministry account) can access. Individual users are redirected to /dashboard. */
const TEAM_LEADER_ONLY_PREFIXES = [
  '/dashboard/teams',
  '/dashboard/members',
  '/dashboard/profile/church',
  '/dashboard/growth',
  '/dashboard/subscription',
  '/dashboard/account',
];

export default function RestrictTeamRoutes({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role === 'teamleader') return;
    const path = pathname ?? '';
    const isRestricted = TEAM_LEADER_ONLY_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
    if (isRestricted) {
      router.replace('/dashboard');
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
