import { useState, useEffect, useRef, useCallback } from 'react';
import { Confetti } from './Confetti';
import { WarmUp } from './WarmUp';
import { GameMirror } from './GameMirror';
import { GameAnagram } from './GameAnagram';
import { GameBlank } from './GameBlank';
import { GameTile } from './GameTile';
import { GameQCM } from './GameQCM';
import { DICTEES, QCM_POOL, GT, LABELS, COLORS, ROUNDS } from '../data/content';
import { shuffle } from '../utils/helpers';
import { getErrors, saveErrors, getProgress, saveProgress, getParentStats, saveParentStats, resetAll as _resetAll } from '../utils/storage';
import type { Dictée, Round, ErrorCounts, Completed, Screen, GameType } from '../types';

// Interface pour recevoir le bouton "Retour" du parent
interface FrenchAppProps {
  onBack: () => void;
}

const THEME = { bg: '#F8FAFC', card: '#FFFFFF', text: '#334155', textLight: '#64748B', border: '#E2E8F0', shadow: '0 6px 16px rgba(0,0,0,0.06)', radius: '20px' };

function buildRounds(d: Dictée): Round[] {
  const seq = shuffle(Object.values(GT).flatMap(t => [t, t]));
  const w = shuffle(d.mots.filter(x => x.length > 2));
  const p = shuffle(d.phrases);
  const q = shuffle(QCM_POOL);
  let wi = 0, pi = 0, qi = 0;
  const out: Round[] = [];
  for (let i = 0; i < ROUNDS; i++) {
    const t = seq[i];
    if (t === 'qcm') { out.push({ type: 'qcm', data: q[qi % q.length] }); qi++; }
    else if (t === 'blank' || t === 'tile') { out.push({ type: t, phrase: p[pi % p.length], mots: d.mots }); pi++; }
    else { out.push({ type: t, word: w[wi % w.length] }); wi++; }
  }
  return out;
}

function buildSpecial(err: ErrorCounts): Round[] {
  const words = Object.keys(err).sort((a,b) => err[b]-err[a]).slice(0,6);
  if (!words.length) return [];
  const q = shuffle(QCM_POOL);
  const pat: ('mirror' | 'anagram' | 'qcm')[] = ['mirror','anagram','mirror','anagram','qcm','mirror','anagram','qcm'];
  const out: Round[] = [];
  for (let i = 0; i < 8; i++) {
    const t = pat[i];
    if (t === 'qcm') { out.push({ type: 'qcm', data: q[i % q.length] }); }
    else { out.push({ type: t, word: words[i % words.length] } as Round); }
  }
  return out;
}

