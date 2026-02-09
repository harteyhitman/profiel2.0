import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { testReliability } from "@/data/faq/AccordionItems";
import { theTest } from "@/data/faq/faqList";
import React from "react";

type Props = {};

export default function ReliablilityQuality({}: Props) {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={theTest}
      accordionItems={testReliability}
    />
  );
}
