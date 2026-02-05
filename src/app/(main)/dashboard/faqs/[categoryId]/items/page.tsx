'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/dashboard/Breadcrumb/Breadcrumb';
import FAQItem from '@/components/dashboard/FAQItem/FAQItem';
import { getCategoryTitle } from '@/lib/faq-data';
import styles from './page.module.scss';

const faqItems: Record<string, Array<{ question: string; answer: string }>> = {
  'personal-score': [
    { question: 'How is my personal score calculated?', answer: 'Your personal score is calculated based on your responses to the questionnaire, analyzing your strengths and areas for growth across different ministry roles.' },
    { question: 'What does my score mean?', answer: 'Your score reflects your alignment with different ministry roles and helps identify where your gifts and calling are strongest.' },
  ],
};

export default function FAQItemsPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.categoryId as string;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categoryTitle = getCategoryTitle(categoryId);
  const items = faqItems[categoryId] ?? [];

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
            { label: categoryTitle },
          ]}
        />
      </div>

      <button type="button" onClick={handleBack} className={styles.backButton} aria-label={`Back to ${categoryTitle}`}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {categoryTitle}
      </button>

      <div className={styles.headerSection}>
        <h1 className={styles.title}>{categoryTitle}</h1>
      </div>

      <div className={styles.faqList}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isExpanded={expandedIndex === index}
              onToggle={() => toggleExpand(index)}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No FAQ items available for this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
