'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/dashboard/Breadcrumb/Breadcrumb';
import FAQItem from '@/components/dashboard/FAQItem/FAQItem';
import { getCategoryTitle, getSubCategoryTitle, getFAQItems } from '@/lib/faq-data';
import styles from './page.module.scss';

export default function FAQSubCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.categoryId as string;
  const subCategoryId = params?.subCategoryId as string;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categoryTitle = getCategoryTitle(categoryId);
  const subCategoryTitle = getSubCategoryTitle(categoryId, subCategoryId);
  const items = getFAQItems(categoryId, subCategoryId);

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
        {items.length > 0 ? items.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isExpanded={expandedIndex === index}
            onToggle={() => toggleExpand(index)}
          />
        )) : (
          <div className={styles.emptyState}>
            <p>Er zijn nog geen vragen beschikbaar voor deze categorie.</p>
          </div>
        )}
      </div>
    </div>
  );
}
