# Data Folder Structure

This folder contains all data arrays, constants, and type definitions used throughout the application.

## Structure

```
src/data/
├── types.ts                    # TypeScript interfaces for all form data
├── onboarding/
│   ├── churchSetupData.ts      # Church setup wizard data (options, constants)
│   └── index.ts                # Exports for onboarding data
├── auth/
│   ├── registrationData.ts     # Registration form data (sector options)
│   └── index.ts                # Exports for auth data
└── index.ts                    # Main export file - exports everything
```

## Usage

Import data and types from the main data folder:

```typescript
import {
  ChurchFormData,
  RegistrationFormData,
  denominationOptions,
  sectorOptions,
  TOTAL_STEPS,
} from '@/data';
```

## Benefits

- **Centralized Data**: All data arrays in one place
- **Type Safety**: Shared TypeScript interfaces
- **Easy Maintenance**: Update data in one location
- **Clean Components**: Components focus on logic, not data
- **Reusability**: Data can be shared across components

