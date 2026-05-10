// src/components/EnglishApp.tsx
import { useState } from 'react';
import { QuizGame, LearnGame, Hdr } from './GameEngine';
import {
  C,
  POSS, AAN, PRON, IAA,
  EE_QS, TEX_QS, PLANTS_QS,
} from '../data/content';
import { shuffle } from '../utils/helpers';

interface EnglishAppProps {
  onBack: () => void;
  profileId?: string;
}

type EnView =
  | 'home'
  | 'poss' | 'aan' | 'pron' | 'iaa'
  | 'ee' | 'tex' | 'ev';

const ENG_COLORS: Record<EnView, string> = {
  home: '#475569',
  poss: C.poss,
  aan:  C.aan,
  pron: C.pron,
  iaa:  C.iaa,
  ee:   C.ee,
  tex:  C.tex,
  ev:   C.ev,
};

const ENG_TITLES: Record<EnView, string> = {
  home: 'English',
  poss: '💬 Possessive Adjectives',
  aan:  '🔤 A or AN?',
  pron: '👤 Pronouns',
  iaa:  '✏️ IS / AM / ARE',
  ee:   '📖 Phonics Ee',
  tex:  '🤚 Textures',
  ev:   '🌱 EVS — Plants',
};

const ENG_BG: Record<string, string> = {
  poss: '#e8eaf6',
  aan:  '#e0f2f1',
  pron: '#ede7f6',
  iaa:  '#ffebee',
  ee:   '#e0f2f1',
  tex:  '#f3e5f5',
  ev:   '#f1f8e9',
};

