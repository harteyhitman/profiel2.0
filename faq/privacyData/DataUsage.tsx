import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { privacyDataUsage } from "@/data/faq/AccordionItems";
import { privacyData } from "@/data/faq/faqList";
import React from "react";

export default function DataUsage() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={privacyData}
      accordionItems={privacyDataUsage}
    />
  );
}
