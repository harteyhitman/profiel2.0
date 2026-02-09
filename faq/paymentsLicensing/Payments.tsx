import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { paymentsPayments } from "@/data/faq/AccordionItems";
import { paymentsLicensing } from "@/data/faq/faqList";
import React from "react";

export default function Payments() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={paymentsLicensing}
      accordionItems={paymentsPayments}
    />
  );
}
