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
}

export default function Button({
  type = 'button',
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${disabled ? styles.disabled : styles.enabled} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

