import { useCubeStore } from "../../state/cubeStore";
import { useLanguage } from "../../contexts/LanguageContext";

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
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      border: '1px solid #e9ecef',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      <h3 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '16px',
        textAlign: isRTL ? 'right' : 'left'
      }}>
        {isSolving ? '🧠 ' : '✅ '}
        {isSolving ? 
          (isRTL ? 'פותר את הקוביה...' : 'Solving the cube...') : 
          (isRTL ? 'פתרון הושלם!' : 'Solving completed!')
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
              backgroundColor: index === currentStep ? '#e3f2fd' : 
                              index < currentStep ? '#f1f8e9' : '#ffffff',
              borderRadius: 6,
              border: index === currentStep ? '2px solid #2196f3' :
                      index < currentStep ? '1px solid #4caf50' : '1px solid #ddd',
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
              color: '#666',
              marginBottom: 4,
              textAlign: isRTL ? 'right' : 'left'
            }}>
              {t(step.descKey)}
            </div>
            <div style={{ 
              fontSize: '12px',
              fontFamily: 'monospace',
              backgroundColor: '#f5f5f5',
              padding: 4,
              borderRadius: 3,
              color: '#333',
              textAlign: isRTL ? 'right' : 'left'
            }}>
              <strong>{t('solve.moves')}</strong> {step.moves}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}