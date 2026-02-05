'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/dashboard/Breadcrumb/Breadcrumb';
import FAQSubCategoryCard from '@/components/dashboard/FAQSubCategoryCard/FAQSubCategoryCard';
import { FAQ_SUB_CATEGORIES, getCategoryTitle } from '@/lib/faq-data';
import styles from './page.module.scss';

export default function FAQCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.categoryId as string;

  const categoryTitle = getCategoryTitle(categoryId);
  const subCats = FAQ_SUB_CATEGORIES[categoryId] ?? [];

  const handleSubCategoryClick = (subCategoryId: string) => {
    router.push(`/dashboard/faqs/${categoryId}/${subCategoryId}`);
  };

  useEffect(() => {
    if (subCats.length === 0 && categoryId) {
      router.replace(`/dashboard/faqs/${categoryId}/items`);
    }
  }, [categoryId, subCats.length, router]);

  if (subCats.length === 0) {
    return null;
  }

  const handleBack = () => router.push('/dashboard/faqs');

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

      <button type="button" onClick={handleBack} className={styles.backButton} aria-label="Back to FAQs">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {categoryTitle}
      </button>

      <div className={styles.headerSection}>
        <h1 className={styles.title}>{categoryTitle}</h1>
      </div>

      <div className={styles.subCategoriesGrid}>
        {subCats.map((subCat) => (
          <FAQSubCategoryCard
            key={subCat.id}
            title={subCat.title}
            icon={subCat.icon}
            onClick={() => handleSubCategoryClick(subCat.id)}
          />
        ))}
      </div>
    </div>
  );
}
