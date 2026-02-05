'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import QuestionCard from '@/components/dashboard/QuestionCard/QuestionCard';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/use-dashboard';
import { profileAPI, type QuestionResponse } from '@/lib/api/profile';
import { QUESTIONS, TOTAL_QUESTIONS } from '@/lib/constants/questionnaire';
import { validateResponses } from '@/lib/utils/questionnaireScoring';
import styles from './page.module.scss';

// AgreementSlider uses -5..5; API uses 0–6 (docs/QUESTIONNAIRE_AND_RESULTS_V2.md).
const apiToSlider = (v: number) => ({ 0: -5, 1: -3, 2: -1, 3: 0, 4: 1, 5: 3, 6: 5 }[v] ?? 0);
const sliderToApi = (v: number) => ({ [-5]: 0, [-3]: 1, [-1]: 2, 0: 3, 1: 4, 3: 5, 5: 6 }[v] ?? 3);

function buildInitialResponses(): QuestionResponse[] {
  return QUESTIONS.map((q) => ({
    questionId: q.id,
    value: 3,
    statement1Role: q.statement1.role,
    statement2Role: q.statement2.role,
  }));
}

function mergeResponsesFromProfile(
  existing: QuestionResponse[] | undefined,
  fallback: QuestionResponse[]
): QuestionResponse[] {
  if (!existing?.length) return fallback;
  const byId = new Map(existing.map((r) => [r.questionId, r]));
  return fallback.map((r) => {
    const saved = byId.get(r.questionId);
    if (saved != null && Number(saved.value) >= 0 && Number(saved.value) <= 6) {
      return { ...r, value: saved.value };
    }
    return r;
  });
}

export default function QuestionnaireStartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id != null ? Number(user.id) : null;
  const { data: profileData, isLoading: profileLoading } = useUserProfile(userId);

  const initialResponses = useMemo(() => {
    const base = buildInitialResponses();
    const profile = profileData as { profile?: { responses?: QuestionResponse[] } } | undefined;
    const saved = profile?.profile?.responses;
    return mergeResponsesFromProfile(saved, base);
  }, [profileData]);

  const [responses, setResponses] = useState<QuestionResponse[]>(initialResponses);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setResponses((prev) => {
      const base = buildInitialResponses();
      const profile = profileData as { profile?: { responses?: QuestionResponse[] } } | undefined;
      return mergeResponsesFromProfile(profile?.profile?.responses, base);
    });
  }, [profileData]);

  const question = QUESTIONS[currentIndex];
  const currentResponse = responses.find((r) => r.questionId === question?.id) ?? {
    questionId: question?.id ?? 0,
    value: 3,
    statement1Role: question?.statement1.role ?? 'teacher',
    statement2Role: question?.statement2.role ?? 'teacher',
  };
  const currentAnswerSlider = apiToSlider(currentResponse.value);

  const handleAnswerChange = (sliderValue: number) => {
    const apiValue = sliderToApi(sliderValue);
    setResponses((prev) =>
      prev.map((r) =>
        r.questionId === question.id ? { ...r, value: apiValue } : r
      )
    );
  };

  const handleNext = () => {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    const validation = validateResponses(responses, TOTAL_QUESTIONS);
    if (!validation.isValid) {
      setSubmitError('Beantwoord alle vragen (schuif 0–6 voor elke stelling).');
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      await profileAPI.submitProfile({ responses });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['user', 'results'] }),
        ...(userId ? [queryClient.invalidateQueries({ queryKey: ['users', userId, 'profile'] })] : []),
      ]);
      router.push('/dashboard/questionnaire/complete');
    } catch (e: unknown) {
      const message =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: unknown }).message)
          : 'Verzenden mislukt.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.push('/dashboard/questionnaire');
  };

  if (profileLoading && !profileData) {
    return (
      <div className={styles.page}>
        <div className={styles.titleSection}>
          <p className={styles.subtitle}>Vragen laden…</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className={styles.page}>
      <button type="button" onClick={handleGoBack} className={styles.goBackButton}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Terug
      </button>

      <div className={styles.titleSection}>
        <h1 className={styles.title}>Bedieningenprofiel vragenlijst</h1>
        <p className={styles.subtitle}>
          Kies per vraag de stelling die het beste bij je past (schuif 0–6, 3 = neutraal).
        </p>
      </div>

      <div className={styles.noteSection}>
        <div className={styles.noteIcon}>
          <span className={styles.noteIconCircle}>!</span>
        </div>
        <p className={styles.noteText}>
          <strong>Let op*</strong> Kies één van de stellingen en geef aan in hoeverre je het ermee eens bent.
        </p>
      </div>

      <div className={styles.cardWrapper}>
        <QuestionCard
          questionNumber={currentIndex + 1}
          totalQuestions={TOTAL_QUESTIONS}
          statementA={question.statement1.text}
          statementB={question.statement2.text}
          value={currentAnswerSlider}
          onChange={handleAnswerChange}
        />
        {submitError && <p className={styles.error}>{submitError}</p>}
        <div className={styles.actionsSection}>
          {currentIndex > 0 ? (
            <>
              <button type="button" onClick={handlePrevious} className={styles.previousButton}>
                Vorige
              </button>
              <button
                type="button"
                onClick={handleNext}
                className={styles.nextButton}
                disabled={submitting}
              >
                {currentIndex === TOTAL_QUESTIONS - 1
                  ? submitting
                    ? 'Verzenden…'
                    : 'Afronden en verzenden'
                  : 'Volgende'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className={styles.nextButton}
              disabled={submitting}
            >
              Volgende
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
