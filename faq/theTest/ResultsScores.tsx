import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { testResultsScores } from "@/data/faq/AccordionItems";
import { theTest } from "@/data/faq/faqList";
import React from "react";

export default function ResultsScores() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={theTest}
      accordionItems={testResultsScores}
    />
  );
}
