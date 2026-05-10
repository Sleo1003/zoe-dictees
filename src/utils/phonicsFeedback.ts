// src/utils/phonicsFeedback.ts
import type { ContrastPair, LanguageCode, PhonemeRule } from '../types';

// 🔑 Helper sécurisé pour mapper 'fr'/'en' → 'french'/'english'
const langKey = (lang: LanguageCode): 'french' | 'english' =>
  lang === 'fr' ? 'french' : 'english';

export const getPhonicsFeedback = (
  pair: ContrastPair,
  userLanguage: LanguageCode,
  currentRule: PhonemeRule,
  isCorrect: boolean
): string => {
  const userWord = pair[langKey(userLanguage)].word;

  if (isCorrect) {
    const contrast = currentRule.contrastWith;
    if (contrast) {
      const otherLang = contrast.otherLanguage;
      const otherWord = pair[langKey(otherLang)].word;
      const otherIPA = pair[langKey(otherLang)].ipa;
      return `🎯 Excellent ! Tu as associé "${userWord}" au son /${currentRule.ipa}/. Et si on comparait avec l'autre langue ? En ${otherLang === 'fr' ? 'français' : 'anglais'}, "${otherWord}" se prononce /${otherIPA}/.`;
    }
    return `🎯 Excellent ! Tu as associé "${userWord}" au son /${currentRule.ipa}/.`;
  }

  return `🤔 Presque ! Écoutons encore : "${userWord}" commence par /${currentRule.ipa}/.`;
};

export const getPatternPrompt = (
  pair: ContrastPair,
  userLanguage: LanguageCode,
  currentRule: PhonemeRule
): string => {
  const userWord = pair[langKey(userLanguage)].word;
  return `💡 Observe bien : "${userWord}" utilise le son /${currentRule.ipa}/. Quelle est la différence avec l'autre langue ?`;
};