export default function FrenchApp({ onBack }: FrenchAppProps) {
  const [screen, setScreen] = useState<Screen>('home');
  const [dicIdx, setDicIdx] = useState<number|null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [ridx, setRidx] = useState(0);
  const [score, setScore] = useState(0);
  const [_errs, setErrs] = useState<string[]>([]);
  const [errCnt, setErrCnt] = useState<ErrorCounts>({});
  const [completed, setCompleted] = useState<Completed>({});
  const [key, setKey] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [parentMode, setParentMode] = useState(false);
  const [_parentData, setParentData] = useState<any>({ sessions:0, correct:0, total:0, words:{} });
  const timer = useRef<number|null>(null);

  useEffect(() => { getErrors().then(setErrCnt); getProgress().then(setCompleted); getParentStats().then(setParentData); }, []);
  const saveErr = useCallback((c: ErrorCounts) => { setErrCnt(c); saveErrors(c); }, []);
  const fire = useCallback(() => { setConfetti(true); if(timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setConfetti(false), 1500); }, []);
  useEffect(() => () => { if(timer.current) clearTimeout(timer.current); }, []);

  const startWarm = (i: number) => { setDicIdx(i); setScreen('warmup'); };
  const startGame = (i: number) => { setRounds(buildRounds(DICTEES[i])); setRidx(0); setScore(0); setErrs([]); setKey(0); setScreen('game'); };
  const startSpecial = () => { const r = buildSpecial(errCnt); if(!r.length) return; setDicIdx(null); setRounds(r); setRidx(0); setScore(0); setErrs([]); setKey(0); setScreen('game'); };

  const onDone = (ok: boolean, w: string) => {
    if(ok) fire();
    const ns = score + (ok ? 1 : 0);
    setScore(ns);
    if(!ok && w !== 'phrase') { setErrs(p => [...p, w]); saveErr({...errCnt, [w]: (errCnt[w] || 0) + 1}); }
    const next = ridx + 1;
    if(next >= rounds.length) {
      const pct = Math.round((ns / rounds.length) * 100);
      if(dicIdx !== null) { setCompleted(p => { const n = {...p}; n[DICTEES[dicIdx].id] = pct; return n; }); saveProgress({...completed, [DICTEES[dicIdx].id]: pct}); }
      setParentData((d: any) => { const u = {...d}; u.sessions++; u.total += rounds.length; u.correct += ns; u.lastDate = new Date().toLocaleDateString(); saveParentStats(u); return u; });
      setScreen('result');
    } else { setRidx(next); setKey(k => k + 1); }
  };

  if(parentMode) return (
    <div style={{ minHeight:'100vh', padding:32, background:'#F1F5F9' }}>
      <div style={{ maxWidth:600, margin:'0 auto', background:'#fff', borderRadius:24, padding:28, boxShadow:THEME.shadow }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h2 style={{ margin:0, color:'#475569' }}>‍👩‍ Tableau de bord parent</h2>
          <button onClick={()=>setParentMode(false)} style={{ background:'#E2E8F0', border:'none', borderRadius:12, padding:'8px 16px' }}>✕ Fermer</button>
        </div>
        <div style={{ textAlign:'center', color:'#64748B' }}>Stats à venir...</div>
      </div>
    </div>
  );

  if(screen === 'home') return (
    <div style={{ minHeight:'100vh', padding:'32px 16px', background:'linear-gradient(180deg,#F0F9FF,#F8FAFC)', position: 'relative' }}>
      
      {/* ✅ BOUTON RETOUR VERS LA PAGE D'ACCUEIL GÉNÉRALE */}
      <button onClick={onBack} style={{ position: 'absolute', top: 16, left: 16, padding: '8px 16px', borderRadius: 12, background: '#E2E8F0', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#475569' }}>
        ← Accueil
      </button>

      <div style={{ maxWidth:560, margin:'0 auto', textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:8 }}>✨</div>
        <h1 style={{ fontSize:32, fontWeight:900, color:'#1E293B', margin:'0 0 8px' }}>Les dictées de Zoé</h1>
        <p style={{ color:'#64748B', fontSize:16, margin:'0 0 12px' }}>Choisis ta dictée et joue à ton rythme </p>
        
        {Object.keys(errCnt).length > 0 && (<button onClick={startSpecial} style={{ width:'100%', padding:16, marginBottom:20, borderRadius:20, background:'linear-gradient(135deg,#F59E0B,#D97706)', color:'#fff', border:'none', fontWeight:800, fontSize:18 }}>🌟 Entraînement spécial</button>)}
        
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:14 }}>
          {DICTEES.map((d: Dictée) => {
            const p = completed[d.id]; const stars = p ? Math.min(3, Math.round(p/34)) : 0;
            return (<button key={d.id} onClick={()=>startWarm(d.id - 1)} style={{ padding:20, borderRadius:24, border: `3px solid ${stars ? '#FCD34D' : '#E2E8F0'}`, background: stars ? '#FEF3C7' : '#fff', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, boxShadow:THEME.shadow }}><span style={{ fontSize:28 }}>{stars ? '⭐'.repeat(stars) : '🎮'}</span><span style={{ fontWeight:800, color:'#334155', fontSize:16 }}>Dictée {d.id}</span></button>);
          })}
        </div>
      </div>
    </div>
  );

  if(screen === 'result') {
    const pct = Math.round((score / rounds.length) * 100);
    const msg = pct >= 90 ? '🎉 Superbe !' : pct >= 70 ? '👏 Très bien !' : pct >= 50 ? '💪 Continue !' : '🌱 Chaque essai compte !';
    return (
      <div style={{ minHeight:'100vh', padding:32, background:'linear-gradient(180deg,#F0F9FF,#F8FAFC)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Confetti show={pct >= 70} />
        <div style={{ background:'#fff', borderRadius:28, padding:32, maxWidth:480, width:'100%', boxShadow:THEME.shadow, textAlign:'center' }}>
          <div style={{ fontSize:72, marginBottom:12 }}>{pct >= 80 ? '🥇' : pct >= 60 ? '🥈' : '🥉'}</div>
          <h2 style={{ fontSize:26, fontWeight:900, color:'#1E293B', margin:'0 0 8px' }}>{msg}</h2>
          <p style={{ color:'#64748B', fontSize:18, margin:'0 0 24px' }}>{score}/{rounds.length} bonnes réponses</p>
          <div style={{ display:'flex', gap:12 }}>
            <button onClick={()=>dicIdx!==null?startWarm(dicIdx):startSpecial()} style={{ flex:1, padding:16, borderRadius:20, background:'#4F46E5', color:'#fff', border:'none', fontWeight:800, fontSize:17 }}>🔄 Rejouer</button>
            <button onClick={onBack} style={{ flex:1, padding:16, borderRadius:20, background:'#64748B', color:'#fff', border:'none', fontWeight:800, fontSize:17 }}>🏠 Accueil</button>
          </div>
        </div>
      </div>
    );
  }

  if(screen === 'warmup' && dicIdx !== null) return <WarmUp mots={DICTEES[dicIdx].mots} onDone={() => startGame(dicIdx)} />;

  const round = rounds[ridx]; if(!round) return null;
  const color = COLORS[round.type as GameType] || '#64748B';
  return (
    <div style={{ minHeight:'100vh', padding:'24px 16px', background:'linear-gradient(180deg,#F0F9FF,#F8FAFC)', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <Confetti show={confetti} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', maxWidth:540, marginBottom:16 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:'#4F46E5', fontSize:16, fontWeight:700 }}>← Accueil</button>
        <span style={{ padding:'8px 16px', background:color, color:'#fff', borderRadius:20, fontSize:14, fontWeight:800 }}>{LABELS[round.type as GameType]}</span>
        <span style={{ fontWeight:800, color:'#334155', fontSize:18 }}>⭐ {score}</span>
      </div>
      <div style={{ width:'100%', maxWidth:540, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'#64748B', marginBottom:4 }}><span>Jeu {ridx+1}/{rounds.length}</span></div>
        <div style={{ height:12, background:'#E2E8F0', borderRadius:8 }}><div style={{ height:'100%', background:color, borderRadius:8, width: `${(ridx/rounds.length)*100}%`, transition:'width .3s' }} /></div>
      </div>
      <div style={{ background:'#fff', borderRadius:28, padding:28, maxWidth:540, width:'100%', boxShadow:THEME.shadow }}>
        {round.type === 'mirror' && <GameMirror key={`m${key}`} word={round.word} onDone={onDone} />}
        {round.type === 'anagram' && <GameAnagram key={`a${key}`} word={round.word} onDone={onDone} />}
        {round.type === 'blank' && <GameBlank key={`b${key}`} phrase={round.phrase} mots={round.mots} onDone={onDone} />}
        {round.type === 'tile' && <GameTile key={`t${key}`} phrase={round.phrase} onDone={onDone} />}
        {round.type === 'qcm' && <GameQCM key={`q${key}`} data={round.data} onDone={onDone} />}
      </div>
    </div>
  );
}