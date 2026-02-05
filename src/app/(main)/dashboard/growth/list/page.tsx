'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/forms';
import StageOverviewChart from '@/components/dashboard/StageOverviewChart/StageOverviewChart';
import GrowthListTable from '@/components/dashboard/GrowthListTable/GrowthListTable';
import { useMyChurch, useChurchDashboard } from '@/hooks/use-dashboard';
import type { ChurchSummary } from '@/lib/types/dashboard';
import { generateDummyDashboardData } from '@/lib/utils/dummyData';
import { downloadCSV } from '@/lib/utils/export';
import styles from './page.module.scss';

const growthMembers = [
  { id: '1', name: 'John Doe', team: 'Youth Team', currentAreas: 'Teen Ministry', growthArea: 'Growing', stage: 'Completed' as const },
  { id: '2', name: 'Grace Park', team: 'Teen Team', currentAreas: 'Worship', growthArea: 'Active', stage: 'Pending' as const },
  { id: '3', name: 'Lucas Reed', team: 'Youth Team', currentAreas: 'Worship', growthArea: 'Deepening', stage: 'Completed' as const },
  { id: '4', name: 'Chris John', team: 'Youth Team', currentAreas: 'Worship', growthArea: 'Fruitful', stage: 'Completed' as const },
  { id: '5', name: 'Chris John', team: 'Teen Team', currentAreas: 'Worship', growthArea: 'Start', stage: 'Completed' as const },
  { id: '6', name: 'Chris John', team: 'Youth Team', currentAreas: 'Worship', growthArea: 'Active', stage: 'Completed' as const },
];

export default function GrowthListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  const { data: churchData } = useMyChurch();
  const churchId = (churchData as { church?: ChurchSummary } | undefined)?.church?.id;
  const { data: dashboardData, isLoading: dashboardLoading } = useChurchDashboard(churchId ?? null);
  const effectiveDashboardData = dashboardData ?? (dashboardLoading ? null : generateDummyDashboardData());

  const handleExportCSV = () => {
    const rows = growthMembers.map((m) => ({
      Member: m.name,
      Team: m.team,
      'Current areas': m.currentAreas,
      'Growth area': m.growthArea,
      Stage: m.stage,
    }));
    downloadCSV(rows, `growth-plans-list-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const filteredMembers = growthMembers.filter((member) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      member.name.toLowerCase().includes(q) ||
      member.team.toLowerCase().includes(q) ||
      member.growthArea.toLowerCase().includes(q);
    const matchesStage = !stageFilter || member.growthArea === stageFilter;
    const matchesTeam = !teamFilter || member.team === teamFilter;
    return matchesSearch && matchesStage && matchesTeam;
  });

  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Overzicht groeiplannen</h1>
          <p className={styles.subtitle}>
            Bekijk en volg alle gedeelde persoonlijke groeiplannen (PGP) binnen je kerk
          </p>
        </div>
        <Button variant="primary" type="button" className={styles.exportButton} onClick={handleExportCSV}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 14.167V15.833C2.5 16.2935 2.8731 16.6667 3.33333 16.6667H16.6667C17.1269 16.6667 17.5 16.2935 17.5 15.833V14.167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.83333 8.33333L10 12.5L14.1667 8.33333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 12.5V2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          CSV exporteren
        </Button>
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Fase-overzicht — kerkbreed</h2>
          <StageOverviewChart dashboardData={effectiveDashboardData} />
        </div>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.searchContainer}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon}>
            <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 19L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Zoek op lid, team of rol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filtersContainer}>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Filter op fase</option>
            <option value="Start">Start</option>
            <option value="Active">Active</option>
            <option value="Growing">Growing</option>
            <option value="Deepening">Deepening</option>
            <option value="Fruitful">Fruitful</option>
          </select>
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Filter by team</option>
            <option value="Youth Team">Youth Team</option>
            <option value="Teen Team">Teen Team</option>
          </select>
        </div>
      </div>

      <div className={styles.tableSection}>
        <GrowthListTable members={filteredMembers} />
      </div>
    </div>
  );
}
