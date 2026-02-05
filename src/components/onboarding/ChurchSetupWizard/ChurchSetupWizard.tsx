'use client';

import React, { useState } from 'react';
import styles from './ChurchSetupWizard.module.scss';
import Modal from '@/components/ui/Modal/Modal';
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import FileUpload from '@/components/ui/FileUpload/FileUpload';
import { TextInput, Select, Button } from '@/components/ui/forms';
import CardImg from '../../../../public/modal/cardimd.jpg' 
import SuccessImg from '../../../../public/modal/allset-modal.jpg' 
import {
  ChurchFormData,
  TOTAL_STEPS,
  denominationOptions,
  sectorOptions,
  hearAboutOptions,
} from '@/data';
import Image from 'next/image';

export default function ChurchSetupWizard({
  onComplete,
  onSkip,
}: {
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ChurchFormData>({
    churchName: '',
    churchDenomination: '',
    sector: '',
    address: '',
    howDidYouKnow: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof ChurchFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
      case 2:
        // Validate all church details fields
        return (
          formData.churchName.trim() !== '' &&
          formData.churchDenomination.trim() !== '' &&
          formData.sector.trim() !== '' &&
          formData.address.trim() !== '' &&
          formData.howDidYouKnow.trim() !== ''
        );
      case 3:
      case 4:
        // Validate logo file is selected
        return logoFile !== null;
      case 5:
        // Success step - always valid
        return true;
      default:
        return false;
    }
  };

  const isStepValid = validateCurrentStep();

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS && isStepValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  const handleSkip = () => {
    onSkip();
  };

  const handleClose = () => {
    onSkip();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
      case 2:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Voeg kerkgegevens toe</h2>
            <p className={styles.stepDescription}>
              Laten we je kerk in een paar snelle stappen instellen.
            </p>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <TextInput
                  id="churchName"
                  name="churchName"
                  value={formData.churchName}
                  onChange={(e) => handleInputChange('churchName', e.target.value)}
                  placeholder="Kerknaam"
                />
              </div>
              <div className={styles.formGroup}>
                <Select
                  id="churchDenomination"
                  name="churchDenomination"
                  value={formData.churchDenomination}
                  onChange={(e) => handleInputChange('churchDenomination', e.target.value)}
                  options={denominationOptions}
                  placeholder="Kerkgenootschap"
                />
              </div>
              <div className={styles.formGroup}>
                <Select
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={(e) => handleInputChange('sector', e.target.value)}
                  options={sectorOptions}
                  placeholder="Sector"
                />
              </div>
              <div className={styles.formGroup}>
                <TextInput
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Adres"
                />
              </div>
              <div className={styles.formGroup}>
                <Select
                  id="howDidYouKnow"
                  name="howDidYouKnow"
                  value={formData.howDidYouKnow}
                  onChange={(e) => handleInputChange('howDidYouKnow', e.target.value)}
                  options={hearAboutOptions}
                  placeholder="Hoe kende je ons?"
                />
              </div>
            </div>
          </div>
        );

      case 3:
      case 4:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Upload kerklogo</h2>
            <FileUpload
              onFileSelect={(file) => setLogoFile(file)}
              onFileRemove={() => setLogoFile(null)}
              selectedFile={logoFile}
              maxSizeMB={2}
              accept="image/*"
            />
          </div>
        );

      case 5:
        return (
          <div className={styles.successContent}>
            <div className={styles.successIllustration}>
              <Image src={SuccessImg} alt='CardImg' />
            </div>
            <h2 className={styles.successTitle}>Welkom bij je nieuwe Kerk Dashboard!</h2>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => {
    if (currentStep === 5) {
      return (
        <Button
          type="button"
          variant="secondary"
          onClick={handleFinish}
          fullWidth
        >
          Ga naar dashboard
        </Button>
      );
    }

    if (currentStep === 4) {
      return (
        <div className={styles.buttonGroupThree}>
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
          >
            Vorige
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleNext}
            disabled={!isStepValid}
          >
            Afronden
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
          >
            Overslaan
          </Button>
        </div>
      );
    }

    return (
      <div className={styles.buttonGroup}>
        <Button
          type="button"
          variant="secondary"
          onClick={handleNext}
          disabled={!isStepValid}
          fullWidth
        >
          Doorgaan
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSkip}
          fullWidth
        >
          Overslaan
        </Button>
      </div>
    );
  };

  return (
    <Modal
      isOpen={true}
      onClose={currentStep !== 5 ? handleClose : undefined}
      title={currentStep === 5 ? "Je bent klaar!" : 'Kerk instellen'}
      showCloseButton={currentStep !== 5}
      size="large"
      closeOnOverlayClick={false}
      footer={renderFooter()}
    >
      {currentStep !== 5 && (
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeCard}>
            <div className={styles.welcomeContent}>
              <h3 className={styles.welcomeTitle}>Welkomstscherm</h3>
              <p className={styles.welcomeText}>
                Laten we je kerk in een paar snelle stappen instellen.
              </p>
              <div className={styles.progressContainer}>
                <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS - 1} />
                <span className={styles.progressText}>{currentStep}/{TOTAL_STEPS - 1}</span>
              </div>
            </div>
            <div className={styles.welcomeIllustration}>
             <Image src={CardImg} alt='CardImg' />
            </div>
          </div>
        </div>
      )}

      <div className={styles.wizardContent}>
        {renderStepContent()}
      </div>
    </Modal>
  );
}

