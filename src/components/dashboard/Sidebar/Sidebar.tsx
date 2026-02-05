'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import LogoutButton from '@/components/dashboard/LogoutButton/LogoutButton';
import { SIDEBAR_NAV_CONFIG, type NavItemConfig } from './sidebarNavConfig';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI } from '@/lib/api/dashboard';
import Logo from '../../../../public/navbar/brand-logo.png';
import styles from './Sidebar.module.scss';

/** Routes that use church data (dashboard, teams, members, profile). Prefetch on link hover. */
const CHURCH_PREFETCH_ROUTES = new Set([
  '/dashboard',
  '/dashboard/teams',
  '/dashboard/teams/list',
  '/dashboard/members',
  '/dashboard/members/list',
  '/dashboard/profile',
  '/dashboard/profile/church',
]);
const STALE_5M = 5 * 60 * 1000;

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function isMainNavActive(route: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (route === '/dashboard') {
    return pathname === '/dashboard' || pathname === '/dashboard/';
  }
  return pathname === route || pathname.startsWith(route + '/');
}

function getExpandedNavFromPath(pathname: string | null): string | null {
  if (!pathname) return null;
  if (pathname.startsWith('/dashboard/teams')) return 'Teams';
  if (pathname.startsWith('/dashboard/members')) return 'Leden';
  if (pathname.startsWith('/dashboard/profile')) return 'Profiel instellingen';
  if (pathname.startsWith('/dashboard/growth')) return 'Groei';
  if (pathname.startsWith('/dashboard/faqs')) return 'Veelgestelde vragen';
  return null;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [expandedNav, setExpandedNav] = useState<string | null>(null);
  const [showResultNav, setShowResultNav] = useState(false);

  const prefetchForRoute = useCallback(
    (route: string) => {
      if (!CHURCH_PREFETCH_ROUTES.has(route) || !user || user.role !== 'teamleader') return;
      queryClient
        .prefetchQuery({
          queryKey: ['churches', 'my'],
          queryFn: () => dashboardAPI.getMyChurch(),
          staleTime: STALE_5M,
        })
        .then((data) => {
          const churchId = (data as { church?: { id?: number } } | undefined)?.church?.id;
          if (!churchId) return;
          const id = Number(churchId);
          queryClient.prefetchQuery({
            queryKey: ['churches', id, 'dashboard'],
            queryFn: () => dashboardAPI.getChurchDashboard(id),
            staleTime: STALE_5M,
          });
          queryClient.prefetchQuery({
            queryKey: ['churches', id, 'members'],
            queryFn: () => dashboardAPI.getChurchMembers(id),
            staleTime: STALE_5M,
          });
          queryClient.prefetchQuery({
            queryKey: ['churches', 'stats', id],
            queryFn: () => dashboardAPI.getChurchStats(id),
            staleTime: STALE_5M,
          });
        })
        .catch(() => {});
    },
    [queryClient, user]
  );

  useEffect(() => {
    setShowResultNav(localStorage.getItem('showResultNav') === 'true');
  }, [pathname]);

  useEffect(() => {
    setExpandedNav(getExpandedNavFromPath(pathname));
  }, [pathname]);

  const toggleExpand = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedNav((prev) => (prev === label ? null : label));
  };

  const visibleItems = SIDEBAR_NAV_CONFIG.filter((item) => {
    if (item.label === 'Resultaat' && !showResultNav) return false;
    return true;
  });

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Image src={Logo} alt="Logo" width={60} height={60} />
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Menu sluiten"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {visibleItems.map((item) => (
          <NavRow
            key={item.label}
            item={item}
            pathname={pathname}
            expandedNav={expandedNav}
            onToggleExpand={toggleExpand}
            onPrefetchRoute={prefetchForRoute}
          />
        ))}

        <div className={styles.logoutSection}>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

interface NavRowProps {
  item: NavItemConfig;
  pathname: string | null;
  expandedNav: string | null;
  onToggleExpand: (e: React.MouseEvent, label: string) => void;
  onPrefetchRoute: (route: string) => void;
}

function NavRow({ item, pathname, expandedNav, onToggleExpand, onPrefetchRoute }: NavRowProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isMainActive = isMainNavActive(item.route, pathname);
  const isExpanded = expandedNav === item.label;

  return (
    <div className={styles.navBlock}>
      <div className={isMainActive ? styles.navItemActive : styles.navItem}>
        <Link
          href={item.route}
          className={styles.navLinkContent}
          aria-current={isMainActive ? 'page' : undefined}
          prefetch
          onMouseEnter={() => onPrefetchRoute(item.route)}
        >
          <span className={styles.navIcon}>{item.icon}</span>
          <span className={styles.navLabel}>{item.label}</span>
        </Link>
        {hasChildren && (
          <button
            type="button"
            className={styles.chevronButton}
            onClick={(e) => onToggleExpand(e, item.label)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Submenu sluiten' : 'Submenu openen'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${styles.dropdownIcon} ${isExpanded ? styles.expanded : ''}`}
            >
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className={styles.dropdownMenu}>
          {item.children!.map((child) => {
            const isChildActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={`${styles.dropdownItem} ${isChildActive ? styles.dropdownItemActive : ''}`}
                aria-current={isChildActive ? 'page' : undefined}
                prefetch
                onMouseEnter={() => onPrefetchRoute(child.href)}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
