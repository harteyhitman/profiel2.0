'use client';

import React, { useState } from 'react';
import { Button, TextInput as Input, Select } from '@/components/ui/forms';
import ConfirmationModal from '@/components/ui/ConfirmationModal/ConfirmationModal';
import styles from './page.module.scss';

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Chris');
  const [lastName, setLastName] = useState('Obi');
  const [city, setCity] = useState('Anders');
  const [country, setCountry] = useState('Verenigd Koninkrijk');
  const [currentSector, setCurrentSector] = useState('Religie');
  const [preferredSector, setPreferredSector] = useState('Familie');
  const [referredBy, setReferredBy] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real application, you would send this data to your backend
    console.log({
      firstName,
      lastName,
      city,
      country,
      currentSector,
      preferredSector,
      referredBy,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert changes if needed, for now just exit edit mode
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    // Perform account deletion logic here (e.g., API call)
    console.log('Account deletion initiated.');
    setShowDeleteConfirmation(false);
    // Redirect or show success message after deletion
  };
  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <div className={styles.headerText}>

          <h1 className={styles.title}>Mijn account</h1>
          <p className={styles.subtitle}>
            Bekijk en beheer je accountgegevens.
          </p>
        </div>
      </div>

      <div className={styles.contentCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>CO</div>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>Chris Obi</p>
            <p className={styles.profileEmail}>christian.obi.248679@unn.edu.ng</p>
          </div>
        </div>

        <div className={styles.personalInfoSection}>
          <h2 className={styles.sectionTitle}>Persoonlijke Informatie</h2>
          {isEditing ? (
            <div className={styles.editForm}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Voornaam</label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Achternaam</label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Land</label>
                  <Select
                    options={[{ label: 'Verenigd Koninkrijk', value: 'Verenigd Koninkrijk' }, { label: 'Nederland', value: 'Nederland' }]}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Stad</label>
                  <Select
                    options={[{ label: 'Anders', value: 'Anders' }, { label: 'Amsterdam', value: 'Amsterdam' }]}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Huidige Sector</label>
                  <Select
                    options={[{ label: 'Religie', value: 'Religie' }, { label: 'Technologie', value: 'Technologie' }]}
                    value={currentSector}
                    onChange={(e) => setCurrentSector(e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Voorkeur Sector</label>
                  <Select
                    options={[{ label: 'Familie', value: 'Familie' }, { label: 'Onderwijs', value: 'Onderwijs' }]}
                    value={preferredSector}
                    onChange={(e) => setPreferredSector(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Hoe ken je ons?</label>
                  <Select
                    options={[{ label: 'Via een vriend', value: 'Via een vriend' }, { label: 'Sociale media', value: 'Sociale media' }]}
                    value={referredBy}
                    onChange={(e) => setReferredBy(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.actionButtons}>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Save</Button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Voornaam</span>
                <span className={styles.infoValue}>{firstName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Achternaam</span>
                <span className={styles.infoValue}>{lastName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Land</span>
                <span className={styles.infoValue}>{country}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Stad</span>
                <span className={styles.infoValue}>{city}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Huidige Sector</span>
                <span className={styles.infoValue}>{currentSector}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Voorkeur Sector</span>
                <span className={styles.infoValue}>{preferredSector}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Doorverwezen Door</span>
                <span className={styles.infoValue}>{referredBy}</span>
              </div>
              <Button variant="secondary" className={styles.editButton} onClick={handleEdit}>Edit</Button>
            </>
          )}
        </div>
      </div>

      <div className={styles.contentCard}>
        <div className={styles.deleteAccountSection}>
          <h2 className={styles.sectionTitle}>Account verwijderen</h2>
          <p className={styles.deleteDescription}>
            Hiermee verwijder je permanent je account en alle gegevens. Dit kan
            niet ongedaan gemaakt worden.
          </p>
          <Button variant="primary" className={`${styles.deleteButton} ${styles.dangerButton}`} onClick={handleDeleteAccount}>Verwijder account</Button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        title="Account verwijderen"
        message="Weet je zeker dat je je account wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
      />
    </div>
  );
}
