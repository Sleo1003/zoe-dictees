import { useState, useEffect, useRef } from 'react';
import { speak } from '../utils/speech';
export function WarmUp({ mots, onDone }: { mots: string[]; onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => { speak(mots[0], 0.6); }, []);
  useEffect(() => {
    if (done) return;
    timer.current = window.setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        const n = idx + 1;
        if (n >= mots.length) { setDone(true); return; }
        setIdx(n); setVisible(true); speak(mots[n], 0.6);
      }, 250);
    }, 2500);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [idx, done]);
  if (done) return (
    <div style={{ fontFamily: 'system-ui', minHeight: '100vh', background: 'linear-gradient(135deg,#FEF3C7,#ECFDF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 32, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🔥</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1E293B', margin: '0 0 12px' }}>Prêt(e) !</h2>
        <p style={{ color: '#64748B', fontSize: 16, marginBottom: 24 }}>Tu connais déjà tous les mots. C'est parti pour les jeux !</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
          {mots.map(m => <span key={m} style={{ padding: '6px 12px', background: '#ECFDF5', borderRadius: 16, fontWeight: 700, color: '#059669' }}>{m}</span>)}
        </div>
        <button onClick={onDone} style={{ width: '100%', padding: 16, borderRadius: 16, background: '#4F46E5', color: '#fff', border: 'none', fontWeight: 900, fontSize: 20, cursor: 'pointer' }}>🎮 Jouer !</button>
      </div>
    </div>
  );
  const pct = Math.round(((idx + 1) / mots.length) * 100);
  return (
    <div style={{ fontFamily: 'system-ui', minHeight: '100vh', background: 'linear-gradient(135deg,#FEF3C7,#ECFDF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 32, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, marginBottom: 24 }}>
          <div style={{ height: '100%', background: '#388E3C', borderRadius: 4, width: `${pct}%`, transition: 'width 0.3s' }} />
        </div>
        <p style={{ color: '#64748B', fontWeight: 700, marginBottom: 20, fontSize: 16 }}>👂 Écoute et regarde !</p>
        <div style={{ minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#1E293B', padding: '16px 32px', background: '#F1F5F9', borderRadius: 20, border: '3px solid #CBD5E1' }}>{mots[idx]}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          <button onClick={() => speak(mots[idx], 0.5)} style={{ flex: 1, padding: 14, borderRadius: 14, border: '2px dashed #94A3B8', background: 'transparent', color: '#4F46E5', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>🔊 Réécouter</button>
          <button onClick={() => setVisible(false)} style={{ flex: 2, padding: 14, borderRadius: 14, background: '#4F46E5', color: '#fff', border: 'none', fontWeight: 900, fontSize: 18, cursor: 'pointer' }}>{idx < mots.length - 1 ? 'Suivant →' : 'Voir la fin'}</button>
        </div>
      </div>
    </div>
  );
}
