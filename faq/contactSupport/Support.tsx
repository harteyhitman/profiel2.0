import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { contactSupport } from "@/data/faq/AccordionItems";
import { contactSupport as contactSupportFaqlist } from "@/data/faq/faqList";
import React from "react";

export default function Support() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={contactSupportFaqlist}
      accordionItems={contactSupport}
    />
  );
}
