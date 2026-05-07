set -e
#!/bin/bash
set -e

# ── src/types/index.ts ─────────────────────────────────────────────────
mkdir -p src/types src/utils src/data src/components
cat > src/types/index.ts << 'EOF'
export type LetterItem = { l: string; id: number; used: boolean };
export type WordItem = { w: string; id: number; used: boolean };
export type Dictée = { id: number; mots: string[]; phrases: string[] };
export type QCMItem = { s: string; a: string; o: string[]; tip: string };
export type Round = 
  | { type: 'mirror' | 'anagram'; word: string }
  | { type: 'blank' | 'tile'; phrase: string; mots: string[] }
  | { type: 'qcm';  QCMItem };
export type ErrorCounts = Record<string, number>;
export type Completed = Record<number, number>;
export type Screen = 'home' | 'warmup' | 'game' | 'result' | 'parent';
export type GameType = 'mirror' | 'anagram' | 'blank' | 'tile' | 'qcm';
EOF

# ── src/utils/storage.ts ──────────────────────────────────────────────
cat > src/utils/storage.ts << 'EOF'
const KEY_ERR = 'zoe-errors';
const KEY_STATS = 'zoe-parent-stats';
const KEY_PROGRESS = 'zoe-progress';
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
  },
  set(key: string, val: any): void {
    if (typeof window !== 'undefined') try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }
};
export const getErrors = () => storage.get<ErrorCounts>(KEY_ERR).then(r => r || {});
export const saveErrors = (c: ErrorCounts) => storage.set(KEY_ERR, c);
export const getProgress = () => storage.get<Completed>(KEY_PROGRESS).then(r => r || {});
export const saveProgress = (c: Completed) => storage.set(KEY_PROGRESS, c);
export const getParentStats = () => storage.get<any>(KEY_STATS).then(r => r || { sessions: 0, total: 0, correct: 0, lastDate: '' });
export const saveParentStats = (s: any) => storage.set(KEY_STATS, s);
export const resetAll = () => { [KEY_ERR, KEY_STATS, KEY_PROGRESS].forEach(k => localStorage.removeItem(k)); window.location.reload(); };
EOF

# ── src/utils/speech.ts ───────────────────────────────────────────────
cat > src/utils/speech.ts << 'EOF'
let voicesReady = false;
function ensure() { if (!window.speechSynthesis || voicesReady) return; window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => { voicesReady = true; }; }
export const getVoice = () => { ensure(); const v = window.speechSynthesis?.getVoices() || []; return v.find(x => x.lang.includes('fr') && /Amélie|Audrey|Julie|Marie/i.test(x.name)) || v.find(x => x.lang.includes('fr')) || null; };
export const speak = (t: string, r = 0.6) => { if (typeof window === 'undefined') return; window.speechSynthesis.cancel(); setTimeout(() => { try { const u = new SpeechSynthesisUtterance(t); u.lang = 'fr-FR'; u.rate = r; u.pitch = 1.1; const v = getVoice(); if (v) u.voice = v; window.speechSynthesis.speak(u); } catch {} }, 100); };
EOF

