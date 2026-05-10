import type { Dictée, QCMItem, GameType } from '../types';

// ── Niveaux scolaires (Ministère de l'Éducation Nationale) ───────────────────
export const LEVELS = ['CP', 'CE1', 'CE2'] as const;
export type Level = typeof LEVELS[number];

// ── Labels & Couleurs par type de jeu ───────────────────────────────────────
export const LABELS: Record<GameType, string> = {
  mirror: '🪞 Miroir',
  anagram: '🔤 Anagramme',
  blank: '✏️ Texte à trous',
  tile: '🧩 Mots à replacer',
  qcm: '❓ QCM',
};

export const COLORS: Record<GameType, string> = {
  mirror: '#4F46E5',
  anagram: '#7C3AED',
  blank: '#059669',
  tile: '#D97706',
  qcm: '#DC2626',
};

// ── Séquence de jeux par session ────────────────────────────────────────────
export const ROUNDS = 10;
export const GT: GameType[] = ['mirror', 'anagram', 'blank', 'tile', 'qcm'];

// ── Pool de questions QCM (réutilisé across levels) ──────────────────────────
export const QCM_POOL: QCMItem[] = [
  { s: "Le chat ___ sur le toit.", a: "dort", o: ["dort", "court", "sort", "port"], tip: "Verbe au présent" },
  { s: "Nous ___ à l'école.", a: "allons", o: ["allons", "venons", "partons", "restons"], tip: "Conjugaison" },
  { s: "Une ___ rouge.", a: "pomme", o: ["pomme", "plume", "porte", "pile"], tip: "Nom féminin" },
  { s: "Il fait ___ aujourd'hui.", a: "beau", o: ["beau", "belle", "beaux", "belles"], tip: "Accord de l'adjectif" },
  { s: "Les ___ chantent.", a: "oiseaux", o: ["oiseaux", "oiseau", "oisillon", "oisellerie"], tip: "Pluriel" },
  { s: "Je ___ une lettre.", a: "lis", o: ["lis", "lit", "lisons", "lise"], tip: "Verbe lire" },
  { s: "C'est ___ livre.", a: "mon", o: ["mon", "ma", "mes", "mienne"], tip: "Possessif masculin" },
  { s: "Elle ___ une robe.", a: "porte", o: ["porte", "port", "portes", "portent"], tip: "Verbe porter" },
];

// ── DICTÉES PAR NIVEAU (15 au total) ─────────────────────────────────────────
export const DICTEES: Dictée[] = [
  // ── CP (6-7 ans) : mots courts, phonèmes simples, syllabes ouvertes ───────
  {
    id: 1,
    level: 'CP',
    theme: 'Animaux',
    mots: ['chat', 'loup', 'ours', 'lion', 'cerf'],
    phrases: ['Le chat dort.', 'Un loup hurle.', 'L\'ours mange.'],
  },
  {
    id: 2,
    level: 'CP',
    theme: 'Couleurs',
    mots: ['rouge', 'bleu', 'vert', 'jaune', 'rose'],
    phrases: ['Le ciel est bleu.', 'Une fleur rouge.', 'L\'herbe est verte.'],
  },
  {
    id: 3,
    level: 'CP',
    theme: 'Corps humain',
    mots: ['nez', 'main', 'pied', 'oeil', 'bras'],
    phrases: ['Je lève la main.', 'Mon pied bouge.', 'L\'oeil voit.'],
  },
  {
    id: 4,
    level: 'CP',
    theme: 'Famille',
    mots: ['maman', 'papa', 'bébé', 'soeur', 'frère'],
    phrases: ['Maman sourit.', 'Papa lit.', 'Le bébé dort.'],
  },
  {
    id: 5,
    level: 'CP',
    theme: 'École',
    mots: ['livre', 'crayon', 'table', 'chaise', 'sac'],
    phrases: ['J\'ouvre le livre.', 'Le crayon écrit.', 'Je m\'assois.'],
  },

  // ── CE1 (7-8 ans) : graphèmes composés, syllabes fermées, accords simples ─
  {
    id: 6,
    level: 'CE1',
    theme: 'Nature',
    mots: ['soleil', 'nuage', 'pluie', 'vent', 'neige'],
    phrases: ['Le soleil brille.', 'Un nuage passe.', 'La pluie tombe.'],
  },
  {
    id: 7,
    level: 'CE1',
    theme: 'Actions',
    mots: ['manger', 'courir', 'sauter', 'chanter', 'danser'],
    phrases: ['Je mange une pomme.', 'Il court vite.', 'Nous chantons.'],
  },
  {
    id: 8,
    level: 'CE1',
    theme: 'Objets',
    mots: ['maison', 'voiture', 'vélo', 'ballon', 'jouet'],
    phrases: ['La maison est grande.', 'Le vélo roule.', 'Un ballon rouge.'],
  },
  {
    id: 9,
    level: 'CE1',
    theme: 'Sons "ch/ou/on"',
    mots: ['chat', 'chien', 'loup', 'bonbon', 'maison'],
    phrases: ['Le chat miaule.', 'Un bonbon sucré.', 'La maison bleue.'],
  },
  {
    id: 10,
    level: 'CE1',
    theme: 'Pluriel simple',
    mots: ['chats', 'chiens', 'fleurs', 'arbres', 'oiseaux'],
    phrases: ['Les chats dorment.', 'Des fleurs jaunes.', 'Trois oiseaux.'],
  },

  // ── CE2 (8-9 ans) : phrases complexes, exceptions, homophones, conjugaisons ─
  {
    id: 11,
    level: 'CE2',
    theme: 'Conjugaison présent',
    mots: ['je mange', 'tu cours', 'il lit', 'nous allons', 'elles dansent'],
    phrases: ['Je mange une pomme.', 'Tu cours dans le parc.', 'Elles dansent bien.'],
  },
  {
    id: 12,
    level: 'CE2',
    theme: 'Homophones a/à',
    mots: ['a', 'à', 'la', 'l\'a', 'as'],
    phrases: ['Il a un chat.', 'Je vais à l\'école.', 'Elle l\'a vu.'],
  },
  {
    id: 13,
    level: 'CE2',
    theme: 'Homophones et/est',
    mots: ['et', 'est', 'c\'est', 's\'est', 'était'],
    phrases: ['Le chat est noir.', 'Il mange et dort.', 'C\'est beau.'],
  },
  {
    id: 14,
    level: 'CE2',
    theme: 'Accords sujet-verbe',
    mots: ['ils chantent', 'elle danse', 'nous lisons', 'vous courez', 'on joue'],
    phrases: ['Ils chantent fort.', 'Elle danse seule.', 'Nous lisons ensemble.'],
  },
  {
    id: 15,
    level: 'CE2',
    theme: 'Dictée complète',
    mots: ['grenouille', 'papillon', 'éléphant', 'girafe', 'hippopotame'],
    phrases: ['La grenouille saute.', 'Un papillon vole.', 'L\'éléphant est grand.'],
  },
];

// ── Helpers utiles ──────────────────────────────────────────────────────────
export const getDictéesByLevel = (level: Level): Dictée[] => 
  DICTEES.filter(d => d.level === level);

export const getDictéesByTheme = (theme: string): Dictée[] => 
  DICTEES.filter(d => d.theme?.toLowerCase() === theme.toLowerCase());

export const getAllThemes = (): string[] => 
  [...new Set(DICTEES.map(d => d.theme).filter(Boolean))] as string[];