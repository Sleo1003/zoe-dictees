import { useState, useEffect } from 'react';

// 📚 Données de tes dictées (extraites de numbers-game.tsx)
const DICTEES = [
  { id: 1, words: ['champion', 'manger', 'papa', 'maman', 'école'], phrases: ['Le champion mange à la cantine.', 'Papa et maman vont à l\'école.'] },
  { id: 2, words: ['jardin', 'fleur', 'soleil', 'arbre', 'oiseau'], phrases: ['La fleur pousse dans le jardin.', 'L\'oiseau chante sur l\'arbre au soleil.'] },
  { id: 3, words: ['livre', 'page', 'lire', 'histoire', 'ami'], phrases: ['Je lis une histoire dans le livre.', 'Mon ami tourne la page.'] },
];

const GAMES = ['mirror', 'anagram', 'blank', 'tile', 'qcm'] as const;
type GameType = typeof GAMES[number];

interface Props { onBack: () => void; }

export default function FrenchApp({ onBack }: Props) {
  const [screen, setScreen] = useState<'menu' | 'warmup' | 'game' | 'result'>('menu');
  const [dicIdx, setDicIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds] = useState(5);
  const [mistakes, setMistakes] = useState<string[]>([]);

  const startDictée = (idx: number) => {
    setDicIdx(idx);
    setScreen('warmup');
    setScore(0);
    setRound(0);
    setMistakes([]);
  };

  const nextRound = () => {
    if (round + 1 >= totalRounds) {
      setScreen('result');
    } else {
      setRound(r => r + 1);
    }
  };

  if (screen === 'menu') {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1528', padding: 24, color: '#ece6f8' }}>
        <button onClick={onBack} style={{ marginBottom: 24, background: 'none', border: 'none', color: '#d4a0c8', cursor: 'pointer', fontSize: 16 }}>← Retour</button>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>📖 Français</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, maxWidth: 500, margin: '0 auto' }}>
          {DICTEES.map((d, i) => (
            <button key={d.id} onClick={() => startDictée(i)} style={{ padding: 20, borderRadius: 16, background: 'rgba(212,160,200,0.1)', border: '2px solid #d4a0c8', color: '#ece6f8', cursor: 'pointer', fontSize: 16, fontWeight: 'bold' }}>
              Dictée {d.id}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'warmup') {
    const dictée = DICTEES[dicIdx];
    return (
      <div style={{ minHeight: '100vh', background: '#1a1528', padding: 24, color: '#ece6f8', textAlign: 'center' }}>
        <h3>📚 Échauffement - Dictée {dictée.id}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', margin: '24px 0' }}>
          {dictée.words.map((w, i) => (
            <span key={i} style={{ padding: '8px 16px', background: 'rgba(212,160,200,0.2)', borderRadius: 12, fontSize: 18 }}>{w}</span>
          ))}
        </div>
        <button onClick={() => setScreen('game')} style={{ padding: '12px 32px', background: '#d4a0c8', border: 'none', borderRadius: 16, color: '#1a1528', fontWeight: 'bold', cursor: 'pointer', fontSize: 16 }}>Commencer ▶</button>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1528', padding: 24, color: '#ece6f8', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{score >= 4 ? '🏆' : score >= 3 ? '🌟' : '💪'}</div>
        <h2>{score >= 4 ? 'Excellent !' : score >= 3 ? 'Très bien !' : 'Continue comme ça !'}</h2>
        <p style={{ fontSize: 24, margin: '16px 0' }}>{score} / {totalRounds}</p>
        {mistakes.length > 0 && <p style={{ color: '#a0a0b8' }}>À revoir : {mistakes.join(', ')}</p>}
        <button onClick={() => setScreen('menu')} style={{ marginTop: 24, padding: '12px 32px', background: '#d4a0c8', border: 'none', borderRadius: 16, color: '#1a1528', fontWeight: 'bold', cursor: 'pointer' }}>Menu principal</button>
      </div>
    );
  }

  // Écran de jeu simplifié (placeholder pour l'instant)
  return (
    <div style={{ minHeight: '100vh', background: '#1a1528', padding: 24, color: '#ece6f8', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={() => setScreen('menu')} style={{ background: 'none', border: 'none', color: '#d4a0c8', cursor: 'pointer' }}>← Menu</button>
        <span>Round {round + 1}/{totalRounds} | ⭐ {score}</span>
      </div>
      <div style={{ padding: 32, background: 'rgba(255,255,255,0.05)', borderRadius: 24, maxWidth: 400, margin: '0 auto' }}>
        <p>Écris le mot entendu</p>
        <input type="text" style={{ padding: 12, fontSize: 20, borderRadius: 12, border: '2px solid #d4a0c8', background: '#2a2540', color: '#ece6f8', textAlign: 'center', width: '100%', marginTop: 16 }} placeholder="..." />
        <button onClick={() => { setScore(s => s + 1); nextRound(); }} style={{ marginTop: 16, padding: '10px 24px', background: '#d4a0c8', border: 'none', borderRadius: 12, color: '#1a1528', fontWeight: 'bold', cursor: 'pointer' }}>Valider</button>
      </div>
    </div>
  );
}