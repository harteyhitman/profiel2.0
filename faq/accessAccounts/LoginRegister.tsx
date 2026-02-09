import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { accessAuth } from "@/data/faq/AccordionItems";
import { accessAccounts } from "@/data/faq/faqList";
import React from "react";

export default function LoginRegister() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={accessAccounts}
      accordionItems={accessAuth}
    />
  );
}
