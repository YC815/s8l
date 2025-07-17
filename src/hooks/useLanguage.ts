import { useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from '@/lib/translations';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    // 自動重新整理頁面以套用新語言設定
    window.location.reload();
  };

  const t = (key: TranslationKey) => {
    if (!mounted) return translations.zh[key]; // Fallback to Chinese during SSR
    return translations[language][key];
  };

  const tString = (key: TranslationKey): string => {
    const result = t(key);
    return typeof result === 'string' ? result : result[0] || '';
  };

  const tArray = (key: TranslationKey): readonly string[] => {
    const result = t(key);
    return Array.isArray(result) ? result : [result as string];
  };

  return {
    language,
    changeLanguage,
    t,
    tString,
    tArray,
    mounted
  };
}