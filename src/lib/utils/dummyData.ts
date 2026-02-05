import type { ChurchDashboardResponse, RoleScores } from '@/lib/types/dashboard';

/**
 * Generate dummy data for dashboard when API doesn't return data
 */
export function generateDummyDashboardData(): ChurchDashboardResponse {
  // Fixed realistic values
  const totalMembers = 45;
  const totalTeams = 8;
  
  // Fixed role scores
  const totalScores: RoleScores = {
    apostle: 28,
    prophet: 32,
    evangelist: 26,
    herder: 24,
    teacher: 30,
  };
  
  // Calculate average from total
  const memberCount = totalMembers;
  const avgScores: RoleScores = {
    apostle: Math.round(totalScores.apostle / memberCount * 10) / 10,
    prophet: Math.round(totalScores.prophet / memberCount * 10) / 10,
    evangelist: Math.round(totalScores.evangelist / memberCount * 10) / 10,
    herder: Math.round(totalScores.herder / memberCount * 10) / 10,
    teacher: Math.round(totalScores.teacher / memberCount * 10) / 10,
  };

  // Generate dummy teams with fixed values
  const teams = Array.from({ length: totalTeams }, (_, i) => {
    const teamScores: RoleScores = {
      apostle: 25 + (i % 3),
      prophet: 30 + (i % 2),
      evangelist: 24 + (i % 4),
      herder: 22 + (i % 3),
      teacher: 28 + (i % 2),
    };
    const memberCount = 5 + (i % 4); // 5-8 members per team
    
    return {
      id: i + 1,
      name: `Team ${i + 1}`,
      memberCount,
      roleDistribution: teamScores,
    };
  });

  return {
    church: {
      id: 1,
      name: 'Sample Church',
      city: 'Amsterdam',
      denomination: 'Reformed',
      totalMembers,
      totalTeams,
    },
    teams,
    totalScores,
    averageScores: avgScores,
    aggregatedScores: totalScores,
  };
}

/**
 * Generate dummy member growth data
 */
export function generateDummyMemberGrowthData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseValue = 3;
  
  return months.map((month, index) => {
    // Fixed growth trend
    const growth = index * 0.4;
    const value = Math.max(1, Math.round(baseValue + growth));
    return { month, value };
  });
}

/**
 * Get dummy role for dominant role display
 */
export function getDummyDominantRole(): string {
  return 'Prophet';
}
