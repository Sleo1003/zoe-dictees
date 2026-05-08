import { useEffect, useRef } from 'react';

type Subject = 'home' | 'french' | 'english' | 'math';

interface HomePageProps {
  onSelectSubject: (subject: Subject) => void;
}

export default function HomePage({ onSelectSubject }: HomePageProps) {
  const sparkleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sparkleRef.current) return;
    const container = sparkleRef.current;
    for (let i = 0; i < 40; i++) {
      const span = document.createElement('div');
      span.className = 'sp';
      const size = Math.random() * 2 + 1.5;
      span.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--sd:${Math.random() * 4 + 3}s;--sdl:${Math.random() * 5}s`;
      container.appendChild(span);
    }
    return () => { container.innerHTML = ''; };
  }, []);

  const subjects = [
    { id: 'french' as Subject, title: 'Français', desc: 'Dictées & Grammaire', icon: '📖', color: '#d4a0c8', theme: 'fr-theme' },
    { id: 'english' as Subject, title: 'English', desc: 'Vocabulary & Grammar', icon: '🌿', color: '#7ec8c0', theme: 'en-theme' },
    { id: 'math' as Subject, title: 'Mathématiques', desc: 'Calcul & Problèmes', icon: '🔮', color: '#e0c07a', theme: 'ma-theme' },
  ];

  return (
    <div className="page">
      <div className="ambient">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="sparkle" ref={sparkleRef} />

      <div className="top-badge">
        <span>👑</span>
        <span>Monde des révisions</span>
      </div>

      <div className="name-wrap">
        <div className="name-title">Zoe</div>
        <div className="name-sub">✦ Aventurière du Savoir ✦</div>
      </div>

      <div className="xp-bar-wrap">
        <div className="xp-label"><span>⚡ Niveau 3</span><span>620 / 1000 XP</span></div>
        <div className="xp-track"><div className="xp-fill" /></div>
      </div>

      <div className="char-frame">
        <div className="orbit"><div className="orbit-dot dot-a" /><div className="orbit-dot dot-b" /></div>
        <div className="glow-ring" />
        <div className="char-img-wrap">
          {/* 📸 Mets ton image dans public/zoe.jpg */}
          <img src="/zoe.jpg" alt="Zoé" style={{ objectPosition: 'center 10%' }} />
        </div>
        <div className="rune rune-tl" /><div className="rune rune-tr" />
        <div className="rune rune-bl" /><div className="rune rune-br" />
        <span className="floaty" style={{ top: -12, left: -22, fontSize: 16 } as any}>💜</span>
        <span className="floaty" style={{ top: -8, right: -20, fontSize: 20 } as any}>🌸</span>
        <span className="floaty" style={{ bottom: 12, right: -24, fontSize: 13 } as any}>✨</span>
        <span className="floaty" style={{ bottom: 8, left: -18, fontSize: 14 } as any}>🌷</span>
      </div>

      <div className="quest-heading">
        <div className="quest-line" /><span>Choisir ta quête</span><div className="quest-line right" />
      </div>

      <div className="quests">
        {subjects.map((s) => (
          <button key={s.id} className={`quest-card ${s.theme}`} onClick={() => onSelectSubject(s.id)}>
            <div className="accent-bar" /><div className="tint" />
            <div className="quest-inner">
              <div className="quest-icon-wrap" style={{ background: `${s.color}20` }}>{s.icon}<div className="gem" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}88)` }}>✦</div></div>
              <div className="quest-text">
                <div className="quest-name">{s.title}</div>
                <div className="quest-desc">{s.desc}</div>
                <div className="quest-stars">
                  {[1, 2, 3].map(i => <div key={i} className={`star-dot ${i <= (s.id === 'french' ? 3 : s.id === 'english' ? 2 : 1) ? 'lit' : ''}`} />)}
                </div>
              </div>
              <div className="quest-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg></div>
            </div>
          </button>
        ))}
      </div>

      <div className="footer">zoe-dictees.vercel.app</div>
    </div>
  );
}