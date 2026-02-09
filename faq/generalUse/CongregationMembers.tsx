import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { congregation } from "@/data/faq/AccordionItems";
import { generalUse } from "@/data/faq/faqList";
import React from "react";

export default function CongregationMembers() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={generalUse}
      accordionItems={congregation}
    />
  );
}
