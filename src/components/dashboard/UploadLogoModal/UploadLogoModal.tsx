'use client';

import React, { useState, useRef, useCallback } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/forms';
import styles from './UploadLogoModal.module.scss';

interface UploadLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  currentLogo?: string | null;
}

export default function UploadLogoModal({
  isOpen,
  onClose,
  onUpload,
  currentLogo,
}: UploadLogoModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSizeMB = 1;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return 'Please upload a JPG, JPEG, or PNG file.';
    }
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB.`;
    }
    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    setError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Don't close modal yet - show save/change photo state
      // The preview is already set, so we just need to keep the modal open
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      onClose();
      // Reset state on close
      setSelectedFile(null);
      setError(null);
      setIsDragging(false);
    }
  };

  const handleChangePhoto = () => {
    setSelectedFile(null);
    setPreview(currentLogo || null);
    setError(null);
  };

  const handleClose = () => {
    // Reset state on close
    setSelectedFile(null);
    setPreview(currentLogo || null);
    setError(null);
    setIsDragging(false);
    onClose();
  };

  const hasNewFile = selectedFile !== null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload logo"
      showCloseButton={true}
      size="medium"
      closeOnOverlayClick={true}
    >
      <div className={styles.modalContent}>
        {hasNewFile ? (
          // After file selection - show preview with Save/Change photo buttons
          <>
            <div className={styles.previewSection}>
              <div className={styles.circularPreview}>
                {preview && (
                  <img src={preview} alt="Logo preview" className={styles.previewImage} />
                )}
              </div>
            </div>
            <div className={styles.modalActions}>
              <Button
                variant="primary"
                type="button"
                onClick={handleSave}
                className={styles.saveButton}
              >
                Save
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={handleChangePhoto}
                className={styles.changePhotoButton}
              >
                Change photo
              </Button>
            </div>
          </>
        ) : (
          // Initial upload state - show upload area
          <>
            <div
              className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileInputChange}
                className={styles.fileInput}
              />

              <div className={styles.uploadIcon}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="18" width="56" height="40" rx="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M26 32L38 44L50 32L62 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="58" cy="48" r="4" fill="currentColor"/>
                  <path d="M12 38L38 28L50 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="66" cy="66" r="10" fill="currentColor"/>
                  <path d="M66 60V72M60 66H72" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>

              <div className={styles.uploadText}>
                <p className={styles.instructionText}>
                  <span className={styles.clickText}>Click to upload</span> or drag and drop
                </p>
                <p className={styles.fileInfo}>JPG, JPEG, PNG less than 1MB</p>
              </div>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <div className={styles.modalActions}>
              <Button
                variant="outline"
                type="button"
                onClick={handleClose}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile}
                className={styles.uploadButton}
              >
                Upload
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

