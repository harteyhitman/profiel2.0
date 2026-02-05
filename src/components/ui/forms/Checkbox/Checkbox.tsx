import React from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function Checkbox({
  id,
  name,
  checked,
  onChange,
  label,
  className = '',
  disabled = false,
  required = false,
}: CheckboxProps) {
  return (
    <label className={`${styles.checkboxLabel} ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className={styles.checkbox}
        disabled={disabled}
        required={required}
      />
      <span className={styles.checkboxText}>{label}</span>
    </label>
  );
}

