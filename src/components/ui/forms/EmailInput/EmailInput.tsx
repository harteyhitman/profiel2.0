'use client';

import React, { useState } from 'react';
import styles from './EmailInput.module.scss';

interface EmailInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function EmailInput({
  id,
  name,
  value,
  onChange,
  placeholder = 'Enter your email',
  className = '',
  disabled = false,
  required = false,
}: EmailInputProps) {
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
      <input
        type="email"
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
    </div>
  );
}

