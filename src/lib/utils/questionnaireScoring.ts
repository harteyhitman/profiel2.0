/**
 * Questionnaire scoring per docs/QUESTIONNAIRE_AND_RESULTS_V2.md.
 * Slider 0–6, 3 = neutral; weight mapping and role scores (0–200 per role).
 */

import type { QuestionResponse } from '@/lib/api/profile';
import type { RoleScores } from '@/lib/types/dashboard';
import { ROLES, type RoleKey } from '@/lib/constants/questionnaire';

const SLIDER_WEIGHTS: Record<number, number> = {
  0: 5,
  1: 3,
  2: 1,
  3: 0,
  4: 1,
  5: 3,
  6: 5,
};

function normalizeRoleName(role: string): RoleKey | null {
  const r = role?.toLowerCase().trim();
  if (r === 'shepherd') return 'herder';
  return ROLES.includes(r as RoleKey) ? (r as RoleKey) : null;
}

/**
 * Calculate raw role scores from responses. Returns 0–200 per role.
 */
export function calculateRoleScores(
  responses: QuestionResponse[],
  totalQuestions: number = 40
): RoleScores {
  const scores: RoleScores = {
    apostle: 0,
    prophet: 0,
    evangelist: 0,
    herder: 0,
    teacher: 0,
  };

  for (const res of responses) {
    const value = Number(res.value);
    if (value < 0 || value > 6 || value !== Math.floor(value)) continue;
    if (value === 3) continue;

    const weight = SLIDER_WEIGHTS[value] ?? 0;
    if (value < 3) {
      const role = normalizeRoleName(res.statement1Role);
      if (role) scores[role] += weight;
    } else {
      const role = normalizeRoleName(res.statement2Role);
      if (role) scores[role] += weight;
    }
  }

  return scores;
}

/**
 * Same shape as scores but with percentages (0–100) per role. Max per role = 200.
 */
export function normalizeScoresToPercentages(
  scores: RoleScores,
  totalQuestions: number = 40
): RoleScores {
  const maxPerRole = totalQuestions * 5;
  return {
    apostle: maxPerRole > 0 ? (scores.apostle / maxPerRole) * 100 : 0,
    prophet: maxPerRole > 0 ? (scores.prophet / maxPerRole) * 100 : 0,
    evangelist: maxPerRole > 0 ? (scores.evangelist / maxPerRole) * 100 : 0,
    herder: maxPerRole > 0 ? (scores.herder / maxPerRole) * 100 : 0,
    teacher: maxPerRole > 0 ? (scores.teacher / maxPerRole) * 100 : 0,
  };
}

export interface ValidationResult {
  isValid: boolean;
  answeredCount: number;
  missingQuestions: number[];
  invalidResponses: QuestionResponse[];
}

/**
 * Validate that all questions are answered with value 0–6 and required fields present.
 */
export function validateResponses(
  responses: QuestionResponse[],
  totalQuestions: number = 40
): ValidationResult {
  const missingQuestions: number[] = [];
  const invalidResponses: QuestionResponse[] = [];
  const seenIds = new Set<number>();

  for (let qId = 1; qId <= totalQuestions; qId++) {
    const res = responses.find((r) => r.questionId === qId);
    if (!res) {
      missingQuestions.push(qId);
      continue;
    }
    seenIds.add(res.questionId);
    const value = Number(res.value);
    if (value < 0 || value > 6 || value !== Math.floor(value)) {
      invalidResponses.push(res);
    }
    if (!res.statement1Role || !res.statement2Role) {
      invalidResponses.push(res);
    }
  }

  return {
    isValid: missingQuestions.length === 0 && invalidResponses.length === 0,
    answeredCount: seenIds.size,
    missingQuestions,
    invalidResponses,
  };
}

export function getMaxPossibleScore(questionCount: number = 40): number {
  return questionCount * 5;
}
