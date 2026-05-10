// src/components/FrenchApp.tsx
// Module Français complet : Dictées · Son G · Son ON · Dictée guidée · Mot du jour
// Phonétique Montessori · Explorateur de Sons

import { useState, useEffect, useRef, useCallback } from 'react';
import { Confetti } from './Confetti';
import { WarmUp } from './WarmUp';
import { GameMirror } from './GameMirror';
import { GameAnagram } from './GameAnagram';
import { GameBlank } from './GameBlank';
import { GameTile } from './GameTile';
import { GameQCM } from './GameQCM';
import { QuizGame, LearnGame, WriteGame, Hdr, ResultScreen } from './GameEngine';
import PhoneticsApp from './PhoneticsApp';
import SoundContrastExplorer from './SoundContrastExplorer';
import {
  DICTEES, QCM_POOL, GT, LABELS, COLORS, ROUNDS,
  DICTEE_PHRASES, DICTEE_TIPS,
  SON_G_WORDS, SON_G_QUIZ,
  SON_ON_WORDS, SON_ON_QUIZ, SON_ON_WRITE,
  MOT_DU_JOUR, C,
} from '../data/content';
import { shuffle } from '../utils/helpers';
import { getErrors, saveErrors, getProgress, saveProgress, getParentStats, saveParentStats } from '../utils/storage';
import type { Dictée, Round, ErrorCounts, Completed, Screen, GameType } from '../types';

// ✅ Accepte désormais profileId
interface FrenchAppProps { 
  onBack: () => void;
  profileId: string;
}

type FrView =
  | 'home' | 'phonetics' | 'explorer'
  | 'glearn' | 'gwrite' | 'gquiz'
  | 'onlearn' | 'onwrite' | 'onquiz'
  | 'dictee_guidee' | 'motdujour';

