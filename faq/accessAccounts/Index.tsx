import ReuseableFaq from "@/components/faq/ReuseableFaq";
import { accessAccounts } from "@/data/faq/faqList";
import React from "react";

export default function AccessAccount() {
  return (
    <ReuseableFaq heading="Toegang en accounts" faqList={accessAccounts} />
  );
}
