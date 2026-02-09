import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { privacyProtectionRights } from "@/data/faq/AccordionItems";
import { privacyData } from "@/data/faq/faqList";
import React from "react";

export default function ProtectionRights() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={privacyData}
      accordionItems={privacyProtectionRights}
    />
  );
}
