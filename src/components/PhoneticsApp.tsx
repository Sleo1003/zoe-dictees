import { useState, useEffect } from 'react';

interface PhoneticsAppProps { onBack: () => void; }

const SOUNDS = {
  fr: [{ id: 'on', label: 'Son ON', words: ['lion', 'maison', 'bonbon'], tip: 'L\'air passe par le nez ' },
       { id: 'ch', label: 'Son CH', words: ['chat', 'chocolat', 'marche'], tip: 'Comme un chuchotement 🤫' }],
  en: [{ id: 'th', label: 'TH sound', words: ['think', 'three', 'bath'], tip: 'Tongue between teeth 👅' },
       { id: 'sh', label: 'SH sound', words: ['ship', 'fish', 'she'], tip: 'Quiet like the sea 🌊' }]
};

export default function PhoneticsApp({ onBack }: PhoneticsAppProps) {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [selected, setSelected] = useState<any>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const playSound = (word: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(word);
      u.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
      u.rate = 0.8;
      speechSynthesis.speak(u);
    }
  };

  if (!selected) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1528', padding: 24, color: '#ece6f8' }}>
        <button onClick={onBack} style={{ marginBottom: 16, background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer' }}>← Retour</button>
        <h2 style={{ marginBottom: 16 }}>🔊 Atelier des Sons</h2>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, justifyContent: 'center' }}>
          <button onClick={() => setLang('fr')} style={{ padding: '8px 16px', borderRadius: 8, background: lang === 'fr' ? '#d4a0c8' : '#252036', border: 'none', color: '#fff', cursor: 'pointer' }}>🇫🇷 Français</button>
          <button onClick={() => setLang('en')} style={{ padding: '8px 16px', borderRadius: 8, background: lang === 'en' ? '#7ec8c0' : '#252036', border: 'none', color: '#fff', cursor: 'pointer' }}>🇬🇧 English</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, maxWidth: 400, margin: '0 auto' }}>
          {SOUNDS[lang].map((s: any) => (
            <button key={s.id} onClick={() => setSelected(s)} style={{ padding: 16, borderRadius: 12, background: '#252036', border: '1px solid #444', color: '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontWeight: 800 }}>{s.label}</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{s.words.join(' • ')}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1528', padding: 24, color: '#ece6f8', textAlign: 'center' }}>
      <button onClick={() => { setSelected(null); setAcknowledged(false); }} style={{ marginBottom: 16, background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer' }}>← Choisir un son</button>
      <h2 style={{ marginBottom: 8 }}>{selected.label}</h2>
      <p style={{ color: '#a0a0b8', marginBottom: 24, fontStyle: 'italic' }}>💡 {selected.tip}</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
        {selected.words.map((w: string, i: number) => (
          <button key={i} onClick={() => playSound(w)} style={{ padding: '12px 20px', borderRadius: 12, background: '#252036', border: '1px solid #555', color: '#fff', cursor: 'pointer', fontSize: 18 }}>
            🔊 {w}
          </button>
        ))}
      </div>

      <div style={{ background: '#2a2540', borderRadius: 16, padding: 20, maxWidth: 400, margin: '0 auto' }}>
        <p style={{ marginBottom: 16, lineHeight: 1.5 }}>
          Écoute bien la bouche et l'air. {lang === 'fr' ? 'As-tu compris comment faire ce son ?' : 'Did you notice the mouth position?'}
        </p>
        {!acknowledged ? (
          <button onClick={() => setAcknowledged(true)} style={{ padding: '12px 24px', borderRadius: 12, background: '#a78bfa', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
            ✅ J\'ai compris le pattern
          </button>
        ) : (
          <button onClick={() => { setSelected(null); setAcknowledged(false); }} style={{ padding: '12px 24px', borderRadius: 12, background: '#4ade80', border: 'none', color: '#000', fontWeight: 800, cursor: 'pointer' }}>
            🌟 Bravo ! Suivant →
          </button>
        )}
      </div>
    </div>
  );
}