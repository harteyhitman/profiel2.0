import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { ROLES, ROLE_COLORS, ROLE_LABELS, RoleKey } from '@/lib/constants/questionnaire';
import { calculatePrimaryRole, RoleScores } from '@/lib/utils/roleCalculations';
import { TeamMember } from '@/lib/types/dashboard';
import styles from './ProfileDistributionChart.module.scss';

interface ProfileDistributionChartProps {
  members: TeamMember[];
  title?: string;
  description?: string;
}

export default function ProfileDistributionChart({ 
  members, 
  title = "Profielverdeling", 
  description = "Verdeling van primaire en secundaire rollen in het team." 
}: ProfileDistributionChartProps) {
  
  // Calculate primary and secondary profile distributions using the shared utility
  const profileDistribution = useMemo(() => {
    // Initialize the result structure
    const result = ROLES.map(role => ({
      name: role,
      label: ROLE_LABELS[role],
      primary: 0,
      secondary: 0,
      primaryColor: ROLE_COLORS[role], // Solid color for primary
      secondaryColor: ROLE_COLORS[role] + '66', // Add transparency (hex alpha) for secondary
    }));
    
    // Filter members with a profile
    const membersWithProfiles = members.filter(member => 
      member.profile || member.scores
    );
    
    // Use the shared utility function to determine primary/secondary roles
    membersWithProfiles.forEach(member => {
      // Handle both profile and scores structure
      const memberScores = member.profile || member.scores;
      if (!memberScores) return;
      
      const scores: RoleScores = {
        apostle: memberScores.apostle || 0,
        prophet: memberScores.prophet || 0,
        evangelist: memberScores.evangelist || 0,
        herder: memberScores.herder || 0,
        teacher: memberScores.teacher || 0
      };
      
      // Calculate profile using our shared utility
      const profile = calculatePrimaryRole(scores);
      
      // Skip if no primary role was determined
      if (!profile.primaryRole) return;
      
      // Find primary role item and increment count
      const primaryItem = result.find(item => item.name === profile.primaryRole);
      if (primaryItem) primaryItem.primary += 1;
      
      // Check if there's a tie (very close scores)
      const isTie = profile.dominanceRatio < 0.1; // If the primary role has <10% more points than secondary
      
      // Handle secondary role
      if (profile.secondaryRole && !isTie) {
        const secondaryItem = result.find(item => item.name === profile.secondaryRole);
        if (secondaryItem) secondaryItem.secondary += 1;
      }
    });
    
    return result;
  }, [members]);
  
  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={profileDistribution}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar 
              dataKey="primary" 
              name="Primaire Rol" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
            >
              {profileDistribution.map((entry, index) => (
                <Cell key={`cell-primary-${index}`} fill={entry.primaryColor} />
              ))}
            </Bar>
            <Bar 
              dataKey="secondary" 
              name="Secundaire Rol" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
            >
              {profileDistribution.map((entry, index) => (
                <Cell key={`cell-secondary-${index}`} fill={entry.secondaryColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
