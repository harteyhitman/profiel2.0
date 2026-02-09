import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { teamsCreateManage } from "@/data/faq/AccordionItems";
import { teamsLeadership } from "@/data/faq/faqList";
import React from "react";

export default function CreateManageTeams() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={teamsLeadership}
      accordionItems={teamsCreateManage}
    />
  );
}
