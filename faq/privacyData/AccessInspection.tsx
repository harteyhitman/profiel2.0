import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { privacyAccessInspection } from "@/data/faq/AccordionItems";
import { privacyData } from "@/data/faq/faqList";
import React from "react";

export default function AccessInspection() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={privacyData}
      accordionItems={privacyAccessInspection}
    />
  );
}
