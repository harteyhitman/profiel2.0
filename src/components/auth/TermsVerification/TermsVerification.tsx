'use client';

import { useState } from 'react';
import styles from './TermsVerification.module.scss';
import { Checkbox, Button } from '@/components/ui/forms';

interface TermsVerificationProps {
  onContinue: () => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
}

export default function TermsVerification({
  onContinue,
  termsAccepted,
  setTermsAccepted,
}: TermsVerificationProps) {
  const [authorized, setAuthorized] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleAuthorizedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAuthorized(checked);
    updateTermsAccepted(checked, termsAgreed);
  };

  const handleTermsAgreedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setTermsAgreed(checked);
    updateTermsAccepted(authorized, checked);
  };

  const updateTermsAccepted = (auth: boolean, terms: boolean) => {
    const bothChecked = auth && terms;
    setTermsAccepted(bothChecked);
  };

  return (
    <div className={styles.card}>
      <div className={styles.checkboxes}>
        <Checkbox
          id="authorized"
          name="authorized"
          checked={authorized}
          onChange={handleAuthorizedChange}
          label="Ik ben gemachtigd om dit account aan te maken namens deze kerk of bediening."
        />

        <Checkbox
          id="termsAgreed"
          name="termsAgreed"
          checked={termsAgreed}
          onChange={handleTermsAgreedChange}
          label="Ik ga akkoord met de Algemene Voorwaarden en het Privacybeleid."
        />
      </div>

      <Button
        type="button"
        onClick={onContinue}
        disabled={!termsAccepted}
        variant="secondary"
        fullWidth
      >
        Doorgaan
      </Button>
    </div>
  );
}

