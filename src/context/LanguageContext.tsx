import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'EN' | 'TA';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  hasSelectedLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('TA');
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('omk_language');
    if (saved === 'EN' || saved === 'TA') {
      setLanguageState(saved);
      setHasSelectedLanguage(true);
    }
    setIsReady(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setHasSelectedLanguage(true);
    localStorage.setItem('omk_language', lang);
  };

  if (!isReady) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, hasSelectedLanguage }}>
      {children}

      {/* Full Screen Language Selection Modal */}
      {!hasSelectedLanguage && (
        <div className="fixed inset-0 z-[9999] bg-[#8B0000] flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
            <div className="w-24 h-24 mx-auto bg-white rounded-full mb-6 border-[3px] border-[#fcc917] p-1 shadow-lg overflow-hidden">
              <img src="/omk-logo.webp" alt="OMK Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            
            <h1 className="text-2xl font-black text-[#8B0000] mb-2">Welcome to OMK</h1>
            <p className="text-gray-500 font-medium mb-8 text-sm">Please select your preferred language</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setLanguage('TA')}
                className="w-full py-4 bg-[#8B0000] hover:bg-[#a30000] text-white rounded-xl font-black text-xl transition-all shadow-md tamil"
              >
                தமிழ்
              </button>
              <button 
                onClick={() => setLanguage('EN')}
                className="w-full py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 rounded-xl font-black text-lg transition-all"
              >
                English
              </button>
            </div>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
