'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/forms';
import { TextInput } from '@/components/ui/forms';
import styles from './ProfileField.module.scss';

interface ProfileFieldProps {
  label: string;
  value: string;
  onUpdate: (value: string) => void;
}

export default function ProfileField({ label, value, onUpdate }: ProfileFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    onUpdate(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className={styles.fieldSection}>
      <div className={styles.fieldLabel}>{label}</div>
      <div className={styles.fieldContent}>
        {isEditing ? (
          <div className={styles.editMode}>
            <TextInput
              id={`field-${label}`}
              name={`field-${label}`}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={styles.editInput}
            />
            <div className={styles.editActions}>
              <Button
                variant="secondary"
                type="button"
                onClick={handleSave}
                className={styles.saveButton}
              >
                Save
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.viewMode}>
            <span className={styles.fieldValue}>{value}</span>
            <Button
              variant="outline"
              type="button"
              onClick={handleEdit}
              className={styles.editButton}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.3333 2.00001C11.5084 1.8249 11.7163 1.686 11.9451 1.59124C12.1739 1.49649 12.4187 1.44775 12.6667 1.44775C12.9146 1.44775 13.1594 1.49649 13.3882 1.59124C13.617 1.686 13.8249 1.8249 14 2.00001C14.1751 2.17512 14.314 2.38305 14.4088 2.61183C14.5035 2.84061 14.5523 3.08541 14.5523 3.33334C14.5523 3.58128 14.5035 3.82608 14.4088 4.05486C14.314 4.28364 14.1751 4.49157 14 4.66668L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

