import { SelectOption } from '@/components/ui/forms';

// Church Setup Constants
export const TOTAL_STEPS = 5;

// Country Options
export const countryOptions: SelectOption[] = [
  { value: 'netherlands', label: 'Nederland' },
  { value: 'usa', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'canada', label: 'Canada' },
  { value: 'germany', label: 'Germany' },
  { value: 'france', label: 'France' },
  { value: 'spain', label: 'Spain' },
  { value: 'italy', label: 'Italy' },
  { value: 'australia', label: 'Australia' },
  { value: 'brazil', label: 'Brazil' },
];

// Church Denomination Options
export const denominationOptions: SelectOption[] = [
  { value: 'reformed', label: 'Gereformeerd' },
  { value: 'baptist', label: 'Baptist' },
  { value: 'methodist', label: 'Methodist' },
  { value: 'presbyterian', label: 'Presbyteriaans' },
  { value: 'catholic', label: 'Katholiek' },
  { value: 'anglican', label: 'Anglicaans' },
  { value: 'lutheran', label: 'Luthers' },
  { value: 'pentecostal', label: 'Pinkster' },
  { value: 'non-denominational', label: 'Niet-kerkelijk' },
  { value: 'other', label: 'Anders' },
];

// Sector Options
export const sectorOptions: SelectOption[] = [
  { value: 'education', label: 'Opleiding' },
  { value: 'healthcare', label: 'Zorg' },
  { value: 'non-profit', label: 'Non-profit' },
  { value: 'community', label: 'Gemeenschap' },
  { value: 'youth', label: 'Jeugd' },
  { value: 'elderly', label: 'Ouderenzorg' },
  { value: 'missions', label: 'Missie' },
  { value: 'other', label: 'Anders' },
];

// How Did You Know Us Options
export const hearAboutOptions: SelectOption[] = [
  { value: 'friend', label: 'Vriend' },
  { value: 'social-media', label: 'Sociale Media' },
  { value: 'website', label: 'Website' },
  { value: 'advertisement', label: 'Advertentie' },
  { value: 'conference', label: 'Conferentie' },
  { value: 'newsletter', label: 'Nieuwsbrief' },
  { value: 'search-engine', label: 'Zoekmachine' },
  { value: 'other', label: 'Anders' },
];

