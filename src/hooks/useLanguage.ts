import { useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from '@/lib/translations';
import { detectBestLanguage, getCachedGeoLanguage, setCachedGeoLanguage } from '@/lib/geoDetection';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const initializeLanguage = async () => {
      try {
        // 優先級 1: 檢查 localStorage 中儲存的語言偏好
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en' || savedLanguage === 'ja')) {
          console.log('使用已儲存的語言偏好:', savedLanguage);
          setLanguage(savedLanguage);
          return;
        }

        // 優先級 2: 檢查地理位置緩存
        const cachedGeoLanguage = getCachedGeoLanguage();
        if (cachedGeoLanguage) {
          console.log('使用緩存的地理位置語言:', cachedGeoLanguage);
          setLanguage(cachedGeoLanguage);
          return;
        }

        // 優先級 3: 進行地理位置檢測
        setIsDetecting(true);
        console.log('開始地理位置語言檢測...');
        
        const detectedLanguage = await detectBestLanguage();
        console.log('檢測到的最佳語言:', detectedLanguage);
        
        // 緩存檢測結果
        setCachedGeoLanguage(detectedLanguage);
        setLanguage(detectedLanguage);
        
      } catch (error) {
        console.error('語言檢測失敗:', error);
        // 回退到預設中文
        setLanguage('zh');
      } finally {
        setIsDetecting(false);
      }
    };

    initializeLanguage();
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
    mounted,
    isDetecting
  };
}