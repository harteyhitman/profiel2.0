import ReuseableFaq from "../../components/faq/ReuseableFaq";
import { theologicalUnderstanding } from "../../data/faq/AccordionItems";
import { fiveFoldMinistryAndPersonalScores } from "../../data/faq/faqList";
import React from "react";

export default function TheologicalSpiritualUnderstanding() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={fiveFoldMinistryAndPersonalScores}
      accordionItems={theologicalUnderstanding}
    />
  );
}
