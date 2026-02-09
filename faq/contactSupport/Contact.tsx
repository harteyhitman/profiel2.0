import ReuseableFaq from "../../..//components/faq/ReuseableFaq";
import { contactContact } from "../../..//data/faq/AccordionItems";
import { contactSupport } from "../../..//data/faq/faqList";

function Contact() {
  return (
    <>
     <ReuseableFaq
      showFaq={false}
      faqList={contactSupport}
      accordionItems={contactContact}
    />
    </>
   
  );
}

export default Contact;
