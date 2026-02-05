'use client';

import React, { useState, useMemo } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/forms';

import { useMyChurch, useAvailableMembers } from '@/hooks/use-dashboard';
import type { ChurchSummary } from '@/lib/types/dashboard';
import styles from './AddMemberModal.module.scss';
import { CiSearch } from 'react-icons/ci';

interface Member {
  id: string;
  name: string;
  email?: string;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName?: string;
  teamId?: string | number | null;
  onAddMembers?: (memberIds: string[]) => void;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  teamName = 'team',
  teamId,
  onAddMembers,
}: AddMemberModalProps) {
  const { data: churchData } = useMyChurch();
  const churchId = (churchData as { church: ChurchSummary } | undefined)?.church?.id ?? null;

  const { data: availableMembers, isLoading } =
    useAvailableMembers(churchId, teamId);

  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const members: Member[] = useMemo(() => {
    if (!availableMembers) return [];
    return availableMembers.map((m: any) => ({
      id: String(m.id ?? m.userId),
      name: m.name ?? 'Unknown',
      email: m.email,
    }));
  }, [availableMembers]);

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const q = searchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q)
    );
  }, [members, searchQuery]);

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!selectedMembers.size) return;
    onAddMembers?.(Array.from(selectedMembers));
    setSelectedMembers(new Set());
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add member"
      showCloseButton
      size="medium"
      closeOnOverlayClick={false}
    >
      <div className={styles.wrapper}>
        <p className={styles.helperText}>
          Selecteer de leden die je’d like to add to the {teamName} wilt toevoegen
        </p>

        {/* Search */}
        <div className={styles.search}>
        <CiSearch className={styles.searchIcon} />
          <input
            placeholder="Zoek naar lid"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* List */}
        <div className={styles.list}>
          {isLoading && <div className={styles.state}>Leden laden…</div>}

          {!isLoading && filteredMembers.length === 0 && (
            <div className={styles.state}>Geen leden gevonden</div>
          )}

          {filteredMembers.map((member) => {
            const checked = selectedMembers.has(member.id);
            return (
              <div
                key={member.id}
                className={styles.row}
                onClick={() => toggleMember(member.id)}
              >
                <span className={styles.name}>{member.name}</span>

                <span
                  className={`${styles.checkbox} ${
                    checked ? styles.checked : ''
                  }`}
                >
                  {checked && '✓'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Sticky CTA */}
        <div className={styles.footer}>
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={!selectedMembers.size}
          >
            Leden toevoegen
          </Button>
        </div>
      </div>
    </Modal>
  );
}
