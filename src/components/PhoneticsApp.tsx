import { useState, useEffect } from 'react';
import { PHONETICS } from '../data/content';

interface PhoneticsAppProps {
  onBack: () => void;
}

export default function PhoneticsApp({ onBack }: PhoneticsAppProps) {
  const [activeSound, setActiveSound] = useState<any>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR';
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#F8FAFC' }}>
      <button onClick={onBack} style={{ marginBottom: 24, padding: '8px 16px', borderRadius: 12, background: '#E2E8F0', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
        ← Retour Français
      </button>

      <h2 style={{ textAlign: 'center', color: '#334155', marginBottom: 24 }}>🗣️ Sons et Lettres</h2>
      
      {/* Grille des sons */}
      {!activeSound && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 400, margin: '0 auto' }}>
          {PHONETICS.map((p, i) => (
            <button
              key={i}
              onClick={() => setActiveSound(p)}
              style={{
                height: 100, borderRadius: 16, background: p.color, border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <span style={{ fontSize: 40, fontWeight: 900, color: '#fff', textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>{p.letter}</span>
              <span style={{ fontSize: 24 }}>{p.emoji}</span>
            </button>
          ))}
        </div>
      )}

      {/* Vue Détail du Son */}
      {activeSound && (
        <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 120, fontWeight: 900, color: activeSound.color, lineHeight: 1, margin: '20px 0' }}>
            {activeSound.letter}
          </div>
          <div style={{ fontSize: 80, marginBottom: 20 }}>{activeSound.emoji}</div>
          <h3 style={{ fontSize: 24, color: '#334155' }}>{activeSound.word}</h3>
          
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
            <button
              onClick={() => speak(activeSound.sound)}
              style={{ padding: '12px 24px', borderRadius: 16, background: '#4F46E5', color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer' }}
            >
              🔊 Écouter le son
            </button>
            <button
              onClick={() => setActiveSound(null)}
              style={{ padding: '12px 24px', borderRadius: 16, background: '#64748B', color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer' }}
            >
              Autres sons
            </button>
          </div>
        </div>
      )}
    </div>
  );
}