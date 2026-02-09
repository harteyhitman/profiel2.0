import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { paymentsRationale } from "@/data/faq/AccordionItems";
import { paymentsLicensing } from "@/data/faq/faqList";
import React from "react";

export default function UnderlyingRationale() {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={paymentsLicensing}
      accordionItems={paymentsRationale}
    />
  );
}
