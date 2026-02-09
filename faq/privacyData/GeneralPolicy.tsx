import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { privacyGeneralPolicy } from "@/data/faq/AccordionItems";
import { privacyData } from "@/data/faq/faqList";
import React from "react";

export default function GeneralPolicy() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={privacyData}
      accordionItems={privacyGeneralPolicy}
    />
  );
}
