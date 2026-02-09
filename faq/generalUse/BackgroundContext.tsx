import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { backgroundContext } from "@/data/faq/AccordionItems";
import { generalUse } from "@/data/faq/faqList";
import React from "react";

export default function BackgroundContext() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={generalUse}
      accordionItems={backgroundContext}
    />
  );
}
