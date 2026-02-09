import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { resultsPractical } from "@/data/faq/AccordionItems";
import { results } from "@/data/faq/faqList";
import React from "react";

export default function ResultPractical() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={results}
      accordionItems={resultsPractical}
    />
  );
}
