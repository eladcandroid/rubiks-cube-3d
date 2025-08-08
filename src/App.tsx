import "./App.css";
import { RubiksCubeScene } from "./components/RubiksCube";
import { ControlsPanel } from "./components/UI/ControlsPanel";
import { KeyboardHandler } from "./components/KeyboardHandler";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";

function AppContent() {
  const { language, setLanguage, t } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };

  const isRTL = language === 'he';
  
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gridTemplateRows: "1fr",
        gap: 16,
        height: "100vh",
        padding: 12,
        boxSizing: "border-box",
        direction: isRTL ? 'rtl' : 'ltr',
        overflow: "hidden"
      }}
    >
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #222",
          position: "relative",
        }}
      >
        <RubiksCubeScene />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden", maxHeight: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>{t('app.title')}</h2>
          <button 
            onClick={toggleLanguage}
            style={{ 
              padding: "5px 10px", 
              fontSize: "12px",
              background: "#333",
              color: "white",
              border: "1px solid #555",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {t('language.switch')}
          </button>
        </div>
        <ControlsPanel />
        <KeyboardHandler />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}