const THEME = { shadow: '0 6px 16px rgba(0,0,0,0.06)' };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const norm = (w: string) => w.toLowerCase().replace(/[.,!?;:"""''«»()]/g, '').trim();

function buildRounds(d: Dictée): Round[] {
  const seq = shuffle(Object.values(GT).flatMap(t => [t, t]));
  const w = shuffle(d.mots.filter(x => x.length > 2));
  const p = shuffle(d.phrases);
  const q = shuffle(QCM_POOL);
  let wi = 0, pi = 0, qi = 0;
  const out: Round[] = [];
  for (let i = 0; i < ROUNDS; i++) {
    const t = seq[i];
    if (t === 'qcm')                  { out.push({ type: 'qcm',  data: q[qi++ % q.length] }); }
    else if (t === 'blank' || t === 'tile') { out.push({ type: t, phrase: p[pi++ % p.length], mots: d.mots }); }
    else                              { out.push({ type: t as any, word: w[wi++ % w.length] }); }
  }
  return out;
}

function buildSpecial(err: ErrorCounts): Round[] {
  const words = Object.keys(err).sort((a, b) => err[b] - err[a]).slice(0, 6);
  if (!words.length) return [];
  const q = shuffle(QCM_POOL);
  const pat = ['mirror','anagram','mirror','anagram','qcm','mirror','anagram','qcm'] as const;
  return Array.from({ length: 8 }, (_, i) => {
    const t = pat[i];
    return t === 'qcm'
      ? { type: 'qcm' as const, data: q[i % q.length] }
      : { type: t as any, word: words[i % words.length] };
  });
}

// ─── Dictée guidée ────────────────────────────────────────────────────────────
function DicteeGuidee({ onBack }: { onBack: () => void }) {
  const [level, setLevel] = useState<'facile' | 'moyen' | 'difficile' | null>(null);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ word: string; typed: string; correct: boolean }[] | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const phrases = level ? DICTEE_PHRASES[level] : [];
  const ph = phrases[idx];

  const speak = (rate = 1) => {
    if (!ph || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(ph.t);
    u.lang = 'fr-FR'; u.rate = rate;
    window.speechSynthesis.speak(u);
  };

  const verify = () => {
    if (!ph || !input.trim()) return;
    const r = ph.t.split(/\s+/).map((x, i) => {
      const uw = input.trim().split(/\s+/);
      return { word: x, typed: uw[i] || '—', correct: norm(x) === norm(uw[i] || '') };
    });
    setResult(r);
    if (r.every(x => x.correct)) setScore(s => s + 1);
  };

  const goNext = () => {
    setInput(''); setResult(null);
    if (idx + 1 < phrases.length) setIdx(i => i + 1); else setDone(true);
  };

  const reset = () => { setLevel(null); setIdx(0); setInput(''); setResult(null); setScore(0); setDone(false); };

  const tips = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginTop: 14, maxWidth: 460, width: '100%' }}>
      {DICTEE_TIPS.map((t, i) => (
        <div key={i} style={{ background: t.col, borderRadius: 12, padding: '9px 11px' }}>
          <b style={{ fontSize: 12, color: 'white', display: 'block' }}>{t.title}</b>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.8)' }}>{t.sub}</span>
        </div>
      ))}
    </div>
  );

  if (done) return <ResultScreen score={score} total={phrases.length} col={C.dict} onReplay={reset} onMenu={onBack} />;

  if (!level) return (
    <div style={{ minHeight: '100vh', background: '#eceff1', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '18px 14px' }}>
      <Hdr onBack={onBack} col={C.dict} title="✍️ Dictée guidée" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 420 }}>
        {[{ key: 'facile', label: '🟢 Facile', col: '#2e7d32' }, { key: 'moyen', label: '🟡 Moyen', col: '#e65100' }, { key: 'difficile', label: '🔴 Difficile', col: '#b71c1c' }]
          .map(l => <button key={l.key} onClick={() => setLevel(l.key as any)} style={{ background: l.col, color: 'white', border: 'none', borderRadius: 18, padding: '15px 20px', fontSize: 17, cursor: 'pointer', fontWeight: 'bold', textAlign: 'left' as const }}>{l.label}</button>)}
      </div>
      {tips}
    </div>
  );

  const cc = result ? result.filter(r => r.correct).length : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#eceff1', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '18px 14px' }}>
      <Hdr onBack={reset} col={C.dict} title="✍️ Dictée guidée" right={`Phrase ${idx + 1} / ${phrases.length}`} />
      <div style={{ background: 'white', borderRadius: 22, padding: '20px 18px', maxWidth: 460, width: '100%', boxShadow: '0 4px 18px rgba(0,0,0,.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, gap: 7, flexWrap: 'wrap' as const }}>
          <span style={{ background: '#eceff1', borderRadius: 9, padding: '4px 11px', fontSize: 12, fontWeight: 'bold', color: C.dict }}>{ph.top}</span>
          <span style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}>{ph.h}</span>
        </div>
        <div style={{ display: 'flex', gap: 9, marginBottom: 16 }}>
          <button onClick={() => speak(1)} style={{ flex: 1, background: C.dict, color: 'white', border: 'none', borderRadius: 18, padding: '11px 7px', fontSize: 14, cursor: 'pointer', fontWeight: 'bold' }}>▶ Écouter</button>
          <button onClick={() => speak(0.65)} style={{ flex: 1, background: 'white', color: C.dict, border: '2px solid ' + C.dict, borderRadius: 18, padding: '11px 7px', fontSize: 14, cursor: 'pointer', fontWeight: 'bold' }}>🐢 Lentement</button>
        </div>
        {!result
          ? <>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                placeholder="Écris la phrase ici…"
                style={{ width: '100%', minHeight: 88, border: '2px solid #ccc', borderRadius: 13, padding: '11px 13px', fontSize: 17, fontFamily: 'sans-serif', resize: 'vertical' as const, outline: 'none', boxSizing: 'border-box' as const, lineHeight: 1.6 }} />
              <button onClick={verify} style={{ marginTop: 10, width: '100%', background: input.trim() ? C.dict : '#ccc', color: 'white', border: 'none', borderRadius: 14, padding: 13, fontSize: 16, cursor: input.trim() ? 'pointer' : 'default', fontWeight: 'bold' }}>
                ✔ Vérifier
              </button>
            </>
          : <>
              <div style={{ background: '#f5f5f5', borderRadius: 13, padding: 13, marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 7, fontWeight: 'bold', textTransform: 'uppercase' as const }}>Phrase correcte :</div>
                <div style={{ lineHeight: 2.3 }}>
                  {result.map((r, i) => (
                    <span key={i} style={{ display: 'inline-block', margin: 2 }}>
                      <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 7, background: r.correct ? '#c8e6c9' : '#ffcdd2', color: r.correct ? '#2e7d32' : '#c62828', fontWeight: 'bold', fontSize: 16 }}>
                        {r.word}
                        {!r.correct && <span style={{ display: 'block', fontSize: 10, color: '#e53935' }}>✍️ {r.typed}</span>}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'center' as const, fontSize: 20, marginBottom: 12, fontWeight: 'bold', color: cc === result.length ? '#2e7d32' : '#e65100' }}>
                {cc === result.length ? '✅ Parfait ! 🎉' : `📝 ${cc} / ${result.length} mots corrects`}
              </div>
              <button onClick={goNext} style={{ width: '100%', background: '#43a047', color: 'white', border: 'none', borderRadius: 14, padding: 13, fontSize: 16, cursor: 'pointer', fontWeight: 'bold' }}>
                {idx + 1 < phrases.length ? 'Phrase suivante →' : 'Voir les résultats 🏆'}
              </button>
            </>}
      </div>
      {tips}
    </div>
  );
}

// ─── Mot du jour ──────────────────────────────────────────────────────────────
function MotDuJour({ onBack }: { onBack: () => void }) {
  const m = MOT_DU_JOUR;
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#fff3e0,#fce4ec)', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '18px 14px' }}>
      <Hdr onBack={onBack} col="#ad1457" title="💬 Mot du jour" />
      <div style={{ background: 'white', borderRadius: 26, padding: '32px 24px', maxWidth: 420, width: '100%', boxShadow: '0 6px 22px rgba(0,0,0,.12)', textAlign: 'center' as const, marginBottom: 16 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{m.emoji}</div>
        <div style={{ fontSize: 52, fontWeight: 'bold', color: '#ad1457', marginBottom: 12, letterSpacing: 2 }}>{m.mot}</div>
        <div style={{ fontSize: 16, color: '#555', marginBottom: 20, fontStyle: 'italic' }}>{m.traduction}</div>
        <div style={{ background: '#fff3e0', borderRadius: 16, padding: 16, textAlign: 'left' as const }}>
          <b style={{ color: '#ad1457', display: 'block', marginBottom: 10 }}>Exemples :</b>
          <div style={{ fontSize: 15, lineHeight: 2.2, color: '#444' }}>
            {m.exemples.map((ex, i) => <div key={i}>{ex.emoji} {ex.phrase}</div>)}
          </div>
        </div>
      </div>
      <div style={{ background: 'white', borderRadius: 18, padding: '16px 20px', maxWidth: 420, width: '100%' }}>
        <b style={{ color: '#ad1457', display: 'block', marginBottom: 10 }}>✏️ Comment écrire {m.mot} :</b>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' as const }}>
          {m.lettres.map((l, i) => (
            <div key={i} style={{ width: 44, height: 44, border: '3px solid #ad1457', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 'bold', color: '#ad1457', background: '#fce4ec' }}>{l}</div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 13, color: '#888', textAlign: 'center' as const }}>{m.note}</div>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function FrenchApp({ onBack, profileId }: FrenchAppProps) {

  // ── TOUS les hooks en premier ───────────────────────────────────────────────
  const [view,      setView]      = useState<FrView>('home');
  const [screen,    setScreen]    = useState<Screen>('home');
  const [dicIdx,    setDicIdx]    = useState<number | null>(null);
  const [rounds,    setRounds]    = useState<Round[]>([]);
  const [ridx,      setRidx]      = useState(0);
  const [score,     setScore]     = useState(0);
  const [errCnt,    setErrCnt]    = useState<ErrorCounts>({});
  const [completed, setCompleted] = useState<Completed>({});
  const [key,       setKey]       = useState(0);
  const [confetti,  setConfetti]  = useState(false);
  const [pk,        setPk]        = useState(0);   // replay key pour les sous-jeux
  const [parentData,setParentData]= useState<any>({ sessions: 0, correct: 0, total: 0 });
  const timer = useRef<number | null>(null);

  // ✅ Chargement lié au profil
  useEffect(() => {
    getErrors(profileId).then(setErrCnt);
    getProgress(profileId).then(setCompleted);
    getParentStats(profileId).then(setParentData);
  }, [profileId]);

  // ✅ Sauvegarde liée au profil
  const saveErr = useCallback((c: ErrorCounts) => { setErrCnt(c); saveErrors(profileId, c); }, [profileId]);
  const fire    = useCallback(() => {
    setConfetti(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setConfetti(false), 1500);
  }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const startWarm    = (i: number) => { setDicIdx(i); setScreen('warmup'); };
  const startGame    = (i: number) => { setRounds(buildRounds(DICTEES[i])); setRidx(0); setScore(0); setKey(0); setScreen('game'); };
  const startSpecial = () => { const r = buildSpecial(errCnt); if (!r.length) return; setDicIdx(null); setRounds(r); setRidx(0); setScore(0); setKey(0); setScreen('game'); };

  // ✅ Correction : u est déclaré AVANT d'être utilisé
  const onDone = (ok: boolean, w: string) => {
    if (ok) fire();
    const ns = score + (ok ? 1 : 0);
    setScore(ns);
    if (!ok && w !== 'phrase') { saveErr({ ...errCnt, [w]: (errCnt[w] || 0) + 1 }); }
    const next = ridx + 1;
    if (next >= rounds.length) {
      const pct = Math.round((ns / rounds.length) * 100);
      if (dicIdx !== null) {
        const nc = { ...completed, [DICTEES[dicIdx].id]: pct };
        setCompleted(nc); saveProgress(profileId, nc);
      }
      const u = { ...parentData, sessions: parentData.sessions + 1, total: parentData.total + rounds.length, correct: parentData.correct + ns, lastDate: new Date().toLocaleDateString() };
      setParentData(u);
      saveParentStats(profileId, u);
      setScreen('result');
    } else { setRidx(next); setKey(k => k + 1); }
  };

  // ── Guards de navigation (APRÈS tous les hooks) ───────────────────────────
  if (view === 'phonetics')   return <PhoneticsApp          onBack={() => setView('home')} />;
  if (view === 'explorer')    return <SoundContrastExplorer onBack={() => setView('home')} />;
  if (view === 'dictee_guidee') return <DicteeGuidee        onBack={() => setView('home')} />;
  if (view === 'motdujour')   return <MotDuJour             onBack={() => setView('home')} />;

  // Son G
  if (view === 'glearn') return <LearnGame key={pk} words={SON_G_WORDS} col={C.sg} bg="#fce4ec" title="📖 Son G — Apprendre" onBack={() => setView('home')} />;
  if (view === 'gwrite') return <WriteGame key={pk} words={SON_G_WORDS.map(w => ({ word: w.word, emoji: w.emoji, hint: w.ex }))} col={C.sg} bg="#fce4ec" title="✏️ Son G — Écrire" onBack={() => setView('home')} />;
  if (view === 'gquiz')  return (
    <QuizGame key={pk} qs={shuffle(SON_G_QUIZ)} col={C.sg} bg="#fce4ec" title="🎮 Son G — Quiz"
      onBack={() => setView('home')} onReplay={() => setPk(k => k + 1)}
      wl={q => 'Réponse : ' + q.a}
      renderQ={(q, chosen, fb, pick, col) => (
        <div>
          <div style={{ fontSize: 80, marginBottom: 8 }}>{q.emoji}</div>
          <p style={{ fontSize: 15, color: '#888', margin: '0 0 14px', fontStyle: 'italic' }}>{q.q}</p>
          {q.type === 'miss' && <div style={{ fontSize: 29, fontWeight: 'bold', color: col, marginBottom: 16, letterSpacing: 3 }}>{q.d}</div>}
          {q.type === 'sent' && <div style={{ fontSize: 18, fontWeight: 'bold', color: '#444', marginBottom: 16, lineHeight: 1.7 }}>{q.d}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {q.c.map((opt: string, i: number) => {
              const ic = chosen === opt, ir = opt === q.a;
              const bg = !fb ? col : ic && fb === 'correct' ? '#43a047' : ic && fb === 'wrong' ? '#e53935' : !ic && fb && ir ? '#43a047' : '#bbb';
              return <button key={i} onClick={() => pick(opt)} disabled={!!fb} style={{ background: bg, color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: 20, cursor: fb ? 'default' : 'pointer', fontWeight: 'bold' }}>{opt}</button>;
            })}
          </div>
        </div>
      )}
    />
  );

  // Son ON
  if (view === 'onlearn') return <LearnGame key={pk} words={SON_ON_WORDS} col={C.on} bg="#fff3e0" title="📖 Son ON — Apprendre" onBack={() => setView('home')} showDef />;
  if (view === 'onwrite') return <WriteGame key={pk} words={SON_ON_WRITE.map(word => { const w = SON_ON_WORDS.find(x => x.word === word)!; return { word, emoji: w.emoji, hint: w.def }; })} col={C.on} bg="#fff3e0" title="✏️ Son ON — Écrire" onBack={() => setView('home')} />;
  if (view === 'onquiz')  return (
    <QuizGame key={pk} qs={shuffle(SON_ON_QUIZ)} col={C.on} bg="#fff3e0" title="🎮 Son ON — Quiz"
      onBack={() => setView('home')} onReplay={() => setPk(k => k + 1)}
      wl={q => 'Réponse : ' + q.a}
      renderQ={(q, chosen, fb, pick, col) => (
        <div>
          <div style={{ fontSize: 80, marginBottom: 10 }}>{q.emoji}</div>
          <p style={{ fontSize: 16, color: '#555', fontWeight: 'bold', margin: '0 0 18px' }}>{q.q}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {q.c.map((opt: string, i: number) => {
              const ic = chosen === opt, ir = opt === q.a;
              const bg = !fb ? col : ic && fb === 'correct' ? '#43a047' : ic && fb === 'wrong' ? '#e53935' : !ic && fb && ir ? '#43a047' : '#bbb';
              return <button key={i} onClick={() => pick(opt)} disabled={!!fb} style={{ background: bg, color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: 20, cursor: fb ? 'default' : 'pointer', fontWeight: 'bold' }}>{opt}</button>;
            })}
          </div>
        </div>
      )}
    />
  );

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (screen === 'home') return (
    <div style={{ minHeight: '100vh', padding: '32px 16px', background: 'linear-gradient(180deg,#F0F9FF,#F8FAFC)', position: 'relative' }}>
      <button onClick={onBack} style={{ position: 'absolute', top: 16, left: 16, padding: '8px 16px', borderRadius: 12, background: '#E2E8F0', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#475569' }}>← Accueil</button>

      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' as const }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>📚✨</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1E293B', margin: '0 0 24px' }}>Français</h1>

        {/* ── Phonétique ── */}
        <div style={{ fontSize: 11, fontWeight: 800, color: C.sg, letterSpacing: 1, marginBottom: 9, textTransform: 'uppercase' as const }}>🎵 Phonétique</div>
        <button onClick={() => setView('phonetics')}
          style={{ width: '100%', padding: 16, marginBottom: 10, borderRadius: 20, background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', border: 'none', fontWeight: 800, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          🗣️ Phonétique Montessori
        </button>
        <button onClick={() => setView('explorer')}
          style={{ width: '100%', padding: 16, marginBottom: 20, borderRadius: 20, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', border: 'none', fontWeight: 800, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          🔬 Explorateur de Sons FR/EN
        </button>

        {/* ── Son G ── */}
        <div style={{ background: 'white', border: '3px solid ' + C.sg, borderRadius: 18, padding: '12px 16px', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
            <span style={{ fontSize: 26 }}>🔤</span>
            <div style={{ textAlign: 'left' as const }}>
              <div style={{ fontWeight: 'bold', fontSize: 15, color: C.sg }}>Le Son G</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>🐉 dragon · 🎂 gâteau</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
            {[['glearn','📖 Apprendre'],['gwrite','✏️ Écrire'],['gquiz','🎮 Quiz']].map(([v, l]) => (
              <button key={v} onClick={() => setView(v as FrView)}
                style={{ background: v === 'gquiz' ? C.sg : 'white', color: v === 'gquiz' ? 'white' : C.sg, border: '2px solid ' + C.sg, borderRadius: 12, padding: '10px 4px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>{l}</button>
            ))}
          </div>
        </div>

        {/* ── Son ON ── */}
        <div style={{ background: 'white', border: '3px solid ' + C.on, borderRadius: 18, padding: '12px 16px', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
            <span style={{ fontSize: 26 }}>🔤</span>
            <div style={{ textAlign: 'left' as const }}>
              <div style={{ fontWeight: 'bold', fontSize: 15, color: C.on }}>Le Son ON</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>🦁 lion · 🐷 cochon · 🐱 chaton · 🐑 mouton</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
            {[['onlearn','📖 Apprendre'],['onwrite','✏️ Écrire'],['onquiz','🎮 Quiz']].map(([v, l]) => (
              <button key={v} onClick={() => setView(v as FrView)}
                style={{ background: v === 'onquiz' ? C.on : 'white', color: v === 'onquiz' ? 'white' : C.on, border: '2px solid ' + C.on, borderRadius: 12, padding: '10px 4px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>{l}</button>
            ))}
          </div>
        </div>

        {/* ── Dictée + Mot du jour ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 20 }}>
          <div onClick={() => setView('dictee_guidee')} style={{ background: 'white', border: '3px solid ' + C.dict, borderRadius: 18, padding: '12px 14px', cursor: 'pointer', textAlign: 'center' as const, boxShadow: THEME.shadow }}>
            <div style={{ fontSize: 26 }}>✍️</div>
            <div style={{ fontWeight: 'bold', fontSize: 13, color: C.dict }}>Dictée guidée</div>
            <div style={{ fontSize: 10, color: '#aaa' }}>3 niveaux</div>
          </div>
          <div onClick={() => setView('motdujour')} style={{ background: 'white', border: '3px solid #ad1457', borderRadius: 18, padding: '12px 14px', cursor: 'pointer', textAlign: 'center' as const, boxShadow: THEME.shadow }}>
            <div style={{ fontSize: 26 }}>💬</div>
            <div style={{ fontWeight: 'bold', fontSize: 13, color: '#ad1457' }}>Mot du jour</div>
            <div style={{ fontSize: 12, color: '#ad1457', fontWeight: 'bold', marginTop: 2 }}>j'aime ❤️</div>
          </div>
        </div>

        {/* ── Dictées classiques ── */}
        <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', letterSpacing: 1, marginBottom: 9, textTransform: 'uppercase' as const }}>📝 Dictées classiques</div>
        {Object.keys(errCnt).length > 0 && (
          <button onClick={startSpecial} style={{ width: '100%', padding: 16, marginBottom: 14, borderRadius: 20, background: 'linear-gradient(135deg,#F59E0B,#D97706)', color: '#fff', border: 'none', fontWeight: 800, fontSize: 17, cursor: 'pointer' }}>
            🌟 Entraînement spécial (erreurs)
          </button>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: 10 }}>
          {DICTEES.map((d: Dictée) => {
            const p = completed[d.id]; const stars = p ? Math.min(3, Math.round(p / 34)) : 0;
            return (
              <button key={d.id} onClick={() => startWarm(d.id - 1)}
                style={{ padding: 16, borderRadius: 20, border: `3px solid ${stars ? '#FCD34D' : '#E2E8F0'}`, background: stars ? '#FEF3C7' : '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: THEME.shadow }}>
                <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700 }}>{d.level}</span>
                <span style={{ fontSize: 22 }}>{stars ? '⭐'.repeat(stars) : '🎮'}</span>
                <span style={{ fontWeight: 800, color: '#334155', fontSize: 14 }}>Dictée {d.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (screen === 'result') {
    const pct = Math.round((score / rounds.length) * 100);
    const msg = pct >= 90 ? '🎉 Superbe !' : pct >= 70 ? '👏 Très bien !' : pct >= 50 ? '💪 Continue !' : '🌱 Chaque essai compte !';
    return (
      <div style={{ minHeight: '100vh', padding: 32, background: 'linear-gradient(180deg,#F0F9FF,#F8FAFC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Confetti show={pct >= 70} />
        <div style={{ background: '#fff', borderRadius: 28, padding: 32, maxWidth: 480, width: '100%', boxShadow: THEME.shadow, textAlign: 'center' as const }}>
          <div style={{ fontSize: 72, marginBottom: 12 }}>{pct >= 80 ? '🥇' : pct >= 60 ? '🥈' : '🥉'}</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#1E293B', margin: '0 0 8px' }}>{msg}</h2>
          <p style={{ color: '#64748B', fontSize: 18, margin: '0 0 24px' }}>{score}/{rounds.length} bonnes réponses</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => dicIdx !== null ? startWarm(dicIdx) : startSpecial()} style={{ flex: 1, padding: 16, borderRadius: 20, background: '#4F46E5', color: '#fff', border: 'none', fontWeight: 800, fontSize: 17, cursor: 'pointer' }}>🔄 Rejouer</button>
            <button onClick={() => setScreen('home')} style={{ flex: 1, padding: 16, borderRadius: 20, background: '#64748B', color: '#fff', border: 'none', fontWeight: 800, fontSize: 17, cursor: 'pointer' }}>🏠 Menu</button>
          </div>
        </div>
      </div>
    );
  }

  // ── WARMUP ────────────────────────────────────────────────────────────────
  if (screen === 'warmup' && dicIdx !== null)
    return <WarmUp mots={DICTEES[dicIdx].mots} onDone={() => startGame(dicIdx)} />;

  // ── GAME ──────────────────────────────────────────────────────────────────
  const round = rounds[ridx]; if (!round) return null;
  const color = COLORS[round.type as GameType] || '#64748B';
  return (
    <div style={{ minHeight: '100vh', padding: '24px 16px', background: 'linear-gradient(180deg,#F0F9FF,#F8FAFC)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Confetti show={confetti} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 540, marginBottom: 16 }}>
        <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>← Menu</button>
        <span style={{ padding: '8px 16px', background: color, color: '#fff', borderRadius: 20, fontSize: 14, fontWeight: 800 }}>{LABELS[round.type as GameType]}</span>
        <span style={{ fontWeight: 800, color: '#334155', fontSize: 18 }}>⭐ {score}</span>
      </div>
      <div style={{ width: '100%', maxWidth: 540, marginBottom: 16 }}>
        <div style={{ height: 12, background: '#E2E8F0', borderRadius: 8 }}>
          <div style={{ height: '100%', background: color, borderRadius: 8, width: `${(ridx / rounds.length) * 100}%`, transition: 'width .3s' }} />
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 28, padding: 28, maxWidth: 540, width: '100%', boxShadow: THEME.shadow }}>
        {round.type === 'mirror'  && <GameMirror  key={`m${key}`} word={(round as any).word}            onDone={onDone} />}
        {round.type === 'anagram' && <GameAnagram key={`a${key}`} word={(round as any).word}            onDone={onDone} />}
        {round.type === 'blank'   && <GameBlank   key={`b${key}`} phrase={(round as any).phrase} mots={(round as any).mots} onDone={onDone} />}
        {round.type === 'tile'    && <GameTile    key={`t${key}`} phrase={(round as any).phrase}        onDone={onDone} />}
        {round.type === 'qcm'     && <GameQCM     key={`q${key}`} data={(round as any).data}            onDone={onDone} />}
      </div>
    </div>
  );
}