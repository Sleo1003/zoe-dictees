import { useState, useEffect } from 'react';
import { speak } from '../utils/speech';
import type { QCMItem } from '../types';
type Props = { data: QCMItem; onDone: (ok: boolean, w: string) => void };
export function GameQCM({ data, onDone }: Props) {
  const [selected, setSelected] = useState<string|null>(null);
  const [result, setResult] = useState<boolean|null>(null);
  useEffect(() => { speak(data.s.replace("___", data.a), 0.55); }, [data]);
  const select = (opt: string) => { if (result) return; setSelected(opt); const ok = opt === data.a; setResult(ok); setTimeout(() => onDone(ok, data.a), 1600); };
  const parts = data.s.split("___");
  return (<div style={{ padding: '10px 0', textAlign: 'center' }}><p style={{ marginBottom: 20 }}>❓ Choisis le bon mot !</p><div style={{ fontSize: 18, fontWeight: 700, padding: '16px', background: '#FEF2F2', borderRadius: 14, marginBottom: 24 }}>{parts[0]}<span style={{ borderBottom: `3px solid ${result ? (selected === data.a ? '#059669' : '#DC2626') : '#C2410C'}`, padding: '0 8px', fontWeight: 900 }}>{selected || '___'}</span>{parts[1]||''}</div><div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>{data.o.map(opt => { const isSel = opt === selected; const isCorr = opt === data.a; return (<button key={opt} onClick={() => select(opt)} style={{ padding: '14px 24px', borderRadius: 14, border: `3px solid ${result && isCorr ? '#059669' : result && isSel ? '#DC2626' : '#FCA5A5'}`, background: result && isCorr ? '#ECFDF5' : result && isSel ? '#FEF2F2' : '#fff', color: result && isCorr ? '#059669' : result && isSel ? '#DC2626' : '#334155', fontWeight: 900, fontSize: 18, cursor: result ? 'default' : 'pointer' }}>{opt}</button>); })}</div>{result && data.tip && <div style={{ marginTop: 16, padding: '10px', background: '#FEF3C7', borderRadius: 10, color: '#92400E' }}>💡 {data.tip}</div>}</div>);
}
