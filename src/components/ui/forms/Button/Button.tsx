import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  type = 'button',
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = false,
  isLoading = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${(disabled || isLoading) ? styles.disabled : styles.enabled} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Laden...
        </span>
      ) : children}
    </button>
  );
}

