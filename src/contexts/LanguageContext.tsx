import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App title
    'app.title': 'Rubik\'s Cube',
    
    // Controls
    'controls.newScramble': 'New Scramble',
    'controls.runScramble': 'Run Scramble',
    'controls.reset': 'Reset',
    'controls.run': 'Run',
    'controls.inputPlaceholder': 'Enter sequence e.g., R U R\' U\'',
    'controls.keyboardTip': 'Tip: Keyboard shortcuts: U D L R F B, with Shift for prime, 2 for double.',
    
    // Footer
    'footer.builtWith': 'Built with React, Three.js, Zustand and @react-three/fiber. Smooth rotations, full animations, keyboard and buttons.',
    
    // Language switch
    'language.switch': 'עברית',
    
    // Move notation (English uses standard notation)
    'moves.U': 'U',
    'moves.U_prime': 'U\'',
    'moves.U2': 'U2',
    'moves.D': 'D',
    'moves.D_prime': 'D\'',
    'moves.D2': 'D2',
    'moves.L': 'L',
    'moves.L_prime': 'L\'',
    'moves.L2': 'L2',
    'moves.R': 'R',
    'moves.R_prime': 'R\'',
    'moves.R2': 'R2',
    'moves.F': 'F',
    'moves.F_prime': 'F\'',
    'moves.F2': 'F2',
    'moves.B': 'B',
    'moves.B_prime': 'B\'',
    'moves.B2': 'B2',
  },
  he: {
    // App title
    'app.title': 'קוביה הונגרית',
    
    // Controls
    'controls.newScramble': 'ערבול חדש',
    'controls.runScramble': 'הפעל ערבול',
    'controls.reset': 'איפוס',
    'controls.run': 'הפעל',
    'controls.inputPlaceholder': 'הכנס רצף למשל, ימ ע ימ\' ע\'',
    'controls.keyboardTip': 'עצה: קיצורי מקלדת: ע ת ש ימ ק א, עם Shift לסיבוב הפוך, 2 לסיבוב כפול.',
    
    // Footer
    'footer.builtWith': 'בנוי עם React, Three.js, Zustand ו-@react-three/fiber. סיבובים חלקים, אנימציות מלאות, מקלדת וכפתורים.',
    
    // Language switch
    'language.switch': 'English',
    
    // Move notation (Hebrew letters)
    'moves.U': 'ע', // עליון (Upper)
    'moves.U_prime': 'ע\'',
    'moves.U2': 'ע2',
    'moves.D': 'ת', // תחתון (Down)
    'moves.D_prime': 'ת\'',
    'moves.D2': 'ת2',
    'moves.L': 'ש', // שמאל (Left)
    'moves.L_prime': 'ש\'',
    'moves.L2': 'ש2',
    'moves.R': 'ימ', // ימין (Right)
    'moves.R_prime': 'ימ\'',
    'moves.R2': 'ימ2',
    'moves.F': 'ק', // קדמי (Front)
    'moves.F_prime': 'ק\'',
    'moves.F2': 'ק2',
    'moves.B': 'א', // אחורי (Back)
    'moves.B_prime': 'א\'',
    'moves.B2': 'א2',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('he'); // Default to Hebrew

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}