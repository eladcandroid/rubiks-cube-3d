import { useCubeStore } from "../../state/cubeStore";
import { useLanguage } from "../../contexts/LanguageContext";

// Convert move notation from letters to symbols
function convertMovesToSymbols(moves: string): string {
  return moves
    .replace(/U'/g, '↑\'')
    .replace(/U2/g, '↑2') 
    .replace(/U/g, '↑')
    .replace(/D'/g, '↓\'')
    .replace(/D2/g, '↓2')
    .replace(/D/g, '↓')
    .replace(/L'/g, '←\'')
    .replace(/L2/g, '←2')
    .replace(/L/g, '←')
    .replace(/R'/g, '→\'')
    .replace(/R2/g, '→2')
    .replace(/R/g, '→')
    .replace(/F'/g, '●\'')
    .replace(/F2/g, '●2')
    .replace(/F/g, '●')
    .replace(/B'/g, '○\'')
    .replace(/B2/g, '○2')
    .replace(/B/g, '○');
}

export function SolvingSteps() {
  const { t, language } = useLanguage();
  const solvingSteps = useCubeStore((s) => s.solvingSteps);
  const currentStep = useCubeStore((s) => s.currentSolvingStep);
  const isSolving = useCubeStore((s) => s.isSolving);
  
  if (!isSolving && solvingSteps.length === 0) {
    return null;
  }
  
  const isRTL = language === 'he';
  
  return (
    <div style={{ 
      marginTop: 12, 
      padding: 12, 
      backgroundColor: '#1a1a1a',
      borderRadius: 8,
      border: '1px solid #333',
      direction: isRTL ? 'rtl' : 'ltr',
      color: '#fff'
    }}>
      <h3 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '16px',
        textAlign: isRTL ? 'right' : 'left'
      }}>
        {isSolving ? '🧠 ' : '✅ '}
        {isSolving ? 
          (isRTL ? 'לומד טכניקות פתרון...' : 'Learning solving techniques...') : 
          (isRTL ? 'מפגש לימוד הושלם!' : 'Learning session completed!')
        }
      </h3>
      
      <div style={{ 
        maxHeight: '200px', 
        overflowY: 'auto',
        fontSize: '14px'
      }}>
        {solvingSteps.map((step, index) => (
          <div
            key={index}
            style={{
              marginBottom: 8,
              padding: 8,
              backgroundColor: index === currentStep ? '#1e3a5f' : 
                              index < currentStep ? '#2d4a2d' : '#2a2a2a',
              borderRadius: 6,
              border: index === currentStep ? '2px solid #4fc3f7' :
                      index < currentStep ? '1px solid #66bb6a' : '1px solid #555',
              opacity: index > currentStep ? 0.6 : 1,
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: 4,
              textAlign: isRTL ? 'right' : 'left'
            }}>
              {index === currentStep && '▶️ '}
              {index < currentStep && '✅ '}
              {t(step.stepKey)}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#ccc',
              marginBottom: 4,
              textAlign: isRTL ? 'right' : 'left'
            }}>
              {t(step.descKey)}
            </div>
            <div style={{ 
              fontSize: '12px',
              fontFamily: 'monospace',
              backgroundColor: '#333',
              padding: 4,
              borderRadius: 3,
              color: '#fff',
              textAlign: isRTL ? 'right' : 'left'
            }}>
              <strong>{t('solve.moves')}</strong> {step.moves ? convertMovesToSymbols(step.moves) : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}