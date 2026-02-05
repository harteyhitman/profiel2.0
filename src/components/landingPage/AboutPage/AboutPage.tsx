'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './AboutPage.module.scss';
import BrandLogo from '../../../../public/About/image 1546.svg';
import BrandLogo2 from '../../../../public/About/product.svg';
import BrandLogo4 from '../../../../public/About/ontwikkelfasen.svg';
import BrandLogo5 from '../../../../public/About/het team.svg';
// export default function AboutPage() {
//   const [openAccordion, setOpenAccordion] = useState<string | null>(null);

//   const toggleAccordion = (id: string) => {
//     setOpenAccordion(openAccordion === id ? null : id);
//   };

//   const accordionItems = [
//     { id: '1', title: 'Geen vervanging van lokale kerk', content: 'Bedieningenprofiel is geen vervanging voor de lokale kerk, maar een hulpmiddel om de kerk te ondersteunen.' },
//     { id: '2', title: 'Aanvullend en dienend', content: 'Ons product is bedoeld om aanvullend en dienend te zijn aan de bestaande kerkstructuren.' },
//     { id: '3', title: 'Verwijzing naar de kerk', content: 'We verwijzen altijd terug naar de lokale kerk als de primaire plaats van gemeenschap en geestelijke groei.' },
//     { id: '4', title: 'Geen bindend gezag', content: 'Bedieningenprofiel heeft geen bindend gezag en is bedoeld als ondersteunend instrument.' },
//   ];

