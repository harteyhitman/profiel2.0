'use client';

import React, { useState } from 'react';
import styles from './Select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select',
  className = '',
  disabled = false,
  required = false,
}: SelectProps) {
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
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`${styles.select} ${className}`}
        disabled={disabled}
        required={required}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

