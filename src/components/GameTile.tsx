import { useState, useEffect } from 'react';
import { norm, shuffle } from '../utils/helpers';
import { speak } from '../utils/speech';
type Word = { w: string; id: number; used: boolean };
type Props = { phrase: string; onDone: (ok: boolean, w: string) => void };
export function GameTile({ phrase, onDone }: Props) {
  const clean = phrase.replace(/[.!?]$/, "");
  const words = clean.split(" ");
  const fresh = () => shuffle(words.map((w, i) => ({ w, id: i, used: false })));
  const [pool, setPool] = useState<Word[]>(fresh);
  const [built, setBuilt] = useState<Word[]>([]);
  const [result, setResult] = useState<boolean|null>(null);
  const [attempts, setAttempts] = useState(0);
  useEffect(() => { speak(phrase, 0.55); }, [phrase]);
  const pick = (item: Word) => { if (item.used || result) return; setPool(p => p.map(x => x.id === item.id ? { ...x, used: true } : x)); setBuilt(b => [...b, item]); };
  const remove = (idx: number) => { const item = built[idx]; setPool(p => p.map(x => x.id === item.id ? { ...x, used: false } : x)); setBuilt(b => b.filter((_, i) => i !== idx)); };
  const check = () => { const builtStr = built.map(x => x.w).join(" "); const ok = norm(builtStr) === norm(clean); const na = attempts + 1; setAttempts(na); setResult(ok); if (ok) setTimeout(() => onDone(true, "phrase"), 1400); else if (na >= 2) setTimeout(() => onDone(false, "phrase"), 2000); else { setBuilt([]); setResult(null); setPool(fresh()); } };
  return (<div style={{ padding: '10px 0', textAlign: 'center' }}><p style={{ marginBottom: 16 }}>🧩 Remets les mots dans l'ordre !</p><div style={{ minHeight: 45, padding: 10, background: '#ECFDF5', borderRadius: 12, marginBottom: 16, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>{built.map((item, i) => (<button key={i} onClick={() => remove(i)} style={{ padding: '6px 12px', borderRadius: 8, background: '#059669', color: '#fff', border: 'none', fontWeight: 700 }}>{item.w}</button>))}</div><div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>{pool.map(item => (<button key={item.id} onClick={() => pick(item)} disabled={item.used} style={{ padding: '8px 14px', borderRadius: 10, background: item.used ? '#E2E8F0' : '#F1F5F9', border: `2px solid ${item.used ? '#CBD5E1' : '#86EFAC'}`, cursor: item.used ? 'default' : 'pointer' }}>{item.used ? '' : item.w}</button>))}</div>{result === true && <div style={{ fontSize: 28, marginTop: 12 }}>🎉 Parfait !</div>}{result === false && <div style={{ color: '#DC2626', marginTop: 8 }}>{attempts >= 2 ? `La phrase : ${phrase}` : 'Presque !'}</div>}{result === null && <button onClick={check} disabled={built.length !== words.length} style={{ marginTop: 12, padding: '10px 24px', background: built.length === words.length ? '#059669' : '#E2E8F0', color: '#fff', border: 'none', borderRadius: 10 }}>✅ Vérifier</button>}</div>);
}
