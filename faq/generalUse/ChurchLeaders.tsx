import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { churchLeaders } from "@/data/faq/AccordionItems";
import { generalUse } from "@/data/faq/faqList";
import React from "react";

export default function ChurchLeaders() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={generalUse}
      accordionItems={churchLeaders}
    />
  );
}