//   return (
//     <div className={styles.aboutPage}>
//       {/* Section 1 — De aanleiding */}
//       <section className={styles.section} aria-labelledby="de-aanleiding-heading">
//         <div className={styles.container}>
//           <div className={styles.introGrid}>
//             <div className={styles.introTextCol}>
//               <h1 id="de-aanleiding-heading" className={styles.introTitle}>
//                 De aanleiding
//               </h1>
//               <div className={styles.introParagraphs}>
//                 <p>
//                   Tijdens trainingen over de vijfvoudige bediening kwam steeds de vraag naar voren waar mensen zichzelf in herkennen. Vragen als &apos;Wie ben ik in Gods huis?&apos; en ook &apos;Welk type van de vijfvoudige bediening past bij mij?&apos;.
//                 </p>
//                 <p>
//                   Er was behoefte aan een hulpmiddel tot zelfidentificatie. Inzicht in personen en inzicht in je hele gemeente. Daarom is Bedieningenprofiel in het leven geroepen om kerken en organisaties te helpen vanuit inzicht verder te groeien.
//                 </p>
//               </div>
//             </div>
//             <div className={styles.introLogoCol} aria-hidden>
//               <Image
//                 src="/navbar/brand-logo.png"
//                 alt="Bedieningenprofiel"
//                 width={200}
//                 height={200}
//                 className={styles.brandLogo}
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Section 2 — Productontwikkeling */}
//       <section className={styles.sectionProduct}>
//         <div className={styles.container}>
//           <div className={styles.productWrap}>
//             <div className={styles.greenBrush} aria-hidden />
//             <div className={styles.productContent}>
//               <h2 className={styles.sectionTitle}>Productontwikkeling</h2>
//               <p className={styles.productIntro}>
//                 Elke leider van een kerk geeft zijn beste. Daarom kiezen en wegen we zorgvuldig nieuwe producten.
//                 We willen open zijn over het ontstaan van het Bedieningenprofiel.
//               </p>
//               <div className={styles.developmentGrid}>
//                 <div className={styles.developmentCard}>
//                   <div className={styles.cardIconCircle}>
//                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
//                       <path d="M12 5v14M5 12h14" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
//                     </svg>
//                   </div>
//                   <h3 className={styles.cardTitle}>Theologie</h3>
//                   <p className={styles.cardText}>
//                     De bediening is gebaseerd op Efeze 4:11 en bestaat uit apostel, profeet, evangelist, herder en leraar.
//                     Dit helpt mensen zichzelf te begrijpen en hoe ze een zegen kunnen zijn. We geloven dat de vijfvoudige
//                     bediening vijf persoonlijkheden met kenmerken omvat, en dat elke christen deze kenmerken in zekere mate bezit.
//                   </p>
//                 </div>
//                 <div className={styles.developmentCard}>
//                   <div className={styles.cardImageCircle}>
//                     <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
//                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                       <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                   </div>
//                   <h3 className={styles.cardTitle}>Vragenlijst</h3>
//                   <p className={styles.cardText}>
//                     De vragenlijst is met grote zorg ontwikkeld, waarbij we gebruik hebben gemaakt van de Bijbel,
//                     veldonderzoek, AI, vergelijkend onderzoek en literatuur om belangrijke kenmerken te selecteren
//                     die de bedieningen onderscheiden.
//                   </p>
//                   <div className={styles.documentationList}>
//                     <p className={styles.docLabel}>Documentatie</p>
//                     <ol>
//                       <li><a href="#" className={styles.docLink}>Achtergrond en ontwikkelkaders van de vragenlijst</a></li>
//                       <li><a href="#" className={styles.docLink}>Verantwoording selectiecriteria kenmerken</a></li>
//                     </ol>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Section 3 — Disclaimer BedieningenProfiel */}
//       <section className={styles.sectionDisclaimer}>
//         <div className={styles.container}>
//           <div className={styles.disclaimerContent}>
//             <h2 className={styles.disclaimerTitle}>Disclaimer BedieningenProfiel</h2>
//             <p className={styles.disclaimerIntro}>
//               BedieningenProfiel is ontwikkeld als hulpmiddel om lokale kerken te ondersteunen in het ontdekken,
//               ontwikkelen en inzetten van de vijfvoudige bediening zoals beschreven in Efeze 4.
//             </p>
//             <p className={styles.disclaimerIntro}>
//               Wij geloven in het belang van gezonde, Bijbelse theologie en willen kerken en gelovigen toerusten
//               door middel van onze test, rapportages en dashboards. Toch is het belangrijk te benadrukken:
//             </p>
//             <div className={styles.accordionContainer}>
//               {accordionItems.map((item) => (
//                 <div key={item.id} className={styles.accordionCard}>
//                   <button
//                     type="button"
//                     className={styles.accordionHeader}
//                     onClick={() => toggleAccordion(item.id)}
//                     aria-expanded={openAccordion === item.id}
//                   >
//                     <span className={styles.accordionTitle}>{item.title}</span>
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`${styles.accordionChevron} ${openAccordion === item.id ? styles.accordionOpen : ''}`}>
//                       <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                   </button>
//                   {openAccordion === item.id && (
//                     <div className={styles.accordionBody}>
//                       <p>{item.content}</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className={styles.finalCard}>
//               <p className={styles.finalStatement}>Ons verlangen is om te dienen, niet om te heersen.</p>
//               <p className={styles.finalSupport}>
//                 BedieningenProfiel wil kerken helpen om hun roeping te vervullen, maar altijd in afhankelijkheid
//                 en erkenning van het gezag dat God heeft toevertrouwd aan de lokale kerk.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Section 4 — Ontwikkelfasen */}
//       <section className={styles.section}>
//         <div className={styles.container}>
//           <div className={styles.phasesGrid}>
//             <div className={styles.phasesTextCol}>
//               <h2 className={styles.sectionTitle}>Ontwikkelfasen</h2>
//               <p>
//                 Door samen te werken kom je verder. Daarom nemen we je graag mee in de verschillende fasen.
//               </p>
//               <p>
//                 Het einddoel is dat elke kerk of organisatie op deze wereld in haar eigen taal toegang heeft tot Bedieningenprofiel.
//               </p>
//             </div>
//             <div className={styles.timelineCol}>
//               <div className={styles.timeline}>
//                 <div className={styles.timelineItem}>
//                   <div className={styles.timelineYear}>2027</div>
//                   <p className={styles.timelineDesc}>Engelstalige wereld</p>
//                   <p className={styles.timelineDetail}>Elke Engelstalige kerk krijgt toegang tot het product waarbij ook megakerken nu kunnen aansluiten.</p>
//                 </div>
//                 <div className={styles.timelineItem}>
//                   <div className={styles.timelineYear}>2026</div>
//                   <p className={styles.timelineDesc}>Nederland</p>
//                   <p className={styles.timelineDetail}>Het product is klaar. Minimaal 100 kerken maken gebruik van het product.</p>
//                 </div>
//                 <div className={styles.timelineItem}>
//                   <div className={styles.timelineYear}>2024–2025</div>
//                   <p className={styles.timelineDesc}>Ontwikkelfase</p>
//                   <p className={styles.timelineDetail}>Het product bestaat in zijn minimale basis. Een basis dashboard waarin tot 200 gebruikers een rapport krijgen.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Section 5 — Het team */}
//       <section className={styles.section}>
//         <div className={styles.container}>
//           <div className={styles.teamTitleWrap}>
//             <h2 className={styles.teamTitle}>Het team</h2>
//           </div>
//           <div className={styles.teamGrid}>
//             <div className={styles.teamMember}>
//               <div className={styles.memberPhotoWrap}>
//                 <Image src="/jochem.png" alt="Jochem" width={140} height={140} className={styles.memberPhoto} />
//               </div>
//               <p className={styles.memberName}>Jochem</p>
//               <p className={styles.memberRole}>initiatiefnemer</p>
//               <p className={styles.memberBio}>
//                 Jochem Mimpen is reli-ondernemer, geroepen om Gods Koninkrijk op te bouwen. Vanuit zijn hart
//                 voor gemeenten ontwikkelde hij BedieningenProfiel. Met passie voor theologie, innovatie en
//                 gemeenteopbouw geeft hij leiding aan het project. Hij bewaakt de visie, ontwikkelt de kaders
//                 en leidt het team in de doorontwikkeling van het platform. Zijn verlangen is dat kerken in
//                 Nederland en ver daarbuiten hun roeping ontdekken en tot bloei komen.
//               </p>
//               <p className={styles.memberBio}>
//                 Daarnaast is Jochem voorganger bij House of Hope in Purmerend, getrouwd met Joanna en vader van drie zoons.
//               </p>
//               <span className={styles.quoteMark} aria-hidden>„</span>
//             </div>
//             <div className={styles.teamMember}>
//               <div className={styles.memberPhotoWrap}>
//                 <Image src="/samuel.png" alt="Samuel Adebisi" width={140} height={140} className={styles.memberPhoto} />
//               </div>
//               <p className={styles.memberName}>Samuel Adebisi</p>
//               <p className={styles.memberRole}>leader development</p>
//               <p className={styles.memberBio}>
//                 Samuel Adebisi is productinnovator en teamleider development binnen BedieningenProfiel.
//                 Vanuit zijn passie voor technologie die mensen verbindt en kerken versterkt, bouwt hij aan
//                 de digitale infrastructuur die kerken helpt hun roeping helder te zien. Met ervaring in fintech,
//                 SaaS en spraaktechnologie brengt hij de expertise om een betrouwbaar en schaalbaar platform te ontwikkelen.
//               </p>
//               <p className={styles.memberBio}>
//                 Samuel is ook eigenaar en oprichter van Sprekar; dé vertaalapp voor kerken.
//               </p>
//               <span className={styles.quoteMark} aria-hidden>‟</span>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
const accordionItems = [
  { id: '1', title: 'Geen vervanging van lokale kerk', content: 'Bedieningenprofiel is geen vervanging voor de lokale kerk, maar een hulpmiddel om de kerk te ondersteunen.' },
  { id: '2', title: 'Aanvullend en dienend', content: 'Ons product is bedoeld om aanvullend en dienend te zijn aan de bestaande kerkstructuren.' },
  { id: '3', title: 'Verwijzing naar de kerk', content: 'We verwijzen altijd terug naar de lokale kerk als de primaire plaats van gemeenschap en geestelijke groei.' },
  { id: '4', title: 'Geen bindend gezag', content: 'Bedieningenprofiel heeft geen bindend gezag en is bedoeld als ondersteunend instrument.' },
];

