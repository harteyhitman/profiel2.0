'use client';

import React, { useMemo } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import type { RoleScores } from '@/lib/types/dashboard';
import styles from './SWOTModal.module.scss';

interface SWOTModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'Strengths' | 'Weaknesses' | 'Chances' | 'Threats' | null;
  scores?: RoleScores | null;
}

const roleDescriptions: Record<string, { strengths: string[]; weaknesses: string[]; chances: string[]; threats: string[] }> = {
  Apostle: {
    strengths: [
      'Sterke visionaire leiderschap en strategisch denken',
      'Vermogen om nieuwe bedieningen op te bouwen en te vestigen',
      'Natuurlijke gave voor het mobiliseren van mensen en middelen',
      'Vermogen om het grote plaatje en langetermijndoelen te zien',
      'Gave van pionieren en nieuwe initiatieven starten',
    ],
    weaknesses: [
      'Kan moeite hebben met het onderhouden van gevestigde systemen',
      'Kan rusteloos worden bij routinematige taken',
      'Kan ondersteuning nodig hebben bij gedetailleerde follow-up',
      'Neiging om door te gaan voordat projecten volledig zijn gevestigd',
      'Kan dagelijkse operationele behoeften over het hoofd zien',
    ],
    chances: [
      'Mogelijkheid om nieuwe kerken of bedieningen te planten',
      'Potentieel om opkomende leiders te begeleiden',
      'Kans om kerkelijke invloed in de gemeenschap uit te breiden',
      'Mogelijkheid om innovatieve bedieningsmodellen te creëren',
      'Mogelijkheid om strategische partnerschappen op te bouwen',
    ],
    threats: [
      'Risico op burn-out door constante nieuwe initiatieven',
      'Potentieel om middelen te dun te verspreiden',
      'Bedreiging van het achterlaten van onvolledige projecten',
      'Risico op verwaarlozing van persoonlijke geestelijke groei',
      'Potentieel voor teamlid afhankelijkheid van je visie',
    ],
  },
  Apostel: {
    strengths: [
      'Sterke visionaire leiderschap en strategisch denken',
      'Vermogen om nieuwe bedieningen op te bouwen en te vestigen',
      'Natuurlijke gave voor het mobiliseren van mensen en middelen',
      'Vermogen om het grote plaatje en langetermijndoelen te zien',
      'Gave van pionieren en nieuwe initiatieven starten',
    ],
    weaknesses: [
      'Kan moeite hebben met het onderhouden van gevestigde systemen',
      'Kan rusteloos worden bij routinematige taken',
      'Kan ondersteuning nodig hebben bij gedetailleerde follow-up',
      'Neiging om door te gaan voordat projecten volledig zijn gevestigd',
      'Kan dagelijkse operationele behoeften over het hoofd zien',
    ],
    chances: [
      'Mogelijkheid om nieuwe kerken of bedieningen te planten',
      'Potentieel om opkomende leiders te begeleiden',
      'Kans om kerkelijke invloed in de gemeenschap uit te breiden',
      'Mogelijkheid om innovatieve bedieningsmodellen te creëren',
      'Mogelijkheid om strategische partnerschappen op te bouwen',
    ],
    threats: [
      'Risico op burn-out door constante nieuwe initiatieven',
      'Potentieel om middelen te dun te verspreiden',
      'Bedreiging van het achterlaten van onvolledige projecten',
      'Risico op verwaarlozing van persoonlijke geestelijke groei',
      'Potentieel voor teamlid afhankelijkheid van je visie',
    ],
  },
  Prophet: {
    strengths: [
      'Sterk gevoel voor Gods richting en doel',
      'Vermogen om waarheid met helderheid en overtuiging te spreken',
      'Gave van onderscheiding en geestelijk inzicht',
      'Natuurlijk vermogen om verandering uit te dagen en te inspireren',
      'Vermogen om verder te kijken dan de huidige omstandigheden',
    ],
    weaknesses: [
      'Kan moeite hebben met geduld bij het zien van verandering',
      'Kan worden gezien als te direct of confronterend',
      'Kan ondersteuning nodig hebben bij relatieopbouw',
      'Neiging om te focussen op problemen in plaats van oplossingen',
      'Kan hulp nodig hebben bij praktische implementatie',
    ],
    chances: [
      'Mogelijkheid om geestelijke vernieuwingsinitiatieven te leiden',
      'Potentieel om profetische trainingsprogramma\'s te ontwikkelen',
      'Kans om ruimtes te creëren voor diepere aanbidding',
      'Mogelijkheid om anderen te begeleiden in het horen van Gods stem',
      'Mogelijkheid om systemische problemen in de kerk aan te pakken',
    ],
    threats: [
      'Risico op isolatie door uitdagende boodschappen',
      'Potentieel voor conflict met leiderschap',
      'Bedreiging van ontmoediging door gebrek aan respons',
      'Risico op verwaarlozing van persoonlijke relaties',
      'Potentieel voor burn-out door het dragen van zware geestelijke lasten',
    ],
  },
  Profeet: {
    strengths: [
      'Sterk gevoel voor Gods richting en doel',
      'Vermogen om waarheid met helderheid en overtuiging te spreken',
      'Gave van onderscheiding en geestelijk inzicht',
      'Natuurlijk vermogen om verandering uit te dagen en te inspireren',
      'Vermogen om verder te kijken dan de huidige omstandigheden',
    ],
    weaknesses: [
      'Kan moeite hebben met geduld bij het zien van verandering',
      'Kan worden gezien als te direct of confronterend',
      'Kan ondersteuning nodig hebben bij relatieopbouw',
      'Neiging om te focussen op problemen in plaats van oplossingen',
      'Kan hulp nodig hebben bij praktische implementatie',
    ],
    chances: [
      'Mogelijkheid om geestelijke vernieuwingsinitiatieven te leiden',
      'Potentieel om profetische trainingsprogramma\'s te ontwikkelen',
      'Kans om ruimtes te creëren voor diepere aanbidding',
      'Mogelijkheid om anderen te begeleiden in het horen van Gods stem',
      'Mogelijkheid om systemische problemen in de kerk aan te pakken',
    ],
    threats: [
      'Risico op isolatie door uitdagende boodschappen',
      'Potentieel voor conflict met leiderschap',
      'Bedreiging van ontmoediging door gebrek aan respons',
      'Risico op verwaarlozing van persoonlijke relaties',
      'Potentieel voor burn-out door het dragen van zware geestelijke lasten',
    ],
  },
  Evangelist: {
    strengths: [
      'Natuurlijk enthousiasme en overtuigingskracht',
      'Sterk in het opbouwen van relaties en netwerken',
      'Vermogen om complexe zaken eenvoudig uit te leggen',
      'Optimisme en positieve energie',
      'Mogelijkheden en kansen zichtbaar maken',
    ],
    weaknesses: [
      'Kan moeite hebben met gedetailleerde planning en follow-up',
      'Kan te optimistisch zijn over tijdlijnen',
      'Kan ondersteuning nodig hebben bij administratieve taken',
      'Neiging om te veel projecten tegelijk aan te pakken',
      'Kan hulp nodig hebben bij het gefocust blijven op prioriteiten',
    ],
    chances: [
      'Mogelijkheid om nieuwe outreach initiatieven te leiden',
      'Potentieel om evangelisatie trainingsprogramma\'s te ontwikkelen',
      'Kans om kerkelijke aanwezigheid in de gemeenschap uit te breiden',
      'Mogelijkheid om nieuwe aansluitingspunten met zoekers te creëren',
      'Mogelijkheid om anderen te begeleiden in het delen van geloof',
    ],
    threats: [
      'Risico op burn-out door constante activiteit',
      'Potentieel om middelen te dun te verspreiden',
      'Bedreiging van verlies van focus op kernprioriteiten',
      'Risico op verwaarlozing van persoonlijke geestelijke groei',
      'Potentieel voor teamlid afhankelijkheid',
    ],
  },
  Shepherd: {
    strengths: [
      'Sterke gave van zorg en mededogen voor mensen',
      'Vermogen om diepe, betekenisvolle relaties op te bouwen',
      'Natuurlijke capaciteit voor pastorale counseling',
      'Gave van het creëren van veilige en gastvrije omgevingen',
      'Vermogen om geestelijke groei in anderen te koesteren',
    ],
    weaknesses: [
      'Kan moeite hebben met het nemen van moeilijke beslissingen',
      'Kan te betrokken raken bij problemen van anderen',
      'Kan ondersteuning nodig hebben bij het stellen van grenzen',
      'Neiging om conflicten of moeilijke gesprekken te vermijden',
      'Kan hulp nodig hebben bij strategische planning',
    ],
    chances: [
      'Mogelijkheid om kleine groep bedieningen te ontwikkelen',
      'Potentieel om zorg- en ondersteuningssystemen te creëren',
      'Kans om anderen te begeleiden in pastorale zorg',
      'Mogelijkheid om sterkere gemeenschapsverbindingen op te bouwen',
      'Mogelijkheid om discipelschapsprogramma\'s te ontwikkelen',
    ],
    threats: [
      'Risico op emotionele burn-out door zorgverlening',
      'Potentieel om te veel verantwoordelijkheid op zich te nemen',
      'Bedreiging van verwaarlozing van persoonlijke behoeften',
      'Risico om verstrikt te raken in problemen van anderen',
      'Potentieel voor moeilijkheden met nee zeggen',
    ],
  },
  Herder: {
    strengths: [
      'Sterke gave van zorg en mededogen voor mensen',
      'Vermogen om diepe, betekenisvolle relaties op te bouwen',
      'Natuurlijke capaciteit voor pastorale counseling',
      'Gave van het creëren van veilige en gastvrije omgevingen',
      'Vermogen om geestelijke groei in anderen te koesteren',
    ],
    weaknesses: [
      'Kan moeite hebben met het nemen van moeilijke beslissingen',
      'Kan te betrokken raken bij problemen van anderen',
      'Kan ondersteuning nodig hebben bij het stellen van grenzen',
      'Neiging om conflicten of moeilijke gesprekken te vermijden',
      'Kan hulp nodig hebben bij strategische planning',
    ],
    chances: [
      'Mogelijkheid om kleine groep bedieningen te ontwikkelen',
      'Potentieel om zorg- en ondersteuningssystemen te creëren',
      'Kans om anderen te begeleiden in pastorale zorg',
      'Mogelijkheid om sterkere gemeenschapsverbindingen op te bouwen',
      'Mogelijkheid om discipelschapsprogramma\'s te ontwikkelen',
    ],
    threats: [
      'Risico op emotionele burn-out door zorgverlening',
      'Potentieel om te veel verantwoordelijkheid op zich te nemen',
      'Bedreiging van verwaarlozing van persoonlijke behoeften',
      'Risico om verstrikt te raken in problemen van anderen',
      'Potentieel voor moeilijkheden met nee zeggen',
    ],
  },
  Teacher: {
    strengths: [
      'Sterk vermogen om complexe concepten uit te leggen en te verduidelijken',
      'Gave van het toegankelijk en relevant maken van de Schrift',
      'Natuurlijke capaciteit voor systematisch denken',
      'Vermogen om anderen te helpen waarheid te begrijpen en toe te passen',
      'Vermogen tot zorgvuldige studie en voorbereiding',
    ],
    weaknesses: [
      'Kan moeite hebben met emotionele verbinding',
      'Kan te gefocust raken op informatie boven transformatie',
      'Kan ondersteuning nodig hebben bij praktische toepassing',
      'Neiging om studie boven actie te verkiezen',
      'Kan hulp nodig hebben bij het betrekken van verschillende leerstijlen',
    ],
    chances: [
      'Mogelijkheid om educatieve programma\'s te ontwikkelen',
      'Potentieel om discipelschapscurriculum te creëren',
      'Kans om anderen te begeleiden in onderwijs',
      'Mogelijkheid om theologische trainingsprogramma\'s op te bouwen',
      'Mogelijkheid om online leermiddelen te ontwikkelen',
    ],
    threats: [
      'Risico op loskoppeling van praktische bediening',
      'Potentieel voor informatie-overload',
      'Bedreiging van verlies van passie in routinematig onderwijs',
      'Risico op verwaarlozing van relationele aspecten van bediening',
      'Potentieel om te academisch te worden',
    ],
  },
  Leraar: {
    strengths: [
      'Sterk vermogen om complexe concepten uit te leggen en te verduidelijken',
      'Gave van het toegankelijk en relevant maken van de Schrift',
      'Natuurlijke capaciteit voor systematisch denken',
      'Vermogen om anderen te helpen waarheid te begrijpen en toe te passen',
      'Vermogen tot zorgvuldige studie en voorbereiding',
    ],
    weaknesses: [
      'Kan moeite hebben met emotionele verbinding',
      'Kan te gefocust raken op informatie boven transformatie',
      'Kan ondersteuning nodig hebben bij praktische toepassing',
      'Neiging om studie boven actie te verkiezen',
      'Kan hulp nodig hebben bij het betrekken van verschillende leerstijlen',
    ],
    chances: [
      'Mogelijkheid om educatieve programma\'s te ontwikkelen',
      'Potentieel om discipelschapscurriculum te creëren',
      'Kans om anderen te begeleiden in onderwijs',
      'Mogelijkheid om theologische trainingsprogramma\'s op te bouwen',
      'Mogelijkheid om online leermiddelen te ontwikkelen',
    ],
    threats: [
      'Risico op loskoppeling van praktische bediening',
      'Potentieel voor informatie-overload',
      'Bedreiging van verlies van passie in routinematig onderwijs',
      'Risico op verwaarlozing van relationele aspecten van bediening',
      'Potentieel om te academisch te worden',
    ],
  },
};

