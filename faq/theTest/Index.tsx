import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { theTest } from "@/data/faq/faqList";
import React from "react";

export default function TheTest() {
  return <ReuseableFaq heading="De test" faqList={theTest} />;
}
