// src/data/phonicsContent.ts
import { ContrastPair } from '../types';

/**
 * Contenu phonétique bilingue (FR 🇫🇷 / EN 🇬🇧)
 * Conçu pour l'analyse contrastive et l'apprentissage métacognitif.
 * 
 * 📁 Structure des chemins attendue :
 * public/assets/sounds/fr/...  et  public/assets/sounds/en/...
 * public/assets/animations/...
 * 
 * 💡 Astuce : Pour tester sans fichiers réels, remplace temporairement les chemins
 * par des URLs de sons libres (ex: https://actions.google.com/sounds/v1/...)
 */
export const phonicsContent: ContrastPair[] = [
  {
    grapheme: 'ch',
    french: {
      word: 'chat',
      ipa: '/ʃa/',
      audio: '/assets/sounds/fr/chat.mp3',
      mouthAnimation: '/assets/animations/fr-ch.json',
      rule: {
        grapheme: 'ch',
        ipa: '/ʃ/',
        description: 'Son doux et continu, comme un train qui freine "chhh"',
        articulatoryCue: 'Lèvres arrondies, langue plate au fond de la bouche',
        language: 'fr',
        contrastWith: {
          otherLanguage: 'en',
          difference: 'En anglais, "ch" est explosif : on entend un petit "t" avant le son.'
        }
      }
    },
    english: {
      word: 'chef',
      ipa: '/tʃɛf/',
      audio: '/assets/sounds/en/chef.mp3',
      mouthAnimation: '/assets/animations/en-ch.json',
      rule: {
        grapheme: 'ch',
        ipa: '/tʃ/',
        description: 'Son court et explosif, comme un éternuement "tch!"',
        articulatoryCue: 'Langue touche le palais, puis se relâche vite',
        language: 'en'
      }
    },
    logicPrompt: 'Pourquoi "ch" est doux en français mais fait "tch" en anglais ?',
    masteryBadge: 'Détective des Sons 🕵️'
  },
  {
    grapheme: 's',
    french: {
      word: 'soleil',
      ipa: '/sɔ.lɛj/',
      audio: '/assets/sounds/fr/soleil.mp3',
      mouthAnimation: '/assets/animations/fr-s.json',
      rule: {
        grapheme: 's',
        ipa: '/s/',
        description: 'Son sifflant continu, comme une petite fuite d\'air',
        articulatoryCue: 'Dents rapprochées, langue collée derrière les dents du bas',
        language: 'fr',
        contrastWith: {
          otherLanguage: 'en',
          difference: 'Même son au début des mots, mais en français, "s" entre voyelles devient "z" (maison).'
        }
      }
    },
    english: {
      word: 'sun',
      ipa: '/sʌn/',
      audio: '/assets/sounds/en/sun.mp3',
      mouthAnimation: '/assets/animations/en-s.json',
      rule: {
        grapheme: 's',
        ipa: '/s/',
        description: 'Son sifflant net, toujours clair',
        articulatoryCue: 'Même position que en français, mais l\'air passe plus fort',
        language: 'en'
      }
    },
    logicPrompt: 'Quand est-ce que le "s" change de son en français ?',
    masteryBadge: 'Maître du Sifflement 🌬️'
  },
  {
    grapheme: 'n',
    french: {
      word: 'neige',
      ipa: '/nɛʒ/',
      audio: '/assets/sounds/fr/neige.mp3',
      mouthAnimation: '/assets/animations/fr-n.json',
      rule: {
        grapheme: 'n',
        ipa: '/n/',
        description: 'Son nasal qui vibre dans le nez',
        articulatoryCue: 'Pointe de la langue touche juste derrière les dents du haut',
        language: 'fr',
        contrastWith: {
          otherLanguage: 'en',
          difference: 'Son presque identique, mais en anglais on le prononce plus "net" au début des mots.'
        }
      }
    },
    english: {
      word: 'nose',
      ipa: '/noʊz/',
      audio: '/assets/sounds/en/nose.mp3',
      mouthAnimation: '/assets/animations/en-n.json',
      rule: {
        grapheme: 'n',
        ipa: '/n/',
        description: 'Son nasal clair, facile à entendre',
        articulatoryCue: 'Langue monte rapidement, air passe par le nez',
        language: 'en'
      }
    },
    logicPrompt: 'Pourquoi "n" fait vibrer le nez dans les deux langues ?',
    masteryBadge: 'Explorateur Nasal 👃'
  },
  {
    grapheme: 'g',
    french: {
      word: 'gare',
      ipa: '/ɡaʁ/',
      audio: '/assets/sounds/fr/gare.mp3',
      mouthAnimation: '/assets/animations/fr-g.json',
      rule: {
        grapheme: 'g',
        ipa: '/ɡ/',
        description: 'Son "dur" qui bloque l\'air au fond de la gorge',
        articulatoryCue: 'Fond de la langue touche le palais mou, puis relâche',
        language: 'fr',
        contrastWith: {
          otherLanguage: 'en',
          difference: 'Même son dur au début. Mais en français, "g" devant "e" ou "i" devient doux /ʒ/ (girafe).'
        }
      }
    },
    english: {
      word: 'go',
      ipa: '/ɡoʊ/',
      audio: '/assets/sounds/en/go.mp3',
      mouthAnimation: '/assets/animations/en-g.json',
      rule: {
        grapheme: 'g',
        ipa: '/ɡ/',
        description: 'Son "dur" comme un petit claquement de gorge',
        articulatoryCue: 'Même mouvement, mais l\'air sort plus vite',
        language: 'en'
      }
    },
    logicPrompt: 'Quand est-ce que le "g" fait un son doux en français ?',
    masteryBadge: 'Gardien des Sons G 🛡️'
  },
  {
    grapheme: 'ou',
    french: {
      word: 'loup',
      ipa: '/lu/',
      audio: '/assets/sounds/fr/loup.mp3',
      mouthAnimation: '/assets/animations/fr-ou.json',
      rule: {
        grapheme: 'ou',
        ipa: '/u/',
        description: 'Son long et rond, comme une trompette',
        articulatoryCue: 'Lèvres bien avancées en petit rond, langue reculée',
        language: 'fr',
        contrastWith: {
          otherLanguage: 'en',
          difference: 'En anglais, "ou" glisse souvent : on part d\'un "a" et on finit en "ou" (out /aʊ/).'
        }
      }
    },
    english: {
      word: 'out',
      ipa: '/aʊt/',
      audio: '/assets/sounds/en/out.mp3',
      mouthAnimation: '/assets/animations/en-ou.json',
      rule: {
        grapheme: 'ou',
        ipa: '/aʊ/',
        description: 'Son qui glisse, comme une surprise "Ah-ou !"',
        articulatoryCue: 'Bouche s\'ouvre large, puis se referme en rond',
        language: 'en'
      }
    },
    logicPrompt: 'Comment ta bouche bouge-t-elle pour dire "ou" dans les deux langues ?',
    masteryBadge: 'Acrobate des Lèvres 👄'
  },
  {
    grapheme: 'on',
    french: {
      word: 'pont',
      ipa: '/pɔ̃/',
      audio: '/assets/sounds/fr/pont.mp3',
      mouthAnimation: '/assets/animations/fr-on.json',
      rule: {
        grapheme: 'on',
        ipa: '/ɔ̃/',
        description: 'Son nasal rond, l\'air sort par le nez',
        articulatoryCue: 'Bouche ronde, langue basse, voile du palais ouvert',
        language: 'fr',
        contrastWith: {
          otherLanguage: 'en',
          difference: 'En anglais, on entend le "n" à la fin, et l\'air ne passe pas par le nez.'
        }
      }
    },
    english: {
      word: 'pond',
      ipa: '/pɒnd/',
      audio: '/assets/sounds/en/pond.mp3',
      mouthAnimation: '/assets/animations/en-on.json',
      rule: {
        grapheme: 'on',
        ipa: '/ɒn/',
        description: 'Son ouvert + "n" final distinct',
        articulatoryCue: 'Bouche large, langue remonte vite pour faire le "n"',
        language: 'en'
      }
    },
    logicPrompt: 'Pourquoi "on" chante dans le nez en français mais sonne "n" en anglais ?',
    masteryBadge: 'Champion Nasal 🎵'
  },
  {
    grapheme: 'om',
    french: {
      word: 'homme',
      ipa: '/ɔm/',
      audio: '/assets/sounds/fr/homme.mp3',
      mouthAnimation: '/assets/animations/fr-om.json',
      rule: {
        grapheme: 'om',
        ipa: '/ɔ̃/',
        description: 'Même son nasal que "on", mais écrit avec "m"',
        articulatoryCue: 'Lèvres rondes, air nasal, pas de "m" final prononcé',
        language: 'fr',
        contrastWith: {
          otherLanguage: 'en',
          difference: 'En anglais, "om" se prononce souvent /ɒm/ avec un "m" clair à la fin (bomb).'
        }
      }
    },
    english: {
      word: 'bomb',
      ipa: '/bɒm/',
      audio: '/assets/sounds/en/bomb.mp3',
      mouthAnimation: '/assets/animations/en-om.json',
      rule: {
        grapheme: 'om',
        ipa: '/ɒm/',
        description: 'Son ouvert + lèvres qui se ferment sur le "m"',
        articulatoryCue: 'Bouche large, puis lèvres se collent pour le "m"',
        language: 'en'
      }
    },
    logicPrompt: 'Pourquoi "on" et "om" sonnent pareil en français mais pas en anglais ?',
    masteryBadge: 'Magicien de l\'Orthographe ✨'
  },
  {
    grapheme: 'an',
    french: {
      word: 'enfant',
      ipa: '/ɑ̃.fɑ̃/',
      audio: '/assets/sounds/fr/enfant.mp3',
      mouthAnimation: '/assets/animations/fr-an.json',
      rule: {
        grapheme: 'an',
        ipa: '/ɑ̃/',
        description: 'Son nasal ouvert, comme une cloche qui résonne',
        articulatoryCue: 'Bouche grande ouverte, langue plate, air dans le nez',
        language: 'fr',
        contrastWith: {
          otherLanguage: 'en',
          difference: 'En anglais, "an" se prononce /æn/ : bouche basse, langue plate, air dans la bouche + "t/n" final.'
        }
      }
    },
    english: {
      word: 'ant',
      ipa: '/ænt/',
      audio: '/assets/sounds/en/ant.mp3',
      mouthAnimation: '/assets/animations/en-an.json',
      rule: {
        grapheme: 'an',
        ipa: '/æn/',
        description: 'Son court et plat, comme un "a" étiré',
        articulatoryCue: 'Mâchoire tombe, langue reste au fond, son bref',
        language: 'en'
      }
    },
    logicPrompt: 'Pourquoi "an" vibre dans le nez en français mais pas en anglais ?',
    masteryBadge: 'Architecte des Sons 🏗️'
  }
];

/**
 * Utilitaires rapides pour l'intégration
 */
export const getPairByGrapheme = (grapheme: string): ContrastPair | undefined => {
  return phonicsContent.find(p => p.grapheme === grapheme);
};

export const getRandomPair = (): ContrastPair => {
  return phonicsContent[Math.floor(Math.random() * phonicsContent.length)];
};

export const getNextPair = (current: string): ContrastPair => {
  const idx = phonicsContent.findIndex(p => p.grapheme === current);
  return phonicsContent[(idx + 1) % phonicsContent.length];
};