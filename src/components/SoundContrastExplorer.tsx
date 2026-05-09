// src/components/SoundContrastExplorer.tsx
// Module Montessori — Explorateur de Contrastes Phonémiques FR/EN
// Sons : CH · OU · AN · N · G · ON · OM
// Pédagogie : Orton-Gillingham + Montessori (AMS 2023) + IDA (2021)
// Zéro dépendance externe — compatible avec l'architecture existante

import { useState, useRef, useEffect, useCallback } from 'react';
import { speak } from '../utils/speech';
import { storage } from '../utils/storage';

// ─── Types locaux ─────────────────────────────────────────────────────────────
type Phase = 'listen' | 'trace' | 'sort' | 'acknowledge';
type Lang  = 'fr' | 'en';

interface LangData {
  flag: string;
  word: string;
  phoneme: string;
  hint: string;
  langCode: 'fr-FR' | 'en-US';
  color: string;
  feedbackOk: string;
}

interface SoundData {
  id: string;
  grapheme: string;
  badge: string;
  fr: LangData;
  en: LangData;
  rule: string;
  patternQ: string;
  sortWords: { fr: string[]; en: string[] };
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const FR_COLOR    = '#4a7fc1';
const EN_COLOR    = '#c14a4a';
const KEY_PHONICS = 'zoe-phonics-badges';

// ─── Données des 7 sons ───────────────────────────────────────────────────────
const SOUNDS: SoundData[] = [
  {
    id: 'ch', grapheme: 'CH', badge: '🔬 Détective CH',
    fr: { flag: '🇫🇷', word: 'CHAT',     phoneme: '/ʃ/',   hint: 'Souffle doux — comme le vent',       langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, CH = /ʃ/ — un souffle doux. La langue monte vers le palais !' },
    en: { flag: '🇬🇧', word: 'CHAIR',    phoneme: '/tʃ/',  hint: 'Pop + souffle — sens l\'air sur ta main', langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, CH = /tʃ/ — a little t-pop first, then the breath. Feel it!' },
    rule: '🇫🇷 /ʃ/ souffle seul  ·  🇬🇧 /tʃ/ pop + souffle',
    patternQ: 'Pourquoi "CH" sonne différent selon la langue ?',
    sortWords: { fr: ['CHIEN', 'VACHE', 'CHOSE'], en: ['CHAIR', 'CHAIN', 'BEACH'] },
  },
  {
    id: 'ou', grapheme: 'OU', badge: '👄 Maître OU',
    fr: { flag: '🇫🇷', word: 'LOUP',     phoneme: '/u/',   hint: 'Lèvres rondes et fixes — comme une bague', langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, OU = /u/ — lèvres très rondes et FIXES !' },
    en: { flag: '🇬🇧', word: 'CLOUD',    phoneme: '/aʊ/', hint: 'Bouche qui glisse — de "a" à "ou"',   langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, OU glides from open "ah" to round "oo". Feel your jaw move!' },
    rule: '🇫🇷 /u/ bouche ronde fixe  ·  🇬🇧 /aʊ/ bouche qui glisse',
    patternQ: 'Qu\'est-ce que ta bouche fait de différent pour chaque langue ?',
    sortWords: { fr: ['MOUTON', 'JOUER', 'ROUX'], en: ['MOUSE', 'CLOUD', 'SOUND'] },
  },
  {
    id: 'an', grapheme: 'AN', badge: '👃 Explorateur AN',
    fr: { flag: '🇫🇷', word: 'ÉLÉPHANT', phoneme: '/ɑ̃/', hint: 'Air par le nez ET la bouche — nez qui vibre !', langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, AN = /ɑ̃/ — voyelle nasale ! Mets la main sous ton nez.' },
    en: { flag: '🇬🇧', word: 'HAND',     phoneme: '/æn/', hint: 'Air par la bouche seulement, puis N',  langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, AN = oral vowel + N. No nose buzz — all through the mouth!' },
    rule: '🇫🇷 /ɑ̃/ air nasal  ·  🇬🇧 /æn/ air oral + N prononcé',
    patternQ: 'Pince ton nez et dis les deux mots. Lequel change le plus ?',
    sortWords: { fr: ['ENFANT', 'BLANC', 'TEMPS'], en: ['BAND', 'HAND', 'LAND'] },
  },
  {
    id: 'n', grapheme: 'N', badge: '🌬️ Maître N',
    fr: { flag: '🇫🇷', word: 'BON',      phoneme: '/ɔ̃/', hint: 'Le N se cache — il colore le son !',   langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, le N final est silencieux — il nasalise la voyelle : /ɔ̃/ !' },
    en: { flag: '🇬🇧', word: 'BONE',     phoneme: '/boʊn/', hint: 'Le N se prononce — langue sur les dents', langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, the final N is always said aloud. Tongue touches the ridge!' },
    rule: '🇫🇷 N final silencieux + nasalise  ·  🇬🇧 N final toujours prononcé',
    patternQ: 'Que fait le N à la fin d\'un mot en français ? Et en anglais ?',
    sortWords: { fr: ['MAISON', 'BALLON', 'CITRON'], en: ['MOON', 'SPOON', 'BUTTON'] },
  },
  {
    id: 'g', grapheme: 'G', badge: '🦒 Maître G',
    fr: { flag: '🇫🇷', word: 'GIRAFE',   phoneme: '/ʒ/',  hint: 'Son doux et continu — comme "je"',    langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, G + E/I = /ʒ/ — doux, continu, sans pop !' },
    en: { flag: '🇬🇧', word: 'GIRAFFE',  phoneme: '/dʒ/', hint: 'Pop + son doux — comme "jump"',       langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, G + E/I = /dʒ/ — a d-pop then soft sound. Like in "jump"!' },
    rule: '🇫🇷 G + e/i = /ʒ/ continu  ·  🇬🇧 G + e/i = /dʒ/ avec pop',
    patternQ: 'Qu\'est-ce qui est ajouté au début du son G en anglais ?',
    sortWords: { fr: ['GÉANT', 'MANGER', 'ROUGE'], en: ['GIANT', 'GEM', 'BRIDGE'] },
  },
  {
    id: 'on', grapheme: 'ON', badge: '🔔 Maître ON',
    fr: { flag: '🇫🇷', word: 'MAISON',   phoneme: '/ɔ̃/', hint: 'Lèvres rondes, air par le nez',        langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, ON = /ɔ̃/ — voyelle nasale ! Lèvres rondes, nez qui vibre.' },
    en: { flag: '🇬🇧', word: 'MELON',    phoneme: '/ɒn/', hint: 'Voyelle orale + N prononcé',            langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, ON = oral vowel then a clear N. No nasality — mouth only!' },
    rule: '🇫🇷 ON = /ɔ̃/ nasal  ·  🇬🇧 ON = voyelle orale + N',
    patternQ: 'Pince ton nez et dis MAISON puis MELON. Pour lequel c\'est difficile ?',
    sortWords: { fr: ['BALLON', 'BOUTON', 'SAISON'], en: ['LEMON', 'COTTON', 'MELON'] },
  },
  {
    id: 'om', grapheme: 'OM', badge: '🎭 Maître OM',
    fr: { flag: '🇫🇷', word: 'OMBRE',    phoneme: '/ɔ̃/', hint: 'Même son nasal que ON !',               langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, OM = /ɔ̃/ — même son que ON ! Le M nasalise la voyelle.' },
    en: { flag: '🇬🇧', word: 'MOM',      phoneme: '/ɒm/', hint: 'Voyelle orale + lèvres qui se ferment', langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, OM = oral vowel then lips press together for M!' },
    rule: '🇫🇷 OM = /ɔ̃/ (même son que ON)  ·  🇬🇧 OM = voyelle + M prononcé',
    patternQ: 'En français, OM et ON font-ils le même son ? Et en anglais ?',
    sortWords: { fr: ['OMBRE', 'NOMBRE', 'TOMBER'], en: ['MOM', 'BOMB', 'BOTTOM'] },
  },
];

// ─── Utilitaires ──────────────────────────────────────────────────────────────
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const haptic  = (ms = 30) => { try { navigator.vibrate?.(ms); } catch {} };

// ─── Sous-composant : Canvas de trace ────────────────────────────────────────
const THRESHOLD = 2500;

function TraceCanvas({ grapheme, color, onComplete }: { grapheme: string; color: string; onComplete: () => void }) {
  const ref  = useRef<HTMLCanvasElement>(null);
  const draw = useRef(false);
  const px   = useRef(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = color; ctx.globalAlpha = 0.85;
  }, [color]);

  const getXY = (e: React.TouchEvent | React.MouseEvent, c: HTMLCanvasElement) => {
    const r  = c.getBoundingClientRect();
    const cx = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const cy = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: cx - r.left, y: cy - r.top };
  };

  const onStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (done) return; e.preventDefault();
    const c = ref.current; const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    draw.current = true;
    const p = getXY(e, c); ctx.beginPath(); ctx.moveTo(p.x, p.y); haptic(15);
  };
  const onDraw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!draw.current || done) return; e.preventDefault();
    const c = ref.current; const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const p = getXY(e, c); ctx.lineTo(p.x, p.y); ctx.stroke();
    px.current += 12;
    const pct = Math.min(100, Math.round((px.current / THRESHOLD) * 100));
    setProgress(pct);
    if (px.current >= THRESHOLD) { setDone(true); haptic(60); }
  };
  const onEnd = () => { draw.current = false; };

  const clear = () => {
    const c = ref.current; const ctx = c?.getContext('2d');
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
    px.current = 0; setProgress(0); setDone(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>
        🖊️ Trace la lettre en disant le son à voix haute
      </p>
      <div style={{ position: 'relative', width: 240, height: 160, margin: '0 auto', borderRadius: 16, overflow: 'hidden', border: `2px solid ${color}55`, background: '#f8fafc' }}>
        {/* Lettre fantôme */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110, fontWeight: 900, color: `${color}18`, userSelect: 'none', pointerEvents: 'none', fontFamily: 'Georgia,serif', lineHeight: 1 }}>
          {grapheme}
        </div>
        <canvas ref={ref} width={240} height={160}
          style={{ position: 'absolute', inset: 0, touchAction: 'none', cursor: 'crosshair' }}
          onMouseDown={onStart} onMouseMove={onDraw} onMouseUp={onEnd} onMouseLeave={onEnd}
          onTouchStart={onStart} onTouchMove={onDraw} onTouchEnd={onEnd}
        />
      </div>
      {/* Barre de progression */}
      <div style={{ width: 240, height: 6, background: '#E2E8F0', borderRadius: 100, margin: '10px auto', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: color, borderRadius: 100, transition: 'width 0.1s' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button onClick={clear} style={{ padding: '6px 14px', borderRadius: 16, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: 12, cursor: 'pointer' }}>🗑️ Effacer</button>
        {done && <button onClick={onComplete} style={{ padding: '6px 16px', borderRadius: 16, border: 'none', background: color, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>✅ Continuer</button>}
      </div>
    </div>
  );
}

// ─── Sous-composant : Jeu de tri ─────────────────────────────────────────────
function SortGame({ words, onComplete }: { words: { fr: string[]; en: string[] }; onComplete: () => void }) {
  type Item = { word: string; correct: Lang };
  const [items]    = useState<Item[]>(() => shuffle([
    ...words.fr.map(w => ({ word: w, correct: 'fr' as Lang })),
    ...words.en.map(w => ({ word: w, correct: 'en' as Lang })),
  ]));
  const [sel, setSel]       = useState<string | null>(null);
  const [asgn, setAsgn]     = useState<Record<string, Lang>>({});
  const [results, setRes]   = useState<Record<string, boolean>>({});
  const [submitted, setSub] = useState(false);

  const allDone = items.every(i => asgn[i.word] !== undefined);

  const pick   = (w: string) => { if (!submitted) setSel(p => p === w ? null : w); };
  const assign = (lang: Lang) => {
    if (!sel || submitted) return;
    setAsgn(p => ({ ...p, [sel]: lang })); setSel(null); haptic(20);
  };
  const submit = () => {
    const res: Record<string, boolean> = {};
    items.forEach(({ word, correct }) => { res[word] = asgn[word] === correct; });
    setRes(res); setSub(true);
    haptic(Object.values(res).every(Boolean) ? 80 : 30);
    setTimeout(onComplete, 1800);
  };

  return (
    <div>
      <p style={{ textAlign: 'center', fontSize: 12, color: '#64748B', marginBottom: 12 }}>
        Appuie sur un mot, puis sur le bon drapeau 👇
      </p>
      {/* Mots */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
        {items.map(({ word }) => {
          const lang   = asgn[word];
          const border = sel === word ? '#F59E0B' : lang === 'fr' ? FR_COLOR : lang === 'en' ? EN_COLOR : '#E2E8F0';
          const bg     = lang === 'fr' ? `${FR_COLOR}22` : lang === 'en' ? `${EN_COLOR}22` : '#fff';
          const icon   = submitted ? (results[word] ? ' ✅' : ' ❌') : '';
          return (
            <button key={word} onClick={() => pick(word)}
              style={{ padding: '8px 14px', borderRadius: 12, border: `2px solid ${border}`, background: bg, color: '#334155', fontWeight: 800, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s' }}>
              {word}{icon}
            </button>
          );
        })}
      </div>
      {/* Drapeaux cibles */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16 }}>
        {(['fr', 'en'] as Lang[]).map(lang => (
          <button key={lang} onClick={() => assign(lang)}
            style={{ width: 80, height: 56, borderRadius: 14, border: `2px solid ${lang === 'fr' ? FR_COLOR : EN_COLOR}`, background: sel ? (lang === 'fr' ? `${FR_COLOR}22` : `${EN_COLOR}22`) : '#f8fafc', fontSize: 28, cursor: sel ? 'pointer' : 'default', opacity: sel ? 1 : 0.5, transition: 'all 0.15s' }}>
            {lang === 'fr' ? '🇫🇷' : '🇬🇧'}
          </button>
        ))}
      </div>
      {!submitted && allDone && (
        <div style={{ textAlign: 'center' }}>
          <button onClick={submit} style={{ padding: '10px 28px', borderRadius: 20, border: 'none', background: '#4F46E5', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
            ✅ Vérifier
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Composant Principal ──────────────────────────────────────────────────────
interface Props { onBack: () => void; }

export default function SoundContrastExplorer({ onBack }: Props) {
  const [sIdx,     setSIdx]     = useState(0);
  const [phase,    setPhase]    = useState<Phase>('listen');
  const [heard,    setHeard]    = useState<Set<Lang>>(new Set());
  const [badges,   setBadges]   = useState<string[]>([]);
  const [done,     setDone]     = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);

  const sound = SOUNDS[sIdx];

  // Charger les badges sauvegardés
  useEffect(() => {
    storage.get<string[]>(KEY_PHONICS).then(b => { if (b) setBadges(b); });
  }, []);

  // Réinitialiser à chaque nouveau son
  useEffect(() => {
    setPhase('listen'); setHeard(new Set()); setFeedback(null);
  }, [sIdx]);

  const hear = useCallback((lang: Lang) => {
    const d = lang === 'fr' ? sound.fr : sound.en;
    speak(d.word.toLowerCase(), d.langCode);
    setHeard(p => new Set([...p, lang]));
    setFeedback({ text: d.feedbackOk, ok: true });
  }, [sound]);

  const nextPhase = useCallback(() => {
    setFeedback(null);
    const order: Phase[] = ['listen', 'trace', 'sort', 'acknowledge'];
    const i = order.indexOf(phase);
    if (i < order.length - 1) setPhase(order[i + 1]);
  }, [phase]);

  const acknowledge = useCallback(() => {
    haptic(80);
    const updated = [...badges, sound.badge];
    setBadges(updated);
    storage.set(KEY_PHONICS, updated);
    speak('Bravo', 'fr-FR');
    setTimeout(() => {
      if (sIdx + 1 < SOUNDS.length) setSIdx(i => i + 1);
      else setDone(true);
    }, 1000);
  }, [sound, badges, sIdx]);

  // ── Écran de félicitations ──
  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#F0F9FF,#F8FAFC)', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
        <h2 style={{ color: '#1E293B', fontSize: 24, marginBottom: 8 }}>Mission accomplie !</h2>
        <p style={{ color: '#64748B', marginBottom: 24 }}>Tu as exploré tous les sons !</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
          {badges.map((b, i) => <span key={i} style={{ background: '#EDE9FE', padding: '8px 14px', borderRadius: 20, fontSize: 14, color: '#4F46E5', fontWeight: 700 }}>{b}</span>)}
        </div>
        <button onClick={onBack} style={{ padding: '12px 32px', borderRadius: 20, border: 'none', background: '#4F46E5', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>← Retour</button>
      </div>
    </div>
  );

  // ── Rendu principal ──
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#F0F9FF,#F8FAFC)', padding: '24px 16px' }}>
      <div style={{ maxWidth: 540, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button onClick={onBack} style={{ padding: '8px 16px', borderRadius: 12, background: '#E2E8F0', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#475569' }}>← Retour</button>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#7C3AED' }}>🎖️ {badges.length}/{SOUNDS.length} badges</span>
        </div>

        {/* Indicateur de progression */}
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 20 }}>
          {SOUNDS.map((s, i) => (
            <div key={s.id} style={{ height: 8, borderRadius: 100, transition: 'all 0.3s', width: i === sIdx ? 24 : 8, background: i < sIdx ? '#4F46E5' : i === sIdx ? '#8B5CF6' : '#E2E8F0' }} />
          ))}
        </div>

        {/* Graphème central */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 80, fontWeight: 900, color: '#1E293B', lineHeight: 1, fontFamily: 'Georgia,serif' }}>{sound.grapheme}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginTop: 4 }}>
            { phase === 'listen' ? 'Écoute les deux sons'
            : phase === 'trace'  ? 'Trace le graphème'
            : phase === 'sort'   ? 'Trie les mots'
            : 'Reconnais le schéma' }
          </div>
        </div>

        {/* Carte principale */}
        <div style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 6px 16px rgba(0,0,0,0.06)', marginBottom: 16 }}>

          {/* ── PHASE 1 : ÉCOUTER ── */}
          {phase === 'listen' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {(['fr', 'en'] as Lang[]).map(lang => {
                  const d = lang === 'fr' ? sound.fr : sound.en;
                  const isHeard = heard.has(lang);
                  return (
                    <div key={lang} style={{ borderRadius: 16, border: `2px solid ${isHeard ? d.color : '#E2E8F0'}`, background: isHeard ? `${d.color}10` : '#f8fafc', padding: 14, textAlign: 'center', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{d.flag}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#1E293B', letterSpacing: '0.05em', marginBottom: 4 }}>{d.word}</div>
                      <div style={{ fontSize: 12, color: d.color, fontWeight: 700, marginBottom: 6 }}>{d.phoneme}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 10, fontStyle: 'italic' }}>{d.hint}</div>
                      <button onClick={() => hear(lang)}
                        style={{ width: '100%', padding: '8px 0', borderRadius: 12, border: 'none', background: d.color, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                        🔊 Écouter
                      </button>
                    </div>
                  );
                })}
              </div>
              {heard.size >= 2 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#16A34A', fontWeight: 700, marginBottom: 10 }}>✅ Tu as entendu les deux sons !</div>
                  <button onClick={nextPhase} style={{ padding: '10px 28px', borderRadius: 20, border: 'none', background: '#4F46E5', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                    Tracer ✏️
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── PHASE 2 : TRACER ── */}
          {phase === 'trace' && (
            <TraceCanvas grapheme={sound.grapheme} color='#7C3AED' onComplete={nextPhase} />
          )}

          {/* ── PHASE 3 : TRIER ── */}
          {phase === 'sort' && (
            <SortGame words={sound.sortWords} onComplete={nextPhase} />
          )}

          {/* ── PHASE 4 : RECONNAÎTRE ── */}
          {phase === 'acknowledge' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🧠</div>
              <p style={{ fontSize: 15, color: '#334155', fontWeight: 700, marginBottom: 16 }}>{sound.patternQ}</p>
              <div style={{ background: '#F1F5F9', borderRadius: 16, padding: 16, marginBottom: 20, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#475569', marginBottom: 6 }}>📌 La règle :</div>
                <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{sound.rule}</div>
              </div>
              <button onClick={acknowledge}
                style={{ width: '100%', padding: '14px 0', borderRadius: 20, border: 'none', background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', color: '#fff', fontWeight: 900, fontSize: 16, cursor: 'pointer' }}>
                💡 Je vois le schéma ! → {sound.badge}
              </button>
            </div>
          )}
        </div>

        {/* Feedback pédagogique */}
        {feedback && (
          <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 16, padding: '12px 16px', marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#15803D', fontWeight: 600, lineHeight: 1.5 }}>{feedback.text}</p>
          </div>
        )}

        {/* Badges obtenus */}
        {badges.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {badges.map((b, i) => (
              <span key={i} style={{ background: '#EDE9FE', padding: '5px 12px', borderRadius: 20, fontSize: 12, color: '#4F46E5', fontWeight: 700 }}>{b}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}