import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { translations, Language, TranslationKey } from '@/lib/translations';
import { detectBestLanguage, getCachedGeoLanguage, setCachedGeoLanguage } from '@/lib/geoDetection';

export function useLanguage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  
  // 從 URL 查詢參數獲取語言（客戶端）
  const getLanguageFromUrl = (): Language | null => {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam === 'zh' || langParam === 'en' || langParam === 'ja') {
      return langParam as Language;
    }
    return null;
  };

  useEffect(() => {
    setMounted(true);
    
    const initializeLanguage = async () => {
      try {
        // 優先級 1: 檢查 URL 查詢參數中的語言設定
        let urlLanguage: Language | null = null;
        try {
          urlLanguage = getLanguageFromUrl();
        } catch {
          // 如果無法獲取 searchParams，繼續其他檢測方式
        }
        
        if (urlLanguage) {
          console.log('使用 URL 參數語言:', urlLanguage);
          setLanguage(urlLanguage);
          // 同時更新 localStorage 以保持一致性
          localStorage.setItem('language', urlLanguage);
          return;
        }

        // 優先級 2: 檢查 localStorage 中儲存的語言偏好
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en' || savedLanguage === 'ja')) {
          console.log('使用已儲存的語言偏好:', savedLanguage);
          setLanguage(savedLanguage);
          return;
        }

        // 優先級 3: 檢查地理位置緩存
        const cachedGeoLanguage = getCachedGeoLanguage();
        if (cachedGeoLanguage) {
          console.log('使用緩存的地理位置語言:', cachedGeoLanguage);
          setLanguage(cachedGeoLanguage);
          return;
        }

        // 優先級 4: 進行地理位置檢測
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
    
    if (typeof window !== 'undefined') {
      // 更新 URL 查詢參數
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLanguage);
      
      // 導航到新的 URL（帶有語言參數）
      router.push(url.pathname + url.search);
    }
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