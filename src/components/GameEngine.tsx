// src/components/GameEngine.tsx
// Trois moteurs de jeu partagés — compatibles FR · EN · Math · EVS
// Remplace : GameMirror, GameAnagram, GameBlank, GameTile, GameQCM pour les nouveaux modules
// Les anciens composants restent pour la compatibilité avec les Dictées existantes

import { useState } from 'react';

// ─── Types (corrigé pour accepter string | number) ────────────────────────────
export interface QuizQ {
  a: string | number;
  c?: (string | number)[];
  [key: string]: any;
}

export interface LearnWord {
  word?: string;
  display?: string;
  emoji: string;
  ex?: string;
  def?: string;
}

export interface WriteWord {
  word: string;
  emoji: string;
  hint?: string;
}

// ─── UI Partagé ───────────────────────────────────────────────────────────────
interface HdrProps { onBack: () => void; col: string; title: string; right?: string; }
export const Hdr = ({ onBack, col, title, right }: HdrProps) => (
  <div style={{ width: '100%', maxWidth: 480, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
    <button onClick={onBack} style={{ background: 'transparent', border: '2px solid ' + col, color: col, borderRadius: 14, padding: '7px 12px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>← Menu</button>
    <b style={{ color: col, fontSize: 14, textAlign: 'center' as const }}>{title}</b>
    <span style={{ minWidth: 68, textAlign: 'right' as const, fontSize: 13, fontWeight: 'bold', color: '#555' }}>{right || ''}</span>
  </div>
);

interface PBarProps { pct: number; col: string; }
export const PBar = ({ pct, col }: PBarProps) => (
  <div style={{ width: '100%', maxWidth: 480, height: 8, background: '#ddd', borderRadius: 8, marginBottom: 18, overflow: 'hidden' }}>
    <div style={{ width: pct + '%', height: '100%', background: col, borderRadius: 8, transition: 'width .4s' }} />
  </div>
);

interface BtnsProps {
  choices: (string | number)[];
  answer: string | number;
  chosen: string | number | null;
  fb: string | null;
  onPick: (opt: string | number) => void;
  col: string;
  row?: boolean;
  fsz?: number;
}
export const Btns = ({ choices, answer, chosen, fb, onPick, col, row, fsz = 20 }: BtnsProps) => (
  <div style={{ display: 'flex', flexDirection: row ? 'row' : 'column', gap: 10, marginTop: 4 }}>
    {choices.map((opt, i) => {
      const ic = chosen !== null && String(chosen) === String(opt);
      const ir = String(opt) === String(answer);
      const bg = !fb ? col
        : ic && fb === 'correct' ? '#43a047'
        : ic && fb === 'wrong'   ? '#e53935'
        : !ic && fb && ir        ? '#43a047'
        : '#bbb';
      return (
        <button key={i} onClick={() => onPick(opt)} disabled={!!fb}
          style={{ flex: 1, background: bg, color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: fsz, cursor: fb ? 'default' : 'pointer', fontWeight: 'bold', transition: 'background .25s' }}>
          {opt}
        </button>
      );
    })}
  </div>
);

interface ResultProps { score: number; total: number; col: string; wrongs?: string[]; onReplay: () => void; onMenu: () => void; }
export const ResultScreen = ({ score, total, col, wrongs, onReplay, onMenu }: ResultProps) => {
  const pct = total ? Math.round(score / total * 100) : 0;
  const medal = pct === 100 ? '🏆' : pct >= 80 ? '🥇' : pct >= 60 ? '🥈' : '🥉';
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#e8f5e9,#e3f2fd)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: 24, textAlign: 'center' as const }}>
      <div style={{ fontSize: 80 }}>{medal}</div>
      <h2 style={{ fontSize: 30, color: '#333', margin: '10px 0 4px' }}>Bravo !</h2>
      <div style={{ fontSize: 40, fontWeight: 'bold', color: col, margin: '10px 0' }}>{score} / {total}</div>
      <div style={{ fontSize: 18, color: '#888', marginBottom: 20 }}>{pct}%</div>
      {wrongs && wrongs.length > 0 && (
        <div style={{ background: 'white', borderRadius: 18, padding: 14, maxWidth: 400, width: '100%', marginBottom: 20, textAlign: 'left' as const }}>
          <b style={{ color: '#c62828' }}>📝 À revoir :</b>
          {wrongs.map((w, i) => <div key={i} style={{ marginTop: 5, fontSize: 13, color: '#555', padding: '4px 8px', background: '#fff8e1', borderRadius: 8 }}>{w}</div>)}
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onReplay} style={{ background: col, color: 'white', border: 'none', borderRadius: 20, padding: '13px 22px', fontSize: 16, cursor: 'pointer', fontWeight: 'bold' }}>🔄 Rejouer</button>
        <button onClick={onMenu}   style={{ background: '#546e7a', color: 'white', border: 'none', borderRadius: 20, padding: '13px 22px', fontSize: 16, cursor: 'pointer', fontWeight: 'bold' }}>🏠 Menu</button>
      </div>
    </div>
  );
};

// ─── QuizGame (corrigé pour accepter string | number) ────────────────────────
interface QuizGameProps<Q extends QuizQ> {
  qs: Q[];
  col: string;
  bg?: string;
  title: string;
  onBack: () => void;
  onReplay: () => void;
  wl?: (q: Q) => string;
  fm?: (q: Q) => string;
  renderQ: (q: Q, chosen: string | number | null, fb: string | null, pick: (a: string | number) => void, col: string) => React.ReactNode;
}

export function QuizGame<Q extends QuizQ>({ qs, col, bg, title, onBack, onReplay, wl, fm, renderQ }: QuizGameProps<Q>) {
  const [idx,    setIdx]    = useState(0);
  const [score,  setScore]  = useState(0);
  const [fb,     setFb]     = useState<string | null>(null);
  const [chosen, setChosen] = useState<string | number | null>(null);
  const [wrongs, setWrongs] = useState<string[]>([]);
  const [done,   setDone]   = useState(false);

  const pick = (ans: string | number) => {
    if (fb) return;
    const q = qs[idx], ci = idx;
    setChosen(ans);
    if (String(ans) === String(q.a)) { setFb('correct'); setScore(s => s + 1); }
    else                             { setFb('wrong');   setWrongs(w => [...w, wl ? wl(q) : '→ ' + q.a]); }
    setTimeout(() => {
      setFb(null); setChosen(null);
      if (ci + 1 < qs.length) setIdx(ci + 1); else setDone(true);
    }, 1300);
  };

  if (done) return <ResultScreen score={score} total={qs.length} col={col} wrongs={wrongs} onReplay={onReplay} onMenu={onBack} />;

  const q   = qs[idx];
  const cbg = fb === 'correct' ? '#e8f5e9' : fb === 'wrong' ? '#ffebee' : 'white';

  return (
    <div style={{ minHeight: '100vh', background: bg || 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '18px 14px' }}>
      <Hdr onBack={onBack} col={col} title={title} right={`Q ${idx + 1} / ${qs.length}`} />
      <PBar pct={idx / qs.length * 100} col={col} />
      <div style={{ background: cbg, borderRadius: 22, padding: '24px 18px', maxWidth: 460, width: '100%', boxShadow: '0 4px 18px rgba(0,0,0,.1)', textAlign: 'center' as const, transition: 'background .25s' }}>
        {renderQ(q, chosen, fb, pick, col)}
        {fb && (
          <div style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold', color: fb === 'correct' ? '#2e7d32' : '#c62828' }}>
            {fb === 'correct' ? '✅ Correct ! 🎉' : fm ? fm(q) : '❌ Réponse : ' + q.a}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LearnGame ────────────────────────────────────────────────────────────────
interface LearnGameProps {
  words: LearnWord[];
  col: string;
  bg: string;
  title: string;
  onBack: () => void;
  showDef?: boolean;
}

export function LearnGame({ words, col, bg, title, onBack, showDef }: LearnGameProps) {
  const [ci, setCi] = useState(0);
  const [fl, setFl] = useState(false);
  const item = words[ci];

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '18px 14px' }}>
      <Hdr onBack={onBack} col={col} title={title} />
      <div style={{ display: 'flex', gap: 7, marginBottom: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        {words.map((w, i) => (
          <button key={i} onClick={() => { setFl(false); setTimeout(() => setCi(i), 100); }}
            style={{ background: ci === i ? col : 'white', color: ci === i ? 'white' : col, border: '2px solid ' + col, borderRadius: 18, padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>
            {w.emoji} {w.display || w.word}
          </button>
        ))}
      </div>
      <div onClick={() => setFl(f => !f)}
        style={{ background: fl ? 'white' : col, borderRadius: 26, padding: '36px 22px', maxWidth: 420, width: '100%', textAlign: 'center' as const, cursor: 'pointer', minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'background .3s', boxShadow: '0 6px 22px rgba(0,0,0,.15)' }}>
        {!fl
          ? <>
              <div style={{ fontSize: 90 }}>{item.emoji}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 14 }}>Touche pour révéler 👆</div>
            </>
          : <>
              <div style={{ fontSize: 60, marginBottom: 8 }}>{item.emoji}</div>
              <div style={{ fontSize: 34, fontWeight: 'bold', color: col, marginBottom: 8 }}>{item.display || item.word}</div>
              <div style={{ fontSize: 14, color: '#555', fontStyle: 'italic', marginBottom: 4 }}>{item.ex}</div>
              {showDef && <div style={{ fontSize: 13, color: col, fontWeight: 'bold' }}>💡 {item.def}</div>}
            </>}
      </div>
      <div style={{ marginTop: 16, background: 'white', borderRadius: 18, padding: '14px 16px', maxWidth: 420, width: '100%' }}>
        <b style={{ color: col, display: 'block', marginBottom: 8, textAlign: 'center' as const }}>📖 Tous les mots</b>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {words.map((w, i) => (
            <div key={i} style={{ background: bg, borderRadius: 10, padding: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 20 }}>{w.emoji}</span>
              <span style={{ color: col, fontWeight: 'bold' }}>{w.display || w.word}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── WriteGame ────────────────────────────────────────────────────────────────
const mkPool = (word: string) => {
  const extra   = 'abcdefhiklmnoprstuvwxy'.split('');
  const letters = word.split('');
  const pool    = [...letters, ...extra.filter(l => !letters.includes(l)).slice(0, 3)];
  return [...pool].sort(() => Math.random() - 0.5).map((l, i) => ({ l, i }));
};

interface WriteGameProps {
  words: WriteWord[];
  col: string;
  bg: string;
  title: string;
  onBack: () => void;
}

export function WriteGame({ words, col, bg, title, onBack }: WriteGameProps) {
  const [wi,    setWi]    = useState(0);
  const [pool,  setPool]  = useState(() => mkPool(words[0].word));
  const [typed, setTyped] = useState<{ l: string; i: number }[]>([]);
  const [fb,    setFb]    = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done,  setDone]  = useState(false);

  const item    = words[wi];
  const target  = item.word;
  const usedIdx = typed.map(u => u.i);

  const click = (l: string, i: number) => {
    if (fb || usedIdx.includes(i)) return;
    const next = [...typed, { l, i }];
    setTyped(next);
    if (next.length === target.length) {
      if (next.map(u => u.l).join('') === target) {
        setFb('correct'); setScore(s => s + 1);
        setTimeout(() => {
          if (wi + 1 < words.length) {
            const ni = wi + 1;
            setWi(ni); setPool(mkPool(words[ni].word)); setTyped([]); setFb(null);
          } else setDone(true);
        }, 1200);
      } else {
        setFb('wrong');
        setTimeout(() => { setFb(null); setTyped([]); }, 900);
      }
    }
  };

  const restart = () => { setWi(0); setPool(mkPool(words[0].word)); setTyped([]); setFb(null); setScore(0); setDone(false); };

  if (done) return <ResultScreen score={score} total={words.length} col={col} onReplay={restart} onMenu={onBack} />;

  const cbg = fb === 'correct' ? '#e8f5e9' : fb === 'wrong' ? '#ffebee' : 'white';

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '18px 14px' }}>
      <Hdr onBack={onBack} col={col} title={title} right={`Mot ${wi + 1} / ${words.length}`} />
      <PBar pct={wi / words.length * 100} col={col} />
      <div style={{ background: cbg, borderRadius: 22, padding: '24px 18px', maxWidth: 460, width: '100%', boxShadow: '0 4px 18px rgba(0,0,0,.1)', textAlign: 'center' as const }}>
        <div style={{ fontSize: 72, marginBottom: 8 }}>{item.emoji}</div>
        <div style={{ fontSize: 14, fontStyle: 'italic', color: '#888', marginBottom: 16 }}>{item.hint}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, flexWrap: 'wrap', marginBottom: 18 }}>
          {target.split('').map((_, si) => (
            <div key={si} style={{ minWidth: 40, height: 50, border: '3px solid ' + col, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 23, fontWeight: 'bold', background: typed[si] ? bg : 'white', color: col }}>
              {typed[si] ? typed[si].l : ''}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
          {pool.map(entry => {
            const used = usedIdx.includes(entry.i);
            return (
              <button key={entry.i} onClick={() => click(entry.l, entry.i)} disabled={used || !!fb}
                style={{ width: 48, height: 48, background: used ? '#e0e0e0' : col, color: used ? '#bbb' : 'white', border: 'none', borderRadius: 11, fontSize: 23, cursor: used || !!fb ? 'default' : 'pointer', fontWeight: 'bold' }}>
                {entry.l}
              </button>
            );
          })}
        </div>
        {typed.length > 0 && !fb && (
          <button onClick={() => setTyped(t => t.slice(0, -1))}
            style={{ background: 'transparent', border: '2px solid #ccc', borderRadius: 9, padding: '7px 14px', fontSize: 13, cursor: 'pointer', color: '#999' }}>
            ⌫ Effacer
          </button>
        )}
        {fb && <div style={{ marginTop: 14, fontSize: 26 }}>{fb === 'correct' ? '✅ Parfait ! 🎉' : '❌ Réessaie !'}</div>}
      </div>
    </div>
  );
}