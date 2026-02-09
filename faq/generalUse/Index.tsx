import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { generalUse } from "@/data/faq/faqList";
import React from "react";

export default function GeneralUse() {
  return <ReuseableFaq heading="Algemeen gebruik" faqList={generalUse} />;
}