function generateSWOTItems(scores: RoleScores | null, category: string): string[] {
  if (!scores) {
    return ['Geen gegevens beschikbaar'];
  }

  const roles = [
    { name: 'Apostel', value: scores.apostle || 0 },
    { name: 'Profeet', value: scores.prophet || 0 },
    { name: 'Evangelist', value: scores.evangelist || 0 },
    { name: 'Herder', value: scores.herder || 0 },
    { name: 'Leraar', value: scores.teacher || 0 },
  ].sort((a, b) => b.value - a.value);

  const highScoreThreshold = 50; // Scores above 50 are considered strong
  const lowScoreThreshold = 30; // Scores below 30 are considered weak

  const strongRoles = roles.filter(r => r.value >= highScoreThreshold);
  const weakRoles = roles.filter(r => r.value <= lowScoreThreshold);

  if (category === 'Strengths') {
    if (strongRoles.length > 0) {
      const items: string[] = [];
      strongRoles.forEach(role => {
        const desc = roleDescriptions[role.name];
        if (desc) {
          items.push(...desc.strengths.slice(0, 2));
        }
      });
      return items.slice(0, 5);
    }
    return ['Focus op het ontwikkelen van je primaire bedieningsgaven'];
  }

  if (category === 'Weaknesses') {
    if (weakRoles.length > 0) {
      const items: string[] = [];
      weakRoles.forEach(role => {
        const desc = roleDescriptions[role.name];
        if (desc) {
          items.push(...desc.weaknesses.slice(0, 2));
        }
      });
      return items.slice(0, 5);
    }
    return ['Blijf alle gebieden van bediening ontwikkelen'];
  }

  if (category === 'Chances') {
    if (strongRoles.length > 0) {
      const items: string[] = [];
      strongRoles.forEach(role => {
        const desc = roleDescriptions[role.name];
        if (desc) {
          items.push(...desc.chances.slice(0, 2));
        }
      });
      return items.slice(0, 5);
    }
    return ['Verken mogelijkheden om je gaven te gebruiken'];
  }

  if (category === 'Threats') {
    if (strongRoles.length > 0) {
      const items: string[] = [];
      strongRoles.forEach(role => {
        const desc = roleDescriptions[role.name];
        if (desc) {
          items.push(...desc.threats.slice(0, 2));
        }
      });
      return items.slice(0, 5);
    }
    return ['Wees je bewust van potentiële uitdagingen in bediening'];
  }

  return [];
}

