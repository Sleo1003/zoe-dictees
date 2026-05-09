export type LetterItem = { l: string; id: number; used: boolean };
export type WordItem = { w: string; id: number; used: boolean };
export type Dictée = { id: number; mots: string[]; phrases: string[] };
export type QCMItem = { s: string; a: string; o: string[]; tip: string };
export type Round =
  | { type: 'mirror' | 'anagram'; word: string }
  | { type: 'blank' | 'tile'; phrase: string; mots: string[] }
  | { type: 'qcm'; data: QCMItem };
export type ErrorCounts = Record<string, number>;
export type Completed = Record<number, number>;
export type Screen = 'home' | 'warmup' | 'game' | 'result' | 'parent';
export type GameType = 'mirror' | 'anagram' | 'blank' | 'tile' | 'qcm';

// Phonics Module Types
export type LanguageCode = 'fr' | 'en';

export interface PhonemeRule {
  grapheme: string;
  ipa: string;
  description: string;
  articulatoryCue: string;
  language: LanguageCode;
  contrastWith?: {
    otherLanguage: LanguageCode;
    difference: string;
  };
}

export interface ContrastPair {
  [key: string]: any; // ✅ Autorise l'indexation dynamique
  grapheme: string;
  french: {
    word: string;
    ipa: string;
    audio: string;
    mouthAnimation: string;
    rule: PhonemeRule;
  };
  english: {
    word: string;
    ipa: string;
    audio: string;
    mouthAnimation: string;
    rule: PhonemeRule;
  };
  logicPrompt: string;
  masteryBadge: string;
}

export interface TracePath {
  points: { x: number; y: number; pressure?: number }[];
  timestamp: number;
  language: LanguageCode;
}

export interface PhonicsProgress {
  unlockedGraphemes: string[];
  masteredContrasts: string[];
  practiceHistory: {
    grapheme: string;
    attempts: number;
    lastPracticed: string;
    patternAcknowledged: boolean;
  }[];
}