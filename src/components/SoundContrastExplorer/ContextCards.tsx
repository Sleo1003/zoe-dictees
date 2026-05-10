// src/components/SoundContrastExplorer/ContextCards.tsx
import type { ContrastPair, LanguageCode } from '../../types';

// 🔑 Même helper que phonicsFeedback.ts pour cohérence
const langKey = (lang: LanguageCode): 'french' | 'english' =>
  lang === 'fr' ? 'french' : 'english';

interface ContextCardsProps {
  pair: ContrastPair;
  lang: LanguageCode;
}

export default function ContextCards({ pair, lang }: ContextCardsProps) {
  const data = pair[langKey(lang)]; // ✅ Correction TypeScript ici

  return (
    <div style={{ 
      padding: '1rem', borderRadius: '12px', background: '#f8fafc', 
      border: '1px solid #e2e8f0', marginBottom: '1rem' 
    }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', color: '#1e293b' }}>
        {lang === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
      </h3>
      <p style={{ margin: 0, fontSize: '1rem', color: '#475569' }}>
        <strong>{data.word}</strong> <span style={{ color: '#64748b' }}>({data.ipa})</span>
      </p>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic' }}>
        {data.rule.description}
      </p>
    </div>
  );
}