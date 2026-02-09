import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { testGeneral } from "@/data/faq/AccordionItems";
import { theTest } from "@/data/faq/faqList";
import React from "react";

export default function GeneralAboutTest() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={theTest}
      accordionItems={testGeneral}
    />
  );
}
