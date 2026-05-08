import type { Dictée, QCMItem, GameType } from '../types';

export const DICTEES: Dictée[] = [
  { id: 1, mots: ['chat', 'manger', 'papa', 'maman', 'école'], phrases: ['Le chat mange à la cantine.', 'Papa et maman vont à l\'école.'] },
  { id: 2, mots: ['jardin', 'fleur', 'soleil', 'arbre', 'oiseau'], phrases: ['La fleur pousse dans le jardin.', 'L\'oiseau chante sur l\'arbre.'] },
  { id: 3, mots: ['livre', 'page', 'lire', 'histoire', 'ami'], phrases: ['Je lis une histoire dans le livre.', 'Mon ami tourne la page.'] },
  { id: 4, mots: ['maison', 'fenêtre', 'porte', 'jardin', 'toit'], phrases: ['La maison a une grande fenêtre.', 'Le jardin est derrière la maison.'] },
  { id: 5, mots: ['chien', 'chat', 'oiseau', 'poisson', 'hamster'], phrases: ['Le chien joue avec le chat.', 'Le poisson nage dans l\'eau.'] },
  { id: 6, mots: ['pomme', 'poire', 'raisin', 'banane', 'orange'], phrases: ['Je mange une pomme rouge.', 'La banane est un fruit jaune.'] },
  { id: 7, mots: ['table', 'chaise', 'lit', 'armoire', 'lampe'], phrases: ['Le livre est sur la table.', 'Ma chambre a un grand lit.'] },
  { id: 8, mots: ['voiture', 'bus', 'train', 'avion', 'vélo'], phrases: ['Le bus roule dans la rue.', 'L\'avion vole dans le ciel.'] },
  { id: 9, mots: ['soleil', 'pluie', 'neige', 'vent', 'nuage'], phrases: ['Il fait beau, le soleil brille.', 'Il y a de gros nuages gris.'] },
  { id: 10, mots: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'], phrases: ['Aujourd\'hui c\'est mercredi.', 'Lundi je retourne à l\'école.'] },
  { id: 11, mots: ['main', 'pied', 'tête', 'nez', 'bouche'], phrases: ['Je me lave les mains.', 'J\'ai mal à la tête.'] },
  { id: 12, mots: ['rouge', 'bleu', 'vert', 'jaune', 'noir'], phrases: ['Le ciel est bleu.', 'L\'herbe est verte.'] },
  { id: 13, mots: ['manger', 'boire', 'dormir', 'courir', 'sauter'], phrases: ['J\'aime manger des pâtes.', 'Le cheval court très vite.'] },
  { id: 14, mots: ['père', 'mère', 'frère', 'sœur', 'famille'], phrases: ['Mon frère est plus grand.', 'J\'aime ma famille.'] },
  { id: 15, mots: ['petit', 'grand', 'gros', 'mince', 'beau'], phrases: ['L\'éléphant est un gros animal.', 'La souris est toute petite.'] },
];

export const QCM_POOL: QCMItem[] = [
  { s: 'Quelle est la bonne orthographe ?', a: 'Maison', o: ['Maison', 'Mézon', 'Mésion'], tip: 'Le son [ɛ] s\'écrit "ai".' },
  { s: 'Trouve le verbe.', a: 'Manger', o: ['Manger', 'Mangeur', 'Mange'], tip: 'Manger est une action.' },
  { s: 'Quel est le pluriel ?', a: 'Les chats', o: ['Les chats', 'Les chas', 'Les chas'], tip: 'On ajoute un "s" au pluriel.' },
  { s: 'Complète la phrase.', a: 'Il est', o: ['Il est', 'Ils est', 'Il ai'], tip: 'Il est singulier.' },
  { s: 'Quel mot commence par "P" ?', a: 'Pomme', o: ['Pomme', 'Tome', 'Gomme'], tip: 'Pomme commence par P.' },
];

export const GT: Record<string, GameType> = { MIRROR: 'mirror', ANAGRAM: 'anagram', BLANK: 'blank', TILE: 'tile', QCM: 'qcm' };
export const LABELS: Record<GameType, string> = { mirror: '👀 Mot Miroir', anagram: '🔤 Lettres', blank: '📝 Mot Manquant', tile: '🧩 Phrase', qcm: '❓ Bon Mot' };
export const COLORS: Record<GameType, string> = { mirror: '#4F46E5', anagram: '#7C3AED', blank: '#EA580C', tile: '#059669', qcm: '#C2410C' };
export const CONFETTI = ['#94A3B8', '#CBD5E1', '#93C5FD', '#86EFAC', '#FDE68A', '#FCA5A5', '#F0ABFC', '#BFDBFE'];
export const ROUNDS = 10;

// Données pour la Phonétique Montessori
export const PHONETICS = [
  { letter: 'a', sound: 'a', word: 'abeille', emoji: '🐝', color: '#ff6b6b' },
  { letter: 'i', sound: 'i', word: 'île', emoji: '🏝️', color: '#4ecdc4' },
  { letter: 'o', sound: 'o', word: 'orange', emoji: '🍊', color: '#ff9f43' },
  { letter: 'u', sound: 'u', word: 'ours', emoji: '🐻', color: '#54a0ff' },
  { letter: 'm', sound: 'm', word: 'maman', emoji: '👩', color: '#5f27cd' },
  { letter: 's', sound: 's', word: 'soleil', emoji: '☀️', color: '#feca57' },
  { letter: 'r', sound: 'r', word: 'rat', emoji: '🐀', color: '#ff9ff3' },
  { letter: 'p', sound: 'p', word: 'poule', emoji: '🐔', color: '#48dbfb' },
  { letter: 'ch', sound: 'ch', word: 'chat', emoji: '🐱', color: '#1dd1a1' },
  { letter: 'on', sound: 'on', word: 'bonbon', emoji: '🍬', color: '#ff6b6b' },
  { letter: 'an', sound: 'an', word: 'éléphant', emoji: '🐘', color: '#5f27cd' },
  { letter: 'ou', sound: 'ou', word: 'loup', emoji: '🐺', color: '#54a0ff' },
];