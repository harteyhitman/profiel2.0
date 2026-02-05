'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './FileUpload.module.scss';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  maxSizeMB?: number;
  accept?: string;
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  maxSizeMB = 2,
  accept = 'image/*',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate upload progress when file is selected
  useEffect(() => {
    if (selectedFile) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 93) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Bestandsgrootte moet kleiner zijn dan ${maxSizeMB}MB`);
        return;
      }
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Bestandsgrootte moet kleiner zijn dan ${maxSizeMB}MB`);
        return;
      }
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = () => {
    return (
      <div className={styles.fileIconContainer}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="8" fill="#E0F7E0"/>
          {/* Mountains */}
          <path d="M8 32L16 20L24 28L32 16L40 24V32H8Z" fill="#0F3728" fillOpacity="0.8"/>
          {/* Sun/Moon */}
          <circle cx="36" cy="12" r="4" fill="#0F3728" fillOpacity="0.6"/>
        </svg>
      </div>
    );
  };

  if (selectedFile) {
    return (
      <div className={styles.filePreview}>
        <div className={styles.fileInfo}>
          {getFileIcon()}
          <div className={styles.fileDetails}>
            <span className={styles.fileName}>{selectedFile.name}</span>
            <span className={styles.fileSize}>{formatFileSize(selectedFile.size)}</span>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className={styles.progressPercentage}>{Math.round(uploadProgress)}%</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onFileRemove}
          className={styles.removeButton}
          aria-label="Bestand verwijderen"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${styles.uploadZone} ${isDragging ? styles.dragging : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      <div className={styles.uploadContent}>
        <div className={styles.uploadTextContainer}>
          <p className={styles.uploadText}>
            Klik om te bladeren of
          </p>
          <p className={styles.uploadText}>
            sleep je afbeelding hierheen
          </p>
        </div>
        <div className={styles.fileFormats}>
          <span className={styles.formatLink}>png</span>
          <span className={styles.formatSeparator}>,</span>
          <span className={styles.formatLink}>jpeg</span>
          <span className={styles.formatSeparator}>,</span>
          <span className={styles.formatLink}>jpg</span>
        </div>
      </div>
    </div>
  );
}

