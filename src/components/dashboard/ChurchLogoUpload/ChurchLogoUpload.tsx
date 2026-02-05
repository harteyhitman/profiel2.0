'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/forms';
import UploadLogoModal from '@/components/dashboard/UploadLogoModal/UploadLogoModal';
import styles from './ChurchLogoUpload.module.scss';

interface ChurchLogoUploadProps {
  onLogoChange?: (logoUrl: string) => void;
}

export default function ChurchLogoUpload({ onLogoChange }: ChurchLogoUploadProps) {
  const [logo, setLogo] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const logoUrl = reader.result as string;
      setLogo(logoUrl);
      onLogoChange?.(logoUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className={styles.logoSection}>
        <div className={styles.logoLabel}>Church logo</div>
        <div className={styles.logoContainer}>
          <div className={styles.logoPlaceholder}>
            {logo ? (
              <img src={logo} alt="Church logo" className={styles.logoImage} />
            ) : (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 24C27.3137 24 30 21.3137 30 18C30 14.6863 27.3137 12 24 12C20.6863 12 18 14.6863 18 18C18 21.3137 20.6863 24 24 24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 36C6 30.4772 9.47715 27 15 27H33C38.5228 27 42 30.4772 42 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div className={styles.logoText}>
            <p className={styles.uploadText}>Upload your church logo.</p>
          </div>
          <div className={styles.uploadButtonContainer}>
            <Button
              variant="outline"
              type="button"
              className={styles.uploadButton}
              onClick={() => setIsModalOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 2L14 6H10V2Z" fill="currentColor"/>
              </svg>
              Upload logo
            </Button>
          </div>
        </div>
      </div>

      <UploadLogoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
        currentLogo={logo}
      />
    </>
  );
}

