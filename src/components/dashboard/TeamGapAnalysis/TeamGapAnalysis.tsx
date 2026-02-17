import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { IoAlertCircleOutline, IoCheckmarkCircleOutline, IoWarningOutline } from "react-icons/io5";
import styles from "./TeamGapAnalysis.module.scss";
import { ROLE_COLORS, ROLES, ROLES_MAP, roleNormalizer, RoleKey } from "@/lib/constants/questionnaire";
import { RoleScores, TeamMember, TeamSummary } from "@/lib/types/dashboard";

interface TeamGapAnalysisProps {
  teamMembers: TeamMember[];
  teamRoleScores: RoleScores;
  teams?: TeamSummary[]; // For church-level analysis with multiple teams
}

interface TeamWithGap {
  id: number;
  name: string;
  gaps: {
    role: string;
    percentage: number;
    status: "severe" | "moderate" | "balanced";
  }[];
  weakestRole: string;
  balanceScore: number;
}

export const TeamGapAnalysis: React.FC<TeamGapAnalysisProps> = ({
  teamMembers,
  teamRoleScores,
  teams = [],
}) => {
  // Determine if we're viewing church-level or team-level data
  const isChurchView = teams && teams.length > 0;
  
  // Active tab state for church level view
  const [activeTab, setActiveTab] = useState<"overview" | "teams">("overview");

  // Calculate ideal distribution (percentage) for each role
  const idealDistribution = Object.values(ROLES).reduce<Record<string, number>>(
    (acc, role) => {
      acc[role] = 100 / Object.values(ROLES).length; // Equal distribution (20% each for 5 roles)
      return acc;
    },
    {}
  );

  // Calculate current distribution (percentage)
  const totalScore = Object.values(teamRoleScores).reduce(
    (sum, score) => sum + (score as number),
    0
  );
  
  const currentDistribution = Object.entries(teamRoleScores).reduce<
    Record<string, number>
  >((acc, [role, score]) => {
    acc[role] = totalScore > 0 ? ((score as number) / totalScore) * 100 : 0;
    return acc;
  }, {});

  // Calculate gaps
  const gaps = Object.entries(idealDistribution).reduce<Record<string, number>>(
    (acc, [role, idealPercentage]) => {
      const currentPercentage = currentDistribution[role] || 0;
      acc[role] = idealPercentage - currentPercentage;
      return acc;
    },
    {}
  );

  // Prepare data for the chart
  const chartData = Object.entries(gaps).map(([role, gap]) => ({
    role: roleNormalizer(role),
    originalRole: role,
    gap: Math.round(gap),
    color: ROLE_COLORS[role as RoleKey] || '#888888',
  }));

  // Identify roles with significant gaps (more than 5% below ideal)
  const significantGaps = Object.entries(gaps)
    .filter(([_, gap]) => gap > 5)
    .sort(([, gapA], [, gapB]) => gapB - gapA);

  // Calculate balance score (higher is better balance)
  const balanceScore = useMemo(() => {
    if (totalScore === 0) return 0;

    // Calculate variance from ideal
    const idealPercentage = 100 / Object.keys(ROLES).length;
    const varianceSum = Object.values(currentDistribution).reduce(
      (sum, percentage) => sum + Math.pow(percentage - idealPercentage, 2),
      0
    );

    // Convert to a 0-100 score where 100 is perfect balance
    // The formula is (1 - normalized_variance) * 100
    // We cap the variance at 1000 to avoid negative scores
    const maxVariance = 1000;
    const normalizedVariance = Math.min(varianceSum / maxVariance, 1);
    return Math.round((1 - normalizedVariance) * 100);
  }, [currentDistribution, totalScore]);

  // Calculate team-level gap analysis for church dashboard
  const teamGapAnalysis = useMemo(() => {
    if (!teams || teams.length === 0) return [];

    return teams
      .map((team) => {
        const roleDistribution = team.roleDistribution as unknown as Record<string, number> || {};
        const teamTotalScore = Object.values(roleDistribution).reduce(
          (sum: number, score) => sum + (score as number),
          0
        );

        // Calculate percentages
        const teamPercentages = Object.entries(roleDistribution).reduce(
          (acc, [role, score]) => {
            acc[role] =
              teamTotalScore > 0
                ? ((score as number) / teamTotalScore) * 100
                : 0;
            return acc;
          },
          {} as Record<string, number>
        );

        // Calculate gaps
        const teamGaps = Object.entries(idealDistribution).map(
          ([role, idealPercentage]) => {
            const currentPercentage = teamPercentages[role] || 0;
            const gap = idealPercentage - currentPercentage;

            // Determine status based on gap size
            let status: "severe" | "moderate" | "balanced" = "balanced";
            if (gap > 10) status = "severe";
            else if (gap > 5) status = "moderate";

            return {
              role,
              percentage: Math.round(gap),
              status,
            };
          }
        );

        // Find the weakest role
        const weakestRoleGap = [...teamGaps].sort(
          (a, b) => b.percentage - a.percentage
        )[0];

        // Calculate team balance score
        const idealPercentage = 100 / Object.keys(ROLES).length;
        const varianceSum = Object.values(teamPercentages).reduce(
          (sum: number, percentage) =>
            sum + Math.pow(percentage - idealPercentage, 2),
          0
        );

        const maxVariance = 1000;
        const normalizedVariance = Math.min(varianceSum / maxVariance, 1);
        const teamBalanceScore = Math.round((1 - normalizedVariance) * 100);

        return {
          id: team.id,
          name: team.name,
          gaps: teamGaps,
          weakestRole: weakestRoleGap?.role || "",
          balanceScore: teamBalanceScore,
        } as TeamWithGap;
      })
      .sort((a, b) => a.balanceScore - b.balanceScore); // Sort by balance score (worst first)
  }, [teams, idealDistribution]);

  const roleRecommendations = {
    [ROLES_MAP.APOSTLE]:
      "Apostelen leggen fundamenten en starten nieuwe initiatieven. Overweeg om nieuwe projecten te starten of teams in nieuwe richtingen te leiden.",
    [ROLES_MAP.PROPHET]:
      "Profeten geven visie en corrigeren waar nodig. Zoek naar mensen die kunnen helpen met heldere visievorming en het bewaken van kernwaarden.",
    [ROLES_MAP.EVANGELIST]:
      "Evangelisten delen het goede nieuws en betrekken nieuwe mensen. Focus op groei en het bereiken van mensen buiten je huidige kringen.",
    [ROLES_MAP.HERDER]:
      "Herders zorgen voor mensen en bouwen gemeenschap. Versterk pastorale zorg en onderlinge verbinding in je teams.",
    [ROLES_MAP.TEACHER]:
      "Leraars brengen diepte en helpen mensen groeien in kennis. Investeer in onderwijs en toerusting van je teamleden.",
  };

  return (
    <div className={styles.container}>
      {isChurchView && (
        <div className={styles.tabsList}>
          <button 
            className={`${styles.tabTrigger} ${activeTab === "overview" ? styles.active : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overzicht
          </button>
          <button 
            className={`${styles.tabTrigger} ${activeTab === "teams" ? styles.active : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            Teams Analyse
          </button>
        </div>
      )}

      {(!isChurchView || activeTab === "overview") && (
        <div className={styles.contentSpace}>
          <div className={styles.metricsGrid}>
            {/* Balance Score Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardDescription}>Balans Score</div>
                <h3 className={styles.cardTitleBig}>
                  {balanceScore}/100
                </h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${balanceScore}%` }}
                  />
                </div>
                <p className={styles.statusText}>
                  {balanceScore >= 80
                    ? "Uitstekende balans"
                    : balanceScore >= 60
                    ? "Goede balans"
                    : balanceScore >= 40
                    ? "Redelijke balans"
                    : "Verbetering nodig"}
                </p>
              </div>
            </div>

            {/* Teams with Gaps (Only for Church View) */}
            {isChurchView && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardDescription}>Teams met Hiaten</div>
                  <h3 className={styles.cardTitleBig}>
                    {
                      teamGapAnalysis.filter((t) =>
                        t.gaps.some((g) => g.status === "severe")
                      ).length
                    }
                  </h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.badgeWrapper}>
                    {teamGapAnalysis.filter((t) =>
                      t.gaps.some((g) => g.status === "severe")
                    ).length > 0 ? (
                      <span className={`${styles.badge} ${styles.badgeDestructive}`}>
                        Aandacht nodig
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                        Geen ernstige hiaten
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Most Missing Role */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardDescription}>Meest Ontbrekende Rol</div>
                <h3 className={styles.cardTitleBigWithIcon}>
                  {significantGaps.length > 0 ? (
                    <>
                      <div
                        className={styles.roleDotLarge}
                        style={{
                          backgroundColor: ROLE_COLORS[significantGaps[0][0] as RoleKey] || '#ccc',
                        }}
                      />
                      {significantGaps[0][0]}
                    </>
                  ) : (
                    "Geen significante hiaten"
                  )}
                </h3>
              </div>
              <div className={styles.cardContent}>
                {significantGaps.length > 0 && (
                  <p className={styles.statusText}>
                    {Math.abs(Math.round(significantGaps[0][1]))}% onder ideaal
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gap Analysis Chart */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Kerkbrede Rollenanalyse</h3>
              <div className={styles.cardDescription}>
                Verschil tussen huidige en ideale verdeling van rollen
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="role" />
                    <YAxis
                      label={{
                        value: "Verschil met ideale verdeling (%)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Verschil"]}
                      labelFormatter={(label) => `Rol: ${label}`}
                      cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    />
                    <Legend />
                    <Bar
                      dataKey="gap"
                      name="Verschil met ideaal"
                      radius={[4, 4, 0, 0]}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.gap > 0 ? entry.color : "#888888"}
                          style={{ opacity: Math.abs(entry.gap) / 20 + 0.5 }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Aanbevelingen</h3>
              <div className={styles.cardDescription}>
                Suggesties om de balans te verbeteren
              </div>
            </div>
            <div className={styles.cardContent}>
              {significantGaps.length > 0 ? (
                <div className={styles.alertList}>
                  {significantGaps.map(([role, gap]) => (
                    <div
                      key={role}
                      className={`${styles.alert} ${gap > 10 ? styles.alertDestructive : styles.alertWarning}`}
                    >
                      <div className={styles.alertIcon}>
                        <IoAlertCircleOutline size={16} className={gap > 10 ? styles.textDestructive : styles.textWarning} />
                      </div>
                      <div className={styles.alertContent}>
                        <h4 className={styles.alertTitle}>
                          <div
                            className={styles.roleDotSmall}
                            style={{
                              backgroundColor: ROLE_COLORS[role as RoleKey] || '#ccc',
                            }}
                          />
                          {role} rol versterken
                        </h4>
                        <div className={styles.alertDescription}>
                          <p>
                            Je {isChurchView ? 'kerk' : 'team'} heeft een tekort aan de {role} rol. Het
                            huidige tekort is ongeveer {Math.round(gap)}%
                            onder de ideale verdeling.
                          </p>
                          <p className={styles.recommendationText}>
                            {roleRecommendations[role as RoleKey]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`${styles.alert} ${styles.alertSuccess}`}>
                  <div className={styles.alertIcon}>
                    <IoCheckmarkCircleOutline size={16} className={styles.textSuccess} />
                  </div>
                  <div className={styles.alertContent}>
                    <h4 className={styles.alertTitle}>Goede balans</h4>
                    <div className={styles.alertDescription}>
                      Je {isChurchView ? 'kerk' : 'team'} heeft een goede balans van rollen. Alle rollen
                      zijn binnen 5% van de ideale verdeling.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isChurchView && activeTab === "teams" && (
        <div className={styles.contentSpace}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Teams Balans Analyse</h3>
              <div className={styles.cardDescription}>
                Overzicht van hiaten in rollen per team
              </div>
            </div>
            <div className={styles.cardContent}>
              {teamGapAnalysis.length > 0 ? (
                <div className={styles.teamList}>
                  {teamGapAnalysis.map((team) => {
                    const severeGaps = team.gaps.filter((g) => g.status === "severe");
                    const moderateGaps = team.gaps.filter((g) => g.status === "moderate");

                    return (
                      <div key={team.id} className={styles.teamItem}>
                        <div className={styles.teamHeader}>
                          <h3 className={styles.teamName}>{team.name}</h3>
                          <span className={`${styles.badge} ${
                            team.balanceScore >= 70 ? styles.badgeSuccess : 
                            team.balanceScore >= 50 ? styles.badgeSecondary : 
                            styles.badgeDestructive
                          }`}>
                            Balans score: {team.balanceScore}
                          </span>
                        </div>

                        {severeGaps.length > 0 && (
                          <div className={styles.gapSection}>
                            <h4 className={styles.gapTitle}>
                              <IoWarningOutline size={14} className={styles.textDestructive} />
                              Ernstige hiaten
                            </h4>
                            <div className={styles.gapGrid}>
                              {severeGaps.map((gap) => (
                                <div key={gap.role} className={`${styles.gapTag} ${styles.gapTagSevere}`}>
                                  <div
                                    className={styles.roleDotSmall}
                                    style={{
                                      backgroundColor: ROLE_COLORS[gap.role as RoleKey] || '#ccc',
                                    }}
                                  />
                                  <span className={styles.gapRoleName}>{roleNormalizer(gap.role)}</span>
                                  <span className={styles.gapPercentage}>-{gap.percentage}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {moderateGaps.length > 0 && (
                          <div className={styles.gapSection}>
                            <h4 className={styles.gapTitle}>
                              <IoAlertCircleOutline size={14} className={styles.textWarning} />
                              Matige hiaten
                            </h4>
                            <div className={styles.gapGrid}>
                              {moderateGaps.map((gap) => (
                                <div key={gap.role} className={`${styles.gapTag} ${styles.gapTagModerate}`}>
                                  <div
                                    className={styles.roleDotSmall}
                                    style={{
                                      backgroundColor: ROLE_COLORS[gap.role as RoleKey] || '#ccc',
                                    }}
                                  />
                                  <span className={styles.gapRoleName}>{roleNormalizer(gap.role)}</span>
                                  <span className={styles.gapPercentage}>-{gap.percentage}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {severeGaps.length === 0 && moderateGaps.length === 0 && (
                          <div className={styles.balancedMessage}>
                            <IoCheckmarkCircleOutline size={14} className={styles.textSuccess} />
                            Dit team is goed in balans
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyState}>Geen teams beschikbaar</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
