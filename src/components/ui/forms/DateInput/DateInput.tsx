'use client';

import React, { useState } from 'react';
import styles from './DateInput.module.scss';

interface DateInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  format?: 'DD/MM/YYYY' | 'YYYY-MM-DD';
}

export default function DateInput({
  id,
  name,
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  className = '',
  disabled = false,
  required = false,
  format = 'DD/MM/YYYY',
}: DateInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (format === 'DD/MM/YYYY') {
      let inputValue = e.target.value.replace(/\D/g, '');
      if (inputValue.length >= 2) {
        inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
      }
      if (inputValue.length >= 5) {
        inputValue = inputValue.slice(0, 5) + '/' + inputValue.slice(5, 9);
      }
      e.target.value = inputValue;
    }
    onChange(e);
  };

  const inputType = format === 'YYYY-MM-DD' ? 'date' : 'text';
  const maxLength = format === 'DD/MM/YYYY' ? 10 : undefined;

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
      <div className={styles.dateInput}>
        <input
          type={inputType}
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isActive ? '' : placeholder}
          className={`${styles.input} ${className}`}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
        />
        {format === 'DD/MM/YYYY' && (
          <button type="button" className={styles.calendarButton} aria-label="Open calendar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3.33334H5C3.61929 3.33334 2.5 4.45263 2.5 5.83334V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V5.83334C17.5 4.45263 16.3807 3.33334 15 3.33334Z" stroke="#666666" strokeWidth="1.5"/>
              <path d="M13.3333 1.66666V5M6.66667 1.66666V5M2.5 8.33334H17.5" stroke="#666666" strokeWidth="1.5"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

