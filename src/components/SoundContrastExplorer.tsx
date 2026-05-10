// src/components/SoundContrastExplorer.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { speak } from '../utils/speech';
import { Confetti } from './Confetti';

// ─── Types ────────────────────────────────────────────────────────────────────
type SoundId = 'ch' | 'ou' | 'an' | 'n' | 'g' | 'on' | 'om';

interface SoundData {
  id: SoundId;
  grapheme: string;
  badge: string;
  fr: { flag: string; word: string; phoneme: string; hint: string; langCode: 'fr-FR'; color: string; feedbackOk: string; };
  en: { flag: string; word: string; phoneme: string; hint: string; langCode: 'en-US'; color: string; feedbackOk: string; };
  rule: string;
  patternQ: string;
  sortWords: { fr: string[]; en: string[] };
}

const FR_COLOR = '#2563eb';
const EN_COLOR = '#dc2626';

const KEY_PHONICS = 'zoe-phonics-badges';

// 🔧 Interface mise à jour pour accepter profileId
interface Props {
  onBack: () => void;
  profileId?: string;
}

const SOUNDS: SoundData[] = [
  {
    id: 'ch', grapheme: 'CH', badge: '🔬 Détective CH',
    fr: { flag: '🇫🇷', word: 'CHAT', phoneme: '/ʃ/', hint: 'Souffle doux — comme le vent', langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, CH = /ʃ/ — un souffle doux. La langue monte vers le palais !' },
    en: { flag: '🇬🇧', word: 'CHAIR', phoneme: '/tʃ/', hint: 'Pop + souffle — sens l\'air sur ta main', langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, CH = /tʃ/ — a little t-pop first, then the breath. Feel it!' },
    rule: '🇫🇷 /ʃ/ souffle seul  ·  🇬🇧 /tʃ/ pop + souffle',
    patternQ: 'Pourquoi "CH" sonne différent selon la langue ?',
    sortWords: { fr: ['CHIEN', 'VACHE', 'CHOSE'], en: ['CHAIR', 'CHAIN', 'BEACH'] },
  },
  {
    id: 'ou', grapheme: 'OU', badge: '👄 Maître OU',
    fr: { flag: '🇫🇷', word: 'LOUP', phoneme: '/u/', hint: 'Lèvres rondes et fixes — comme une bague', langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, OU = /u/ — lèvres très rondes et FIXES !' },
    en: { flag: '🇬🇧', word: 'CLOUD', phoneme: '/aʊ/', hint: 'Bouche qui glisse — de "a" à "ou"', langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, OU glides from open "ah" to round "oo". Feel your jaw move!' },
    rule: '🇫🇷 /u/ bouche ronde fixe  ·  🇬🇧 /aʊ/ bouche qui glisse',
    patternQ: 'Qu\'est-ce que ta bouche fait de différent pour chaque langue ?',
    sortWords: { fr: ['MOUTON', 'JOUER', 'ROUX'], en: ['MOUSE', 'CLOUD', 'SOUND'] },
  },
  {
    id: 'an', grapheme: 'AN', badge: '👃 Explorateur AN',
    fr: { flag: '🇫🇷', word: 'ÉLÉPHANT', phoneme: '/ɑ̃/', hint: 'Air par le nez ET la bouche — nez qui vibre !', langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, AN = /ɑ̃/ — voyelle nasale ! Mets la main sous ton nez.' },
    en: { flag: '🇬🇧', word: 'HAND', phoneme: '/æn/', hint: 'Air par la bouche seulement, puis N', langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, AN = oral vowel + N. No nose buzz — all through the mouth!' },
    rule: '🇫🇷 /ɑ̃/ air nasal  ·  🇬🇧 /æn/ air oral + N prononcé',
    patternQ: 'Pince ton nez et dis les deux mots. Lequel change le plus ?',
    sortWords: { fr: ['ENFANT', 'BLANC', 'TEMPS'], en: ['BAND', 'HAND', 'LAND'] },
  },
  {
    id: 'n', grapheme: 'N', badge: '🌬️ Maître N',
    fr: { flag: '🇫🇷', word: 'BON', phoneme: '/ɔ̃/', hint: 'Le N se cache — il colore le son !', langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, le N final est silencieux — il nasalise la voyelle : /ɔ̃/ !' },
    en: { flag: '🇬🇧', word: 'BONE', phoneme: '/boʊn/', hint: 'Le N se prononce — langue sur les dents', langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, the final N is always said aloud. Tongue touches the ridge!' },
    rule: '🇫🇷 N final silencieux + nasalise  ·  🇬🇧 N final toujours prononcé',
    patternQ: 'Que fait le N à la fin d\'un mot en français ? Et en anglais ?',
    sortWords: { fr: ['MAISON', 'BALLON', 'CITRON'], en: ['MOON', 'SPOON', 'BUTTON'] },
  },
  {
    id: 'g', grapheme: 'G', badge: '🦒 Maître G',
    fr: { flag: '🇫🇷', word: 'GIRAFE', phoneme: '/ʒ/', hint: 'Son doux et continu — comme "je"', langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, G + E/I = /ʒ/ — doux, continu, sans pop !' },
    en: { flag: '🇬🇧', word: 'GIRAFFE', phoneme: '/dʒ/', hint: 'Pop + son doux — comme "jump"', langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, G + E/I = /dʒ/ — a d-pop then soft sound. Like in "jump"!' },
    rule: '🇫🇷 G + e/i = /ʒ/ continu  ·  🇬🇧 G + e/i = /dʒ/ avec pop',
    patternQ: 'Qu\'est-ce qui est ajouté au début du son G en anglais ?',
    sortWords: { fr: ['GÉANT', 'MANGER', 'ROUGE'], en: ['GIANT', 'GEM', 'BRIDGE'] },
  },
  {
    id: 'on', grapheme: 'ON', badge: '🔔 Maître ON',
    fr: { flag: '🇫🇷', word: 'MAISON', phoneme: '/ɔ̃/', hint: 'Lèvres rondes, air par le nez', langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, ON = /ɔ̃/ — voyelle nasale ! Lèvres rondes, nez qui vibre.' },
    en: { flag: '🇬🇧', word: 'MELON', phoneme: '/ɒn/', hint: 'Voyelle orale + N prononcé', langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, ON = oral vowel then a clear N. No nasality — mouth only!' },
    rule: '🇫🇷 ON = /ɔ̃/ nasal  ·  🇬🇧 ON = voyelle orale + N',
    patternQ: 'Pince ton nez et dis MAISON puis MELON. Pour lequel c\'est difficile ?',
    sortWords: { fr: ['BALLON', 'BOUTON', 'SAISON'], en: ['LEMON', 'COTTON', 'MELON'] },
  },
  {
    id: 'om', grapheme: 'OM', badge: '🎭 Maître OM',
    fr: { flag: '🇫🇷', word: 'OMBRE', phoneme: '/ɔ̃/', hint: 'Même son nasal que ON !', langCode: 'fr-FR', color: FR_COLOR, feedbackOk: 'En français, OM = /ɔ̃/ — même son que ON ! Le M nasalise la voyelle.' },
    en: { flag: '🇬🇧', word: 'MOM', phoneme: '/ɒm/', hint: 'Voyelle orale + lèvres qui se ferment', langCode: 'en-US', color: EN_COLOR, feedbackOk: 'In English, OM = oral vowel then lips press together for M!' },
    rule: '🇫🇷 OM = /ɔ̃/ (même son que ON)  ·  🇬🇧 OM = voyelle + M prononcé',
    patternQ: 'En français, OM et ON font-ils le même son ? Et en anglais ?',
    sortWords: { fr: ['OMBRE', 'NOMBRE', 'TOMBER'], en: ['MOM', 'BOMB', 'BOTTOM'] },
  },
];

// ─── Composant principal ──────────────────────────────────────────────────────
export default function SoundContrastExplorer({ onBack, profileId }: Props) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'listen' | 'trace' | 'sort' | 'recognize'>('listen');
  const [lang, setLang] = useState<'fr' | 'en' | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [canvasKey, setCanvasKey] = useState(0);
  const [sortItems, setSortItems] = useState<string[]>([]);
  const [sortResult, setSortResult] = useState<boolean | null>(null);

  const current = SOUNDS[idx];

  // Charger les badges depuis localStorage (générique, partagé)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY_PHONICS);
      if (saved) setBadges(JSON.parse(saved));
    } catch {}
  }, []);

  // Helpers de navigation
  const goNext = () => { setIdx(i => (i + 1) % SOUNDS.length); resetPhase(); };
  const goPrev = () => { setIdx(i => (i - 1 + SOUNDS.length) % SOUNDS.length); resetPhase(); };
  const resetPhase = () => { setPhase('listen'); setLang(null); setSortResult(null); setCanvasKey(k => k + 1); };

  // Badges
  const acknowledge = () => {
    if (badges.includes(current.id)) return;
    const updated = [...badges, current.id];
    setBadges(updated);
    try { localStorage.setItem(KEY_PHONICS, JSON.stringify(updated)); } catch {}
  };

  // Trace
  const handleTraceDone = () => {
    setPhase('sort');
    const words = lang === 'fr' ? current.sortWords.fr : current.sortWords.en;
    // Mélanger les mots FR et EN pour le tri
    setSortItems([...current.sortWords.fr, ...current.sortWords.en].sort(() => Math.random() - 0.5));
  };

  // Sort
  const checkSort = (item: string, bin: 'fr' | 'en') => {
    const isFrench = current.sortWords.fr.includes(item);
    if ((isFrench && bin === 'fr') || (!isFrench && bin === 'en')) {
      setSortResult(true);
      setTimeout(() => {
        setPhase('recognize');
        acknowledge();
      }, 800);
    } else {
      setSortResult(false);
      setTimeout(() => setSortResult(null), 1000);
    }
  };

  // Listen
  const listen = (l: 'fr' | 'en') => {
    setLang(l);
    const d = current[l];
    speak(d.word, d.langCode);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '18px 14px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: 'transparent', border: '2px solid #2563eb', color: '#2563eb', borderRadius: 14, padding: '7px 12px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>← Retour</button>
          <b style={{ color: '#334155', fontSize: 14 }}>🔬 Explorateur de Sons</b>
          <button onClick={goNext} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 14, padding: '7px 12px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>Son suivant →</button>
        </div>

        {/* Badge du jour */}
        <div style={{ textAlign: 'center', fontSize: 18, color: '#2563eb', marginBottom: 18, fontWeight: 'bold' }}>{current.grapheme}</div>

        {/* Phase LISTEN */}
        {phase === 'listen' && (
          <div style={{ background: 'white', borderRadius: 24, padding: 24, boxShadow: '0 4px 18px rgba(0,0,0,.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>{current.grapheme}</div>
            <p style={{ color: '#555', marginBottom: 24 }}>Écoute les deux sons</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => listen('fr')} style={{ flex: 1, background: FR_COLOR, color: 'white', border: 'none', borderRadius: 16, padding: 18, fontSize: 18, cursor: 'pointer', fontWeight: 'bold' }}>
                🇫🇷 {current.fr.word}<br/><span style={{ fontSize: 13, opacity: 0.9 }}>{current.fr.phoneme}</span>
              </button>
              <button onClick={() => listen('en')} style={{ flex: 1, background: EN_COLOR, color: 'white', border: 'none', borderRadius: 16, padding: 18, fontSize: 18, cursor: 'pointer', fontWeight: 'bold' }}>
                🇬🇧 {current.en.word}<br/><span style={{ fontSize: 13, opacity: 0.9 }}>{current.en.phoneme}</span>
              </button>
            </div>
            {lang && (
              <div style={{ marginTop: 20 }}>
                <button onClick={() => setPhase('trace')} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 20, padding: '12px 28px', fontSize: 16, cursor: 'pointer', fontWeight: 'bold' }}>✍️ Tracer la lettre</button>
              </div>
            )}
          </div>
        )}

        {/* Phase TRACE */}
        {phase === 'trace' && (
          <div style={{ background: 'white', borderRadius: 24, padding: 24, boxShadow: '0 4px 18px rgba(0,0,0,.08)', textAlign: 'center' }}>
            <p style={{ color: '#555', marginBottom: 16 }}>Dessine la lettre avec ton doigt</p>
            <canvas
              key={canvasKey}
              width={300}
              height={150}
              style={{ border: '2px dashed #ccc', borderRadius: 12, touchAction: 'none', marginBottom: 16 }}
            />
            <button onClick={handleTraceDone} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 20, padding: '10px 24px', fontSize: 15, cursor: 'pointer', fontWeight: 'bold' }}>✅ J'ai terminé</button>
          </div>
        )}

        {/* Phase SORT */}
        {phase === 'sort' && (
          <div style={{ background: 'white', borderRadius: 24, padding: 24, boxShadow: '0 4px 18px rgba(0,0,0,.08)', textAlign: 'center' }}>
            <p style={{ color: '#555', marginBottom: 20 }}>Glisse les mots dans la bonne langue</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              {sortItems.map((word, i) => (
                <button
                  key={i}
                  onClick={() => {}}
                  style={{ background: '#f1f5f9', border: '2px solid #e2e8f0', borderRadius: 12, padding: '8px 14px', fontSize: 16, fontWeight: 'bold', color: '#334155' }}
                >
                  {word}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <div onClick={() => checkSort('', 'fr')} style={{ flex: 1, background: '#eff6ff', border: '2px dashed #2563eb', borderRadius: 16, padding: 24, color: '#2563eb', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>🇫🇷</div>
              <div onClick={() => checkSort('', 'en')} style={{ flex: 1, background: '#fef2f2', border: '2px dashed #dc2626', borderRadius: 16, padding: 24, color: '#dc2626', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>🇬🇧</div>
            </div>
            {sortResult !== null && (
              <div style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold', color: sortResult ? '#2e7d32' : '#c62828' }}>
                {sortResult ? '✅ Bravo !' : '❌ Essaye encore'}
              </div>
            )}
          </div>
        )}

        {/* Phase RECOGNIZE */}
        {phase === 'recognize' && (
          <div style={{ background: 'white', borderRadius: 24, padding: 24, boxShadow: '0 4px 18px rgba(0,0,0,.08)', textAlign: 'center' }}>
            <Confetti show />
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
            <h2 style={{ color: '#1e293b', marginBottom: 8 }}>Badge : {current.badge}</h2>
            <p style={{ color: '#475569', marginBottom: 20 }}>{current.rule}</p>
            <p style={{ color: '#64748b', fontSize: 14, fontStyle: 'italic', marginBottom: 24 }}>{current.patternQ}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={goNext} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 20, padding: '12px 24px', fontSize: 15, cursor: 'pointer', fontWeight: 'bold' }}>Son suivant →</button>
              <button onClick={goPrev} style={{ background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: 20, padding: '12px 24px', fontSize: 15, cursor: 'pointer', fontWeight: 'bold' }}>← Revenir</button>
            </div>
          </div>
        )}

        {/* Progression badges */}
        <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {SOUNDS.map(s => (
            <div key={s.id} style={{ fontSize: 22, opacity: badges.includes(s.id) ? 1 : 0.3, transition: 'opacity .3s' }}>
              {s.badge}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}