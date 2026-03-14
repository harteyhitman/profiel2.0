'use client';

import React from 'react';

export interface FAQCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface FAQSubCategory {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

export interface FAQItemEntry {
  question: string;
  answer: string;
}

// Reusable icon components for FAQ
const IconClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPerson = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconDocument = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconTeam = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1674 16.5523C21.6304 15.8519 20.8833 15.3516 20.04 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconBook = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17L9 11L13 15L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 17V11H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconMinistry = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L2 5V9C2 13.55 5.36 17.74 10 19C14.64 17.74 18 13.55 18 9V5L10 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconBuilding = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 21V7L12 3L19 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 9V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconAccount = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPayment = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19V5C22 4.44772 21.5523 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconContact = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconResult = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17L9 11L13 15L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 17V11H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPeople = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1674 16.5523C21.6304 15.8519 20.8833 15.3516 20.04 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconLock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L5 6V11C5 15.55 8.03 19.74 12 21C15.97 19.74 19 15.55 19 11V6L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.5 12L11.25 13.75L14.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconKey = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 7C21 9.20914 19.2091 11 17 11C16.1819 11 15.4211 10.7544 14.7873 10.3333L10 15.1207V18H7V21H4V17.8787L9.66667 12.212C9.24557 11.5789 9 10.8181 9 10C9 7.79086 10.7909 6 13 6C13.8181 6 14.5789 6.24557 15.212 6.66667L16 5.87868V3H19V6H21V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.5 7.5H16.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconInfo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconClipboard = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3H15V6H9V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 4H7C5.89543 4 5 4.89543 5 6V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6C19 4.89543 18.1046 4 17 4H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FAQ_CATEGORIES: FAQCategory[] = [
  { id: 'personal-score', title: 'Over je persoonlijke score', description: 'Leer hoe je score wordt berekend en wat die zegt over je aanleg, sterke punten en groeigebieden.', icon: <IconPerson /> },
  { id: 'ministry-vocation', title: 'Ambt, roeping en identiteit', description: 'Begrijp hoe roeping, bediening en identiteit zich tot elkaar verhouden in de praktijk.', icon: <IconMinistry /> },
  { id: 'municipality', title: 'Relatie tot de gemeente', description: 'Verken hoe je bediening zich verbindt met de gemeente en hoe je daarin gezond kunt dienen.', icon: <IconBuilding /> },
  { id: 'growth-development', title: 'Groei en ontwikkeling', description: 'Krijg begeleiding bij het ontwikkelen van je bediening en het verdiepen van persoonlijke groei.', icon: <IconChart /> },
  { id: 'theological-spiritual', title: 'Theologische en geestelijke verwerking', description: 'Reflecteer op de geestelijke en theologische betekenis van je profiel en bediening.', icon: <IconBook /> },
  { id: 'general-use', title: 'Algemeen gebruik', description: 'Vind hulp bij het navigeren op het platform en het gebruiken van de belangrijkste functies.', icon: <IconClock /> },
  { id: 'the-test', title: 'De test', description: 'Begrijp de vragenlijst, betrouwbaarheid en hoe antwoorden worden verwerkt.', icon: <IconDocument /> },
  { id: 'result', title: 'Resultaten', description: 'Begrijp je uitkomsten, hoe je ze leest en waar je ze terugvindt op het platform.', icon: <IconResult /> },
  { id: 'account-data', title: 'Privacy en gegevens', description: 'Lees hoe gegevens worden opgeslagen, gedeeld en beschermd binnen het platform.', icon: <IconShield /> },
  { id: 'access-accounts', title: 'Toegang en accounts', description: 'Beheer inloggen, wachtwoorden en toegang tot je persoonlijke account.', icon: <IconKey /> },
  { id: 'teams-leadership', title: 'Teams en leiderschap', description: 'Ontdek hoe teams zijn opgebouwd en hoe leiderschap samenwerkt met bedieningsprofielen.', icon: <IconTeam /> },
  { id: 'payment-license', title: 'Betalingen en licenties', description: 'Leer meer over abonnementen, licenties en hoe betalingen binnen organisaties werken.', icon: <IconPayment /> },
  { id: 'contact-support', title: 'Contact en ondersteuning', description: 'Neem contact op met het ondersteuningsteam voor hulp, feedback of aanvullende vragen.', icon: <IconContact /> },
  { id: 'disclaimer', title: 'Disclaimer', description: 'Lees hoe de resultaten bedoeld zijn en welke grenzen er gelden bij de interpretatie ervan.', icon: <IconInfo /> },
  { id: 'background-frameworks', title: 'Achtergrond en ontwikkelkaders', description: 'Lees meer over de achtergrond van de vragenlijst en de kaders waarop deze is ontwikkeld.', icon: <IconBook /> },
  { id: 'selection-criteria', title: 'Selectiecriteria en beoordelingsprincipes', description: 'Lees hoe kenmerken zijn geselecteerd en op welke beoordelingsprincipes de uitkomsten rusten.', icon: <IconClipboard /> },
];

export const FAQ_SUB_CATEGORIES: Record<string, FAQSubCategory[]> = {
  'general-use': [
    { id: 'church-members', title: 'Gemeenteleden', icon: <IconPeople /> },
    { id: 'team-leaders', title: 'Teamleiders', icon: <IconTeam /> },
    { id: 'church-leaders', title: 'Voor kerkleiders / beheerder', icon: <IconLock /> },
    { id: 'reasons-background', title: 'Redenen & achtergrond', icon: <IconBuilding /> },
  ],
  'personal-score': [],
  'the-test': [],
  'result': [],
  'theological-spiritual': [],
  'growth-development': [],
  'teams-leadership': [],
  'ministry-vocation': [],
  'municipality': [],
  'contact-support': [],
  'account-data': [],
  'access-accounts': [],
  'payment-license': [],
  'disclaimer': [],
  'background-frameworks': [],
  'selection-criteria': [],
};

/** FAQ items for categories that have no subcategories (shown on /dashboard/faqs/[categoryId]/items) */
export const FAQ_ITEMS_BY_CATEGORY: Record<string, FAQItemEntry[]> = {
  'personal-score': [
    { question: 'Ben ik automatisch die bediening bij een hoge score?', answer: 'Nee. Een score laat zien waar je genade en aanleg ligt, maar bevestiging en vrucht komen door de Heilige Geest en de gemeente.' },
    { question: 'Kan mijn score veranderen?', answer: 'Ja. Door groei, ervaringen en seizoenen kan een profiel verschuiven, maar je kernroeping blijft herkenbaar.' },
    { question: 'Wat betekent een lage score?', answer: 'Dat betekent niet dat je "minder geestelijk" bent, maar dat die rol niet jouw primaire krachtveld is.' },
    { question: 'Kan ik meerdere hoofdscores hebben?', answer: 'Soms wel. God combineert bedieningen, maar meestal word je in de praktijk vooral in één rol bevestigd.' },
  ],
  'ministry-vocation': [
    { question: 'Is score hetzelfde als roeping tot ambt?', answer: 'Nee. Een score laat aanleg zien, maar roeping wordt bevestigd door God, vrucht en de gemeente.' },
    { question: 'Verschil tussen gave, roeping en ambt?', answer: 'Gave is geschenk van de Geest, roeping is Gods stem, ambt is herkenning door de gemeente.' },
    { question: 'Hoe weet ik of God mijn bediening bevestigt?', answer: 'Door innerlijke overtuiging, vrucht in de praktijk en bevestiging door geestelijke leiders.' },
    { question: 'Kan de kerk mij anders herkennen dan mijn score?', answer: 'Ja. De test is een hulpmiddel, maar Gods Geest en de gemeenschap zien soms bredere kanten.' },
  ],
  'municipality': [
    { question: 'Hoe gebruik ik mijn score in de gemeente?', answer: 'Door te dienen waar je gaven liggen en door anderen op te bouwen in liefde.' },
    { question: 'Moet iedereen mijn bediening weten?', answer: 'Niet per se. Belangrijker is dat je bediening zichtbaar wordt in je daden en vrucht.' },
    { question: 'Wat bij botsing met gemeentecultuur?', answer: 'Blijf in liefde dienen en zoek gesprek. God kan via jou nieuwe accenten brengen.' },
    { question: 'Hoe omgaan met jaloezie over scores?', answer: 'Herinner jezelf dat alle gaven genade zijn en bedoeld om elkaar te dienen.' },
  ],
  'growth-development': [
    { question: 'Kan ik groeien in een lage score rol?', answer: 'Ja, door oefening, onderwijs en de werking van de Geest kan groei plaatsvinden.' },
    { question: 'Hoe ontwikkel ik mijn bediening?', answer: 'Door training, mentoring en actieve inzet in de gemeente.' },
    { question: 'Is karakter belangrijker dan score?', answer: 'Ja. Karakter draagt de bediening; zonder karakter kan een hoge score schadelijk worden.' },
    { question: 'Hoe weet ik of mijn bediening vrucht draagt?', answer: 'Door levens te zien veranderen en door bevestiging van anderen.' },
  ],
  'theological-spiritual': [
    { question: 'Is mijn score Gods stem over mijn leven?', answer: 'Nee. Het is een hulpmiddel, maar Gods stem komt door de Geest, de Schrift en de gemeente.' },
    { question: 'Hoe verhoudt dit zich tot de Geest?', answer: 'De Geest leidt altijd. De test helpt je dat concreet te herkennen.' },
    { question: 'Is bediening een gave of opdracht?', answer: 'Beide: het is een genadegave en een roeping van Jezus om te dienen.' },
    { question: 'Wat als mijn score me onzeker maakt?', answer: 'Breng je onzekerheid bij God. Je identiteit ligt in Christus, niet in cijfers.' },
  ],
  'the-test': [
    { question: 'Hoe werkt de vragenlijst?', answer: 'Je krijgt 40 vragen met steeds twee stellingen. Je kiest per vraag de stelling die het beste bij je past (schaal 0–6, 3 = neutraal).' },
    { question: 'Hoe betrouwbaar is de test?', answer: 'De test is gebaseerd op het vijfvoudige bedieningsmodel en geeft een indicatie van je sterke punten. Bevestiging komt door de gemeente en de Geest.' },
    { question: 'Hoe worden de scores berekend?', answer: 'Op basis van je antwoorden worden scores per bediening (apostel, profeet, evangelist, herder, leraar) berekend. De hoogste scores bepalen je primaire en secundaire profiel.' },
    { question: 'Kan ik de vragenlijst opnieuw doen?', answer: 'Ja. Je kunt je antwoorden later aanpassen; je resultaten worden dan opnieuw berekend.' },
  ],
  'result': [
    { question: 'Waar vind ik mijn resultaat?', answer: 'Na het invullen van de vragenlijst vind je je resultaat onder Resultaat op je dashboard.' },
    { question: 'Wat toont mijn resultaat?', answer: 'Je ziet je scores per bediening, je primaire en secundaire profiel en een volledige score-uitsplitsing (max. 80 punten per rol).' },
    { question: 'Kan ik mijn resultaat delen?', answer: 'Ja. Je kunt je resultaat delen of exporteren via de knoppen op de resultaatpagina.' },
    { question: 'Wat als ik nog geen resultaat heb?', answer: 'Vul eerst de vragenlijst in via Vragenlijst in het menu. Daarna verschijnt je resultaat.' },
  ],
  'teams-leadership': [
    { question: 'Hoe worden teams samengesteld?', answer: 'Teamleiders en beheerders kunnen leden aan teams toevoegen op basis van bedieningsprofielen en behoeften.' },
    { question: 'Wat is de rol van een teamleider?', answer: 'Een teamleider beheert het team, nodigt leden uit en ziet de verdeling van gaven binnen het team.' },
    { question: 'Kan ik in meerdere teams zitten?', answer: 'Ja, afhankelijk van hoe je kerk of organisatie teams inricht.' },
    { question: 'Hoe zie ik het teamprofiel?', answer: 'Op het teamoverzicht zie je de samenstelling en bedieningsverdeling van elk team.' },
  ],
  'account-data': [
    { question: 'Wie heeft toegang tot mijn gegevens?', answer: 'Je gegevens zijn zichtbaar voor beheerders en teamleiders binnen je kerk of organisatie, conform het privacybeleid.' },
    { question: 'Welke gegevens worden opgeslagen?', answer: 'Alleen gegevens die nodig zijn voor je account, vragenlijst en resultaten worden opgeslagen en verwerkt binnen het platform.' },
    { question: 'Kan ik mijn account verwijderen?', answer: 'Neem contact op met je beheerder of support als je je account wilt laten verwijderen.' },
  ],
  'access-accounts': [
    { question: 'Hoe maak ik een account aan?', answer: 'Je kunt een account aanmaken via de registratiepagina of via een uitnodiging van je kerk, teamleider of organisatie.' },
    { question: 'Hoe wijzig ik mijn wachtwoord?', answer: 'Ga naar je accountinstellingen of gebruik de link "Wachtwoord vergeten" op de inlogpagina.' },
    { question: 'Wat als ik niet kan inloggen?', answer: 'Controleer je e-mailadres en wachtwoord en neem contact op met support of je beheerder als het probleem blijft bestaan.' },
  ],
  'payment-license': [
    { question: 'Wat kost het platform?', answer: 'De kosten zijn afhankelijk van het abonnement van je kerk of organisatie. Individuele leden betalen doorgaans niet zelf.' },
    { question: 'Hoe verleng ik een licentie?', answer: 'Licentieverlenging verloopt via de beheerder of het abonnement van je organisatie.' },
  ],
  'contact-support': [
    { question: 'Hoe neem ik contact op?', answer: 'Via de contact- of ondersteuningspagina of via je teamleider of beheerder.' },
    { question: 'Waar vind ik hulp?', answer: 'Bij Veelgestelde vragen (FAQ), in je dashboard en via je kerkelijke beheerder.' },
  ],
  'disclaimer': [
    { question: 'Is mijn uitslag een definitieve geestelijke beoordeling?', answer: 'Nee. Het profiel is een hulpmiddel voor reflectie en gesprek, maar vervangt geen geestelijke begeleiding, bevestiging of pastoraal onderscheidingsvermogen.' },
    { question: 'Mag ik mijn score direct als ambt of bediening claimen?', answer: 'Nee. Resultaten zijn bedoeld als richtinggevend inzicht en horen altijd in samenhang met karakter, vrucht en bevestiging door de gemeente gelezen te worden.' },
  ],
  'background-frameworks': [
    { question: 'Waarop is de vragenlijst gebaseerd?', answer: 'De vragenlijst is ontwikkeld vanuit het vijfvoudige bedieningsmodel en is bedoeld om herkenbare patronen in aanleg en bediening zichtbaar te maken.' },
    { question: 'Wat wordt bedoeld met ontwikkelkaders?', answer: 'Dat zijn de inhoudelijke en praktische uitgangspunten die gebruikt zijn om vragen, profielen en interpretaties op een consistente manier vorm te geven.' },
  ],
  'selection-criteria': [
    { question: 'Hoe zijn de selectiecriteria bepaald?', answer: 'De criteria zijn samengesteld op basis van kenmerken die passen bij de verschillende bedieningsrollen en die in de praktijk herkenbaar en toetsbaar zijn.' },
    { question: 'Wat zijn beoordelingsprincipes?', answer: 'Dat zijn de uitgangspunten waarmee antwoorden worden gelezen en gewogen, zodat de uitkomst een gebalanceerd profiel geeft in plaats van een losse momentopname.' },
  ],
};

/** FAQ items for subcategories (shown on /dashboard/faqs/[categoryId]/[subCategoryId]) */
export const FAQ_ITEMS_BY_SUBCATEGORY: Record<string, Record<string, FAQItemEntry[]>> = {
  'general-use': {
    'church-members': [
      { question: 'Wat is het Bedieningenprofiel en hoe helpt het mij?', answer: 'Het Bedieningenprofiel is een platform dat je met een korte test inzicht geeft in je bediening. Je ontvangt een persoonlijk rapport en het kerkteam ziet de verdeling van gaven.' },
      { question: 'Wat staat er in mijn persoonlijke rapport?', answer: 'Je persoonlijke rapport bevat gedetailleerde inzichten over je bedieningsprofiel: je sterke punten, groeigebieden en aanbevelingen op basis van de resultaten.' },
      { question: 'Waar zie ik later mijn resultaten?', answer: 'Je vindt je resultaten in het onderdeel Resultaat op je dashboard na het invullen van de vragenlijst.' },
      { question: 'Kan ik later aan een team worden gekoppeld?', answer: 'Ja, teamleiders en beheerders kunnen je na je assessment aan teams toevoegen.' },
      { question: 'Kost het geld als individu?', answer: 'Nee, individuele leden betalen niet voor de test. De kerk of organisatie draagt de abonnementskosten.' },
      { question: 'Wat is het voordeel ten opzichte van een eenmalige test?', answer: 'Het platform biedt doorlopende inzichten, teamanalyses en groeivolging vergeleken met een eenmalige test.' },
      { question: 'Waar kan ik hulp vinden?', answer: 'Je vindt hulp bij Veelgestelde vragen, via de support of door contact op te nemen met je teamleider.' },
    ],
    'team-leaders': [
      { question: 'Hoe nodig ik leden uit voor de vragenlijst?', answer: 'Via het dashboard kun je een uitnodigingslink genereren of leden per e-mail uitnodigen. Leden ontvangen dan een link om in te loggen en de vragenlijst in te vullen.' },
      { question: 'Hoe voeg ik leden aan een team toe?', answer: 'Ga naar het teamoverzicht, kies een team en gebruik de optie om leden toe te voegen. Je kunt beschikbare leden selecteren op basis van hun profiel.' },
      { question: 'Wat zie ik op het teamdashboard?', answer: 'Je ziet de samenstelling van je team(s), de verdeling van bedieningen en inzichten voor groei en balans.' },
    ],
    'church-leaders': [
      { question: 'Hoe beheer ik accounts en rechten?', answer: 'Als beheerder kun je in de instellingen gebruikers en rollen beheren, en bepalen wie toegang heeft tot welke onderdelen.' },
      { question: 'Hoe zie ik de resultaten van de kerk?', answer: 'Op het kerkdashboard zie je aggregaties van scores, verdeling van bedieningen en groei van leden.' },
    ],
    'reasons-background': [
      { question: 'Waarom het Bedieningenprofiel?', answer: 'Het platform helpt kerken en organisaties om gaven en bedieningen zichtbaar te maken, teams te versterken en persoonlijke groei te ondersteunen.' },
      { question: 'Op welk model is de test gebaseerd?', answer: 'De test is gebaseerd op het vijfvoudige bedieningsmodel (Efeziërs 4): apostel, profeet, evangelist, herder en leraar.' },
    ],
  },
};

export function getCategoryTitle(categoryId: string): string {
  return FAQ_CATEGORIES.find((c) => c.id === categoryId)?.title ?? categoryId;
}

export function getSubCategoryTitle(categoryId: string, subCategoryId: string): string {
  const subs = FAQ_SUB_CATEGORIES[categoryId];
  return subs?.find((s) => s.id === subCategoryId)?.title ?? subCategoryId;
}

/** Get FAQ items for a category (items page) or for a subcategory (subcategory page). */
export function getFAQItems(categoryId: string, subCategoryId?: string): FAQItemEntry[] {
  if (subCategoryId) {
    return FAQ_ITEMS_BY_SUBCATEGORY[categoryId]?.[subCategoryId] ?? [];
  }
  return FAQ_ITEMS_BY_CATEGORY[categoryId] ?? [];
}
