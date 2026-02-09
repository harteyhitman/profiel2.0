import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { paymentsSubscriptions } from "@/data/faq/AccordionItems";
import { paymentsLicensing } from "@/data/faq/faqList";
import React from "react";

export default function Subscription() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={paymentsLicensing}
      accordionItems={paymentsSubscriptions}
    />
  );
}
