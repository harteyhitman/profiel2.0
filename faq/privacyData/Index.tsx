import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { privacyData } from "@/data/faq/faqList";
import React from "react";

export default function PrivacyData() {
  return <ReuseableFaq heading="Privacy en gegevens" faqList={privacyData} />;
}
