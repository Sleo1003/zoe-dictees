import { useState, useEffect } from 'react';
import { norm, shuffle } from '../utils/helpers';
import { speak } from '../utils/speech';
type Props = { phrase: string; mots: string[]; onDone: (ok: boolean, w: string) => void };
export function GameBlank({ phrase, mots, onDone }: Props) {
  const words = phrase.replace(/[.,!?]/g,"").split(" ").filter(w => w.length > 1);
  const target = words.filter(w => mots.some(m => norm(m) === norm(w)))[0] || words[0];
  const options = shuffle([target, ...mots.filter(m => norm(m) !== norm(target) && m.length > 1).slice(0, 2)]);
  const [selected, setSelected] = useState<string|null>(null);
  const [result, setResult] = useState<boolean|null>(null);
  useEffect(() => { speak(phrase, 0.55); }, [phrase]);
  const select = (opt: string) => { if (result) return; setSelected(opt); const ok = norm(opt) === norm(target); setResult(ok); setTimeout(() => onDone(ok, target), 1600); };
  const masked = phrase.replace(target, "____");
  const parts = masked.split("____");
  return (<div style={{ padding: '10px 0', textAlign: 'center' }}><p style={{ marginBottom: 16 }}>📝 Quel mot manque ?</p><div style={{ fontSize: 18, fontWeight: 700, padding: '14px', background: '#FEF3C7', borderRadius: 12, marginBottom: 20 }}>{parts[0]}<span style={{ borderBottom: `3px solid ${result === null ? '#F59E0B' : result ? '#059669' : '#DC2626'}`, padding: '0 8px', fontWeight: 900 }}>{selected || ''}</span>{parts[1]||''}</div><div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>{options.map(opt => { const isSel = opt === selected; const isCorr = norm(opt) === norm(target); return (<button key={opt} onClick={() => select(opt)} style={{ padding: '12px 20px', borderRadius: 12, border: `2px solid ${result && isCorr ? '#059669' : result && isSel ? '#DC2626' : '#CBD5E1'}`, background: result && isCorr ? '#ECFDF5' : result && isSel ? '#FEF2F2' : '#fff', color: result && isCorr ? '#059669' : result && isSel ? '#DC2626' : '#334155', fontWeight: 700, cursor: result ? 'default' : 'pointer' }}>{opt}</button>); })}</div></div>);
}
