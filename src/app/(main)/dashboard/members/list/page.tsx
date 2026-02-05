'use client';


import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMyChurch, useChurchMembers } from '@/hooks/use-dashboard';
import type { ChurchSummary } from '@/lib/types/dashboard';

import { Button } from '@/components/ui/forms';
import MemberListTable from '@/components/dashboard/MemberListTable/MemberListTable';
import InviteMemberModal from '@/components/dashboard/InviteMemberModal/InviteMemberModal';
import InvitationLinkModal from '@/components/dashboard/InvitationLinkModal/InvitationLinkModal';
import styles from './page.module.scss';


export default function MemberListPage() {
  const router = useRouter();
  const { data: churchData } = useMyChurch();
  const church = (churchData as { church?: ChurchSummary } | undefined)?.church;
  const churchId = church?.id;
  const { data: membersData, isLoading: membersLoading } = useChurchMembers(churchId ?? null);
  

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInvitationLinkModalOpen, setIsInvitationLinkModalOpen] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const inviteUrl = church?.inviteCode 
    ? `https://bedieningenprofiel.nl/join-church/${church.inviteCode}`
    : 'https://bedieningenprofiel.nl/join-church/Zwz_ykyRC_';

  // Transform members data for the table
  const members = useMemo(() => {
    if (!membersData) return [];
    return membersData.map((member: any) => ({
      id: member.id?.toString() || member.userId?.toString(),
      name: member.name || 'Onbekend',
      email: member.email || '',
      role: member.role || 'Lid',
      primaryControl: member.scores ? getDominantRole(member.scores) : 'N.v.t.',
      status: member.status || (member.scores ? 'Voltooid' : 'In afwachting'),
    }));
  }, [membersData]);

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const query = searchQuery.toLowerCase();
    return members.filter((member: any) =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  function getDominantRole(scores: any): string {
    if (!scores) return 'N.v.t.';
    const roles = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];
    let maxRole = roles[0];
    let maxScore = scores[roles[0]] || 0;
    roles.forEach(role => {
      if ((scores[role] || 0) > maxScore) {
        maxScore = scores[role];
        maxRole = role;
      }
    });
    return maxRole.charAt(0).toUpperCase() + maxRole.slice(1);
  }


  const handleGoBack = () => {
    router.push('/dashboard/members');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className={styles.page}>
        <button type="button" onClick={handleGoBack} className={styles.goBackButton}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          Terug

        </button>

        <div className={styles.headerSection}>
          <div className={styles.headerText}>

            <h1 className={styles.title}>Ledenlijst</h1>
            <p className={styles.subtitle}>
              Bekijk welke leden zich bij je team aansluiten en hun beoordelingen.

            </p>
          </div>
        </div>

        <div className={styles.actionsSection}>
          <div className={styles.leftActions}>
            <Button
              variant="outline"
              type="button"
              className={styles.inviteButton}
              onClick={() => setIsInviteModalOpen(true)}
            >
              Lid uitnodigen
            </Button>
            <Button
              variant="outline"
              type="button"
              className={styles.inviteButton}
              onClick={() => setIsInvitationLinkModalOpen(true)}
            >
              Uitnodigingslink
            </Button>
            <div className={styles.urlContainer}>
              <input
                type="text"
                value={inviteUrl}
                readOnly
                className={styles.urlInput}
              />
              <Button
                variant="secondary"
                type="button"
                onClick={handleCopy}
                className={styles.copyButton}
              >

                {copied ? 'Gekopieerd!' : 'Kopiëren'}

              </Button>
            </div>
          </div>
          <div className={styles.rightActions}>
            <div className={styles.searchContainer}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.searchIcon}
              >
                <path
                  d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 19L14.65 14.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Zoek naar lid"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filterContainer}>
              <button
                type="button"
                className={styles.filterButton}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5H17M5 10H15M7 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Filteren
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {showFilterDropdown && (
                <div className={styles.filterDropdown}>
                  <div className={styles.filterOption}>Alle leden</div>
                  <div className={styles.filterOption}>Voltooid</div>
                  <div className={styles.filterOption}>In afwachting</div>
                </div>
              )}
            </div>
          </div>
        </div>


        {membersLoading ? (
          <div>Leden laden...</div>
        ) : (
          <MemberListTable members={filteredMembers} />
        )}

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