const AboutPage = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className={styles.aboutPage}>
      <div className={styles.firstImageWrap} aria-hidden>
        <Image src={BrandLogo} alt="" className={styles.BrandLogo1} />
      </div>
      <Image src={BrandLogo2} alt="Product" className={styles.BrandLogo2} />
      <section className={styles.sectionDisclaimer} aria-labelledby="disclaimer-heading">
        <div className={styles.container}>
          <div className={styles.disclaimerContent}>
            <h2 id="disclaimer-heading" className={styles.disclaimerTitle}>Disclaimer BedieningenProfiel</h2>
            <p className={styles.disclaimerIntro}>
              BedieningenProfiel is ontwikkeld als hulpmiddel om lokale kerken te ondersteunen in het ontdekken,
              ontwikkelen en inzetten van de vijfvoudige bediening zoals beschreven in Efeze 4.
            </p>
            <p className={styles.disclaimerIntro1}>
              Wij geloven in het belang van gezonde, Bijbelse theologie en willen kerken en gelovigen toerusten
              door middel van onze test, rapportages en dashboards. Toch is het belangrijk te benadrukken:
            </p>
            <div className={styles.accordionContainer}>
              {accordionItems.map((item) => (
                <div key={item.id} className={styles.accordionCard}>
                  <button
                    type="button"
                    className={styles.accordionHeader}
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={openAccordion === item.id}
                  >
                    <span className={styles.accordionTitle}>{item.title}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`${styles.accordionChevron} ${openAccordion === item.id ? styles.accordionOpen : ''}`}>
                      <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {openAccordion === item.id && (
                    <div className={styles.accordionBody}>
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.finalCard}>
              <p className={styles.finalStatement}>Ons verlangen is om te dienen, niet om te heersen.</p>
              <p className={styles.finalSupport}>
                BedieningenProfiel wil kerken helpen om hun roeping te vervullen, maar altijd in afhankelijkheid
                en erkenning van het gezag dat God heeft toevertrouwd aan de lokale kerk.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Image src={BrandLogo4} alt="Ontwikkelfasen" className={styles.BrandLogo4} />
      <Image src={BrandLogo5} alt="Het team" className={styles.BrandLogo5} />
    </div>
  );
};

export default AboutPage;