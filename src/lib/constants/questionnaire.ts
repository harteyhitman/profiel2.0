/**
 * Questionnaire and role constants aligned with Five-Fold Ministry setup.
 * ROLES, labels, colors; QUESTIONS (40 items) – same IDs and role mapping as backend.
 */

// Five-Fold Ministry role keys (lowercase; API and scoring use these)
export const ROLES = [
  'apostle',
  'prophet',
  'evangelist',
  'herder',
  'teacher',
] as const;

export type RoleKey = (typeof ROLES)[number];

/** Role keys as object for compatibility */
export const ROLES_MAP = {
  APOSTLE: 'apostle',
  PROPHET: 'prophet',
  EVANGELIST: 'evangelist',
  HERDER: 'herder',
  TEACHER: 'teacher',
} as const;

export const ROLE_LABELS: Record<RoleKey, string> = {
  apostle: 'Apostel',
  prophet: 'Profeet',
  evangelist: 'Evangelist',
  herder: 'Herder',
  teacher: 'Leraar',
};

export const ROLE_DESCRIPTIONS: Record<RoleKey, string> = {
  apostle:
    'Je bent een pionier en visionair. Je ziet het grote plaatje en bent gericht op het bouwen en uitbreiden van Gods Koninkrijk. Je legt graag nieuwe fundamenten en houdt van uitdaging en verandering.',
  prophet:
    'Je hebt een sterk vermogen om Gods stem te horen en zijn waarheid te spreken. Je bent vaak gericht op het zien van wat verkeerd gaat en hoe het verbeterd kan worden.',
  evangelist:
    'Je hebt een passie om het goede nieuws te delen met anderen. Je bent enthousiast over het bereiken van mensen met de boodschap van redding en genade.',
  herder:
    'Je hebt een groot hart voor mensen en zorgt graag voor anderen. Je bent gericht op relaties, emotionele gezondheid en het creëren van een veilige omgeving.',
  teacher:
    'Je hebt een natuurlijke aanleg voor het begrijpen en uitleggen van complexe concepten. Je geniet ervan om waarheid te ontdekken en te delen met anderen.',
};

/** Single source of truth for role colors (bar chart + Kernbediening cards). */
export const ROLE_COLORS: Record<RoleKey, string> = {
  apostle: '#3b82f6',   // Blue
  prophet: '#10b981',  // Green
  evangelist: '#ec4899', // Pink
  herder: '#f59e0b',   // Orange
  teacher: '#8b5cf6',  // Purple
};

/**
 * National average scores for comparison.
 * Based on aggregated data from the platform.
 */
export const NATIONAL_AVERAGE_SCORES: Record<RoleKey, number> = {
  apostle: 120,
  prophet: 125,
  evangelist: 130,
  herder: 140,
  teacher: 135,
};

/** Bullet points for recommendation page: strengths per role. */
export const RECOMMENDATION_STRENGTHS: Record<RoleKey, string[]> = {
  apostle: ['Visionair en ondernemend', 'Bouwt en breidt uit', 'Legt nieuwe fundamenten', 'Houdt van uitdaging en verandering'],
  prophet: ['Hoort Gods stem', 'Spreekt waarheid', 'Ziet wat verbeterd kan worden', 'Scherp onderscheidingsvermogen'],
  evangelist: ['Passie voor het goede nieuws', 'Bereikt mensen met de boodschap', 'Enthousiast en overtuigend', 'Focus op redding en genade'],
  herder: ['Groot hart voor mensen', 'Zorgt voor anderen', 'Richt op relaties en emotionele gezondheid', 'Creëert veilige omgeving'],
  teacher: ['Legt complexe concepten uit', 'Onderzoekt en deelt waarheid', 'Nauwkeurig en zorgvuldig', 'Helpt anderen begrijpen'],
};

/** Bullet points for recommendation page: development areas per role. */
export const RECOMMENDATION_DEVELOPMENT: Record<RoleKey, string[]> = {
  apostle: ['Geduld met bestaande structuren', 'Luisteren naar anderen voordat je bouwt', 'Rust nemen na verandering'],
  prophet: ['Timing en zachtheid in communicatie', 'Bevestiging zoeken bij anderen', 'Balans tussen waarschuwen en bemoedigen'],
  evangelist: ['Opvolging en discipelschap', 'Diepgang na de eerste ontmoeting', 'Samenwerken met herders en leraren'],
  herder: ['Grenzen stellen', 'Niet voor iedereen verantwoordelijk', 'Visie en richting naast zorg'],
  teacher: ['Praktische toepassing', 'Niet alleen kennis maar ook doen', 'Toegankelijk blijven voor niet-specialisten'],
};

