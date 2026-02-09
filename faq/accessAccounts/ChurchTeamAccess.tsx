import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { accessChurchTeam } from "@/data/faq/AccordionItems";
import { accessAccounts } from "@/data/faq/faqList";
import React from "react";

export default function ChurchTeamAccess() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={accessAccounts}
      accordionItems={accessChurchTeam}
    />
  );
}
