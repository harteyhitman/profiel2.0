'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/dashboard/Breadcrumb/Breadcrumb';
import FAQItem from '@/components/dashboard/FAQItem/FAQItem';
import { getCategoryTitle, getSubCategoryTitle } from '@/lib/faq-data';
import styles from './page.module.scss';

const faqItems: Record<string, Record<string, Array<{ question: string; answer: string }>>> = {
  'general-use': {
    'church-members': [
      { question: 'Wat is het Bedieningenprofiel en hoe helpt het mij?', answer: 'Het Bedieningenprofiel is een platform dat je met een korte test inzicht geeft in je bediening. Je ontvangt een persoonlijk rapport en het kerkteam ziet de verdeling van gaven.' },
      { question: 'Wat staat er in mijn persoonlijke rapport?', answer: 'Je persoonlijke rapport bevat gedetailleerde inzichten over je bedieningsprofiel: je sterke punten, groeigebieden en aanbevelingen op basis van de resultaten.' },
      { question: 'Waar zie ik later mijn resultaten?', answer: 'Je vindt je resultaten in het onderdeel Resultaat op je dashboard na het invullen van de vragenlijst.' },
      { question: 'Kan ik later aan een team worden gekoppeld?', answer: 'Ja, teamleiders en beheerders kunnen je na je assessment aan teams toevoegen.' },
      { question: 'Kost het geld als individu?', answer: 'Nee, individuele leden betalen niet voor de test. De kerk of organisatie draagt de abonnementskosten.' },
      { question: 'Wat is het voordeel ten opzichte van een eenmalige test?', answer: 'Het platform biedt doorlopende inzichten, teamanalyses en groeivolging vergeleken met een eenmalige test.' },
      { question: 'Waar kan ik hulp vinden?', answer: 'Je vindt hulp bij Veelgestelde vragen, via de support of door contact op te nemen met je teamleider.' },
    ],
  },
};

export default function FAQSubCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.categoryId as string;
  const subCategoryId = params?.subCategoryId as string;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categoryTitle = getCategoryTitle(categoryId);
  const subCategoryTitle = getSubCategoryTitle(categoryId, subCategoryId);
  const items = faqItems[categoryId]?.[subCategoryId] ?? [];

  const handleBack = () => router.push(`/dashboard/faqs/${categoryId}`);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbWrap}>
        <Breadcrumb
          items={[
            { label: 'Veelgestelde vragen', href: '/dashboard/faqs' },
            { label: categoryTitle, href: `/dashboard/faqs/${categoryId}` },
            { label: subCategoryTitle },
          ]}
        />
      </div>

      <button type="button" onClick={handleBack} className={styles.backButton} aria-label={`Terug naar ${categoryTitle}`}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {subCategoryTitle}
      </button>

      <div className={styles.headerSection}>
        <h1 className={styles.title}>{subCategoryTitle}</h1>
      </div>

      <div className={styles.faqList}>
        {items.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isExpanded={expandedIndex === index}
            onToggle={() => toggleExpand(index)}
          />
        ))}
      </div>
    </div>
  );
}
