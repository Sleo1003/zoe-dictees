// src/components/SoundContrastExplorer/ContextCards.tsx
import React from 'react';
import { ContrastPair, LanguageCode } from '../../types';
import { playAudio } from '../../utils/speech';
import './ContextCards.css';

interface ContextCardsProps {
  pair: ContrastPair;
  selectedLanguage: LanguageCode | null;
  onLanguageSelect: (lang: LanguageCode) => void;
  onShowMouthAnimation: (lang: LanguageCode) => void;
}

export const ContextCards: React.FC<ContextCardsProps> = ({
  pair,
  selectedLanguage,
  onLanguageSelect,
  onShowMouthAnimation,
}) => {
  
  const handleAudio = (lang: LanguageCode, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la sélection de la carte quand on clique sur 🔊
    const src = lang === 'fr' ? pair.french.audio : pair.english.audio;
    playAudio(src);
  };

  const renderCard = (lang: LanguageCode) => {
    const data = pair[lang];
    const isFrench = lang === 'fr';
    const isSelected = selectedLanguage === lang;
    const flag = isFrench ? '🇫🇷' : '🇬🇧';
    const langLabel = isFrench ? 'Français' : 'English';
    const themeClass = isFrench ? 'card-fr' : 'card-en';

    return (
      <button
        key={lang}
        className={`context-card ${themeClass} ${isSelected ? 'is-selected' : ''}`}
        onClick={() => onLanguageSelect(lang)}
        aria-label={`${langLabel} : ${data.word} se prononce ${data.ipa}`}
        aria-pressed={isSelected}
        tabIndex={0}
      >
        <div className="card-header">
          <span className="card-flag" aria-hidden="true">{flag}</span>
          <span className="card-lang-label">{langLabel}</span>
        </div>

        <div className="card-content">
          <div className="card-word">{data.word}</div>
          <div className="card-ipa" aria-label={`Prononciation : ${data.ipa}`}>
            {data.ipa}
          </div>
          <div className="card-cue" aria-hidden="true">
            👉 {data.rule.articulatoryCue}
          </div>
        </div>

        <div className="card-actions">
          <button
            className="btn-action"
            onClick={(e) => handleAudio(lang, e)}
            aria-label={`Écouter ${data.word}`}
            title="Écouter"
          >
            🔊 Écouter
          </button>
          <button
            className="btn-action"
            onClick={(e) => {
              e.stopPropagation();
              onShowMouthAnimation(lang);
            }}
            aria-label={`Voir le mouvement de la bouche`}
            title="Voir la bouche"
          >
            👄 Bouche
          </button>
        </div>
      </button>
    );
  };

  return (
    <section className="context-cards-wrapper" aria-label="Comparaison bilingue des mots">
      {renderCard('fr')}
      {renderCard('en')}
    </section>
  );
};

export default ContextCards;