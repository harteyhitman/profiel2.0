'use client';

import React, { useState, useMemo } from 'react';
import { useMyChurch, useChurchMembers, useChurchDashboard } from '@/hooks/use-dashboard';
import { generateDummyDashboardData, getDummyDominantRole } from '@/lib/utils/dummyData';
import type { ChurchSummary, RoleScores } from '@/lib/types/dashboard';
import MetricCard from '@/components/dashboard/MetricCard/MetricCard';
import ControlsDistributionChart from '@/components/dashboard/ControlsDistributionChart/ControlsDistributionChart';
import AverageScoresChart from '@/components/dashboard/AverageScoresChart/AverageScoresChart';
import DistributionOfServicesChart from '@/components/dashboard/DistributionOfServicesChart/DistributionOfServicesChart';
import InviteMemberModal from '@/components/dashboard/InviteMemberModal/InviteMemberModal';
import InvitationLinkModal from '@/components/dashboard/InvitationLinkModal/InvitationLinkModal';
import { downloadCSV } from '@/lib/utils/export';
import styles from './page.module.scss';

export default function MembersPage() {
  const { data: churchData } = useMyChurch();
  const churchId = (churchData as { church: ChurchSummary } | undefined)?.church?.id ?? null;
  const { data: membersData, isLoading: membersLoading } = useChurchMembers(churchId);
  const { data: dashboardData, isLoading: dashboardLoading } = useChurchDashboard(churchId);

  const effectiveDashboardData = useMemo(() => {
    if (dashboardData) return dashboardData;
    if (dashboardLoading) return null;
    return generateDummyDashboardData();
  }, [dashboardData, dashboardLoading]);

  const effectiveMembersData = useMemo(() => {
    if (membersData && membersData.length > 0) return membersData;
    if (membersLoading) return null;
    return Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      userId: i + 1,
      name: `Member ${i + 1}`,
      email: `member${i + 1}@example.com`,
      role: 'Member',
      status: 'Active',
      scores: {
        apostle: 25 + (i % 5),
        prophet: 30 + (i % 4),
        evangelist: 24 + (i % 6),
        herder: 22 + (i % 5),
        teacher: 28 + (i % 4),
      },
    }));
  }, [membersData, membersLoading]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInvitationLinkModalOpen, setIsInvitationLinkModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const church = (churchData as { church: ChurchSummary } | undefined)?.church;
  const inviteUrl = church?.inviteCode
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://bedieningenprofiel.nl'}/join-church/${church.inviteCode}`
    : '';

  const handleCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadReport = () => {
    if (!effectiveMembersData?.length) return;
    const csvData = effectiveMembersData.map((member: any) => ({
      'ID': member.id ?? member.userId ?? '',
      'Name': member.name ?? '',
      'Email': member.email ?? '',
      'Role': member.role ?? '',
      'Apostle Score': member.scores?.apostle ?? 0,
      'Prophet Score': member.scores?.prophet ?? 0,
      'Evangelist Score': member.scores?.evangelist ?? 0,
      'Shepherd Score': member.scores?.herder ?? 0,
      'Teacher Score': member.scores?.teacher ?? 0,
      'Status': member.status ?? 'Active',
    }));
    downloadCSV(csvData, `member-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const scores = effectiveDashboardData?.aggregatedScores;
  const totalMembers = effectiveMembersData?.length ?? 0;
  const dominantControl = getDominantRole(scores) || getDummyDominantRole();
  const lowestService = getLowestService(scores) || getDummyDominantRole();

  return (
    <>
      <div className={styles.page}>
        <div className={styles.headerSection}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Member Dashboard</h1>
            <p className={styles.subtitle}>
              Gain insight into the composition and ministry profiles of your church
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadReport}
            className={styles.downloadButton}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M10 2V14M10 14L6 10M10 14L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 16V17C2 17.5523 2.44772 18 3 18H17C17.5523 18 18 17.5523 18 17V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Download report
          </button>
        </div>

        <div className={styles.inviteSection}>
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className={styles.inviteButton}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M17 19V17C17 15.9391 16.5786 14.9217 15.8284 14.1716C15.0783 13.4214 14.0609 13 13 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9C11.2091 9 13 7.20914 13 5C13 2.79086 11.2091 1 9 1C6.79086 1 5 2.79086 5 5C5 7.20914 6.79086 9 9 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 19V17C18.9993 16.1137 18.7044 15.2528 18.1674 14.5523C17.6304 13.8519 16.8833 13.3516 16.04 13.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Lid uitnodigen
          </button>
          <button
            type="button"
            onClick={() => setIsInvitationLinkModalOpen(true)}
            className={styles.inviteButton}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M8.333 11.667L11.667 8.333M7.5 5L5 7.5C3.622 8.878 3.622 11.122 5 12.5C6.378 13.878 8.622 13.878 10 12.5L12.5 10M12.5 10L15 7.5C16.378 6.122 16.378 3.878 15 2.5C13.622 1.122 11.378 1.122 10 2.5L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Uitnodigingslink
          </button>
          {inviteUrl ? (
            <div className={styles.urlContainer}>
              <span className={styles.urlText}>{inviteUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className={styles.copyButton}
                aria-label={copied ? 'Gekopieerd' : 'Kopiëren'}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 11V3C3 2.44772 3.44772 2 4 2H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {copied ? 'Gekopieerd' : 'Kopiëren'}
              </button>
            </div>
          ) : null}
        </div>

        <div className={styles.metricsGrid}>
          <MetricCard
            title="Total number of members"
            value={totalMembers}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1674 16.5523C21.6304 15.8519 20.8833 15.3516 20.04 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <MetricCard
            title="Dominant control"
            value={dominantControl}
            animate={false}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 16.1137 22.7044 15.2528 22.1674 14.5523C21.6304 13.8519 20.8833 13.3516 20.04 13.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <MetricCard
            title="Lowest service"
            value={lowestService}
            animate={false}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
          />
        </div>

        <div className={styles.chartsGrid}>
          <ControlsDistributionChart dashboardData={effectiveDashboardData} />
          <AverageScoresChart dashboardData={effectiveDashboardData} />
        </div>

        <div className={styles.distributionSection}>
          <DistributionOfServicesChart dashboardData={effectiveDashboardData} />
        </div>
      </div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
      <InvitationLinkModal
        isOpen={isInvitationLinkModalOpen}
        onClose={() => setIsInvitationLinkModalOpen(false)}
      />
    </>
  );
}

const ROLE_KEYS: (keyof RoleScores)[] = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];

function getDominantRole(scores: RoleScores | undefined): string {
  if (!scores) return '';
  let maxRole = ROLE_KEYS[0];
  let maxScore = scores[ROLE_KEYS[0]] ?? 0;
  ROLE_KEYS.forEach((role) => {
    const v = scores[role] ?? 0;
    if (v > maxScore) {
      maxScore = v;
      maxRole = role;
    }
  });
  return maxRole.charAt(0).toUpperCase() + maxRole.slice(1);
}

function getLowestService(scores: RoleScores | undefined): string {
  if (!scores) return '';
  let minRole = ROLE_KEYS[0];
  let minScore = scores[ROLE_KEYS[0]] ?? Infinity;
  ROLE_KEYS.forEach((role) => {
    const v = scores[role] ?? 0;
    if (v < minScore) {
      minScore = v;
      minRole = role;
    }
  });
  return minRole.charAt(0).toUpperCase() + minRole.slice(1);
}
