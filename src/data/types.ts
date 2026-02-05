import { SelectOption } from '@/components/ui/forms';

// Form Data Types
export interface ChurchFormData {
  churchName: string;
  churchDenomination: string;
  sector: string;
  address: string;
  howDidYouKnow: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  sector: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface NewPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

// Export SelectOption type for convenience
export type { SelectOption };

