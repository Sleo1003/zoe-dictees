// src/components/PhoneticsApp.tsx - Version finale propre
import { useState } from 'react';
import { playAudio } from '../utils/speech';

const SOUNDS = [
  { grapheme: 'ch', fr: 'chat', en: 'chain', frCue: 'Lèvres arrondies, son doux "chhh"', enCue: 'Son court et explosif' },
  { grapheme: 's', fr: 'soleil', en: 'sun', frCue: 'Dents rapprochées, air sifflant', enCue: 'Même position, air plus net' },
  { grapheme: 'n', fr: 'nuage', en: 'moon', frCue: 'Langue derrière les dents, air nasal', enCue: 'Vibration nasale claire' },
  { grapheme: 'g', fr: 'girafe', en: 'giant', frCue: 'Gorge bloque l\'air, puis relâche', enCue: 'Son dur au début' },
  { grapheme: 'ou', fr: 'loup', en: 'sound', frCue: 'Lèvres en petit rond, langue reculée', enCue: 'Voyelle longue et ronde' },
  { grapheme: 'on', fr: 'bon', en: 'mom', frCue: 'Bouche ronde, voile du palais ouvert', enCue: 'Son court + "m" final' },
  { grapheme: 'om', fr: 'ombre', en: 'bomb', frCue: 'Lèvres rondes, air nasal, pas de "m"', enCue: 'Lèvres se collent pour le "m"' },
  { grapheme: 'an', fr: 'enfant', en: 'hand', frCue: 'Bouche ouverte, langue plate, résonance nasale', enCue: 'Son bref, mâchoire basse' },
];

export default function PhoneticsApp({ onBack }: { onBack?: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<'fr' | 'en' | null>(null);
  const [status, setStatus] = useState('👇 Clique sur une carte pour écouter');
  const [showMouth, setShowMouth] = useState<'fr' | 'en' | null>(null);

  const current = SOUNDS[index];

  const navigate = (dir: 'next' | 'prev' | 'random') => {
    setSelected(null);
    setShowMouth(null);
    if (dir === 'random') setIndex(Math.floor(Math.random() * SOUNDS.length));
    else if (dir === 'next') setIndex((i) => (i + 1) % SOUNDS.length);
    else setIndex((i) => (i - 1 + SOUNDS.length) % SOUNDS.length);
    setStatus(`🎲 Nouveau son : "${SOUNDS[dir === 'random' ? Math.floor(Math.random() * SOUNDS.length) : index].grapheme}"`);
  };

  const handleListen = async (lang: 'fr' | 'en', word: string) => {
    setSelected(lang);
    setShowMouth(lang);
    setStatus(`⏳ Lecture de "${word}"...`);
    const ok = await playAudio(word, lang);
    setStatus(ok ? `✅ ${lang === 'fr' ? 'Français' : 'Anglais'} : "${word}"` : '⚠️ Audio indisponible');
  };

  return (
    <div style={{ maxWidth: 850, margin: '2rem auto', padding: '1.5rem', fontFamily: 'system-ui, sans-serif', background: '#fff', borderRadius: '20px', boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button onClick={() => navigate('prev')} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '8px', border: '1px solid #ccc', background: '#f9fafb' }}>⬅️ Précédent</button>
        <h2 style={{ margin: 0, fontSize: '1.4rem', textAlign: 'center' }}>🔊 Son : <span style={{ color: '#2563eb', fontSize: '1.8rem' }}>"{current.grapheme}"</span></h2>
        <button onClick={() => navigate('next')} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '8px', border: '1px solid #ccc', background: '#f9fafb' }}>Suivant ➡️</button>
      </div>

      <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '10px', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 500, minHeight: '28px' }}>{status}</div>

      <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => handleListen('fr', current.fr)} style={{ flex: 1, minWidth: 260, padding: '1.5rem', borderRadius: '14px', border: selected === 'fr' ? '3px solid #2563eb' : '2px solid #e2e8f0', background: selected === 'fr' ? '#eff6ff' : '#f8fafc', cursor: 'pointer' }}>
          <span style={{ fontSize: '1.8rem' }}>🇫🇷</span>
          <h3 style={{ margin: '0.5rem 0', color: '#0f172a', fontSize: '1.5rem' }}>{current.fr}</h3>
          <p style={{ fontSize: '0.9rem', color: '#475569' }}>👉 {current.frCue}</p>
        </button>
        <button onClick={() => handleListen('en', current.en)} style={{ flex: 1, minWidth: 260, padding: '1.5rem', borderRadius: '14px', border: selected === 'en' ? '3px solid #dc2626' : '2px solid #e2e8f0', background: selected === 'en' ? '#fef2f2' : '#f8fafc', cursor: 'pointer' }}>
          <span style={{ fontSize: '1.8rem' }}>🇬🇧</span>
          <h3 style={{ margin: '0.5rem 0', color: '#0f172a', fontSize: '1.5rem' }}>{current.en}</h3>
          <p style={{ fontSize: '0.9rem', color: '#475569' }}>👉 {current.enCue}</p>
        </button>
      </div>

      {showMouth && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0fdf4', borderRadius: '12px', textAlign: 'center', border: '1px solid #86efac' }}>
          <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: '#166534' }}>👄 Position de la bouche ({showMouth === 'fr' ? 'Français' : 'Anglais'})</p>
          <svg width="120" height="90" viewBox="0 0 120 90" style={{ display: 'inline-block' }}>
            <circle cx="60" cy="45" r="40" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="45" cy="35" r="4" fill="#475569" />
            <circle cx="75" cy="35" r="4" fill="#475569" />
            {showMouth === 'fr' ? (
              <ellipse cx="60" cy="55" rx="14" ry="10" fill="#1e293b"><animate attributeName="ry" values="10;14;10" dur="2s" repeatCount="indefinite" /></ellipse>
            ) : (
              <ellipse cx="60" cy="55" rx="20" ry="8" fill="#1e293b"><animate attributeName="rx" values="20;15;20" dur="1.5s" repeatCount="indefinite" /></ellipse>
            )}
          </svg>
          <p style={{ margin: '0.8rem 0 0', fontSize: '0.95rem', color: '#334155' }}>{showMouth === 'fr' ? current.frCue : current.enCue}</p>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button onClick={() => navigate('random')} style={{ padding: '0.8rem 1.5rem', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}>🎲 Autre son</button>
      </div>
    </div>
  );
}