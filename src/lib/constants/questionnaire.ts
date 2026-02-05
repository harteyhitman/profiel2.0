/**
 * Questionnaire and role constants per docs/QUESTIONNAIRE_AND_RESULTS_V2.md.
 * ROLES, labels, colors; QUESTIONS (40 items) – same IDs and role mapping as backend.
 */

export const ROLES = [
  'apostle',
  'prophet',
  'evangelist',
  'herder',
  'teacher',
] as const;

export type RoleKey = (typeof ROLES)[number];

export const ROLE_LABELS: Record<RoleKey, string> = {
  apostle: 'Apostel',
  prophet: 'Profeet',
  evangelist: 'Evangelist',
  herder: 'Herder',
  teacher: 'Leraar',
};

export const ROLE_DESCRIPTIONS: Record<RoleKey, string> = {
  apostle: 'Pionier en grondlegger; ziet mogelijkheden en bouwt nieuwe structuren.',
  prophet: 'Spreekt Gods waarheid; gevoelig voor Zijn stem en richting.',
  evangelist: 'Brengt het goede nieuws; trekt mensen tot Christus.',
  herder: 'Zorgt en begeleidt; bouwt relaties en beschermt de kudde.',
  teacher: 'Legt de waarheid uit; maakt de Schrift begrijpelijk en toepasbaar.',
};

export const ROLE_COLORS: Record<RoleKey, string> = {
  apostle: '#10B981',
  prophet: '#8B5CF6',
  evangelist: '#F59E0B',
  herder: '#3B82F6',
  teacher: '#EC4899',
};

export interface QuestionStatement {
  text: string;
  role: RoleKey;
}

export interface QuestionnaireQuestion {
  id: number;
  statement1: QuestionStatement;
  statement2: QuestionStatement;
}

/**
 * 40 questions for the ministry profile questionnaire.
 * Per doc: same IDs and role assignments as backend; do not change.
 * Statement text for items 3–40 should be filled from the legacy shared/constants if available.
 */
export const QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 1,
    statement1: {
      text: 'I like to look ahead and see possibilities that others do not yet see.',
      role: 'apostle',
    },
    statement2: {
      text: 'I regularly experience impressions that turn out to be valuable.',
      role: 'prophet',
    },
  },
  {
    id: 2,
    statement1: {
      text: 'I am sensitive to changes in mood and tension, even if no one says anything about it.',
      role: 'herder',
    },
    statement2: {
      text: 'I approach new conversations or situations with an open mind.',
      role: 'teacher',
    },
  },
  // Placeholders 3–40: replace with full text from legacy shared/constants when available.
  ...Array.from({ length: 38 }, (_, i) => {
    const id = i + 3;
    const roles: RoleKey[] = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];
    const r1 = roles[id % 5];
    const r2 = roles[(id + 1) % 5];
    return {
      id,
      statement1: { text: `Statement 1 (vraag ${id})`, role: r1 },
      statement2: { text: `Statement 2 (vraag ${id})`, role: r2 },
    };
  }),
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
