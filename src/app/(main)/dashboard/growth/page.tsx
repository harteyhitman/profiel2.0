'use client';

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/forms';
import MetricCard from '@/components/dashboard/MetricCard/MetricCard';
import StageOverviewChart from '@/components/dashboard/StageOverviewChart/StageOverviewChart';
import TopGrowthAreasChart from '@/components/dashboard/TopGrowthAreasChart/TopGrowthAreasChart';
import DistributionOfServicesChart from '@/components/dashboard/DistributionOfServicesChart/DistributionOfServicesChart';
import { useMyChurch, useChurchDashboard } from '@/hooks/use-dashboard';
import { generateDummyDashboardData, getDummyDominantRole } from '@/lib/utils/dummyData';

import { downloadCSV } from '@/lib/utils/export';
import styles from './page.module.scss';

export default function GrowthPage() {
  const { data: churchData } = useMyChurch();
  const churchId = churchData?.church?.id;
  const { data: dashboardData, isLoading: dashboardLoading } = useChurchDashboard(churchId);

  // Use dummy data if API doesn't return data
  const effectiveDashboardData = useMemo(() => {
    if (dashboardData) return dashboardData;
    if (dashboardLoading) return null;
    return generateDummyDashboardData();
  }, [dashboardData, dashboardLoading]);

  // Generate dummy metrics
  const totalMembers = useMemo(() => {
    return effectiveDashboardData?.church?.totalMembers || 45;
  }, [effectiveDashboardData]);

  const handleExportCSV = () => {
    const growthData = [
      { 'Member ID': '1', 'Name': 'Sample Member', 'Stage': 'Stage 1', 'Growth area': 'Prayer', 'Goal': 'Daily prayer', 'Status': 'Active' },
    ];
    downloadCSV(growthData, `growth-plans-${new Date().toISOString().split('T')[0]}.csv`);
  };


  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <div className={styles.headerText}>

          <h1 className={styles.title}>Overzicht groeiplannen</h1>
          <p className={styles.subtitle}>
            Bekijk en volg alle gedeelde persoonlijke groeiplannen (PGP) binnen je kerk
          </p>
        </div>
        <Button
          variant="primary"
          type="button"
          className={styles.exportButton}
          onClick={handleExportCSV}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 14.167V15.833C2.5 16.2935 2.8731 16.6667 3.33333 16.6667H16.6667C17.1269 16.6667 17.5 16.2935 17.5 15.833V14.167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.83333 8.33333L10 12.5L14.1667 8.33333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 12.5V2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          CSV exporteren
        </Button>
      </div>

      <div className={styles.metricsSection}>
        <MetricCard
          title="Totaal aantal leden"
          value={String(totalMembers).padStart(2, '0')}
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
          value={String(getDummyDominantRole() ?? '00').padStart(2, '0')}
          animate={false}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5301C20.3248 17.7739 20.3766 18.0359 20.3766 18.3006C20.3766 18.5652 20.3248 18.8272 20.2241 19.071C20.1235 19.3148 19.976 19.5354 19.79 19.721C19.6043 19.907 19.3837 20.0545 19.1399 20.1551C18.8961 20.2558 18.6341 20.3076 18.3695 20.3076C18.1048 20.3076 17.8428 20.2558 17.599 20.1551C17.3552 20.0545 17.1346 19.907 16.9486 19.721L16.8886 19.661C16.653 19.4305 16.3537 19.2758 16.0293 19.217C15.7049 19.1582 15.3703 19.1979 15.0686 19.331C14.9754 19.3708 14.8846 19.4176 14.797 19.471L14.697 19.541C13.7068 20.1363 12.5515 20.4572 11.367 20.464C10.1825 20.4708 9.02363 20.1635 8.027 19.576L7.927 19.506C7.64227 19.347 7.38005 19.1504 7.14799 18.922C6.91593 18.6936 6.71675 18.4359 6.556 18.156L6.486 18.056C5.89938 17.059 5.59195 15.9002 5.59876 14.7157C5.60557 13.5312 5.92649 12.3759 6.521 11.385L6.591 11.285C6.64441 11.1974 6.69119 11.1066 6.731 11.013C6.86412 10.7115 6.90382 10.3768 6.84504 10.0524C6.78626 9.728 6.63155 9.42869 6.401 9.193L6.341 9.133C6.15534 8.947 5.93472 8.79947 5.69092 8.69882C5.44712 8.59816 5.18511 8.54637 4.92047 8.54637C4.65583 8.54637 4.39382 8.59816 4.15002 8.69882C3.90622 8.79947 3.6856 8.947 3.5 9.133C3.31403 9.319 3.1665 9.53962 3.06585 9.78342C2.96519 10.0272 2.91341 10.2892 2.91341 10.5539C2.91341 10.8185 2.96519 11.0805 3.06585 11.3243C3.1665 11.5681 3.31403 11.7887 3.5 11.9747L3.56 12.0347C3.79555 12.2653 4.09486 12.4199 4.41925 12.4787C4.74365 12.5375 5.07831 12.4978 5.3799 12.3647C5.47308 12.3249 5.56389 12.2781 5.651 12.2247L5.751 12.1547C6.74219 11.5594 7.89749 11.2385 9.082 11.2317C10.2665 11.2249 11.4254 11.5323 12.422 12.119L12.522 12.189C12.8067 12.348 13.0689 12.5446 13.301 12.773C13.533 13.0014 13.7322 13.2591 13.893 13.539L13.963 13.639C14.5496 14.636 14.8571 15.7948 14.8503 16.9793C14.8434 18.1638 14.5225 19.3191 13.928 20.309L13.858 20.409C13.8046 20.4966 13.7578 20.5874 13.718 20.681C13.5849 20.9826 13.5452 21.3172 13.604 21.6416C13.6627 21.966 13.8175 22.2653 14.048 22.501L14.108 22.561C14.294 22.747 14.5146 22.8945 14.7584 22.9951C15.0022 23.0958 15.2642 23.1476 15.5289 23.1476C15.7935 23.1476 16.0555 23.0958 16.2993 22.9951C16.5431 22.8945 16.7637 22.747 16.9497 22.561L17.0097 22.501C17.2453 22.2705 17.5446 22.1158 17.869 22.057C18.1934 21.9982 18.528 22.0379 18.8296 22.171C18.9228 22.2108 19.0136 22.2576 19.101 22.311L19.201 22.381C20.1918 22.9763 21.3471 23.2972 22.5316 23.304C23.7161 23.3108 24.875 23.0034 25.871 22.416L25.971 22.346C26.2557 22.187 26.5179 21.9904 26.75 21.762C26.9821 21.5336 27.1812 21.2759 27.342 20.996L27.412 20.896C27.9986 19.899 28.3061 18.7402 28.2993 17.5557C28.2924 16.3712 27.9715 15.2159 27.377 14.225L27.307 14.125C27.2536 14.0374 27.2068 13.9466 27.167 13.853C27.0339 13.5515 26.9942 13.2168 27.053 12.8924C27.1117 12.568 27.2665 12.2687 27.497 12.033L27.557 11.973C27.743 11.787 27.9636 11.6395 28.2074 11.5388C28.4512 11.4382 28.7132 11.3864 28.9778 11.3864C29.2425 11.3864 29.5045 11.4382 29.7483 11.5388C29.9921 11.6395 30.2127 11.787 30.3987 11.973L30.4587 12.033C30.6943 12.2635 30.9936 12.4182 31.318 12.477C31.6424 12.5358 31.977 12.4961 32.2786 12.363C32.3718 12.3232 32.4626 12.2764 32.55 12.223L32.65 12.153C33.6408 11.5577 34.7961 11.2368 35.9806 11.23C37.1651 11.2232 38.324 11.5306 39.32 12.117L39.42 12.187C39.7047 12.346 39.9669 12.5426 40.199 12.771C40.4311 13.0004 40.6302 13.2581 40.791 13.537L40.861 13.637C41.4476 14.634 41.7551 15.7928 41.7483 16.9773C41.7414 18.1618 41.4205 19.3171 40.826 20.307L40.756 20.407C40.7026 20.4946 40.6558 20.5854 40.616 20.679C40.4829 20.9806 40.4432 21.3152 40.502 21.6396C40.5607 21.964 40.7155 22.2633 40.946 22.499L41.006 22.559C41.192 22.745 41.4126 22.8925 41.6564 22.9931C41.9002 23.0938 42.1622 23.1456 42.4269 23.1456C42.6915 23.1456 42.9535 23.0938 43.1973 22.9931C43.4411 22.8925 43.6617 22.745 43.8477 22.559L43.9077 22.499C44.1433 22.2685 44.4426 22.1138 44.767 22.055C45.0914 21.9962 45.426 22.0359 45.7276 22.169C45.8208 22.2088 45.9116 22.2556 45.999 22.309L46.099 22.379C47.0898 22.9743 48.2451 23.2952 49.4296 23.302C50.6141 23.3088 51.773 23.0014 52.769 22.414L52.869 22.344C53.1537 22.185 53.4159 21.9884 53.648 21.76C53.8801 21.5316 54.0792 21.2739 54.24 20.994L54.31 20.894C54.8966 19.897 55.2041 18.7382 55.1973 17.5537C55.1904 16.3692 54.8695 15.2139 54.275 14.223L54.205 14.123C54.1516 14.0354 54.1048 13.9446 54.065 13.851C53.9319 13.5495 53.8922 13.2148 53.951 12.8904C54.0097 12.566 54.1645 12.2667 54.395 12.031L54.455 11.971C54.641 11.785 54.8616 11.6375 55.1054 11.5368C55.3492 11.4362 55.6112 11.3844 55.8758 11.3844C56.1405 11.3844 56.4025 11.4362 56.6463 11.5368C56.8901 11.6375 57.1107 11.787 57.2967 11.973L57.3567 12.033C57.5923 12.2635 57.8916 12.4182 58.216 12.477C58.5404 12.5358 58.875 12.4961 59.1766 12.363C59.2698 12.3232 59.3606 12.2764 59.448 12.223L59.548 12.153C60.5388 11.5577 61.6941 11.2368 62.8786 11.23C64.0631 11.2232 65.222 11.5306 66.218 12.117L66.318 12.187" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <MetricCard
          title="Laagste bediening"
          value={String(getDummyDominantRole() ?? '00').padStart(2, '0')}
          animate={false}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1674 16.5523C21.6304 15.8519 20.8833 15.3516 20.04 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
      </div>

      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Fase-overzicht — kerkbreed</h2>
          <StageOverviewChart dashboardData={effectiveDashboardData} />
        </div>

        <div className={styles.twoColRow}>
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Top 5 groeigebieden (doelen)</h2>
            <TopGrowthAreasChart dashboardData={effectiveDashboardData} />
          </div>
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Verdeling van bedieningen</h2>
            <p className={styles.chartSubtitle}>Percentuele verdeling van primaire bedieningen</p>
            <DistributionOfServicesChart dashboardData={effectiveDashboardData} />
          </div>
        </div>
      </div>
    </div>
  );
}

