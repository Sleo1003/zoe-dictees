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
