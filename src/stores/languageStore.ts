import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, LANGUAGES } from '@/types/language';

export type { Language } from '@/types/language';
export { LANGUAGES } from '@/types/language';

interface LanguageState {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: LANGUAGES[0], // Default to Vietnamese
      setSelectedLanguage: (language: Language) => set({ selectedLanguage: language }),
    }),
    {
      name: 'language-storage', // localStorage key
    }
  )
); 