import { SelectOption } from '@/components/ui/forms';

// Registration Form Sector Options (where you work / where you'd like to work)
export const registrationSectorOptions: SelectOption[] = [
  { value: 'education', label: 'Opleiding' },
  { value: 'healthcare', label: 'Zorg' },
  { value: 'technology', label: 'Technologie' },
  { value: 'finance', label: 'Financieel' },
  { value: 'non-profit', label: 'Non-profit' },
  { value: 'art-entertainment', label: 'Kunst en entertainment' },
  { value: 'ministry', label: 'Bediening' },
  { value: 'business', label: 'Bedrijf' },
  { value: 'government', label: 'Overheid' },
  { value: 'other', label: 'Anders' },
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

