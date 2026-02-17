'use client';

import React from 'react';
import { IoCheckmarkCircleOutline, IoWarningOutline, IoPeopleOutline, IoBusinessOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/forms';
import { useJoinFlow } from '@/hooks/use-join-flow';
import styles from './JoinPageContent.module.scss';

interface JoinPageContentProps {
  inviteCode: string;
  type: 'team' | 'church';
}

export default function JoinPageContent({ inviteCode, type }: JoinPageContentProps) {
  const { 
    entity, 
    isLoading, 
    error, 
    isJoining, 
    successMessage, 
    handleJoin,
    user 
  } = useJoinFlow({ inviteCode, type });

  const entityName = entity?.name || entity?.teamName || '';
  const isChurch = type === 'church';

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className={styles.cardContent}>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !entity) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <IoWarningOutline className={styles.iconError} />
              Ongeldige uitnodiging
            </h2>
            <p className={styles.cardDescription}>
              Deze {isChurch ? "kerk" : "team"}-uitnodigingslink is ongeldig of verlopen.
            </p>
          </div>
          <div className={styles.cardContent}>
            <p className="text-sm text-gray-600 mb-4">
              De {isChurch ? "kerk" : "team"} die je probeert te joinen bestaat niet of de uitnodigingslink is niet langer geldig. 
              Neem contact op met de leider van de {isChurch ? "kerk" : "team"} voor een nieuwe uitnodiging.
            </p>
            <Button onClick={() => window.location.href = '/'} variant="secondary" className={styles.button}>
              Ga naar startpagina
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            {isChurch ? <IoBusinessOutline className={styles.icon} /> : <IoPeopleOutline className={styles.icon} />}
            Deelnemen aan "{entityName}"
          </h2>
          <p className={styles.cardDescription}>
            Je bent uitgenodigd om deel te nemen aan deze {isChurch ? "kerk" : "team"}.
          </p>
        </div>
        
        <div className={styles.cardContent}>
          {error && (
            <div className={`${styles.alert} ${styles.error}`}>
              <div className="flex items-center gap-2 mb-1 font-medium">
                <IoWarningOutline /> Fout
              </div>
              {error}
            </div>
          )}

          {successMessage && (
            <div className={`${styles.alert} ${styles.success}`}>
              <div className="flex items-center gap-2 mb-1 font-medium">
                <IoCheckmarkCircleOutline /> Succes
              </div>
              {successMessage}
            </div>
          )}

          <p className="text-sm text-gray-600 mb-4">
            Door lid te worden van deze {isChurch ? "kerk" : "team"} kun je de Vijfvoudige Bedieningstest voltooien en worden je resultaten gedeeld met de leider.
          </p>

          <div className={styles.infoBox}>
            <h3 className="text-sm font-medium mb-2">Wat er gebeurt wanneer je deelneemt:</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <IoCheckmarkCircleOutline className={styles.icon} />
                <span>Je zult de test afleggen om je profiel te ontdekken</span>
              </li>
              <li className={styles.listItem}>
                <IoCheckmarkCircleOutline className={styles.icon} />
                <span>Je resultaten worden zichtbaar voor de leiders</span>
              </li>
              <li className={styles.listItem}>
                <IoCheckmarkCircleOutline className={styles.icon} />
                <span>Je krijgt toegang tot het team dashboard</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.cardFooter}>
          <Button 
            onClick={handleJoin} 
            disabled={isJoining || !!successMessage}
            isLoading={isJoining}
            className={styles.button}
          >
            {successMessage ? 'Succesvol!' : user ? `Deelnemen aan ${isChurch ? 'kerk' : 'team'}` : 'Inloggen & Deelnemen'}
          </Button>
          
          {!user && (
            <p className="text-xs text-center text-gray-500 mt-2">
              Je wordt doorgestuurd naar de inlogpagina
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
