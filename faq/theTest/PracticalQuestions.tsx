import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { testPractical } from "@/data/faq/AccordionItems";
import { theTest } from "@/data/faq/faqList";
import React from "react";

export default function PracticalQuestions() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={theTest}
      accordionItems={testPractical}
    />
  );
}
