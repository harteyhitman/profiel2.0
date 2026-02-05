'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import { TextInput, EmailInput, Button, Radio } from '@/components/ui/forms';

import { useInviteMember } from '@/hooks/use-dashboard';

import styles from './InviteMemberModal.module.scss';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalState = 'form' | 'confirmation';

export default function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {

  const inviteMemberMutation = useInviteMember();

  const [state, setState] = useState<ModalState>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',

    role: 'Leider',
  });
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Leider');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = ['Leider', 'Lid', 'Beheerder', 'Moderator'];

  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showRoleDropdown && !target.closest(`.${styles.roleDropdown}`)) {
        setShowRoleDropdown(false);
      }
    };

    if (showRoleDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRoleDropdown]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    setShowRoleDropdown(false);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);
    try {
      await inviteMemberMutation.mutateAsync({
        email: formData.email,
        name: formData.fullName,
        role: selectedRole,
      });
      setState('confirmation');
    } catch (err: any) {
      setError(err.message || 'Uitnodiging verzenden mislukt. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }

  };

  const handleOk = () => {
    setState('form');

    setFormData({ fullName: '', email: '', phone: '', role: 'Leider' });
    setSelectedRole('Leider');

    onClose();
  };

  const isFormValid = formData.fullName.trim() !== '' && 
                     formData.email.trim() !== '' && 
                     formData.phone.trim() !== '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}

      title="Lid uitnodigen"

      showCloseButton={true}
      size="medium"
      closeOnOverlayClick={false}
    >
      {state === 'form' ? (
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>

            <h2 className={styles.subtitle}>Nieuw Lid Uitnodigen</h2>
            <p className={styles.description}>
              Stuur een uitnodigingslink of e-mail om een nieuw lid aan je team toe te voegen.

            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <TextInput
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}

                placeholder="Volledige naam"

                required
              />
            </div>

            <div className={styles.formGroup}>
              <EmailInput
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}

                placeholder="E-mailadres"

                required
              />
            </div>

            <div className={styles.formGroup}>
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}

                placeholder="Telefoonnummer"

                required
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.roleDropdown}>
                <button
                  type="button"
                  className={styles.roleButton}
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                >
                  <span className={styles.roleButtonText}>

                    {selectedRole || 'Rol'}

                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${styles.dropdownIcon} ${showRoleDropdown ? styles.open : ''}`}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {showRoleDropdown && (
                  <div className={styles.roleDropdownMenu}>
                    {roles.map((role, index) => (
                      <div key={index} className={styles.roleOption}>
                        <Radio
                          id={`role-${index}`}
                          name="role"
                          value={role}
                          checked={selectedRole === role}
                          onChange={(e) => handleRoleSelect(e.target.value)}
                          label={role}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>


            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="secondary"
              disabled={!isFormValid || isLoading}

              fullWidth
              className={styles.inviteButton}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>

              {isLoading ? 'Verzenden...' : 'Lid Uitnodigen'}

            </Button>
          </form>
        </div>
      ) : (
        <div className={styles.confirmationContent}>
          <div className={styles.confirmationHeader}>

            <h2 className={styles.confirmationTitle}>Uitnodiging verzonden</h2>
            <p className={styles.confirmationMessage}>
              Een uitnodigingslink wordt verzonden naar {formData.email}

            </p>
          </div>

          <div className={styles.confirmationList}>

            <p className={styles.confirmationListTitle}>De uitgenodigde gebruiker zal:</p>
            <ul className={styles.confirmationListItems}>
              <li>Zijn profiel instellen</li>
              <li>Zijn rol vragenlijst voltooien</li>
              <li>Automatisch verschijnen onder 'Leden in afwachting' totdat ze deelnemen</li>

            </ul>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={handleOk}
            fullWidth
            className={styles.okButton}
          >

            Oké

          </Button>
        </div>
      )}
    </Modal>
  );
}