export default function EnglishApp({ onBack, profileId }: EnglishAppProps) {
  const [view, setView] = useState<EnView>('home');
  const [pk,   setPk]   = useState(0);

  const goHome = () => setView('home');
  const replay = () => setPk(k => k + 1);

  // ═══ Possessive Adjectives ═══
  if (view === 'poss')
    return (
      <QuizGame key={pk} qs={shuffle(POSS)} col={C.poss} bg={ENG_BG.poss} title={ENG_TITLES.poss}
        onBack={goHome} onReplay={replay}
        wl={q => q.s.replace('___', '[' + q.a + ']')}
        renderQ={(q, chosen, fb, pick, col) => {
          const [a, b] = q.s.split('___');
          return (
            <div>
              <div style={{ background: '#e8eaf6', borderRadius: 11, padding: '9px 13px', marginBottom: 14, fontSize: 13, color: col, fontStyle: 'italic' }}>
                Hint: {q.h} 💡
              </div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 22, lineHeight: 1.8 }}>
                {a}
                <span style={{ display: 'inline-block', minWidth: 56, borderBottom: '3px solid ' + col, color: chosen ? col : 'transparent', fontWeight: 'bold', margin: '0 4px', fontSize: 22 }}>
                  {chosen || '   '}
                </span>
                {b}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {['my', 'your', 'his', 'her'].map(opt => {
                  const ic = chosen === opt, ir = opt === q.a;
                  const bg = !fb ? col : ic && fb === 'correct' ? '#43a047' : ic && fb === 'wrong' ? '#e53935' : !ic && fb && ir ? '#43a047' : '#bbb';
                  return (
                    <button key={opt} onClick={() => pick(opt)} disabled={!!fb}
                      style={{ flex: 1, background: bg, color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: 20, cursor: fb ? 'default' : 'pointer', fontWeight: 'bold' }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }}
      />
    );

  // ═══ A or AN ═══
  if (view === 'aan')
    return (
      <QuizGame key={pk} qs={shuffle(AAN)} col={C.aan} bg={ENG_BG.aan} title={ENG_TITLES.aan}
        onBack={goHome} onReplay={replay}
        wl={q => '"' + q.a + ' ' + q.w + '"'}
        renderQ={(q, chosen, fb, pick, col) => {
          const fl = q.w[0].toLowerCase();
          const isV = 'aeiou'.includes(fl);
          return (
            <div>
              <div style={{ background: '#e0f2f1', borderRadius: 11, padding: 8, marginBottom: 6, fontSize: 12, border: '2px solid ' + col, textAlign: 'center' }}>
                AN before vowels (a,e,i,o,u) · A before consonants
              </div>
              <div style={{ fontSize: 88, margin: '10px 0' }}>{q.e}</div>
              <div style={{ background: '#e0f2f1', borderRadius: 11, padding: '7px 14px', display: 'inline-block', marginBottom: 18 }}>
                <span style={{ fontSize: 15, color: '#888' }}>First letter: </span>
                <b style={{ fontSize: 21, color: isV ? col : '#e65100' }}>{fl.toUpperCase()}</b>
                <span style={{ fontSize: 13, color: isV ? col : '#e65100', marginLeft: 5 }}>{isV ? '(vowel ✓)' : '(consonant)'}</span>
              </div>
              <div style={{ fontSize: 24, color: '#333', marginBottom: 20 }}>
                <span style={{ display: 'inline-block', minWidth: 65, borderBottom: '3px solid ' + col, color: chosen ? col : 'transparent', fontWeight: 'bold', marginRight: 7, fontSize: 26 }}>
                  {chosen || '___'}
                </span>
                <b style={{ fontSize: 26 }}>{q.w}</b>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {['a', 'an'].map(opt => {
                  const ic = chosen === opt, ir = opt === q.a;
                  const bg = !fb ? col : ic && fb === 'correct' ? '#43a047' : ic && fb === 'wrong' ? '#e53935' : !ic && fb && ir ? '#43a047' : '#bbb';
                  return (
                    <button key={opt} onClick={() => pick(opt)} disabled={!!fb}
                      style={{ flex: 1, background: bg, color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: 28, cursor: fb ? 'default' : 'pointer', fontWeight: 'bold' }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }}
      />
    );

  // ═══ Pronouns ═══
  if (view === 'pron')
    return (
      <QuizGame key={pk} qs={shuffle(PRON)} col={C.pron} bg={ENG_BG.pron} title={ENG_TITLES.pron}
        onBack={goHome} onReplay={replay}
        wl={q => q.b.replace('___', '[' + q.a + ']') + ' — ' + q.h}
        renderQ={(q, chosen, fb, pick, col) => {
          const [a, b] = q.b.split('___');
          return (
            <div>
              <div style={{ background: '#ede7f6', borderRadius: 12, padding: '11px 14px', marginBottom: 14, fontSize: 15, color: '#555', fontWeight: 'bold' }}>{q.o}</div>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 18, lineHeight: 1.9 }}>
                {a}
                <span style={{ display: 'inline-block', minWidth: 60, borderBottom: '3px solid ' + col, color: chosen ? col : 'transparent', fontWeight: 'bold', margin: '0 4px', fontSize: 20 }}>
                  {chosen || '___'}
                </span>
                {b}
              </div>
              <div style={{ background: '#f3e5ff', borderRadius: 9, padding: '7px 11px', marginBottom: 14, fontSize: 12, color: col, fontStyle: 'italic' }}>💡 {q.h}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {q.c.map(opt => {
                  const ic = chosen === opt, ir = opt === q.a;
                  const bg = !fb ? col : ic && fb === 'correct' ? '#43a047' : ic && fb === 'wrong' ? '#e53935' : !ic && fb && ir ? '#43a047' : '#bbb';
                  return (
                    <button key={opt} onClick={() => pick(opt)} disabled={!!fb}
                      style={{ flex: 1, background: bg, color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: 22, cursor: fb ? 'default' : 'pointer', fontWeight: 'bold' }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }}
      />
    );

  // ═══ IS / AM / ARE ═══
  if (view === 'iaa')
    return (
      <QuizGame key={pk} qs={shuffle(IAA)} col={C.iaa} bg={ENG_BG.iaa} title={ENG_TITLES.iaa}
        onBack={goHome} onReplay={replay}
        wl={q => q.s.replace('___', q.a) + ' (' + q.t + ')'}
        fm={q => '❌ ' + q.a.toUpperCase() + ' — ' + q.t}
        renderQ={(q, chosen, fb, pick) => {
          const [a, b] = q.s.split('___');
          const IC: Record<string, string> = { is: '#0277bd', am: '#2e7d32', are: '#b71c1c' };
          return (
            <div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 24, lineHeight: 1.9 }}>
                {a}
                <span style={{ display: 'inline-block', minWidth: 75, borderBottom: '3px solid ' + C.iaa, color: chosen ? C.iaa : 'transparent', fontWeight: 'bold', margin: '0 5px', fontSize: 24 }}>
                  {chosen || '____'}
                </span>
                {b}
              </div>
              <div style={{ display: 'flex', gap: 11, justifyContent: 'center' }}>
                {['is', 'am', 'are'].map(opt => {
                  const ic = chosen === opt, ir = opt === q.a, oc = IC[opt];
                  const bg = !fb ? oc : ic && fb === 'correct' ? '#43a047' : ic && fb === 'wrong' ? '#e53935' : !ic && fb && ir ? '#43a047' : '#bbb';
                  return (
                    <button key={opt} onClick={() => pick(opt)} disabled={!!fb}
                      style={{ flex: 1, background: bg, color: 'white', border: 'none', borderRadius: 16, padding: '17px 0', fontSize: 21, cursor: fb ? 'default' : 'pointer', fontWeight: 'bold', transition: 'background .25s' }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, background: '#f5f5f5', borderRadius: 11, padding: 9, fontSize: 12, color: '#555', textAlign: 'left' }}>
                <b style={{ color: '#0277bd' }}>IS</b> → he, she, it · <b style={{ color: '#2e7d32' }}>AM</b> → I · <b style={{ color: '#b71c1c' }}>ARE</b> → you, we, they
              </div>
            </div>
          );
        }}
      />
    );

  // ═══ Phonics Ee, Textures, EVS (Quiz simple) ═══
  const simpleQuiz = (id: EnView) => {
    const col = ENG_COLORS[id];
    const qs = shuffle(id === 'ee' ? EE_QS : id === 'tex' ? TEX_QS : PLANTS_QS);
    return (
      <QuizGame key={pk} qs={qs} col={col} bg={ENG_BG[id]} title={ENG_TITLES[id]}
        onBack={goHome} onReplay={replay}
        wl={(q: any) => id === 'ev' ? q.q + ' → ' + q.a : (q.emoji || '') + ' ' + q.a}
        renderQ={(q: any, chosen, fb, pick, col) => (
          <div>
            {id === 'ee' && <div style={{ background: '#e0f2f1', borderRadius: 12, padding: 8, marginBottom: 10, fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: col }}>All these words start with 🔤 Ee</div>}
            {id === 'tex' && <div style={{ background: '#f3e5f5', borderRadius: 12, padding: '8px 14px', marginBottom: 10, fontSize: 12, textAlign: 'center', color: col }}>🤚 Rough · Smooth · Hard · Soft</div>}
            <div style={{ fontSize: id === 'ev' ? 80 : 90, margin: '10px 0' }}>{q.emoji}</div>
            <p style={{ fontSize: id === 'ev' ? 16 : 15, fontWeight: id === 'ev' ? 'bold' : 'normal', color: id === 'ev' ? '#333' : '#555', margin: '0 0 18px', lineHeight: id === 'ev' ? 1.6 : 1.5 }}>{q.q}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              {(id === 'tex' ? ['rough', 'smooth', 'hard', 'soft'] : q.c).map((opt: string) => {
                const ic = chosen === opt, ir = opt === q.a;
                const bg = !fb ? col : ic && fb === 'correct' ? '#43a047' : ic && fb === 'wrong' ? '#e53935' : !ic && fb && ir ? '#43a047' : '#bbb';
                return (
                  <button key={opt} onClick={() => pick(opt)} disabled={!!fb}
                    style={{ background: bg, color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: id === 'tex' ? 18 : 20, cursor: fb ? 'default' : 'pointer', fontWeight: 'bold' }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      />
    );
  };

  if (view === 'ee')  return simpleQuiz('ee');
  if (view === 'tex') return simpleQuiz('tex');
  if (view === 'ev')  return simpleQuiz('ev');

  // ═══ HOME ═══
  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px', background: 'linear-gradient(180deg,#e8f5e9,#e3f2fd)', position: 'relative' }}>
      <button onClick={onBack} style={{ position: 'absolute', top: 16, left: 16, padding: '8px 16px', borderRadius: 12, background: '#E2E8F0', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#475569' }}>← Accueil</button>

      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🌿</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1E293B', margin: '0 0 24px' }}>English</h1>

        {(['poss', 'aan', 'pron', 'iaa', 'ee', 'tex', 'ev'] as EnView[]).map(id => (
          <div key={id} onClick={() => setView(id)}
            style={{ background: 'white', border: '3px solid ' + ENG_COLORS[id], borderRadius: 18, padding: '14px 18px', marginBottom: 10, cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>
                {id === 'poss' ? '💬' : id === 'aan' ? '🔤' : id === 'pron' ? '👤' : id === 'iaa' ? '✏️' : id === 'ee' ? '📖' : id === 'tex' ? '🤚' : '🌱'}
              </span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 15, color: ENG_COLORS[id] }}>{ENG_TITLES[id]}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                  {id === 'poss' ? 'my · your · his · her' :
                   id === 'aan' ? 'a car · an apple' :
                   id === 'pron' ? 'he · she · they · I' :
                   id === 'iaa' ? 'We ___ · He ___ · I ___' :
                   id === 'ee' ? 'egg · ear · eagle…' :
                   id === 'tex' ? 'rough · smooth · hard · soft' :
                   'roots · stem · leaves · flower · seed'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}