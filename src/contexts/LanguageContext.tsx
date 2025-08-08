import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

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
    'controls.keyboardTip': 'Tip: Keyboard shortcuts: U D L R F B, with Shift for prime, 2 for double. Buttons show: ↑ ↓ ← → 1 6',
    
    // Footer
    'footer.builtWith': 'Built with React, Three.js, Zustand and @react-three/fiber. Smooth rotations, full animations, keyboard and buttons.',
    
    // Language switch
    'language.switch': 'עברית',
    
    // Move notation (arrows and numbers)
    'moves.U': '↑',
    'moves.U_prime': '↑\'',
    'moves.U2': '↑2',
    'moves.D': '↓',
    'moves.D_prime': '↓\'',
    'moves.D2': '↓2',
    'moves.L': '←',
    'moves.L_prime': '←\'',
    'moves.L2': '←2',
    'moves.R': '→',
    'moves.R_prime': '→\'',
    'moves.R2': '→2',
    'moves.F': '1',
    'moves.F_prime': '1\'',
    'moves.F2': '12',
    'moves.B': '6',
    'moves.B_prime': '6\'',
    'moves.B2': '62',
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
    'controls.keyboardTip': 'עצה: קיצורי מקלדת: U D L R F B, עם Shift לסיבוב הפוך, 2 לסיבוב כפול. כפתורים מציגים: ↑ ↓ ← → 1 6',
    
    // Footer
    'footer.builtWith': 'בנוי עם React, Three.js, Zustand ו-@react-three/fiber. סיבובים חלקים, אנימציות מלאות, מקלדת וכפתורים.',
    
    // Language switch
    'language.switch': 'English',
    
    // Move notation (arrows and numbers - same as English)
    'moves.U': '↑', // עליון (Upper)
    'moves.U_prime': '↑\'',
    'moves.U2': '↑2',
    'moves.D': '↓', // תחתון (Down)
    'moves.D_prime': '↓\'',
    'moves.D2': '↓2',
    'moves.L': '←', // שמאל (Left)
    'moves.L_prime': '←\'',
    'moves.L2': '←2',
    'moves.R': '→', // ימין (Right)
    'moves.R_prime': '→\'',
    'moves.R2': '→2',
    'moves.F': '1', // קדמי (Front)
    'moves.F_prime': '1\'',
    'moves.F2': '12',
    'moves.B': '6', // אחורי (Back)
    'moves.B_prime': '6\'',
    'moves.B2': '62',
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