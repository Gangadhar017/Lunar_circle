import React, { useEffect, useState } from 'react';
import { CircleNotch, CheckCircle } from '@phosphor-icons/react';

interface ProcessingTraceProps {
  scenario: string;
}

export const ProcessingTrace: React.FC<ProcessingTraceProps> = ({ scenario }) => {
  const [stage, setStage] = useState(0);

  // Generate appropriate stages based on scenario
  const getStages = () => {
    const query = scenario.toLowerCase();
    
    if (query.includes('change') || query.includes('develop') || query.includes('compar')) {
      return [
        "Validating bi-temporal image pair",
        "Checking spatial compatibility and alignment",
        "Detecting temporal differences",
        "Localizing change regions",
        "Generating change evidence",
        "Synthesizing response"
      ];
    }
    
    if (query.includes('sar') || query.includes('fusion') || query.includes('both')) {
      return [
        "Validating optical and SAR imagery",
        "Aligning multimodal observations",
        "Extracting complementary features",
        "Performing cross-modal reasoning",
        "Generating fused interpretation",
        "Synthesizing response"
      ];
    }
    
    return [
      "Validating image",
      "Understanding query intent",
      "Selecting specialist workflow",
      "Extracting visual features",
      "Generating spatial evidence",
      "Synthesizing response"
    ];
  };

  const stages = getStages();

  useEffect(() => {
    // Progress through stages roughly every 1.2s to sum up to ~7 seconds total
    const timer = setInterval(() => {
      setStage(prev => {
        if (prev < stages.length - 1) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [stages.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', padding: '0 8px' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
        Demo Processing
      </div>
      
      {stages.map((text, i) => {
        const isPast = i < stage;
        const isCurrent = i === stage;
        const isFuture = i > stage;
        
        return (
          <div key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            opacity: isFuture ? 0 : 1,
            transition: 'opacity 0.3s ease-in',
            color: isPast ? 'var(--text-disabled)' : 'var(--text-primary)',
            fontSize: '12px'
          }}>
            {isPast ? (
              <CheckCircle size={14} color="#10B981" weight="fill" />
            ) : isCurrent ? (
              <CircleNotch size={14} color="#60A5FA" className="animate-spin" />
            ) : (
              <div style={{ width: 14, height: 14 }} />
            )}
            <span>{text}</span>
          </div>
        );
      })}
    </div>
  );
};
