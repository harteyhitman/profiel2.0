import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { relationshipChurch } from "@/data/faq/AccordionItems";
import { fiveFoldMinistryAndPersonalScores } from "@/data/faq/faqList";
import React from "react";

export default function RelationShipToChurch() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={fiveFoldMinistryAndPersonalScores}
      accordionItems={relationshipChurch}
    />
  );
}
