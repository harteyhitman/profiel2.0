import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { teamsPracticalTips } from "@/data/faq/AccordionItems";
import { teamsLeadership } from "@/data/faq/faqList";
import React from "react";

export default function PracticalTips() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={teamsLeadership}
      accordionItems={teamsPracticalTips}
    />
  );
}
