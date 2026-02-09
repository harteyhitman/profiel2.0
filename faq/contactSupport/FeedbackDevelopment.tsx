import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { contactFeedback } from "@/data/faq/AccordionItems";
import { contactSupport } from "@/data/faq/faqList";
import React from "react";

export default function FeedbackDevelopment() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={contactSupport}
      accordionItems={contactFeedback}
    />
  );
}
