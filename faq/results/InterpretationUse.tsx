import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { resultsInterpretation } from "@/data/faq/AccordionItems";
import { results } from "@/data/faq/faqList";
import React from "react";

export default function InterpretationUse() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={results}
      accordionItems={resultsInterpretation}
    />
  );
}
