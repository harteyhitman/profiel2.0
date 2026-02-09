import ReuseableFaq from "../../components/faq/ReuseableFaq";
import { fiveFoldMinistryAndPersonalScores } from "../../data/faq/faqList";
import React from "react";

export default function Faq() {
  return (
    <ReuseableFaq
      heading="Veelgestelde vragen"
      faqList={fiveFoldMinistryAndPersonalScores}
    />
  );
}
