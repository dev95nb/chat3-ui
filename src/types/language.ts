export enum LanguageCode {
    VIETNAMESE = 'vi',
    ENGLISH = 'en',
    JAPANESE = 'ja',
    KOREAN = 'ko',
    CHINESE = 'zh',
    GERMAN = 'de',
  }
  
  export interface Language {
    code: LanguageCode;
    name: string;
    flag: string; // SVG image URL
  }
  
  export const LANGUAGE_CONFIG: Record<LanguageCode, Language> = {
    [LanguageCode.VIETNAMESE]: {
      code: LanguageCode.VIETNAMESE,
      name: 'Tiếng Việt',
      flag: '/flags/vi.svg',
    },
    [LanguageCode.ENGLISH]: {
      code: LanguageCode.ENGLISH,
      name: 'English',
      flag: '/flags/en.svg',
    },
    [LanguageCode.JAPANESE]: {
      code: LanguageCode.JAPANESE,
      name: '日本語',
      flag: '/flags/ja.svg',
    },
    [LanguageCode.KOREAN]: {
      code: LanguageCode.KOREAN,
      name: '한국어',
      flag: '/flags/ko.svg',
    },
    [LanguageCode.CHINESE]: {
      code: LanguageCode.CHINESE,
      name: '中文',
      flag: '/flags/zh.svg',
    },
    [LanguageCode.GERMAN]: {
      code: LanguageCode.GERMAN,
      name: 'Deutsch',
      flag: '/flags/de.svg',
    },
  };
  
  export const LANGUAGES = Object.values(LANGUAGE_CONFIG); 