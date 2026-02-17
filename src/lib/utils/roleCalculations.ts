import { ROLES_MAP, ROLE_LABELS, ROLES, RoleKey } from '@/lib/constants/questionnaire';

/**
 * Role scores interface
 * 
 * Scores represent raw point totals from questionnaire responses.
 * Range: 0 to (QUESTIONS.length × 5) per role
 * For 40 questions: 0-200 points per role
 */
export interface RoleScores {
  apostle: number;
  prophet: number;
  evangelist: number;
  herder: number;
  teacher: number;
}

export interface RoleProfile {
  primaryRole: string | null;
  secondaryRole: string | null;
  dominanceRatio: number;
  profileType: 'balanced' | 'moderate' | 'specialized' | 'unknown';
}

/**
 * Calculates the primary role based on role scores
 * @param roleScores Object containing role scores
 * @returns An object with primaryRole, secondaryRole, dominanceRatio, and profileType
 */
export function calculatePrimaryRole(roleScores: RoleScores): RoleProfile {
  // Validate input to ensure we have valid role scores
  if (!roleScores) {
    console.error('[calculatePrimaryRole] Invalid roleScores provided:', roleScores);
    return {
      primaryRole: null,
      secondaryRole: null,
      dominanceRatio: 0,
      profileType: 'unknown'
    };
  }
  
  // Ensure all expected roles are present
  const validatedScores = {
    [ROLES_MAP.APOSTLE]: roleScores[ROLES_MAP.APOSTLE] || 0,
    [ROLES_MAP.PROPHET]: roleScores[ROLES_MAP.PROPHET] || 0,
    [ROLES_MAP.EVANGELIST]: roleScores[ROLES_MAP.EVANGELIST] || 0,
    [ROLES_MAP.HERDER]: roleScores[ROLES_MAP.HERDER] || 0,
    [ROLES_MAP.TEACHER]: roleScores[ROLES_MAP.TEACHER] || 0
  };
  
  // Get roles sorted from highest to lowest score
  const sortedRoles = Object.entries(validatedScores)
    .sort((a, b) => b[1] - a[1])
    .map(([role]) => role);
  
  // If all scores are 0, return null for primary role
  const totalScore = Object.values(validatedScores).reduce((sum, score) => sum + score, 0);
  if (totalScore === 0) {
    // console.warn('[calculatePrimaryRole] All role scores are 0');
    return {
      primaryRole: null,
      secondaryRole: null,
      dominanceRatio: 0,
      profileType: 'unknown'
    };
  }
  
  // Get the primary and secondary roles
  const primaryRole = sortedRoles[0];
  const secondaryRole = sortedRoles[1];
  
  // Calculate the dominance ratio (how dominant is the primary role)
  const primaryScore = validatedScores[primaryRole as keyof typeof validatedScores];
  const dominanceRatio = primaryScore / totalScore;
  
  // Determine if the profile is balanced, moderate, or specialized
  let profileType: 'balanced' | 'moderate' | 'specialized' | 'unknown' = "moderate";
  
  if (dominanceRatio < 0.35) {
    // Less than 35% of points in primary role = balanced
    profileType = "balanced";
  } else if (dominanceRatio > 0.5) {
    // More than 50% of points in primary role = specialized
    profileType = "specialized";
  }
  
  return {
    primaryRole,
    secondaryRole,
    dominanceRatio,
    profileType
  };
}

/**
 * Determines the primary role label based on scores
 * @param roleScores Role scores to analyze
 * @returns The primary role label (translated)
 */
export function getPrimaryRoleLabel(roleScores: RoleScores): string {
  const { primaryRole } = calculatePrimaryRole(roleScores);
  return primaryRole ? ROLE_LABELS[primaryRole as RoleKey] : 'N.v.t.';
}
