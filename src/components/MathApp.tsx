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
  | 'grid' | 'missing' | 'missing69' | 'missing100' | 'order'
  | 'tens' | 'fourways' | 'addition';

const MATH_COLORS: Record<MathView, string> = {
  home:      '#475569',
  grid:      C.grid,
  missing:   C.miss,
  missing69: '#0277bd',
  missing100:'#6a1b9a',
  order:     C.ord,
  tens:      C.tens,
  fourways:  C.four,
  addition:  C.add,
};

const MATH_TITLES: Record<MathView, string> = {
  home:      'Mathématiques',
  grid:      '🔢 Grille 1–100',
  missing:   '🔍 Manquants 1–50',
  missing69: '🔢 Manquants 51–69',
  missing100:'🔢 Manquants 70–100',
  order:     '📊 Ordonner',
  tens:      '🧱 Dizaines & Unités',
  fourways:  '🔄 4 Façons',
  addition:  '➕ Addition',
};

// ═══ Helpers (génèrent plus de choix) ══════════════════════════════════════════
const mkMissingQ = (start: number, end: number) => {
  const length = Math.min(5, end - start + 1);
  const s = start + Math.floor(Math.random() * (end - start - length + 1));
  const seq = Array.from({ length }, (_, i) => s + i);
  const bp = 1 + Math.floor(Math.random() * (seq.length - 2));
  const ans = seq[bp];
  
  // Générer 3-4 distracteurs autour de la réponse
  const choicesSet = new Set<number>();
  choicesSet.add(ans);
  
  // Essayer d'ajouter des nombres proches
  for (let delta = 1; choicesSet.size < 5 && delta <= 4; delta++) {
    [ans - delta, ans + delta].forEach(x => {
      if (x >= start && x <= end && !seq.includes(x)) choicesSet.add(x);
    });
  }
  
  // Si pas assez, ajouter des nombres aléatoires valides
  while (choicesSet.size < 5) {
    const r = start + Math.floor(Math.random() * (end - start + 1));
    if (!seq.includes(r)) choicesSet.add(r);
  }
  
  const choices = shuffle(Array.from(choicesSet));
  return { seq, bp, a: ans, choices };
};

const mkTensQ = (n: number) => {
  const tens = Math.floor(n / 10);
  const units = n % 10;
  const askTens = Math.random() > 0.5;
  const ans = askTens ? tens : units;
  
  let pool: number[];
  if (askTens) {
    pool = Array.from({ length: 10 }, (_, i) => i); // 0-9
  } else {
    pool = Array.from({ length: 10 }, (_, i) => i); // 0-9
  }
  
  const choicesSet = new Set<number>();
  choicesSet.add(ans);
  
  // Ajouter 3-4 distracteurs
  while (choicesSet.size < 5) {
    const r = pool[Math.floor(Math.random() * pool.length)];
    choicesSet.add(r);
  }
  
  const choices = shuffle(Array.from(choicesSet));
  return {
    n,
    label: askTens ? 'dizaines' : 'unités',
    a: ans,
    choices,
  };
};

const mkAddQ = ([a, b]: [number, number]) => {
  const sum = a + b;
  const choicesSet = new Set<number>();
  choicesSet.add(sum);
  
  // Ajouter 3-4 distracteurs dans la plage 0-20
  while (choicesSet.size < 5) {
    const r = Math.floor(Math.random() * 21); // 0 à 20
    choicesSet.add(r);
  }
  
  const choices = shuffle(Array.from(choicesSet));
  return { a2: a, b2: b, a: sum, choices };
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

// ═══ Jeux spécifiques ═════════════════════════════════════════════════════════
function GridScreen({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'all' | 'by2' | 'by5' | 'by10'>('all');
  const isHighlighted = (n: number) =>
    (mode === 'by2' && n % 2 === 0) ||
    (mode === 'by5' && n % 5 === 0) ||
    (mode === 'by10' && n % 10 === 0);

  return (
    <div style={{ minHeight: '100vh', background: '#e8f5e9', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '18px 14px' }}>
      <Hdr onBack={onBack} col={C.grid} title="🔢 Grille 1–100" />
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
    const nums = [...new Set(Array.from({ length: 10 }, () => Math.floor(Math.random() * 99) + 1))].slice(0, 5);
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
          const newNums = [...new Set(Array.from({ length: 10 }, () => Math.floor(Math.random() * 99) + 1))].slice(0, 5);
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
        {/* ... (le reste est inchangé, je le garde pour la longueur du message) ... */}
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

// ... (FourWaysScreen inchangé, je le raccourcis pour le message) ...

// ═══ Composant principal ═════════════════════════════════════════════════════
export default function MathApp({ onBack, profileId }: MathAppProps) {
  const [view, setView] = useState<MathView>('home');
  const [pk,   setPk]   = useState(0);
  const [tip,  setTip]  = useState(false);

  const goHome = () => setView('home');
  const replay = () => setPk(k => k + 1);

  // ═══ Manquants (1-50, 51-69, 70-100) ═════════════════════════════════════
  if (view === 'missing' || view === 'missing69' || view === 'missing100') {
    const ranges: Record<string, [number, number]> = {
      missing: [1, 50],
      missing69: [51, 69],
      missing100: [70, 100],
    };
    const [start, end] = ranges[view];
    const title = MATH_TITLES[view];
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

  // ... (le reste est inchangé, sauf le ajout dans la boucle HOME) ...
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
          'grid', 'missing', 'missing69', 'missing100', 'order', 'tens', 'fourways', 'addition'
        ] as MathView[]).map(id => (
          <div key={id} onClick={() => setView(id)}
            style={{ background: 'white', border: '3px solid ' + MATH_COLORS[id], borderRadius: 18, padding: '14px 18px', marginBottom: 10, cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>
                {id === 'grid' ? '🔢' : id === 'missing' ? '🔍' : id === 'missing69' ? '🔢' : id === 'missing100' ? '🔢' : id === 'order' ? '📊' : id === 'tens' ? '🧱' : id === 'fourways' ? '🔄' : '➕'}
              </span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 15, color: MATH_COLORS[id] }}>{MATH_TITLES[id]}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                  {id === 'grid' ? 'Nombres jusqu’à 100' :
                   id === 'missing' ? 'Trouve le manquant' :
                   id === 'missing69' ? 'Nombres 51–69' :
                   id === 'missing100' ? 'Nombres 70–100' :
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