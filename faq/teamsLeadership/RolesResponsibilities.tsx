import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { teamsRolesResponsibilities } from "@/data/faq/AccordionItems";
import { teamsLeadership } from "@/data/faq/faqList";
import React from "react";

export default function RolesResponsibilities() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={teamsLeadership}
      accordionItems={teamsRolesResponsibilities}
    />
  );
}
