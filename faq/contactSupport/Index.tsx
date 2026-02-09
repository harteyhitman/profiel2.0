import ReuseableFaq from "../../../components/faq/ReuseableFaq";
import { contactSupport } from "../../../data/faq/faqList";
import React from "react";

export default function ContactSupport() {
  return (
    <>
    <ReuseableFaq heading="Contact en ondersteuning" faqList={contactSupport} />
    </>
  );
}
