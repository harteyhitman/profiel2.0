import React from "react";
import ReuseableFaq from "../../components/faq/ReuseableFaq";
import { fiveFoldMinistryAndPersonalScores } from "../../data/faq/faqList";
import { selectionCriteriaPrinciples } from "../../data/faq/AccordionItems";

const SelectionCriteriaPrinciples = () => {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={fiveFoldMinistryAndPersonalScores}
      accordionItems={selectionCriteriaPrinciples}
    />
  );
};

export default SelectionCriteriaPrinciples;
