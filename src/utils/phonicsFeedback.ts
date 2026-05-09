// src/utils/phonicsFeedback.ts
import { ContrastPair, LanguageCode } from '../types';

interface FeedbackInput {
  pair: ContrastPair;
  userLanguage: LanguageCode;
  isCorrect: boolean;
  traceAccuracy: number;
}

interface FeedbackOutput {
  message: string;
  type: 'success' | 'guidance';
  ruleReminder?: string;
  nextStepSuggestion?: string;
}

export const generateFeedback = ({
  pair,
  userLanguage,
  isCorrect,
  traceAccuracy
}: FeedbackInput): FeedbackOutput => {
  
  const currentRule = userLanguage === 'fr' ? pair.french.rule : pair.english.rule;
  const contrast = currentRule.contrastWith;

  if (isCorrect) {
    return {
      message: `🎯 Excellent ! Tu as associé "${pair[userLanguage].word}" au son /${currentRule.ipa}/.`,
      type: 'success',
      ruleReminder: `Rappel : ${currentRule.articulatoryCue}`,
      nextStepSuggestion: contrast 
        ? `Et si on comparait avec l'autre langue ? En ${contrast.otherLanguage === 'fr' ? 'français' : 'anglais'}, "${pair[contrast.otherLanguage].word}" se prononce /${pair[contrast.otherLanguage].ipa}/.`
        : 'Prêt·e pour un nouveau son ?'
    };
  }

  // Feedback de guidage (jamais juste "faux")
  return {
    message: `🤔 Presque ! Écoutons encore : "${pair[userLanguage].word}" commence par /${currentRule.ipa}/.`,
    type: 'guidance',
    ruleReminder: `Astuce : ${currentRule.description}. ${contrast ? contrast.difference : ''}`,
    nextStepSuggestion: 'Appuie sur 🔊 pour réécouter, ou 👄 pour voir le mouvement de la bouche.'
  };
};

// Fonction utilitaire pour générer des prompts métacognitifs variés
export const getMetacognitivePrompt = (grapheme: string, language: LanguageCode): string => {
  const prompts = {
    fr: [
      `Pourquoi "${grapheme}" sonne-t-il comme ça en français ?`,
      `Quel mouvement fais-tu avec ta bouche pour dire /${grapheme}/ ?`,
      `Peux-tu trouver un autre mot français qui commence comme "${grapheme}" ?`
    ],
    en: [
      `Why does "${grapheme}" sound like that in English?`,
      `What does your tongue do when you say /${grapheme}/?`,
      `Can you think of another English word that starts like "${grapheme}"?`
    ]
  };
  
  const list = prompts[language];
  return list[Math.floor(Math.random() * list.length)];
};