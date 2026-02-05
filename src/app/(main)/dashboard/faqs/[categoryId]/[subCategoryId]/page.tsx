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
      { question: 'What is the Ministry Profile and how does it help me?', answer: "Ministry's profile is a platform that helps you gain insight into your ministry with a short test. You will receive a personal report and the church team will see the distribution of gifts." },
      { question: "What's in my personal report?", answer: 'Your personal report contains detailed insights about your ministry profile, including your strengths, areas for growth, and recommendations based on your assessment results.' },
      { question: 'Where will I see my results later?', answer: 'You can access your results in the Result section of your dashboard after completing the questionnaire.' },
      { question: 'Can I be linked to a team later?', answer: 'Yes, team leaders and administrators can assign you to teams after you complete your assessment.' },
      { question: 'Does it cost money as an individual?', answer: 'No, individual members do not pay for the assessment. The church or organization covers the subscription costs.' },
      { question: 'What is the advantage over buying a test once?', answer: 'The platform provides ongoing insights, team analysis, and continuous growth tracking compared to a one-time assessment.' },
      { question: 'Where can I find help?', answer: 'You can find help in the FAQs section, contact support, or reach out to your team leader for assistance.' },
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
            { label: 'FAQ', href: '/dashboard/faqs' },
            { label: categoryTitle, href: `/dashboard/faqs/${categoryId}` },
            { label: subCategoryTitle },
          ]}
        />
      </div>

      <button type="button" onClick={handleBack} className={styles.backButton} aria-label={`Back to ${categoryTitle}`}>
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
