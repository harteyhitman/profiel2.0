'use client';

import React, { useState } from 'react';
import styles from './PasswordInput.module.scss';

interface PasswordInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = 'Enter your password',
  className = '',
  disabled = false,
  required = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className={styles.inputWrapper}>
      {placeholder && (
        <label
          htmlFor={id}
          className={`${styles.floatingLabel} ${isActive ? styles.active : ''}`}
        >
          {placeholder}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.passwordInput}>
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isActive ? '' : placeholder}
          className={`${styles.input} ${className}`}
          disabled={disabled}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={styles.eyeButton}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {showPassword ? (
              <>
                <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#666666" strokeWidth="1.5"/>
                <path d="M2.5 10C2.5 10 5 5 10 5C15 5 17.5 10 17.5 10C17.5 10 15 15 10 15C5 15 2.5 10 2.5 10Z" stroke="#666666" strokeWidth="1.5"/>
              </>
            ) : (
              <>
                <path d="M2.5 2.5L17.5 17.5M7.5 7.5C6.11929 7.5 5 8.61929 5 10C5 11.3807 6.11929 12.5 7.5 12.5C8.88071 12.5 10 11.3807 10 10M12.5 12.5C13.8807 12.5 15 11.3807 15 10C15 8.61929 13.8807 7.5 12.5 7.5M2.5 10C2.5 10 5 5 10 5C12.5 5 14.5 7.5 15 10M17.5 10C17.5 10 15 15 10 15C7.5 15 5.5 12.5 5 10" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}

