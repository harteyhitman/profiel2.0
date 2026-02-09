import React from "react";
import ReuseableFaq from "../../components/faq/ReuseableFaq";
import { fiveFoldMinistryAndPersonalScores } from "../../data/faq/faqList";
import { backgroundDevelopmentFrameworks } from "../../data/faq/AccordionItems";

const BackgroundDevelopmentFrameworks = () => {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={fiveFoldMinistryAndPersonalScores}
      accordionItems={backgroundDevelopmentFrameworks}
    />
  );
};

export default BackgroundDevelopmentFrameworks;
