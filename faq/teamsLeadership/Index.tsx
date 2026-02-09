import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { teamsLeadership } from "@/data/faq/faqList";
import React from "react";

export default function TeamsLeadership() {
  return (
    <ReuseableFaq heading="Teams en leiderschap" faqList={teamsLeadership} />
  );
}
