import Heading from "@/components/faq/Heading";
import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { personalScore } from "@/data/faq/AccordionItems";
import { fiveFoldMinistryAndPersonalScores } from "@/data/faq/faqList";

import React from "react";
export default function PersonalScores() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={fiveFoldMinistryAndPersonalScores}
      accordionItems={personalScore}
    />
  );
}
