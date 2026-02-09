import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { officeCallingIdentity } from "@/data/faq/AccordionItems";
import { fiveFoldMinistryAndPersonalScores } from "@/data/faq/faqList";
import React from "react";

export default function OfficeCallingIdentity() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={fiveFoldMinistryAndPersonalScores}
      accordionItems={officeCallingIdentity}
    />
  );
}
