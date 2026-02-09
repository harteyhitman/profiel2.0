'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/dashboard/Breadcrumb/Breadcrumb';
import FAQItem from '@/components/dashboard/FAQItem/FAQItem';
import { getCategoryTitle, getFAQItems, FAQ_SUB_CATEGORIES } from '@/lib/faq-data';
import styles from './page.module.scss';

export default function FAQItemsPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.categoryId as string;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categoryTitle = getCategoryTitle(categoryId);
  const items = getFAQItems(categoryId);
  const hasSubCategories = (FAQ_SUB_CATEGORIES[categoryId]?.length ?? 0) > 0;
  const handleBack = () => router.push(hasSubCategories ? `/dashboard/faqs/${categoryId}` : '/dashboard/faqs');

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbWrap}>
        <Breadcrumb
          items={[
            { label: 'Veelgestelde vragen', href: '/dashboard/faqs' },
            { label: categoryTitle },
          ]}
        />
      </div>

      <button type="button" onClick={handleBack} className={styles.backButton} aria-label={`Terug naar ${categoryTitle}`}>
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
            <p>Er zijn nog geen vragen beschikbaar voor deze categorie.</p>
          </div>
        )}
      </div>
    </div>
  );
}