export interface QuestionStatement {
  text: string;
  role: RoleKey;
}

export interface QuestionnaireQuestion {
  id: number;
  statement1: QuestionStatement;
  statement2: QuestionStatement;
}

/**
 * All 40 questions of the Five-Fold Ministry questionnaire.
 * Same IDs and role assignments as backend; value 0–6 (3 = neutral).
 */
export const QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 1,
    statement1: {
      text: 'Ik kijk graag vooruit en zie mogelijkheden die anderen nog niet zien.',
      role: 'apostle',
    },
    statement2: {
      text: 'Ik ervaar regelmatig indrukken die waardevol blijken te zijn.',
      role: 'prophet',
    },
  },
  {
    id: 2,
    statement1: {
      text: 'Ik ben gevoelig voor sfeerwisselingen en spanningen, zelfs als niemand er iets over zegt.',
      role: 'prophet',
    },
    statement2: {
      text: 'Ik ga onbevangen nieuwe gesprekken of situaties aan.',
      role: 'evangelist',
    },
  },
  {
    id: 3,
    statement1: {
      text: 'Ik druk me gemakkelijk en duidelijk uit in woorden om anderen te overtuigen.',
      role: 'evangelist',
    },
    statement2: {
      text: 'Ik wil de rust en harmonie te bewaren tussen mensen.',
      role: 'herder',
    },
  },
  {
    id: 4,
    statement1: {
      text: 'Ik zorg dat mensen zich gezien en verbonden voelen.',
      role: 'herder',
    },
    statement2: {
      text: 'Ik werk zorgvuldig en nauwkeurig in wat ik doe.',
      role: 'teacher',
    },
  },
  {
    id: 5,
    statement1: {
      text: 'Ik let op details die belangrijk zijn voor het geheel.',
      role: 'teacher',
    },
    statement2: {
      text: 'Ik neem van nature de leiding als richting of structuur nodig is.',
      role: 'apostle',
    },
  },
  {
    id: 6,
    statement1: {
      text: 'Ik zie vaak als eerste waar we naartoe kunnen werken als groep of organisatie.',
      role: 'apostle',
    },
    statement2: {
      text: 'Ik denk vaak in termen van mensen bereiken of winnen.',
      role: 'evangelist',
    },
  },
  {
    id: 7,
    statement1: {
      text: 'Ik ervaar in dagelijkse dingen vaak een diepere symbolische laag.',
      role: 'prophet',
    },
    statement2: {
      text: 'Mensen voelen zich veilig om hun verhaal met mij te delen.',
      role: 'herder',
    },
  },
  {
    id: 8,
    statement1: {
      text: 'Ik zoek bewust naar nieuwe ervaringen en culturen.',
      role: 'evangelist',
    },
    statement2: {
      text: 'Ik heb voorkeur voor regels en richtlijnen, omdat die prettig werken.',
      role: 'teacher',
    },
  },
  {
    id: 9,
    statement1: {
      text: 'Ik reageer evenwichtig, omdat ik me kan inleven in wat anderen nodig hebben.',
      role: 'herder',
    },
    statement2: {
      text: 'Ik maak plannen die gericht zijn op de lange termijn.',
      role: 'apostle',
    },
  },
  {
    id: 10,
    statement1: {
      text: 'Ik orden informatie zodat het logisch en overzichtelijk wordt.',
      role: 'teacher',
    },
    statement2: {
      text: 'Ik ben bereid ongemak te verdragen om boodschappen van God door te geven.',
      role: 'prophet',
    },
  },
  {
    id: 11,
    statement1: {
      text: 'Ik geef anderen richting om gezamenlijke doelen te bereiken.',
      role: 'apostle',
    },
    statement2: {
      text: 'Ik voel me verantwoordelijk voor hoe het met anderen gaat.',
      role: 'herder',
    },
  },
  {
    id: 12,
    statement1: {
      text: 'Ik wacht bewust op het juiste moment om iets belangrijks te zeggen.',
      role: 'prophet',
    },
    statement2: {
      text: 'Ik verdiep me graag in goed geschreven of inhoudelijk sterke teksten.',
      role: 'teacher',
    },
  },
  {
    id: 13,
    statement1: {
      text: 'Ik vind het leuk om nieuwe mensen te leren kennen om het juiste tegen hen te zeggen.',
      role: 'evangelist',
    },
    statement2: {
      text: 'Ik breng graag structuur aan waar het chaotisch is.',
      role: 'apostle',
    },
  },
  {
    id: 14,
    statement1: {
      text: 'Ik geef mijn volledige aandacht als iemand iets met me deelt.',
      role: 'herder',
    },
    statement2: {
      text: 'Ik spreek uit wat ik diep van binnen als waar en essentieel ervaar.',
      role: 'prophet',
    },
  },
  {
    id: 15,
    statement1: {
      text: 'Ik bereid me grondig voor voordat ik iets uitvoer.',
      role: 'teacher',
    },
    statement2: {
      text: 'Ik stap gemakkelijk uit mijn comfortzone op onbekende plekken.',
      role: 'evangelist',
    },
  },
  {
    id: 16,
    statement1: {
      text: 'Ik hak knopen door, ook als niet alle informatie beschikbaar is.',
      role: 'apostle',
    },
    statement2: {
      text: 'Ik neem de tijd om iets goed af te maken.',
      role: 'teacher',
    },
  },
  {
    id: 17,
    statement1: {
      text: 'Ik kies voor waarheid, ook als dat ten koste gaat van tijdelijke harmonie.',
      role: 'prophet',
    },
    statement2: {
      text: 'Ik ben geneigd om nieuwe dingen op te starten.',
      role: 'apostle',
    },
  },
  {
    id: 18,
    statement1: {
      text: 'Ik wil mensen inspireren in het maken van belangrijke besluiten, waar ze later geen spijt van krijgen.',
      role: 'evangelist',
    },
    statement2: {
      text: 'Ik blijf trouw aan wat ik zie of ervaar, ook als het niet gewaardeerd wordt.',
      role: 'prophet',
    },
  },
  {
    id: 19,
    statement1: {
      text: 'Ik bied graag hulp als iemand ergens mee zit.',
      role: 'herder',
    },
    statement2: {
      text: 'Ik geef niet snel op, omdat de eeuwigheid van mensen mij aan het hart gaat.',
      role: 'evangelist',
    },
  },
  {
    id: 20,
    statement1: {
      text: 'Ik wil voortdurend nieuwe kennis en inzichten opdoen.',
      role: 'teacher',
    },
    statement2: {
      text: 'Ik ben betrokken bij het welzijn van mensen in mijn omgeving.',
      role: 'herder',
    },
  },
  {
    id: 21,
    statement1: {
      text: 'Ik zie snel waar dingen anders of beter kunnen en wil daar iets mee doen.',
      role: 'apostle',
    },
    statement2: {
      text: 'Ik geef inhoud vaak vorm met een uitbeeldende manier van spreken of schrijven.',
      role: 'prophet',
    },
  },
  {
    id: 22,
    statement1: {
      text: 'Ik krijg geregeld ingevingen die ik niet vooraf heb bedacht, maar wel opvolg.',
      role: 'prophet',
    },
    statement2: {
      text: 'Ik voel me vrij om verbinding te maken, ongeacht cultuur of achtergrond.',
      role: 'evangelist',
    },
  },
  {
    id: 23,
    statement1: {
      text: 'Ik beweeg me gemakkelijk tussen mensen van verschillende achtergronden.',
      role: 'evangelist',
    },
    statement2: {
      text: 'Ik ben gericht op innerlijk herstel van mensen.',
      role: 'herder',
    },
  },
  {
    id: 24,
    statement1: {
      text: 'Ik stel me open op zodat mensen zich welkom voelen.',
      role: 'herder',
    },
    statement2: {
      text: 'Ik splits grote vraagstukken op in logische onderdelen.',
      role: 'teacher',
    },
  },
  {
    id: 25,
    statement1: {
      text: 'Ik neem de tijd om na te denken over wat ik leer of ervaar.',
      role: 'teacher',
    },
    statement2: {
      text: 'Ik bedenk originele oplossingen als iets vastloopt.',
      role: 'apostle',
    },
  },
  {
    id: 26,
    statement1: {
      text: 'Ik moedig anderen aan om in beweging te komen en stappen te zetten.',
      role: 'apostle',
    },
    statement2: {
      text: 'Ik geloof dat mensen tot geloof kunnen komen, zelfs als het moeilijk lijkt.',
      role: 'evangelist',
    },
  },
  {
    id: 27,
    statement1: {
      text: 'Ik zie vaak potentie of roeping in mensen voordat zij dat zelf doorhebben.',
      role: 'prophet',
    },
    statement2: {
      text: 'Ik stem mijn gedrag aan op de emoties die ik bij anderen zie.',
      role: 'herder',
    },
  },
  {
    id: 28,
    statement1: {
      text: 'Ik leef met het besef dat ieders leven een diepere waarde heeft.',
      role: 'evangelist',
    },
    statement2: {
      text: 'Ik geef graag uitleg, zodat de ander het begrijpt.',
      role: 'teacher',
    },
  },
  {
    id: 29,
    statement1: {
      text: 'Ik blijf betrokken bij mensen, ook als het moeilijk of ingewikkeld wordt.',
      role: 'herder',
    },
    statement2: {
      text: 'Ik ga moeilijke situaties niet uit de weg en blijf volharden.',
      role: 'apostle',
    },
  },
  {
    id: 30,
    statement1: {
      text: 'Ik ben gedisciplineerd en consequent in wat ik doe.',
      role: 'teacher',
    },
    statement2: {
      text: 'Ik weet dingen die ik lastig kan uitleggen, maar die vaak blijken te kloppen.',
      role: 'prophet',
    },
  },
  {
    id: 31,
    statement1: {
      text: 'Ik zoek de uitdaging op en laat me niet snel afschrikken.',
      role: 'apostle',
    },
    statement2: {
      text: 'Ik draag bij aan verbondenheid door verschillen te overbruggen.',
      role: 'herder',
    },
  },
  {
    id: 32,
    statement1: {
      text: 'Ik geef vaak betekenis aan situaties vanuit een dieper perspectief.',
      role: 'prophet',
    },
    statement2: {
      text: 'Door mijn overdenkende aard, reageer weloverwogen en rustig.',
      role: 'teacher',
    },
  },
  {
    id: 33,
    statement1: {
      text: 'Ik breng vaak energie en enthousiasme in wat ik doe om mensen op het juiste pad te brengen.',
      role: 'evangelist',
    },
    statement2: {
      text: 'Ik werk doelgericht en ga voor concrete resultaten.',
      role: 'apostle',
    },
  },
  {
    id: 34,
    statement1: {
      text: 'Ik zoek actief manieren om mensen dichter bij elkaar te brengen.',
      role: 'herder',
    },
    statement2: {
      text: 'Ik zie verbanden tussen gebeurtenissen die anderen vaak niet zien.',
      role: 'prophet',
    },
  },
  {
    id: 35,
    statement1: {
      text: 'Ik zie snel kleine fouten of onregelmatigheden die anderen missen.',
      role: 'teacher',
    },
    statement2: {
      text: 'Ik wil anderen graag overtuigen van wat ik weet dat waardevol is.',
      role: 'evangelist',
    },
  },
  {
    id: 36,
    statement1: {
      text: 'Onder hoge druk blijf ik helder denken en goed functioneren.',
      role: 'apostle',
    },
    statement2: {
      text: 'Ik geef graag duidelijkheid door dingen systematisch te presenteren.',
      role: 'teacher',
    },
  },
  {
    id: 37,
    statement1: {
      text: 'Ik voel snel aan wat de unieke plek of kracht van iemand is.',
      role: 'prophet',
    },
    statement2: {
      text: 'Ik vind het vanzelfsprekend om beslissingen te nemen als niemand dat doet.',
      role: 'apostle',
    },
  },
  {
    id: 38,
    statement1: {
      text: 'Ik voel me vrijmoedig om mijn overtuigingen te delen.',
      role: 'evangelist',
    },
    statement2: {
      text: 'Ik laat me leiden door inspiratie die plotseling en van binnenuit komt.',
      role: 'prophet',
    },
  },
  {
    id: 39,
    statement1: {
      text: 'Ik ben iemand bij wie anderen zich snel op hun gemak voelen.',
      role: 'herder',
    },
    statement2: {
      text: 'Ik voel me vrijmoedig om mijn overtuigingen te delen.',
      role: 'evangelist',
    },
  },
  {
    id: 40,
    statement1: {
      text: 'Ik voel me prettig bij heldere regels en structuren.',
      role: 'teacher',
    },
    statement2: {
      text: 'Ik wil dat anderen zich gedragen en gesteund voelen.',
      role: 'herder',
    },
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

/**
 * Normalize role string for API/backend compatibility.
 * API uses lowercase keys: apostle, prophet, evangelist, herder, teacher; shepherd → herder.
 */
export function roleNormalizer(role: string): string {
  const r = role?.toLowerCase().trim();
  if (r === 'shepherd') return 'herder';
  return r ?? '';
}

/**
 * Normalize label for display (e.g. Prophet → Profeet, Teacher → Leraar).
 */
export function labelNormalizer(role: string): string {
  const map: Record<string, string> = {
    Prophet: 'Profeet',
    Teacher: 'Leraar',
    Apostle: 'Apostel',
    Evangelist: 'Evangelist',
    Herder: 'Herder',
  };
  return map[role] ?? role;
}
