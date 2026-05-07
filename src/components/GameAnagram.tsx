import { useState, useEffect } from 'react';
import { norm, shuffle } from '../utils/helpers';
import { speak } from '../utils/speech';
type Letter = { l: string; id: number; used: boolean };
type Props = { word: string; onDone: (ok: boolean, w: string) => void };
export function GameAnagram({ word, onDone }: Props) {
  const makePool = (w: string): Letter[] => shuffle(w.split("")).map((l, i) => ({ l, id: i, used: false }));
  const [pool, setPool] = useState<Letter[]>(() => makePool(word));
  const [selected, setSelected] = useState<Letter[]>([]);
  const [result, setResult] = useState<boolean|null>(null);
  const [attempts, setAttempts] = useState(0);
  useEffect(() => { speak(word, 0.55); }, [word]);
  const pick = (item: Letter) => { if (item.used || result) return; setPool(p => p.map(x => x.id === item.id ? { ...x, used: true } : x)); setSelected(s => [...s, item]); };
  const remove = (idx: number) => { const item = selected[idx]; setPool(p => p.map(x => x.id === item.id ? { ...x, used: false } : x)); setSelected(s => s.filter((_, i) => i !== idx)); };
  const check = () => { const built = selected.map(x => x.l).join(""); const ok = norm(built) === norm(word); const na = attempts + 1; setAttempts(na); setResult(ok); if (ok) setTimeout(() => onDone(true, word), 1400); else if (na >= 3) setTimeout(() => onDone(false, word), 2000); else { setSelected([]); setResult(null); setPool(makePool(word)); } };
  return (<div style={{ padding: '10px 0', textAlign: 'center' }}><p style={{ marginBottom: 12 }}>🔤 Remets les lettres dans l'ordre !</p><div style={{ minHeight: 50, display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>{selected.map((item, i) => (<button key={i} onClick={() => remove(i)} style={{ width: 40, height: 40, borderRadius: 8, background: '#7C3AED', color: '#fff', border: 'none', fontSize: 18 }}>{item.l}</button>))}</div><div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>{pool.map(item => (<button key={item.id} onClick={() => pick(item)} disabled={item.used} style={{ width: 44, height: 44, borderRadius: 10, fontSize: 20, background: item.used ? '#E2E8F0' : '#F1F5F9', border: `2px solid ${item.used ? '#CBD5E1' : '#A5B4FC'}`, cursor: item.used ? 'default' : 'pointer' }}>{item.used ? '' : item.l}</button>))}</div>{result === true && <div style={{ fontSize: 32, marginTop: 12 }}>🎉 Bravo !</div>}{result === false && <div style={{ color: '#DC2626', marginTop: 8 }}>Presque !</div>}{result === null && <button onClick={check} disabled={selected.length !== word.length} style={{ marginTop: 12, padding: '10px 24px', background: selected.length === word.length ? '#7C3AED' : '#E2E8F0', color: '#fff', border: 'none', borderRadius: 10 }}>✅ Vérifier</button>}</div>);
}
