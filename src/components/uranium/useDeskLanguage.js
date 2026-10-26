import { useLanguage } from '@/components/common/LanguageProvider';

export default function useDeskLanguage() {
  const { language, setLanguage } = useLanguage();
  return [language === 'zh' ? 'zh' : 'en', setLanguage];
}