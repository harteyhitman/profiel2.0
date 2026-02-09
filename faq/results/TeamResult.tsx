import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { resultsTeam } from "@/data/faq/AccordionItems";
import { results } from "@/data/faq/faqList";
import React from "react";

export default function TeamResult() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={results}
      accordionItems={resultsTeam}
    />
  );
}
