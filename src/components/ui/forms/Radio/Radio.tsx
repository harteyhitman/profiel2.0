import React from 'react';
import styles from './Radio.module.scss';

interface RadioProps {
  id?: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function Radio({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  className = '',
  disabled = false,
  required = false,
}: RadioProps) {
  return (
    <label className={`${styles.radioLabel} ${className}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.radio}
        disabled={disabled}
        required={required}
      />
      <span className={styles.radioText}>{label}</span>
    </label>
  );
}

