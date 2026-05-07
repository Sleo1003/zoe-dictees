import { useRef } from 'react';
import { CONFETTI } from '../data/content';
export function Confetti({ show }: { show: boolean }) {
  const ref = useRef<any[]>([]);
  if (ref.current.length === 0) {
    ref.current = Array.from({ length: 36 }).map((_, i) => ({
      id: i, left: Math.random() * 100, color: CONFETTI[Math.floor(Math.random() * CONFETTI.length)],
      delay: Math.random() * 0.4, duration: 0.9 + Math.random() * 0.7, size: 9 + Math.random() * 9, shape: Math.random() > 0.5 ? '50%' : '3px'
    }));
  }
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {ref.current.map(p => (
        <div key={p.id} style={{ position: 'absolute', left: `${p.left}%`, top: -20, width: p.size, height: p.size, background: p.color, borderRadius: p.shape, animation: `confetti ${p.duration}s ${p.delay}s ease-in forwards` }} />
      ))}
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)', fontSize: 80, animation: 'pop 0.6s ease-out' }}>🌟</div>
    </div>
  );
}
