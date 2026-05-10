// src/components/MathApp.tsx
import { useState } from 'react';
import { QuizGame, Hdr, PBar, Btns, ResultScreen } from './GameEngine';
import {
  C,
  GRID_NUMS, ADD_PAIRS, FOURWAYS_NUMS, TENS_NUMS,
} from '../data/content';
import { shuffle } from '../utils/helpers';

interface MathAppProps {
  onBack: () => void;
  profileId?: string;
}

type MathView =
  | 'home'
  | 'grid' | 'missing' | 'missing69' | 'order'
  | 'tens' | 'fourways' | 'addition';

const MATH_COLORS: Record<MathView, string> = {
  home:      '#475569',
  grid:      C.grid,
  missing:   C.miss,
  missing69: '#0277bd',
  order:     C.ord,
  tens:      C.tens,
  fourways:  C.four,
  addition:  C.add,
};

const MATH_TITLES: Record<MathView, string> = {
  home:      'Mathématiques',
  grid:      '🔢 Grille 1–69',
  missing:   '🔍 Manquants 1–50',
  missing69: '🔢 Compter 51–69',
  order:     '📊 Ordonner',
  tens:      '🧱 Dizaines & Unités',
  fourways:  '🔄 4 Façons',
  addition:  '➕ Addition',
};

// ═══ Helpers ══════════════════════════════════════════════════════════════════
const mkMissingQ = (start: number, end: number) => {
  const length = Math.min(5, end - start + 1);
  const s = start + Math.floor(Math.random() * (end - start - length + 1));
  const seq = Array.from({ length }, (_, i) => s + i);
  const bp = 1 + Math.floor(Math.random() * (seq.length - 2));
  const ans = seq[bp];
  const dist = [ans - 1, ans + 1].filter(x => x >= start && x <= end && !seq.includes(x)).slice(0, 2) as number[];
  return { seq, bp, a: ans, choices: shuffle([ans, ...dist]) };
};

const mkTensQ = (n: number) => {
  const tens = Math.floor(n / 10);
  const units = n % 10;
  const askTens = Math.random() > 0.5;
  const ans = askTens ? tens : units;
  const pool = askTens ? [0, 1, 2, 3, 4] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const dist = shuffle(pool.filter(x => x !== ans)).slice(0, 2);
  return {
    n,
    label: askTens ? 'dizaines' : 'unités',
    a: ans,
    choices: shuffle([ans, ...dist]),
  };
};

const mkAddQ = ([a, b]: [number, number]) => {
  const sum = a + b;
  const dist = shuffle([sum - 2, sum - 1, sum + 1, sum + 2].filter(x => x >= 0 && x <= 20)).slice(0, 2);
  return { a2: a, b2: b, a: sum, choices: shuffle([sum, ...dist]) };
};

const Stix = ({ n, col }: { n: number; col: string }) => {
  const tens = Math.floor(n / 10);
  const units = n % 10;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, flexWrap: 'wrap', justifyContent: 'center', padding: 4 }}>
      {Array.from({ length: tens }, (_, b) => (
        <div key={b} style={{ display: 'flex', gap: 2, padding: 3, border: '2px solid ' + col, borderRadius: 5 }}>
          {Array.from({ length: 10 }, (_, s) => (
            <div key={s} style={{ width: 3, height: 22, background: col, borderRadius: 2 }} />
          ))}
        </div>
      ))}
      {Array.from({ length: units }, (_, s) => (
        <div key={s} style={{ width: 3, height: 22, background: col, borderRadius: 2 }} />
      ))}
    </div>
  );
};

