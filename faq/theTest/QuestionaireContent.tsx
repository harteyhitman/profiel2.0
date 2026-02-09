import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { testQuestionnaire } from "@/data/faq/AccordionItems";
import { theTest } from "@/data/faq/faqList";
import React from "react";

export default function QuestionaireContent() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={theTest}
      accordionItems={testQuestionnaire}
    />
  );
}
