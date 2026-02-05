'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FAQCategoryCard from '@/components/dashboard/FAQCategoryCard/FAQCategoryCard';
import { FAQ_CATEGORIES } from '@/lib/faq-data';
import styles from './page.module.scss';

export default function FAQsPage() {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/dashboard/faqs/${categoryId}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>FAQS</h1>
        <p className={styles.subtitle}>
          See which members are joining your team and their ratings
        </p>
      </div>

      <div className={styles.categoriesGrid}>
        {FAQ_CATEGORIES.map((category) => (
          <FAQCategoryCard
            key={category.id}
            title={category.title}
            description={category.description}
            icon={category.icon}
            onClick={() => handleCategoryClick(category.id)}
          />
        ))}
      </div>
    </div>
  );
}
