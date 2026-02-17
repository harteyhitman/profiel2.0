'use client';

import React, { useState } from 'react';
import RoleChart from '../RoleChart/RoleChart';
import { ROLE_COLORS, ROLES, RoleKey } from '@/lib/constants/questionnaire';
import { TeamSummary, RoleScores } from '@/lib/types/dashboard';
import styles from './TeamComparison.module.scss';
import Select from '@/components/ui/forms/Select/Select';
import Button from '@/components/ui/forms/Button/Button';
import { IoCloseCircleOutline, IoPeopleOutline } from 'react-icons/io5';

interface TeamComparisonProps {
  teams: TeamSummary[];
}

export default function TeamComparison({ teams }: TeamComparisonProps) {
  // State to keep track of the selected teams for comparison (max 3)
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [chartType, setChartType] = useState<'radar' | 'bar' | 'pie'>('radar');

  // Get the actual team objects for the selected IDs
  const selectedTeams = teams.filter(team => selectedTeamIds.includes(team.id));

  // Function to add a team to the comparison
  const addTeamToComparison = (teamIdStr: string) => {
    const teamId = parseInt(teamIdStr);
    if (!isNaN(teamId) && selectedTeamIds.length < 3 && !selectedTeamIds.includes(teamId)) {
      setSelectedTeamIds([...selectedTeamIds, teamId]);
    }
  };

  // Function to remove a team from the comparison
  const removeTeamFromComparison = (teamId: number) => {
    setSelectedTeamIds(selectedTeamIds.filter(id => id !== teamId));
  };

  // Calculate a simple "balance score" from the role distribution
  const calculateBalanceScore = (roleDistribution: RoleScores): number => {
    // Cast to record for iteration
    const scores = roleDistribution as unknown as Record<string, number>;
    const totalScore = Object.values(scores).reduce((sum, score) => sum + (score as number), 0);
    if (totalScore === 0) return 0;
    
    // Calculate the ideal even distribution (20% per role)
    const idealPercentage = 20;
    
    // Calculate the deviation from ideal for each role
    const deviations = Object.values(scores).map(score => {
      const percentage = (score as number) / totalScore * 100;
      return Math.abs(percentage - idealPercentage);
    });
    
    // Average deviation (lower is better)
    const avgDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;
    
    // Convert to a 0-100 scale where 100 is perfectly balanced
    return Math.round(100 - (avgDeviation * 1.25));
  };

  const chartTypeOptions = [
    { value: 'radar', label: 'Radar Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
  ];

  const teamOptions = teams
    .filter(team => !selectedTeamIds.includes(team.id))
    .map(team => ({
      value: team.id.toString(),
      label: team.name,
    }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Team Vergelijking</h2>
        <div className={styles.controls}>
          <div style={{ width: '200px' }}>
             <Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'radar' | 'bar' | 'pie')}
                options={chartTypeOptions}
                placeholder="Grafiektype"
             />
          </div>
        </div>
      </div>

      {/* Team Selection Area */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Teams Selecteren</h3>
          <p className={styles.cardDescription}>Kies maximaal 3 teams om te vergelijken</p>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.selectionArea}>
            {selectedTeamIds.length < 3 && (
              <div className={styles.addTeamWrapper}>
                <Select
                  value=""
                  onChange={(e) => addTeamToComparison(e.target.value)}
                  options={teamOptions}
                  placeholder="Voeg team toe"
                />
              </div>
            )}
            
            {selectedTeamIds.map(teamId => {
              const team = teams.find(t => t.id === teamId);
              if (!team) return null;
              
              return (
                <div key={teamId} className={styles.selectedTeamTag}>
                  <div className={styles.teamTagInfo}>
                    <span className={styles.teamTagName}>{team.name}</span>
                    <button 
                      className={styles.removeButton}
                      onClick={() => removeTeamFromComparison(teamId)}
                    >
                      <IoCloseCircleOutline size={20} />
                    </button>
                  </div>
                  <div className={styles.teamTagMeta}>
                    <IoPeopleOutline className={styles.icon} />
                    <span>{team.memberCount} leden</span>
                  </div>
                </div>
              );
            })}
            
            {selectedTeamIds.length === 0 && (
              <div className={styles.emptyState}>
                <p>Selecteer teams om te vergelijken</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Area */}
      {selectedTeams.length > 0 && (
        <div className={styles.comparisonGrid}>
          {selectedTeams.map(team => {
            const balanceScore = calculateBalanceScore(team.roleDistribution);
            const scores = team.roleDistribution as unknown as Record<string, number>;
            
            const dominantRole = Object.entries(scores)
              .reduce((max, [role, score]) => 
                (score as number) > max.score ? { role, score: score as number } : max, 
                { role: "", score: 0 }
              );
            
            const weakestRole = Object.entries(scores)
              .reduce((min, [role, score]) => 
                (score as number) < min.score || min.score === 0 ? { role, score: score as number } : min, 
                { role: "", score: Number.MAX_VALUE }
              );
            
            // Calculate total score
            const totalScore = Object.values(scores)
              .reduce((sum, score) => sum + (score as number), 0);
            
            // Calculate percentages for dominant and weakest roles
            const dominantPercentage = totalScore > 0 
              ? Math.round((dominantRole.score / totalScore) * 100) 
              : 0;
            
            const weakestPercentage = totalScore > 0 && weakestRole.score !== Number.MAX_VALUE
              ? Math.round((weakestRole.score / totalScore) * 100)
              : 0;

            return (
              <div key={team.id} className={styles.teamCard}>
                <div className={styles.teamCardHeader}>
                  <h3 className={styles.teamCardTitle}>{team.name}</h3>
                  <div className={styles.teamMeta}>
                    <IoPeopleOutline className={styles.icon} />
                    <span>{team.memberCount}</span>
                  </div>
                </div>
                <div className={styles.teamCardContent}>
                  <div className={styles.chartWrapper}>
                    <RoleChart 
                      results={team.roleDistribution} 
                      type={chartType} 
                      height={250}
                      width="100%"
                      showLegend={false}
                    />
                  </div>
                  
                  <div className={styles.statsGrid}>
                    {/* Balance Score */}
                    <div className={styles.statBox}>
                      <div className={styles.statLabel}>Balans</div>
                      <div className={styles.statValue}>
                        {balanceScore}%
                      </div>
                    </div>
                    
                    {/* Dominant Role */}
                    <div className={styles.statBox}>
                      <div className={styles.statLabel}>Sterkste</div>
                      <div className={styles.statValueWithDot}>
                        <div 
                          className={styles.roleDot} 
                          style={{ 
                            backgroundColor: ROLE_COLORS[dominantRole.role as RoleKey] || '#ccc'
                          }}
                        />
                        {dominantPercentage}%
                      </div>
                      <div className={styles.statSub}>{dominantRole.role}</div>
                    </div>
                    
                    {/* Weakest Role */}
                    <div className={styles.statBox}>
                      <div className={styles.statLabel}>Zwakste</div>
                      <div className={styles.statValueWithDot}>
                        {weakestRole.role && (
                          <>
                            <div 
                              className={styles.roleDot} 
                              style={{ 
                                backgroundColor: ROLE_COLORS[weakestRole.role as RoleKey] || '#ccc'
                              }}
                            />
                            {weakestPercentage}%
                          </>
                        )}
                      </div>
                      <div className={styles.statSub}>{weakestRole.role}</div>
                    </div>
                  </div>
                  
                  {/* Role Distribution Table */}
                  <div className={styles.distributionTable}>
                    <h4 className={styles.distributionTitle}>Rolverdeling</h4>
                    <div className={styles.distributionBars}>
                      {Object.entries(scores).map(([role, score]) => {
                        const percentage = totalScore > 0
                          ? Math.round(((score as number) / totalScore) * 100)
                          : 0;
                        
                        return (
                          <div key={role} className={styles.distributionCol}>
                            <div className={styles.barBackground}>
                              <div 
                                className={styles.barFill} 
                                style={{ 
                                  height: `${percentage}%`,
                                  backgroundColor: ROLE_COLORS[role as RoleKey] || '#ccc'
                                }}
                              />
                            </div>
                            <div className={styles.roleInitial}>{role.substring(0, 1).toUpperCase()}</div>
                            <div className={styles.percentageLabel}>{percentage}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
