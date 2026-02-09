import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { accessProfile } from "@/data/faq/AccordionItems";
import { accessAccounts } from "@/data/faq/faqList";
import React from "react";

export default function UserAccessProfile() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={accessAccounts}
      accordionItems={accessProfile}
    />
  );
}
