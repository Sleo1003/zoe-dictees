import { useState, useEffect } from 'react';
import { norm } from '../utils/helpers';
import { speak } from '../utils/speech';
import { LetterDiff } from './LetterDiff';
type Props = { word: string; onDone: (ok: boolean, w: string) => void };
export function GameMirror({ word, onDone }: Props) {
  const [phase, setPhase] = useState<'show'|'type'>('show');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<boolean|null>(null);
  const [attempts, setAttempts] = useState(0);
  useEffect(() => { speak(word, 0.55); const t = setTimeout(() => setPhase('type'), 2200); return () => clearTimeout(t); }, [word]);
  const check = () => { if (!input.trim()) return; const ok = norm(input) === norm(word); const na = attempts + 1; setAttempts(na); setResult(ok); if (ok) setTimeout(() => onDone(true, word), 1400); else if (na >= 2) setTimeout(() => onDone(false, word), 2200); };
  if (phase === 'show') return (<div style={{ textAlign: 'center', padding: '40px 16px' }}><p style={{ color: '#64748B', fontWeight: 700, marginBottom: 20 }}>👀 Regarde bien ce mot !</p><div style={{ fontSize: 56, fontWeight: 900, color: '#4F46E5', marginBottom: 16 }}>{word}</div></div>);
  return (<div style={{ padding: '10px 0' }}>{result === null && (<><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && input.trim() && check()} autoFocus placeholder="Tape le mot…" style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #94A3B8', fontSize: 26, textAlign: 'center', marginBottom: 12 }} /><button onClick={() => speak(word, 0.45)} style={{ marginRight: 8 }}>🔊</button><button onClick={check} disabled={!input.trim()}>✅ Vérifier</button></>)}{result === true && <div style={{ textAlign: 'center', fontSize: 32 }}>🎉 Bravo !</div>}{result === false && attempts < 2 && (<><LetterDiff expected={word} typed={input} /><button onClick={() => { setInput(''); setResult(null); speak(word, 0.55); }}>🔄 Réessayer</button></>)}</div>);
}
