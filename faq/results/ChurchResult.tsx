import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { resultsChurch } from "@/data/faq/AccordionItems";
import { results } from "@/data/faq/faqList";
import React from "react";

export default function ChurchResult() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={results}
      accordionItems={resultsChurch}
    />
  );
}
