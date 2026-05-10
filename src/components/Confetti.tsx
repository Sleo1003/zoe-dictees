// src/components/Confetti.tsx
import { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
}

// Configuration autonome (plus d'import manquant)
const CONFETTI_CONFIG = {
  colors: ['#4F46E5', '#7C3AED', '#059669', '#F59E0B', '#DC2626'],
  count: 80,
  duration: 1.5,
};

export const Confetti = ({ show }: ConfettiProps) => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!show) { setParticles([]); return; }
    
    const newParticles = Array.from({ length: CONFETTI_CONFIG.count }, (_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const duration = CONFETTI_CONFIG.duration + Math.random() * 1;
      const color = CONFETTI_CONFIG.colors[i % CONFETTI_CONFIG.colors.length];
      
      return (
        <div
          key={i}
          style={{
            position: 'fixed',
            left: `${left}%`,
            top: '-10px',
            width: '8px',
            height: '8px',
            backgroundColor: color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${duration}s ease-in ${delay}s forwards`,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      );
    });
    setParticles(newParticles);
  }, [show]);

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {particles}
    </>
  );
};