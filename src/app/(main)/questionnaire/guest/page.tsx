'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import QuestionCard from '@/components/dashboard/QuestionCard/QuestionCard';
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

type Step = 'info' | 'questions' | 'submitted';

function GuestQuestionnaireContent() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams?.get('inviteCode') ?? '';

  const [step, setStep] = useState<Step>('info');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [responses, setResponses] = useState<QuestionResponse[]>(() => buildInitialResponses());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!question) return;
    setResponses((prev) =>
      prev.map((r) => (r.questionId === question.id ? { ...r, value: apiValue } : r))
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
      setError('Beantwoord alle vragen (schuif 0–6 voor elke stelling).');
      return;
    }
    if (!inviteCode) {
      setError('Ontbrekende uitnodigingslink.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await profileAPI.submitProfileGuest(inviteCode, {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        responses,
      });
      setStep('submitted');
    } catch (e: unknown) {
      const message =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: unknown }).message)
          : 'Verzenden mislukt.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const canStartQuestions =
    email.trim().length > 0 && firstName.trim().length > 0 && lastName.trim().length > 0;

  if (!inviteCode) {
    return (
      <div className={styles.page}>
        <div className={styles.center}>
          <p className={styles.error}>Ontbrekende of ongeldige uitnodigingslink.</p>
          <Link href="/" className={styles.link}>
            Naar startpagina
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'submitted') {
    return (
      <div className={styles.page}>
        <div className={styles.center}>
          <h1 className={styles.title}>Bedankt</h1>
          <p className={styles.message}>
            Je antwoorden zijn verzonden. Je kunt dit venster sluiten.
          </p>
          <Link href="/" className={styles.link}>
            Naar startpagina
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'info') {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gastvragenlijst</h1>
          <p className={styles.subtitle}>
            Vul je gegevens in en daarna de vragenlijst op uitnodiging van je kerk.
          </p>
        </div>
        <div className={styles.cardWrap}>
          <label className={styles.label}>
            Voornaam
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.input}
              placeholder="Je voornaam"
              autoComplete="given-name"
            />
          </label>
          <label className={styles.label}>
            Achternaam
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.input}
              placeholder="Je achternaam"
              autoComplete="family-name"
            />
          </label>
          <label className={styles.label}>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="je@email.nl"
              autoComplete="email"
            />
          </label>
          <button
            type="button"
            onClick={() => setStep('questions')}
            className={styles.btnPrimary}
            disabled={!canStartQuestions}
          >
            Start vragenlijst
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const statementA = question.statement1.text;
  const statementB = question.statement2.text;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gastvragenlijst</h1>
        <p className={styles.subtitle}>
          Vul de vragenlijst in op uitnodiging van je kerk. Kies per vraag de stelling die het beste bij je past (schuif 0–6, 3 = neutraal).
        </p>
      </div>

      <div className={styles.note}>
        <strong>Let op:</strong> Kies één van de stellingen en geef aan in hoeverre je het ermee eens bent.
      </div>

      <div className={styles.cardWrap}>
        <QuestionCard
          questionNumber={currentIndex + 1}
          totalQuestions={TOTAL_QUESTIONS}
          statementA={statementA}
          statementB={statementB}
          value={currentAnswerSlider}
          onChange={handleAnswerChange}
        />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          {currentIndex > 0 ? (
            <>
              <button type="button" onClick={handlePrevious} className={styles.btnSecondary}>
                Vorige
              </button>
              <button
                type="button"
                onClick={handleNext}
                className={styles.btnPrimary}
                disabled={submitting}
              >
                {currentIndex === TOTAL_QUESTIONS - 1
                  ? submitting
                    ? 'Verzenden…'
                    : 'Verzenden'
                  : 'Volgende'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className={styles.btnPrimary}
              disabled={submitting}
            >
              {currentIndex === TOTAL_QUESTIONS - 1
                ? submitting
                  ? 'Verzenden…'
                  : 'Verzenden'
                : 'Volgende'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GuestQuestionnaireFallback() {
  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <p className={styles.message}>Laden...</p>
      </div>
    </div>
  );
}

export default function GuestQuestionnairePage() {
  return (
    <Suspense fallback={<GuestQuestionnaireFallback />}>
      <GuestQuestionnaireContent />
    </Suspense>
  );
}
