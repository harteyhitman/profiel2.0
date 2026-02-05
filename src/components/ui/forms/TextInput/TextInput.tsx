'use client';

import React, { useState } from 'react';
import styles from './TextInput.module.scss';

interface TextInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'tel' | 'number';
}

export default function TextInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  required = false,
  type = 'text',
}: TextInputProps) {
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
        type={type}
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

