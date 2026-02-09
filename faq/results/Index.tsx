import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { results } from "@/data/faq/faqList";
import React from "react";

export default function Results() {
  return <ReuseableFaq heading="Resultaten" faqList={results} />;
}
