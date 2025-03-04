// types/next-intl.d.ts

import { AllTranslations } from './translations'; // Path to your translations

declare module 'next-intl' {
    // The updated `useTranslations` type definition that supports interpolation
    export function useTranslations<K extends keyof AllTranslations>(
        namespace: K
    ): <T extends keyof AllTranslations[K]>(
        key: T,
        values?: Record<string, string | number>
    ) => string
}
