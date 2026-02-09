import ReuseableFaq from "../../components/faq/ReuseableFaq";
import { growthDevelopment } from "../../data/faq/AccordionItems";
import { fiveFoldMinistryAndPersonalScores } from "../../data/faq/faqList";
import React from "react";

export default function GrowthAndDevelopment() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={fiveFoldMinistryAndPersonalScores}
      accordionItems={growthDevelopment}
    />
  );
}