const swotIcons: Record<string, React.ReactNode> = {
  Strengths: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Weaknesses: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Chances: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Threats: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 9V13M12 17H12.01M5.71 19H18.29C19.881 19 21.17 17.709 21.17 16.118V7.882C21.17 6.291 19.881 5 18.29 5H5.71C4.119 5 2.83 6.291 2.83 7.882V16.118C2.83 17.709 4.119 19 5.71 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function SWOTModal({ isOpen, onClose, category, scores }: SWOTModalProps) {
  if (!category) return null;

  const items = useMemo(() => generateSWOTItems(scores || null, category), [scores, category]);
  const icon = swotIcons[category];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SWOT-analyse"
      showCloseButton={true}
      size="medium"
      closeOnOverlayClick={true}
    >
      <div className={styles.modalContent}>
        <div className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <div className={styles.categoryIcon}>{icon}</div>
            <h3 className={styles.categoryTitle}>
              {category === 'Strengths' ? 'Sterke Punten' :
               category === 'Weaknesses' ? 'Zwakke Punten' :
               category === 'Chances' ? 'Kansen' :
               category === 'Threats' ? 'Bedreigingen' : category}
            </h3>
          </div>
          <ul className={styles.itemsList}>
            {items.map((item, index) => (
              <li key={index} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}

