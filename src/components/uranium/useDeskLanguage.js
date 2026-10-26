import { useState } from 'react';

export default function useDeskLanguage() {
  const [language, setLanguageState] = useState(() => localStorage.getItem('eve-metal-desk-language') === 'zh' ? 'zh' : 'en');
  const setLanguage = (value) => {
    localStorage.setItem('eve-metal-desk-language', value);
    setLanguageState(value);
  };
  return [language, setLanguage];
}