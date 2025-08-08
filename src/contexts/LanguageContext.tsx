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
    'controls.autoSolve': '🧠 Learn Techniques',
    'controls.reset': 'Reset',
    'controls.run': 'Run',
    'controls.inputPlaceholder': 'Enter sequence e.g., R U R\' U\'',
    'controls.keyboardTip': 'Tip: Keyboard shortcuts: U D L R F B, with Shift for prime, 2 for double. Buttons show: ↑ ↓ ← → ● ○',
    
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
    'moves.F': '●',
    'moves.F_prime': '●\'',
    'moves.F2': '●2',
    'moves.B': '○',
    'moves.B_prime': '○\'',
    'moves.B2': '○2',
    
    // Solving steps
    'solve.starting': '🎯 Learning solving techniques...',
    'solve.step1': '🟦 Step 1: Making White Cross',
    'solve.step1.desc': 'Moving white edge pieces to form a cross on top',
    'solve.step2': '🔲 Step 2: Completing White Corners',
    'solve.step2.desc': 'Placing white corner pieces to finish the first layer',
    'solve.step3': '🟨 Step 3: Completing Middle Layer',
    'solve.step3.desc': 'Positioning edge pieces in the middle layer',
    'solve.step4': '🟡 Step 4: Making Yellow Cross',
    'solve.step4.desc': 'Creating a cross pattern on the yellow face',
    'solve.step5': '✨ Step 5: Orienting Yellow Corners',
    'solve.step5.desc': 'Making all yellow stickers face up',
    'solve.step6': '🔄 Step 6: Positioning Yellow Corners',
    'solve.step6.desc': 'Moving yellow corners to correct positions',
    'solve.step7': '🎉 Step 7: Final Edge Positioning',
    'solve.step7.desc': 'Placing the last edge pieces correctly',
    'solve.completed': '🎉 Learning session completed!',
    'solve.moves': 'Moves:',
  },
  he: {
    // App title
    'app.title': 'קוביה הונגרית',
    
    // Controls
    'controls.newScramble': 'ערבול חדש',
    'controls.runScramble': 'הפעל ערבול',
    'controls.autoSolve': '🧠 לימוד טכניקות',
    'controls.reset': 'איפוס',
    'controls.run': 'הפעל',
    'controls.inputPlaceholder': 'הכנס רצף למשל, ימ ע ימ\' ע\'',
    'controls.keyboardTip': 'עצה: קיצורי מקלדת: U D L R F B, עם Shift לסיבוב הפוך, 2 לסיבוב כפול. כפתורים מציגים: ↑ ↓ ← → ● ○',
    
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
    'moves.F': '●', // קדמי (Front)
    'moves.F_prime': '●\'',
    'moves.F2': '●2',
    'moves.B': '○', // אחורי (Back)
    'moves.B_prime': '○\'',
    'moves.B2': '○2',
    
    // Solving steps
    'solve.starting': '🎯 לומד טכניקות פתרון...',
    'solve.step1': '🟦 שלב 1: יצירת צלב לבן',
    'solve.step1.desc': 'הזזת חלקי קצה לבנים ליצירת צלב בחלק העליון',
    'solve.step2': '🔲 שלב 2: השלמת פינות לבנות',
    'solve.step2.desc': 'הצבת חלקי פינה לבנים להשלמת השכבה הראשונה',
    'solve.step3': '🟨 שלב 3: השלמת השכבה האמצעית',
    'solve.step3.desc': 'מיקום חלקי קצה בשכבה האמצעית',
    'solve.step4': '🟡 שלב 4: יצירת צלב צהוב',
    'solve.step4.desc': 'יצירת תבנית צלב על הפנים הצהובות',
    'solve.step5': '✨ שלב 5: יישור פינות צהובות',
    'solve.step5.desc': 'הפיכת כל המדבקות הצהובות כלפי מעלה',
    'solve.step6': '🔄 שלב 6: מיקום פינות צהובות',
    'solve.step6.desc': 'הזזת פינות צהובות למקומות הנכונים',
    'solve.step7': '🎉 שלב 7: מיקום קצוות אחרונים',
    'solve.step7.desc': 'הצבת חלקי הקצה האחרונים במקום הנכון',
    'solve.completed': '🎉 מפגש לימוד הושלם!',
    'solve.moves': 'מהלכים:',
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