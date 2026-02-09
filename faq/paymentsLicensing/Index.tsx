import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { paymentsLicensing } from "@/data/faq/faqList";
import React from "react";

export default function PaymentsLicensing() {
  return (
    <ReuseableFaq
      heading="Betalingen en licenties"
      faqList={paymentsLicensing}
    />
  );
}