# ── src/utils/helpers.ts ──────────────────────────────────────────────
cat > src/utils/helpers.ts << 'EOF'
export const strip = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export const norm = (w: string) => strip(w.toLowerCase().replace(/[.,!?;:"'«»()\-''']/g, '').trim());
export const shuffle = <T>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const pick = <T>(a: T[]) => a[Math.floor(Math.random() * a.length)];
EOF

# ── src/data/content.ts ───────────────────────────────────────────────
cat > src/data/content.ts << 'EOF'
import type { Dictée, QCMItem, GameType } from '../types';
export const DICTEES: Dictée[] = [
  {id:1, mots:["Mira","vélo","robe","rouge","soleil","moto","purée","chien"], phrases:["Mira a une robe rouge.","Le chien est sur le vélo.","Le soleil brille sur la moto.","Mira mange de la purée."]},
  {id:2, mots:["maman","Véro","tomate","tarte","télé","bébé","salade","robot"], phrases:["Maman a préparé une tarte.","Véro mange des tomates.","Le bébé regarde la télé.","Le robot mange de la salade."]},
  {id:3, mots:["Rémi","polo","chat","rat","hibou","lit"], phrases:["Rémi est poli.","C'est un chat.","Le hibou est sur le lit.","Le rat porte un polo."]},
  {id:4, mots:["Amélie","tulipe","lavabo","biberon","forêt"], phrases:["Amélie est malade.","Le bébé boit dans un biberon.","Il y a une tulipe dans la forêt.","Amélie lave le lavabo."]},
  {id:5, mots:["Rita","mémé","Pamela","jupe","fille","garçon","parachute","pile"], phrases:["Rita va chez sa mémé.","Pamela a lavé sa jupe.","Il a vu une fille et un garçon.","Le garçon a une pile pour le parachute."]},
  {id:6, mots:["Sacha","moto","Titi","canari","chou","fille","garçon","faratas"], phrases:["Sacha a acheté une moto verte.","Titi a un petit canari.","Une fille et un garçon mangent du chou.","Sacha prépare des faratas."]},
  {id:7, mots:["chien","chat","poule","roupie","tapis","cahier","crayon","table"], phrases:["La roupie est sur le tapis.","Il y a un cahier et un crayon sous la table.","Le chien et le chat jouent.","La poule est sur le tapis."]},
  {id:8, mots:["Sacha","Lara","maman","olive","four","rêve"], phrases:["Sacha a fait un rêve.","Lara joue avec maman.","Maman cuit les olives au four.","Lara a fait un beau rêve."]},
  {id:9, mots:["Papa","coq","Sami","canard","locomotive","nuit","soleil","robe"], phrases:["Papa voit un canard et un coq.","La locomotive roule la nuit.","Sami porte une belle robe.","Le soleil brille sur la locomotive."]},
  {id:10, mots:["Papi","salade","patate","nuit"], phrases:["Papi a salé la salade.","Il fait nuit.","La patate est dans la salade de Papi.","Papi mange la nuit."]},
  {id:11, mots:["Lili","Méli","banane","nuage","cheval","jus","lit"], phrases:["Lili est sur le lit.","Méli mange une banane.","Un nuage bleu est dans le ciel.","Le cheval de Méli boit un jus."]},
  {id:12, mots:["Mica","pilote","pomelo","fête","farine","samedi","jeudi"], phrases:["Mica a fait une fête samedi.","Le pilote mange un pomelo.","La farine est sur la table.","Jeudi, Mica prépare un gâteau avec de la farine."]},
  {id:13, mots:["Sacha","Léa","gâteau","dragon","séga","mercredi","vendredi","dimanche"], phrases:["Sacha mange un gâteau le dimanche.","Léa danse le séga le vendredi.","Un dragon est sous le lit.","Mercredi, Léa et Sacha font la fête."]},
  {id:14, mots:["Nora","Nicolas","canapé","légumes","joli"], phrases:["Nora mange des légumes.","Nicolas est joli.","Nora et Nicolas sont sur le canapé.","Les légumes de Nora sont jolis."]},
  {id:15, mots:["Mina","Marou","chiens","chou","dragon","route"], phrases:["J'aime les chiens.","Mina coupe un chou pour Marou.","Le dragon est sur la route.","Marou et Mina aiment les chiens."]},
];
export const QCM_POOL: QCMItem[] = [
  {s:"Mira ___ une robe rouge.", a:"a", o:["a","à","as"], tip:"'a' vient du verbe avoir"},
  {s:"Maman ___ préparé une tarte.", a:"a", o:["a","à","as"], tip:"'a' vient du verbe avoir"},
  {s:"Il boit ___ lait.", a:"du", o:["du","de","des"], tip:"du = de + le"},
  {s:"Papi ___ salé la salade.", a:"a", o:["a","à","as"], tip:"'a' vient du verbe avoir"},
  {s:"Rita va ___ pied.", a:"à", o:["a","à","as"], tip:"'à' indique la direction"},
  {s:"Le bébé va ___ l'école.", a:"à", o:["a","à","as"], tip:"'à' indique la direction"},
  {s:"Pamela ___ lavé sa jupe.", a:"a", o:["a","à","as"], tip:"'a' vient du verbe avoir"},
  {s:"Le chat ___ le chien jouent.", a:"et", o:["et","est","ai"], tip:"'et' relie deux mots"},
  {s:"Le hibou ___ sur le lit.", a:"est", o:["et","est","ai"], tip:"'est' vient du verbe être"},
  {s:"___ cartable est lourd.", a:"Son", o:["Son","Sa","Ses"], tip:"cartable = masculin → son"},
  {s:"___ jupe est belle.", a:"Sa", o:["Son","Sa","Ses"], tip:"jupe = féminin → sa"},
  {s:"Mica ___ fait une fête.", a:"a", o:["a","à","as"], tip:"'a' vient du verbe avoir"},
  {s:"Lili est ___ le lit.", a:"sur", o:["sur","sous","dans"], tip:""},
  {s:"Le chien est ___ le vélo.", a:"sur", o:["sur","sous","dans"], tip:""},
  {s:"Il y a un crayon ___ la table.", a:"sous", o:["sur","sous","dans"], tip:""},
];
export const GT: Record<string, GameType> = { MIRROR:'mirror', ANAGRAM:'anagram', BLANK:'blank', TILE:'tile', QCM:'qcm' };
export const LABELS: Record<GameType, string> = { mirror:'👀 Mot Miroir', anagram:'🔤 Lettres', blank:'📝 Mot Manquant', tile:'🧩 Phrase', qcm:'❓ Bon Mot' };
export const COLORS: Record<GameType, string> = { mirror:'#4F46E5', anagram:'#7C3AED', blank:'#EA580C', tile:'#059669', qcm:'#C2410C' };
export const CONFETTI = ['#94A3B8','#CBD5E1','#93C5FD','#86EFAC','#FDE68A','#FCA5A5','#F0ABFC','#BFDBFE'];
export const ROUNDS = 10;
EOF

# ── src/components/Confetti.tsx ───────────────────────────────────────
cat > src/components/Confetti.tsx << 'EOF'
import { useRef } from 'react';
import { CONFETTI } from '../data/content';
export function Confetti({ show }: { show: boolean }) {
  const ref = useRef<any[]>([]);
  if (ref.current.length === 0) {
    ref.current = Array.from({ length: 36 }).map((_, i) => ({
      id: i, left: Math.random() * 100, color: CONFETTI[Math.floor(Math.random() * CONFETTI.length)],
      delay: Math.random() * 0.4, duration: 0.9 + Math.random() * 0.7, size: 9 + Math.random() * 9, shape: Math.random() > 0.5 ? '50%' : '3px'
    }));
  }
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {ref.current.map(p => (
        <div key={p.id} style={{ position: 'absolute', left: \`\${p.left}%\`, top: -20, width: p.size, height: p.size, background: p.color, borderRadius: p.shape, animation: \`confetti \${p.duration}s \${p.delay}s ease-in forwards\` }} />
      ))}
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)', fontSize: 80, animation: 'pop 0.6s ease-out' }}>🌟</div>
    </div>
  );
}
EOF

# ── src/components/LetterDiff.tsx ─────────────────────────────────────
cat > src/components/LetterDiff.tsx << 'EOF'
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
            <div style={{ width: 38, height: 38, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ok ? '#ECFDF5' : '#FEF2F2', border: \`2px solid \${ok ? '#86EFAC' : '#FCA5A5'}\`, fontSize: 20, fontWeight: 900, color: ok ? '#059669' : '#DC2626' }}>{typ[i] || '_'}</div>
            <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{exp[i] || ''}</div>
          </div>
        );
      })}
    </div>
  );
}
EOF

# ── src/components/WarmUp.tsx ─────────────────────────────────────────
cat > src/components/WarmUp.tsx << 'EOF'
import { useState, useEffect, useRef } from 'react';
import { speak } from '../utils/speech';
export function WarmUp({ mots, onDone }: { mots: string[]; onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => { speak(mots[0], 0.6); }, []);
  useEffect(() => {
    if (done) return;
    timer.current = window.setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        const n = idx + 1;
        if (n >= mots.length) { setDone(true); return; }
        setIdx(n); setVisible(true); speak(mots[n], 0.6);
      }, 250);
    }, 2500);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [idx, done]);
  if (done) return (
    <div style={{ fontFamily: 'system-ui', minHeight: '100vh', background: 'linear-gradient(135deg,#FEF3C7,#ECFDF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 32, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🔥</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1E293B', margin: '0 0 12px' }}>Prêt(e) !</h2>
        <p style={{ color: '#64748B', fontSize: 16, marginBottom: 24 }}>Tu connais déjà tous les mots. C'est parti pour les jeux !</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
          {mots.map(m => <span key={m} style={{ padding: '6px 12px', background: '#ECFDF5', borderRadius: 16, fontWeight: 700, color: '#059669' }}>{m}</span>)}
        </div>
        <button onClick={onDone} style={{ width: '100%', padding: 16, borderRadius: 16, background: '#4F46E5', color: '#fff', border: 'none', fontWeight: 900, fontSize: 20, cursor: 'pointer' }}>🎮 Jouer !</button>
      </div>
    </div>
  );
  const pct = Math.round(((idx + 1) / mots.length) * 100);
  return (
    <div style={{ fontFamily: 'system-ui', minHeight: '100vh', background: 'linear-gradient(135deg,#FEF3C7,#ECFDF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 32, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, marginBottom: 24 }}>
          <div style={{ height: '100%', background: '#388E3C', borderRadius: 4, width: \`\${pct}%\`, transition: 'width 0.3s' }} />
        </div>
        <p style={{ color: '#64748B', fontWeight: 700, marginBottom: 20, fontSize: 16 }}>👂 Écoute et regarde !</p>
        <div style={{ minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#1E293B', padding: '16px 32px', background: '#F1F5F9', borderRadius: 20, border: '3px solid #CBD5E1' }}>{mots[idx]}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          <button onClick={() => speak(mots[idx], 0.5)} style={{ flex: 1, padding: 14, borderRadius: 14, border: '2px dashed #94A3B8', background: 'transparent', color: '#4F46E5', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>🔊 Réécouter</button>
          <button onClick={() => setVisible(false)} style={{ flex: 2, padding: 14, borderRadius: 14, background: '#4F46E5', color: '#fff', border: 'none', fontWeight: 900, fontSize: 18, cursor: 'pointer' }}>{idx < mots.length - 1 ? 'Suivant →' : 'Voir la fin'}</button>
        </div>
      </div>
    </div>
  );
}
EOF

# ── src/components/GameMirror.tsx (version courte) ────────────────────
cat > src/components/GameMirror.tsx << 'EOF'
import { useState, useEffect } from 'react';
import { norm } from '../utils/helpers';
import { speak } from '../utils/speech';
import { LetterDiff } from './LetterDiff';
type Props = { word: string; onDone: (ok: boolean, w: string) => void };
export function GameMirror({ word, onDone }: Props) {
  const [phase, setPhase] = useState<'show'|'type'>('show');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<boolean|null>(null);
  const [attempts, setAttempts] = useState(0);
  useEffect(() => { speak(word, 0.55); const t = setTimeout(() => setPhase('type'), 2200); return () => clearTimeout(t); }, [word]);
  const check = () => { if (!input.trim()) return; const ok = norm(input) === norm(word); const na = attempts + 1; setAttempts(na); setResult(ok); if (ok) setTimeout(() => onDone(true, word), 1400); else if (na >= 2) setTimeout(() => onDone(false, word), 2200); };
  if (phase === 'show') return (<div style={{ textAlign: 'center', padding: '40px 16px' }}><p style={{ color: '#64748B', fontWeight: 700, marginBottom: 20 }}>👀 Regarde bien ce mot !</p><div style={{ fontSize: 56, fontWeight: 900, color: '#4F46E5', marginBottom: 16 }}>{word}</div></div>);
  return (<div style={{ padding: '10px 0' }}>{result === null && (<><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && input.trim() && check()} autoFocus placeholder="Tape le mot…" style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #94A3B8', fontSize: 26, textAlign: 'center', marginBottom: 12 }} /><button onClick={() => speak(word, 0.45)} style={{ marginRight: 8 }}>🔊</button><button onClick={check} disabled={!input.trim()}>✅ Vérifier</button></>)}{result === true && <div style={{ textAlign: 'center', fontSize: 32 }}>🎉 Bravo !</div>}{result === false && attempts < 2 && (<><LetterDiff expected={word} typed={input} /><button onClick={() => { setInput(''); setResult(null); speak(word, 0.55); }}>🔄 Réessayer</button></>)}</div>);
}
EOF

# ── src/components/GameAnagram.tsx (version courte) ───────────────────
cat > src/components/GameAnagram.tsx << 'EOF'
import { useState, useEffect } from 'react';
import { norm, shuffle } from '../utils/helpers';
import { speak } from '../utils/speech';
type Letter = { l: string; id: number; used: boolean };
type Props = { word: string; onDone: (ok: boolean, w: string) => void };
export function GameAnagram({ word, onDone }: Props) {
  const makePool = (w: string): Letter[] => shuffle(w.split("")).map((l, i) => ({ l, id: i, used: false }));
  const [pool, setPool] = useState<Letter[]>(() => makePool(word));
  const [selected, setSelected] = useState<Letter[]>([]);
  const [result, setResult] = useState<boolean|null>(null);
  const [attempts, setAttempts] = useState(0);
  useEffect(() => { speak(word, 0.55); }, [word]);
  const pick = (item: Letter) => { if (item.used || result) return; setPool(p => p.map(x => x.id === item.id ? { ...x, used: true } : x)); setSelected(s => [...s, item]); };
  const remove = (idx: number) => { const item = selected[idx]; setPool(p => p.map(x => x.id === item.id ? { ...x, used: false } : x)); setSelected(s => s.filter((_, i) => i !== idx)); };
  const check = () => { const built = selected.map(x => x.l).join(""); const ok = norm(built) === norm(word); const na = attempts + 1; setAttempts(na); setResult(ok); if (ok) setTimeout(() => onDone(true, word), 1400); else if (na >= 3) setTimeout(() => onDone(false, word), 2000); else { setSelected([]); setResult(null); setPool(makePool(word)); } };
  return (<div style={{ padding: '10px 0', textAlign: 'center' }}><p style={{ marginBottom: 12 }}>🔤 Remets les lettres dans l'ordre !</p><div style={{ minHeight: 50, display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>{selected.map((item, i) => (<button key={i} onClick={() => remove(i)} style={{ width: 40, height: 40, borderRadius: 8, background: '#7C3AED', color: '#fff', border: 'none', fontSize: 18 }}>{item.l}</button>))}</div><div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>{pool.map(item => (<button key={item.id} onClick={() => pick(item)} disabled={item.used} style={{ width: 44, height: 44, borderRadius: 10, fontSize: 20, background: item.used ? '#E2E8F0' : '#F1F5F9', border: \`2px solid \${item.used ? '#CBD5E1' : '#A5B4FC'}\`, cursor: item.used ? 'default' : 'pointer' }}>{item.used ? '' : item.l}</button>))}</div>{result === true && <div style={{ fontSize: 32, marginTop: 12 }}>🎉 Bravo !</div>}{result === false && <div style={{ color: '#DC2626', marginTop: 8 }}>Presque !</div>}{result === null && <button onClick={check} disabled={selected.length !== word.length} style={{ marginTop: 12, padding: '10px 24px', background: selected.length === word.length ? '#7C3AED' : '#E2E8F0', color: '#fff', border: 'none', borderRadius: 10 }}>✅ Vérifier</button>}</div>);
}
EOF

# ── src/components/GameBlank.tsx (version courte) ─────────────────────
cat > src/components/GameBlank.tsx << 'EOF'
import { useState, useEffect } from 'react';
import { norm, shuffle, pick } from '../utils/helpers';
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
  return (<div style={{ padding: '10px 0', textAlign: 'center' }}><p style={{ marginBottom: 16 }}>📝 Quel mot manque ?</p><div style={{ fontSize: 18, fontWeight: 700, padding: '14px', background: '#FEF3C7', borderRadius: 12, marginBottom: 20 }}>{parts[0]}<span style={{ borderBottom: \`3px solid \${result === null ? '#F59E0B' : result ? '#059669' : '#DC2626'}\`, padding: '0 8px', fontWeight: 900 }}>{selected || ''}</span>{parts[1]||''}</div><div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>{options.map(opt => { const isSel = opt === selected; const isCorr = norm(opt) === norm(target); return (<button key={opt} onClick={() => select(opt)} style={{ padding: '12px 20px', borderRadius: 12, border: \`2px solid \${result && isCorr ? '#059669' : result && isSel ? '#DC2626' : '#CBD5E1'}\`, background: result && isCorr ? '#ECFDF5' : result && isSel ? '#FEF2F2' : '#fff', color: result && isCorr ? '#059669' : result && isSel ? '#DC2626' : '#334155', fontWeight: 700, cursor: result ? 'default' : 'pointer' }}>{opt}</button>); })}</div></div>);
}
EOF

# ── src/components/GameTile.tsx (version courte) ──────────────────────
cat > src/components/GameTile.tsx << 'EOF'
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
  return (<div style={{ padding: '10px 0', textAlign: 'center' }}><p style={{ marginBottom: 16 }}>🧩 Remets les mots dans l'ordre !</p><div style={{ minHeight: 45, padding: 10, background: '#ECFDF5', borderRadius: 12, marginBottom: 16, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>{built.map((item, i) => (<button key={i} onClick={() => remove(i)} style={{ padding: '6px 12px', borderRadius: 8, background: '#059669', color: '#fff', border: 'none', fontWeight: 700 }}>{item.w}</button>))}</div><div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>{pool.map(item => (<button key={item.id} onClick={() => pick(item)} disabled={item.used} style={{ padding: '8px 14px', borderRadius: 10, background: item.used ? '#E2E8F0' : '#F1F5F9', border: \`2px solid \${item.used ? '#CBD5E1' : '#86EFAC'}\`, cursor: item.used ? 'default' : 'pointer' }}>{item.used ? '' : item.w}</button>))}</div>{result === true && <div style={{ fontSize: 28, marginTop: 12 }}>🎉 Parfait !</div>}{result === false && <div style={{ color: '#DC2626', marginTop: 8 }}>{attempts >= 2 ? \`La phrase : \${phrase}\` : 'Presque !'}</div>}{result === null && <button onClick={check} disabled={built.length !== words.length} style={{ marginTop: 12, padding: '10px 24px', background: built.length === words.length ? '#059669' : '#E2E8F0', color: '#fff', border: 'none', borderRadius: 10 }}>✅ Vérifier</button>}</div>);
}
EOF

# ── src/components/GameQCM.tsx (version courte) ───────────────────────
cat > src/components/GameQCM.tsx << 'EOF'
import { useState, useEffect } from 'react';
import { speak } from '../utils/speech';
import type { QCMItem } from '../types';
type Props = {  QCMItem; onDone: (ok: boolean, w: string) => void };
export function GameQCM({ data, onDone }: Props) {
  const [selected, setSelected] = useState<string|null>(null);
  const [result, setResult] = useState<boolean|null>(null);
  useEffect(() => { speak(data.s.replace("___", data.a), 0.55); }, [data]);
  const select = (opt: string) => { if (result) return; setSelected(opt); const ok = opt === data.a; setResult(ok); setTimeout(() => onDone(ok, data.a), 1600); };
  const parts = data.s.split("___");
  return (<div style={{ padding: '10px 0', textAlign: 'center' }}><p style={{ marginBottom: 20 }}>❓ Choisis le bon mot !</p><div style={{ fontSize: 18, fontWeight: 700, padding: '16px', background: '#FEF2F2', borderRadius: 14, marginBottom: 24 }}>{parts[0]}<span style={{ borderBottom: \`3px solid \${result ? (selected === data.a ? '#059669' : '#DC2626') : '#C2410C'}\`, padding: '0 8px', fontWeight: 900 }}>{selected || '___'}</span>{parts[1]||''}</div><div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>{data.o.map(opt => { const isSel = opt === selected; const isCorr = opt === data.a; return (<button key={opt} onClick={() => select(opt)} style={{ padding: '14px 24px', borderRadius: 14, border: \`3px solid \${result && isCorr ? '#059669' : result && isSel ? '#DC2626' : '#FCA5A5'}\`, background: result && isCorr ? '#ECFDF5' : result && isSel ? '#FEF2F2' : '#fff', color: result && isCorr ? '#059669' : result && isSel ? '#DC2626' : '#334155', fontWeight: 900, fontSize: 18, cursor: result ? 'default' : 'pointer' }}>{opt}</button>); })}</div>{result && data.tip && <div style={{ marginTop: 16, padding: '10px', background: '#FEF3C7', borderRadius: 10, color: '#92400E' }}>💡 {data.tip}</div>}</div>);
}
EOF

# ── src/main.tsx ──────────────────────────────────────────────────────
cat > src/main.tsx << 'EOF'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
EOF

# ── src/App.tsx (version finale CE2 + parent mode) ────────────────────
cat > src/App.tsx << 'APPEOF'
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
    if (t === 'qcm') { out.push({ type: 'qcm',  q[qi++ % q.length] }); }
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
  return pat.slice(0,8).map((t,i) => t === 'qcm' ? { type: 'qcm',  q[i%q.length] } : { type: t, word: words[i%words.length] });
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
  const clicks = useRef(0);

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

  const titleClick = () => { clicks.current++; if(clicks.current>=3){ setParentMode(true); clicks.current=0; } setTimeout(()=>clicks.current=0, 600); };

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
          {DICTEES.map(d=>{ const p=completed[d.id]||0; return <div key={d.id} style={{ padding:12, background:p? '#F0FDF4':'#F8FAFC', borderRadius:14, textAlign:'center', border:\`2px solid \${p? '#86EFAC':'#E2E8F0'}\` }}><div style={{ fontSize:16, fontWeight:700 }}>Dictée {d.id}</div><div style={{ fontSize:14, color:'#059669' }}>{p?'⭐'.repeat(Math.round(p/33.3)):'Non fait'}</div></div>; })}
        </div>
        <button onClick={()=>{ if(confirm('Réinitialiser tous les progrès ?')) resetAll(); }} style={{ width:'100%', marginTop:24, padding:14, background:'#EF4444', color:'#fff', border:'none', borderRadius:14, fontWeight:700, fontSize:16 }}>🗑️ Réinitialiser tout</button>
      </div>
    </div>
  );

  if(screen==='home') return (
    <div style={{ minHeight:'100vh', padding:'32px 16px', background:'linear-gradient(180deg,#F0F9FF,#F8FAFC)' }}>
      <div style={{ maxWidth:560, margin:'0 auto', textAlign:'center' }}>
        <div onClick={titleClick} style={{ cursor:'default' }}><div style={{ fontSize:48, marginBottom:8 }}>📚✨</div></div>
        <h1 style={{ fontSize:32, fontWeight:900, color:'#1E293B', margin:'0 0 8px' }}>Les dictées de Zoé</h1>
        <p style={{ color:'#64748B', fontSize:16, margin:'0 0 24px' }}>Choisis ta dictée et joue à ton rythme 🌿</p>
        {Object.keys(errCnt).length>0 && <button onClick={startSpecial} style={{ width:'100%', padding:16, marginBottom:20, borderRadius:20, background:'linear-gradient(135deg,#F59E0B,#D97706)', color:'#fff', border:'none', fontWeight:800, fontSize:18, boxShadow:'0 4px 14px rgba(217,119,6,0.3)' }}>🌟 Entraînement spécial</button>}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:14 }}>
          {DICTEES.map(d=>{
            const p=completed[d.id]; const stars=p? Math.min(3,Math.round(p/34)) : 0;
            return <button key={d.id} onClick={()=>startWarm(d.id-1)} style={{ padding:20, borderRadius:24, border:\`3px solid \${stars?'#FCD34D':'#E2E8F0'}\`, background:stars?'#FEF3C7':'#fff', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, boxShadow:THEME.shadow }}>
              <span style={{ fontSize:28 }}>{stars? '⭐'.repeat(stars) : '🎮'}</span>
              <span style={{ fontWeight:800, color:'#334155', fontSize:16 }}>Dictée {d.id}</span>
            </button>;
          })}
        </div>
      </div>
    </div>
  );

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

  if(screen==='warmup' && dicIdx!==null) return <WarmUp mots={DICTEES[dicIdx].mots} onDone={()=>startGame(dicIdx)} />;

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
        <div style={{ height:12, background:'#E2E8F0', borderRadius:8 }}><div style={{ height:'100%', background:color, borderRadius:8, width:\`\${(ridx/rounds.length)*100}%\`, transition:'width .3s' }} /></div>
      </div>
      <div style={{ background:'#fff', borderRadius:28, padding:28, maxWidth:540, width:'100%', boxShadow:THEME.shadow }}>
        {round.type==='mirror' && <GameMirror key={\`m\${key}\`} word={round.word} onDone={onDone} />}
        {round.type==='anagram' && <GameAnagram key={\`a\${key}\`} word={round.word} onDone={onDone} />}
        {round.type==='blank' && <GameBlank key={\`b\${key}\`} phrase={round.phrase} mots={round.mots} onDone={onDone} />}
        {round.type==='tile' && <GameTile key={\`t\${key}\`} phrase={round.phrase} onDone={onDone} />}
        {round.type==='qcm' && <GameQCM key={\`q\${key}\`} data={round.data} onDone={onDone} />}
      </div>
    </div>
  );
}
APPEOF

# ── Rendre le script exécutable et le lancer ───────────────────────────
chmod +x setup-zoe.sh
echo "✅ Fichiers générés ! Maintenant installe les dépendances et lance :"
echo "   npm install"
echo "   npm run dev"
