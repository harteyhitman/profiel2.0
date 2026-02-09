import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { teamLeaders } from "@/data/faq/AccordionItems";
import { generalUse } from "@/data/faq/faqList";
import React from "react";

export default function TeamLeaders() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={generalUse}
      accordionItems={teamLeaders}
    />
  );
}
