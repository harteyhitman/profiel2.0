import { SelectOption } from '@/components/ui/forms';

// Registration Form Sector Options (where you work / where you'd like to work)
// Used for "Waar ben je werkzaam in de maatschappij?" and "Waar zou je werkzaam willen zijn in de maatschappij?"
export const registrationSectorOptions: SelectOption[] = [
  { value: 'Business', label: 'Business' },
  { value: 'Overheid', label: 'Overheid' },
  { value: 'Kunst & entertainment', label: 'Kunst & entertainment' },
  { value: 'Onderwijs', label: 'Onderwijs' },
  { value: 'Familie & zorg', label: 'Familie & zorg' },
  { value: 'Religie', label: 'Religie' },
  { value: 'Media', label: 'Media' },
];

// How did you find us? (referral source)
export const referralSourceOptions: SelectOption[] = [
  { value: 'search', label: 'Zoekmachine' },
  { value: 'social', label: 'Sociale media' },
  { value: 'friend', label: 'Via vriend of kennis' },
  { value: 'church', label: 'Via kerk of gemeente' },
  { value: 'event', label: 'Evenement of conferentie' },
  { value: 'other', label: 'Anders' },
];

// Birth date: months (1–12)
const MONTH_NAMES = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
export const birthMonthOptions: SelectOption[] = [
  { value: '', label: 'Maand' },
  ...MONTH_NAMES.map((label, i) => ({ value: String(i + 1), label })),
];

// Birth date: years (current year down to 1920)
const currentYear = new Date().getFullYear();
export const birthYearOptions: SelectOption[] = [
  { value: '', label: 'Jaar' },
  ...Array.from({ length: currentYear - 1919 }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  }),
];

// Birth date: days 1–31
export const birthDayOptions: SelectOption[] = [
  { value: '', label: 'Dag' },
  ...Array.from({ length: 31 }, (_, i) => {
    const d = i + 1;
    return { value: String(d), label: String(d) };
  }),
];

