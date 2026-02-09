import ReuseableFaq from "../../components/faq/ReuseableFaq";
import { disclaimerContent } from "../../data/faq/AccordionItems";
import { fiveFoldMinistryAndPersonalScores } from "../../data/faq/faqList";

const Disclaimer = () => {
  return (
    <ReuseableFaq
      showFaq={false}
      faqList={fiveFoldMinistryAndPersonalScores}
      accordionItems={disclaimerContent}
    />
  )
}

export default Disclaimer