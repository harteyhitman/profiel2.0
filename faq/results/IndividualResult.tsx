import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { resultsIndividual } from "@/data/faq/AccordionItems";
import { results } from "@/data/faq/faqList";
import React from "react";

export default function IndividualResult() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={results}
      accordionItems={resultsIndividual}
    />
  );
}
