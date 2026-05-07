import { norm } from '../utils/helpers';
export function LetterDiff({ expected, typed }: { expected: string; typed: string }) {
  const exp = expected.split(""), typ = typed.split("");
  const max = Math.max(exp.length, typ.length);
  return (
    <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
      {Array.from({ length: max }).map((_, i) => {
        const ok = exp[i] && typ[i] ? norm(exp[i]) === norm(typ[i]) : false;
        return (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ok ? '#ECFDF5' : '#FEF2F2', border: `2px solid ${ok ? '#86EFAC' : '#FCA5A5'}`, fontSize: 20, fontWeight: 900, color: ok ? '#059669' : '#DC2626' }}>{typ[i] || '_'}</div>
            <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{exp[i] || ''}</div>
          </div>
        );
      })}
    </div>
  );
}
