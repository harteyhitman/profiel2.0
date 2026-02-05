/**
 * Role calculations per docs/QUESTIONNAIRE_AND_RESULTS_V2.md.
 * Primary/secondary role and profile type from raw scores.
 */

import type { RoleScores } from '@/lib/types/dashboard';
import type { RoleKey } from '@/lib/constants/questionnaire';

export interface RoleProfile {
  primaryRole: RoleKey | null;
  secondaryRole: RoleKey | null;
  dominanceRatio: number;
  profileType: 'balanced' | 'moderate' | 'specialized' | 'unknown';
  totalScore: number;
}

const ROLE_KEYS: RoleKey[] = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];

/**
 * Compute primary/secondary role and profile type from raw role scores (0–200 per role).
 */
export function calculatePrimaryRole(scores: RoleScores): RoleProfile {
  const totalScore = ROLE_KEYS.reduce((sum, key) => sum + (scores[key] ?? 0), 0);

  if (totalScore === 0) {
    return {
      primaryRole: null,
      secondaryRole: null,
      dominanceRatio: 0,
      profileType: 'unknown',
      totalScore: 0,
    };
  }

  const sorted = [...ROLE_KEYS]
    .map((key) => ({ key, score: scores[key] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  const primaryRole = sorted[0].score > 0 ? sorted[0].key : null;
  const secondaryRole = sorted[1].score > 0 ? sorted[1].key : null;
  const dominanceRatio = primaryRole ? (scores[primaryRole] ?? 0) / totalScore : 0;

  let profileType: RoleProfile['profileType'] = 'moderate';
  if (dominanceRatio < 0.35) profileType = 'balanced';
  else if (dominanceRatio > 0.5) profileType = 'specialized';

  return {
    primaryRole,
    secondaryRole,
    dominanceRatio,
    profileType,
    totalScore,
  };
}