// ═══ Jeux spécifiques ════════════════════════════════════════════════════════
function GridScreen({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'all' | 'by2' | 'by5' | 'by10'>('all');
  const isHighlighted = (n: number) =>
    (mode === 'by2' && n % 2 === 0) ||
    (mode === 'by5' && n % 5 === 0) ||
    (mode === 'by10' && n % 10 === 0);

  return (
    <div style={{ minHeight: '100vh', background: '#e8f5e9', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '18px 14px' }}>
      <Hdr onBack={onBack} col={C.grid} title="🔢 Grille 1–69" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        {(['all', 'by2', 'by5', 'by10'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            style={{
              background: mode === m ? C.grid : 'white',
              color: mode === m ? 'white' : C.grid,
              border: '2px solid ' + C.grid,
              borderRadius: 18, padding: '7px 14px', fontSize: 13,
              cursor: 'pointer', fontWeight: 'bold',
            }}>
            {m === 'all' ? 'Tous' : m === 'by2' ? 'Par 2' : m === 'by5' ? 'Par 5' : 'Par 10'}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4, maxWidth: 460, width: '100%' }}>
        {GRID_NUMS.map(n => {
          const hl = mode !== 'all' && isHighlighted(n);
          return (
            <div key={n} style={{
              background: hl ? C.grid : 'white',
              color: hl ? 'white' : '#333',
              borderRadius: 7, padding: '7px 2px', textAlign: 'center',
              fontSize: 13, fontWeight: hl ? 'bold' : 'normal',
              border: hl ? '2px solid ' + C.grid : '2px solid #e0e0e0',
            }}>
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderScreen({ onBack, onReplay }: { onBack: () => void; onReplay: () => void }) {
  const [round, setRound] = useState(() => {
    const nums = [...new Set(Array.from({ length: 10 }, () => Math.floor(Math.random() * 69) + 1))].slice(0, 5);
    return { nums, sorted: [...nums].sort((a, b) => a - b) };
  });
  const [tapped, setTapped] = useState<number[]>([]);
  const [fb, setFb] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [rn, setRn] = useState(1);
  const [done, setDone] = useState(false);
  const ROUNDS = 5;

  const tapN = (n: number) => {
    if (fb || tapped.includes(n)) return;
    const next = [...tapped, n];
    setTapped(next);
    if (next.length === round.nums.length) {
      const ok = next.every((v, i) => v === round.sorted[i]);
      if (ok) { setFb('correct'); setScore(s => s + 1); }
      else setFb('wrong');
      const cr = rn;
      setTimeout(() => {
        if (cr < ROUNDS) {
          setRn(cr + 1);
          const newNums = [...new Set(Array.from({ length: 10 }, () => Math.floor(Math.random() * 69) + 1))].slice(0, 5);
          setRound({ nums: newNums, sorted: [...newNums].sort((a, b) => a - b) });
          setTapped([]);
          setFb(null);
        } else setDone(true);
      }, 1300);
    }
  };

  if (done) return <ResultScreen score={score} total={ROUNDS} col={C.ord} onReplay={onReplay} onMenu={onBack} />;

  const cbg = fb === 'correct' ? '#e8f5e9' : fb === 'wrong' ? '#ffebee' : 'white';

  return (
    <div style={{ minHeight: '100vh', background: '#f3e5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '18px 14px' }}>
      <Hdr onBack={onBack} col={C.ord} title="📊 Ordonner" right={`Tour ${rn} / ${ROUNDS}`} />
      <PBar pct={(rn - 1) / ROUNDS * 100} col={C.ord} />
      <div style={{ background: cbg, borderRadius: 22, padding: '24px 18px', maxWidth: 460, width: '100%', boxShadow: '0 4px 18px rgba(0,0,0,.1)', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#888', margin: '0 0 10px' }}>Du <b>plus petit</b> au <b>plus grand</b> !</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 18 }}>
          {round.nums.map((_, i) => (
            <div key={i} style={{
              width: 52, height: 52, borderRadius: 11,
              background: tapped[i] ? C.ord : 'white',
              color: tapped[i] ? 'white' : '#ccc',
              border: '3px solid ' + (tapped[i] ? C.ord : '#ddd'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 21, fontWeight: 'bold',
            }}>
              {tapped[i] || ''}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 14 }}>
          {round.nums.map(n => {
            const used = tapped.includes(n);
            return (
              <button key={n} onClick={() => tapN(n)} disabled={used || !!fb}
                style={{
                  width: 58, height: 58, background: used ? '#e0e0e0' : C.ord,
                  color: used ? '#bbb' : 'white', border: 'none', borderRadius: 13,
                  fontSize: 21, cursor: used || !!fb ? 'default' : 'pointer', fontWeight: 'bold',
                }}>
                {n}
              </button>
            );
          })}
        </div>
        {tapped.length > 0 && !fb && (
          <button onClick={() => setTapped(t => t.slice(0, -1))}
            style={{ background: 'transparent', border: '2px solid #ccc', borderRadius: 9, padding: '5px 13px', fontSize: 13, cursor: 'pointer', color: '#999' }}>
            ⌫
          </button>
        )}
        {fb && (
          <div style={{ marginTop: 14, fontSize: 18, fontWeight: 'bold', color: fb === 'correct' ? '#2e7d32' : '#c62828' }}>
            {fb === 'correct' ? '✅ Correct ! 🎉' : `❌ Ordre : ${round.sorted.join(' – ')}`}
          </div>
        )}
      </div>
      <div style={{ marginTop: 10, background: 'white', borderRadius: 13, padding: '9px 14px', maxWidth: 460, width: '100%', fontSize: 13, color: '#888', textAlign: 'center' }}>
        ⭐ Score : {score}
      </div>
    </div>
  );
}

function FourWaysScreen({ onBack }: { onBack: () => void }) {
  const [ni, setNi] = useState(0);
  const n = FOURWAYS_NUMS[ni];
  const tens = Math.floor(n / 10);
  const units = n % 10;

  const Box = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ background: 'white', borderRadius: 18, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,.08)', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: '#999', fontWeight: 'bold', letterSpacing: 1, marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fff3e0', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '18px 14px' }}>
      <Hdr onBack={onBack} col={C.four} title="🔄 4 façons d'écrire" right={`${ni + 1} / ${FOURWAYS_NUMS.length}`} />
      <div style={{ display: 'flex', gap: 5, marginBottom: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {FOURWAYS_NUMS.map((num, i) => (
          <button key={i} onClick={() => setNi(i)}
            style={{
              background: ni === i ? C.four : 'white',
              color: ni === i ? 'white' : C.four,
              border: '2px solid ' + C.four, borderRadius: 9,
              padding: '6px 10px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold',
            }}>
            {num}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 56, fontWeight: 'bold', color: C.four, marginBottom: 10 }}>{n}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 440, width: '100%' }}>
        <Box label="① CHIFFRE"><div style={{ fontSize: 44, fontWeight: 'bold', color: C.four }}>{n}</div></Box>
        <Box label="② DIZ. & UNITÉS">
          <div style={{ fontSize: 15, fontWeight: 'bold', color: C.four, lineHeight: 1.8 }}>
            {tens} dizaines<br />et {units} unités
          </div>
        </Box>
        <Box label="③ BÂTONS"><Stix n={n} col={C.four} /></Box>
        <Box label="④ FORME DÉVELOPPÉE">
          <div style={{ fontSize: 24, fontWeight: 'bold', color: C.four }}>{tens * 10} + {units}</div>
        </Box>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 14, maxWidth: 440, width: '100%' }}>
        <button onClick={() => setNi(i => Math.max(0, i - 1))} disabled={ni === 0}
          style={{
            flex: 1, background: ni === 0 ? '#e0e0e0' : C.four,
            color: ni === 0 ? '#bbb' : 'white', border: 'none', borderRadius: 14,
            padding: 12, fontSize: 15, cursor: ni === 0 ? 'default' : 'pointer', fontWeight: 'bold',
          }}>
          ← Préc.
        </button>
        <button onClick={() => setNi(i => Math.min(FOURWAYS_NUMS.length - 1, i + 1))} disabled={ni === FOURWAYS_NUMS.length - 1}
          style={{
            flex: 1, background: ni === FOURWAYS_NUMS.length - 1 ? '#e0e0e0' : C.four,
            color: ni === FOURWAYS_NUMS.length - 1 ? '#bbb' : 'white', border: 'none', borderRadius: 14,
            padding: 12, fontSize: 15, cursor: ni === FOURWAYS_NUMS.length - 1 ? 'default' : 'pointer', fontWeight: 'bold',
          }}>
          Suiv. →
        </button>
      </div>
    </div>
  );
}

// ═══ Composant principal ═════════════════════════════════════════════════════
export default function MathApp({ onBack, profileId }: MathAppProps) {
  const [view, setView] = useState<MathView>('home');
  const [pk,   setPk]   = useState(0);

  const goHome = () => setView('home');
  const replay = () => setPk(k => k + 1);

  // ═══ Manquants (1-50 & 51-69) ═══════════════════════════════════════════
  if (view === 'missing' || view === 'missing69') {
    const [start, end] = view === 'missing' ? [1, 50] : [51, 69];
    const title = view === 'missing' ? MATH_TITLES.missing : MATH_TITLES.missing69;
    const qs = Array.from({ length: 10 }, () => mkMissingQ(start, end));
    return (
      <QuizGame key={pk} qs={qs} col={MATH_COLORS[view]} bg="#e1f5fe" title={title}
        onBack={goHome} onReplay={replay}
        wl={q => 'Manquant : ' + q.a} fm={q => '❌ Réponse : ' + q.a}
        renderQ={(q, chosen, fb, pick, col) => (
          <div>
            <p style={{ fontSize: 14, color: '#888', margin: '0 0 18px' }}>Quel est le nombre manquant ?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 22 }}>
              {q.seq.map((n: number, i: number) => {
                const bl = i === q.bp;
                return (
                  <div key={i} style={{
                    width: 52, height: 52, borderRadius: 11,
                    border: '3px solid ' + col,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 19, fontWeight: 'bold',
                    background: bl ? (chosen ? col : '#fff9c4') : 'white',
                    color: bl ? (chosen ? 'white' : col) : col,
                  }}>
                    {bl ? (chosen || '?') : n}
                  </div>
                );
              })}
            </div>
            <Btns choices={q.choices.map(String)} answer={String(q.a)} chosen={chosen ? String(chosen) : null} fb={fb} onPick={(opt) => pick(Number(opt))} col={col} row />
          </div>
        )}
      />
    );
  }

  // ═══ Dizaines & Unités ═══════════════════════════════════════════════════
  if (view === 'tens') {
    const qs = shuffle(TENS_NUMS).map(mkTensQ);
    return (
      <QuizGame key={pk} qs={qs} col={C.tens} bg="#e0f7fa" title={MATH_TITLES.tens}
        onBack={goHome} onReplay={replay}
        wl={q => `${q.n} = ${Math.floor(q.n / 10)} diz. & ${q.n % 10} unités`}
        fm={q => `❌ ${q.n} = ${Math.floor(q.n / 10)} diz. et ${q.n % 10} unités`}
        renderQ={(q, chosen, fb, pick, col) => (
          <div>
            <div style={{ fontSize: 64, fontWeight: 'bold', color: col, marginBottom: 4 }}>{q.n}</div>
            <p style={{ fontSize: 17, color: '#555', marginBottom: 14 }}>Combien de <b>{q.label}</b> ?</p>
            <div style={{ marginBottom: 18 }}><Stix n={q.n} col={col} /></div>
            <Btns choices={q.choices.map(String)} answer={String(q.a)} chosen={chosen ? String(chosen) : null} fb={fb} onPick={(opt) => pick(Number(opt))} col={col} row fsz={28} />
          </div>
        )}
      />
    );
  }

  // ═══ Addition ════════════════════════════════════════════════════════════
  if (view === 'addition') {
    const qs = shuffle(ADD_PAIRS).map(mkAddQ);
    const [tip, setTip] = useState(false);

    return (
      <QuizGame key={pk} qs={qs} col={C.add} bg="#fffde7" title={MATH_TITLES.addition}
        onBack={goHome} onReplay={replay}
        wl={q => `${q.a2} + ${q.b2} = ${q.a}`}
        fm={q => `❌ Réponse : ${q.a}`}
        renderQ={(q, chosen, fb, pick, col) => {
          const big = Math.max(q.a2, q.b2), sml = Math.min(q.a2, q.b2);
          return (
            <div>
              <div style={{ fontSize: 44, fontWeight: 'bold', color: col, marginBottom: 20 }}>{q.a2} + {q.b2} = ?</div>
              <Btns choices={q.choices.map(String)} answer={String(q.a)} chosen={chosen ? String(chosen) : null} fb={fb} onPick={(opt) => pick(Number(opt))} col={col} row fsz={26} />
              <button onClick={() => setTip(t => !t)}
                style={{ marginTop: 14, background: 'transparent', border: '2px solid ' + col, color: col, borderRadius: 11, padding: '6px 13px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>
                💡 {tip ? 'Cacher' : 'Astuce'}
              </button>
              {tip && (
                <div style={{ marginTop: 9, background: '#fff8e1', borderRadius: 12, padding: 12, textAlign: 'left', fontSize: 13, color: '#555', lineHeight: 1.9 }}>
                  1. Garde <b>{big}</b> dans ta tête 🧠<br />
                  2. Compte <b>{sml}</b> sur tes doigts 🤚<br />
                  3. <b>{big}+{sml}={q.a}</b> 🎉
                </div>
              )}
            </div>
          );
        }}
      />
    );
  }

  // ═══ Jeux non-quiz ═══════════════════════════════════════════════════════
  if (view === 'grid')     return <GridScreen     onBack={goHome} />;
  if (view === 'order')    return <OrderScreen    onBack={goHome} onReplay={replay} key={pk} />;
  if (view === 'fourways') return <FourWaysScreen onBack={goHome} key={pk} />;

  // ═══ HOME ════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px', background: 'linear-gradient(180deg,#e8f5e9,#f3e5f5)', position: 'relative' }}>
      <button onClick={onBack}
        style={{ position: 'absolute', top: 16, left: 16, padding: '8px 16px', borderRadius: 12, background: '#E2E8F0', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#475569' }}>
        ← Accueil
      </button>

      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🔮</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1E293B', margin: '0 0 24px' }}>Mathématiques</h1>

        {([
          'grid', 'missing', 'missing69', 'order', 'tens', 'fourways', 'addition'
        ] as MathView[]).map(id => (
          <div key={id} onClick={() => setView(id)}
            style={{ background: 'white', border: '3px solid ' + MATH_COLORS[id], borderRadius: 18, padding: '14px 18px', marginBottom: 10, cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>
                {id === 'grid' ? '🔢' : id === 'missing' ? '🔍' : id === 'missing69' ? '🔢' : id === 'order' ? '📊' : id === 'tens' ? '🧱' : id === 'fourways' ? '🔄' : '➕'}
              </span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 15, color: MATH_COLORS[id] }}>{MATH_TITLES[id]}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                  {id === 'grid' ? 'Nombres jusqu’à 69' :
                   id === 'missing' ? 'Trouve le manquant' :
                   id === 'missing69' ? 'Nouveaux nombres' :
                   id === 'order' ? 'Du plus petit au plus grand' :
                   id === 'tens' ? 'Compte les dizaines' :
                   id === 'fourways' ? 'Chiffre, unités, bâtons, addition' :
                   'Additions simples'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
