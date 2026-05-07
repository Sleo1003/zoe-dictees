import { useState, useEffect, useRef, useCallback } from 'react';
import { Confetti } from './components/Confetti';
import { WarmUp } from './components/WarmUp';
import { GameMirror } from './components/GameMirror';
import { GameAnagram } from './components/GameAnagram';
import { GameBlank } from './components/GameBlank';
import { GameTile } from './components/GameTile';
import { GameQCM } from './components/GameQCM';
import { DICTEES, QCM_POOL, GT, LABELS, COLORS, ROUNDS } from './data/content';
import { shuffle } from './utils/helpers';
import { getErrors, saveErrors, getProgress, saveProgress, getParentStats, saveParentStats, resetAll } from './utils/storage';
import type { Dictée, Round, ErrorCounts, Completed, Screen, GameType } from './types';

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
    if (t === 'qcm') { out.push({ type: 'qcm', data: q[qi++ % q.length] }); }
    else if (t === 'blank' || t === 'tile') { out.push({ type: t, phrase: p[pi++ % p.length], mots: d.mots }); }
    else { out.push({ type: t, word: w[wi++ % w.length] }); }
  }
  return out;
}

function buildSpecial(err: ErrorCounts): Round[] {
  const words = Object.keys(err).sort((a,b) => err[b]-err[a]).slice(0,6);
  if (!words.length) return [];
  const q = shuffle(QCM_POOL);
  const pat: GameType[] = ['mirror','anagram','blank','anagram','qcm','mirror','blank','anagram'];
  return pat.slice(0,8).map((t,i) => t === 'qcm' ? { type: 'qcm', data: q[i%q.length] } : { type: t, word: words[i%words.length] });
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [dicIdx, setDicIdx] = useState<number|null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [ridx, setRidx] = useState(0);
  const [score, setScore] = useState(0);
  const [errs, setErrs] = useState<string[]>([]);
  const [errCnt, setErrCnt] = useState<ErrorCounts>({});
  const [completed, setCompleted] = useState<Completed>({});
  const [key, setKey] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [parentMode, setParentMode] = useState(false);
  const [parentData, setParentData] = useState<any>({ sessions:0, correct:0, total:0, words:{} });
  const timer = useRef<number|null>(null);

  useEffect(() => { getErrors().then(setErrCnt); getProgress().then(setCompleted); getParentStats().then(setParentData); }, []);

  const saveErr = useCallback((c:ErrorCounts) => { setErrCnt(c); saveErrors(c); }, []);
  const fire = useCallback(() => { setConfetti(true); if(timer.current)clearTimeout(timer.current); timer.current=setTimeout(()=>setConfetti(false),1500); }, []);
  useEffect(() => () => { if(timer.current)clearTimeout(timer.current); }, []);

  const startWarm = (i:number) => { setDicIdx(i); setScreen('warmup'); };
  const startGame = (i:number) => { setRounds(buildRounds(DICTEES[i])); setRidx(0); setScore(0); setErrs([]); setKey(0); setScreen('game'); };
  const startSpecial = () => { const r=buildSpecial(errCnt); if(!r.length)return; setDicIdx(null); setRounds(r); setRidx(0); setScore(0); setErrs([]); setKey(0); setScreen('game'); };

  const onDone = (ok:boolean, w:string) => {
    if(ok) fire();
    const ns = score + (ok?1:0);
    setScore(ns);
    if(!ok && w!=='phrase') {
      setErrs(p=>[...p,w]);
      saveErr({...errCnt, [w]:(errCnt[w]||0)+1});
    }
    const next = ridx+1;
    if(next >= rounds.length) {
      const pct = Math.round((ns/rounds.length)*100);
      if(dicIdx!==null) {
        setCompleted(p=>{ const n={...p}; n[DICTEES[dicIdx].id]=pct; return n; });
        saveProgress({...completed, [DICTEES[dicIdx].id]:pct});
      }
      setParentData(d=>{ const u={...d}; u.sessions++; u.total+=rounds.length; u.correct+=ns; u.lastDate=new Date().toLocaleDateString(); saveParentStats(u); return u; });
      setScreen('result');
    } else { setRidx(next); setKey(k=>k+1); }
  };

  // ── PARENT DASHBOARD ─────────────────────────────────────────────────
  if(parentMode) return (
    <div style={{ minHeight:'100vh', padding:32, background:'#F1F5F9' }}>
      <div style={{ maxWidth:600, margin:'0 auto', background:'#fff', borderRadius:24, padding:28, boxShadow:THEME.shadow }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h2 style={{ margin:0, color:'#475569' }}>👨‍👩‍👧 Tableau de bord parent</h2>
          <button onClick={()=>setParentMode(false)} style={{ background:'#E2E8F0', border:'none', borderRadius:12, padding:'8px 16px' }}>✕ Fermer</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
          <div style={{ background:'#EEF2FF', padding:16, borderRadius:16, textAlign:'center' }}><div style={{ fontSize:28, fontWeight:800, color:'#4F46E5' }}>{parentData.sessions}</div><div style={{ color:'#64748B', fontSize:14 }}>Sessions</div></div>
          <div style={{ background:'#ECFDF5', padding:16, borderRadius:16, textAlign:'center' }}><div style={{ fontSize:28, fontWeight:800, color:'#059669' }}>{parentData.total?Math.round(parentData.correct/parentData.total*100):0}%</div><div style={{ color:'#64748B', fontSize:14 }}>Réussite globale</div></div>
          <div style={{ background:'#FEF3C7', padding:16, borderRadius:16, textAlign:'center' }}><div style={{ fontSize:28, fontWeight:800, color:'#D97706' }}>{Object.keys(errCnt).length}</div><div style={{ color:'#64748B', fontSize:14 }}>Mots à revoir</div></div>
        </div>
        <h3 style={{ color:'#475569' }}>📌 Mots difficiles :</h3>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
          {Object.entries(errCnt).sort((a,b)=>b[1]-a[1]).map(([w,c])=>(<span key={w} style={{ background:'#FFF7ED', color:'#C2410C', padding:'6px 12px', borderRadius:16, fontWeight:600, fontSize:14 }}>{w} <small>({c}x)</small></span>))}
        </div>
        <h3 style={{ color:'#475569' }}>📊 Dictées terminées :</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))', gap:10 }}>
          {DICTEES.map(d=>{ const p=completed[d.id]||0; return <div key={d.id} style={{ padding:12, background:p? '#F0FDF4':'#F8FAFC', borderRadius:14, textAlign:'center', border:`2px solid ${p? '#86EFAC':'#E2E8F0'}` }}><div style={{ fontSize:16, fontWeight:700 }}>Dictée {d.id}</div><div style={{ fontSize:14, color:'#059669' }}>{p?'⭐'.repeat(Math.round(p/33.3)):'Non fait'}</div></div>; })}
        </div>
        <button onClick={()=>{ if(confirm('Réinitialiser tous les progrès ?')) resetAll(); }} style={{ width:'100%', marginTop:24, padding:14, background:'#EF4444', color:'#fff', border:'none', borderRadius:14, fontWeight:700, fontSize:16 }}>🗑️ Réinitialiser tout</button>
      </div>
    </div>
  );

  // ── HOME ─────────────────────────────────────────────────────────────
  if(screen==='home') return (
    <div style={{ minHeight:'100vh', padding:'32px 16px', background:'linear-gradient(180deg,#F0F9FF,#F8FAFC)' }}>
      <div style={{ maxWidth:560, margin:'0 auto', textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:8 }}>📚✨</div>
        <h1 style={{ fontSize:32, fontWeight:900, color:'#1E293B', margin:'0 0 8px' }}>Les dictées de Zoé</h1>
        <p style={{ color:'#64748B', fontSize:16, margin:'0 0 12px' }}>Choisis ta dictée et joue à ton rythme 🌿</p>
        
        {/* ✅ BOUTON PARENT VISIBLE */}
        <button onClick={()=>setParentMode(true)} style={{ padding:'8px 16px', borderRadius:12, background:'#E2E8F0', color:'#475569', border:'none', fontWeight:700, fontSize:14, marginBottom:20, cursor:'pointer' }}>👨‍👩‍👧 Espace Parent</button>
        
        {Object.keys(errCnt).length>0 && <button onClick={startSpecial} style={{ width:'100%', padding:16, marginBottom:20, borderRadius:20, background:'linear-gradient(135deg,#F59E0B,#D97706)', color:'#fff', border:'none', fontWeight:800, fontSize:18, boxShadow:'0 4px 14px rgba(217,119,6,0.3)' }}>🌟 Entraînement spécial</button>}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:14 }}>
          {DICTEES.map(d=>{
            const p=completed[d.id]; const stars=p? Math.min(3,Math.round(p/34)) : 0;
            return <button key={d.id} onClick={()=>startWarm(d.id-1)} style={{ padding:20, borderRadius:24, border:`3px solid ${stars?'#FCD34D':'#E2E8F0'}`, background:stars?'#FEF3C7':'#fff', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, boxShadow:THEME.shadow }}>
              <span style={{ fontSize:28 }}>{stars? '⭐'.repeat(stars) : '🎮'}</span>
              <span style={{ fontWeight:800, color:'#334155', fontSize:16 }}>Dictée {d.id}</span>
            </button>;
          })}
        </div>
      </div>
    </div>
  );

  // ── RESULT ───────────────────────────────────────────────────────────
  if(screen==='result') {
    const pct=Math.round((score/rounds.length)*100);
    const msg = pct>=90?'🎉 Superbe !' : pct>=70?'👏 Très bien !' : pct>=50?'💪 Continue !' : '🌱 Chaque essai compte !';
    return (
      <div style={{ minHeight:'100vh', padding:32, background:'linear-gradient(180deg,#F0F9FF,#F8FAFC)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Confetti show={pct>=70} />
        <div style={{ background:'#fff', borderRadius:28, padding:32, maxWidth:480, width:'100%', boxShadow:THEME.shadow, textAlign:'center' }}>
          <div style={{ fontSize:72, marginBottom:12 }}>{pct>=80?'🥇':pct>=60?'🥈':'🥉'}</div>
          <h2 style={{ fontSize:26, fontWeight:900, color:'#1E293B', margin:'0 0 8px' }}>{msg}</h2>
          <p style={{ color:'#64748B', fontSize:18, margin:'0 0 24px' }}>{score}/{rounds.length} bonnes réponses</p>
          {errs.length>0 && (<div style={{ background:'#FFF7ED', borderRadius:20, padding:16, marginBottom:24, textAlign:'left' }}><div style={{ fontWeight:700, color:'#C2410C', marginBottom:8 }}>📝 À revoir :</div><div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>{[...new Set(errs)].map(w=><span key={w} style={{ background:'#FED7AA', color:'#9A3412', padding:'6px 12px', borderRadius:16, fontWeight:600, fontSize:14 }}>{w}</span>)}</div></div>)}
          <div style={{ display:'flex', gap:12 }}>
            <button onClick={()=>screen==='game' && dicIdx!==null?startWarm(dicIdx):startSpecial()} style={{ flex:1, padding:16, borderRadius:20, background:'#4F46E5', color:'#fff', border:'none', fontWeight:800, fontSize:17 }}>🔄 Rejouer</button>
            <button onClick={()=>setScreen('home')} style={{ flex:1, padding:16, borderRadius:20, background:'#64748B', color:'#fff', border:'none', fontWeight:800, fontSize:17 }}>🏠 Accueil</button>
          </div>
        </div>
      </div>
    );
  }

  // ── WARMUP ───────────────────────────────────────────────────────────
  if(screen==='warmup' && dicIdx!==null) return <WarmUp mots={DICTEES[dicIdx].mots} onDone={()=>startGame(dicIdx)} />;

  // ── GAME ─────────────────────────────────────────────────────────────
  const round=rounds[ridx]; if(!round) return null;
  const color=COLORS[round.type]||'#64748B';
  return (
    <div style={{ minHeight:'100vh', padding:'24px 16px', background:'linear-gradient(180deg,#F0F9FF,#F8FAFC)', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <Confetti show={confetti} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', maxWidth:540, marginBottom:16 }}>
        <button onClick={()=>setScreen('home')} style={{ background:'none', border:'none', color:'#4F46E5', fontSize:16, fontWeight:700 }}>← Accueil</button>
        <span style={{ padding:'8px 16px', background:color, color:'#fff', borderRadius:20, fontSize:14, fontWeight:800 }}>{LABELS[round.type]}</span>
        <span style={{ fontWeight:800, color:'#334155', fontSize:18 }}>⭐ {score}</span>
      </div>
      <div style={{ width:'100%', maxWidth:540, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'#64748B', marginBottom:4 }}><span>Jeu {ridx+1}/{rounds.length}</span></div>
        <div style={{ height:12, background:'#E2E8F0', borderRadius:8 }}><div style={{ height:'100%', background:color, borderRadius:8, width:`${(ridx/rounds.length)*100}%`, transition:'width .3s' }} /></div>
      </div>
      <div style={{ background:'#fff', borderRadius:28, padding:28, maxWidth:540, width:'100%', boxShadow:THEME.shadow }}>
        {round.type==='mirror' && <GameMirror key={`m${key}`} word={round.word} onDone={onDone} />}
        {round.type==='anagram' && <GameAnagram key={`a${key}`} word={round.word} onDone={onDone} />}
        {round.type==='blank' && <GameBlank key={`b${key}`} phrase={round.phrase} mots={round.mots} onDone={onDone} />}
        {round.type==='tile' && <GameTile key={`t${key}`} phrase={round.phrase} onDone={onDone} />}
        {round.type==='qcm' && <GameQCM key={`q${key}`} data={round.data} onDone={onDone} />}
      </div>
    </div>
  );
}