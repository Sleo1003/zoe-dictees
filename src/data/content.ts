import type { Dictée, QCMItem, GameType } from '../types';
export const DICTEES: Dictée[] = [
  {id:1, mots:["Mira","vélo","robe","rouge","soleil","moto","purée","chien"], phrases:["Mira a une robe rouge.","Le chien est sur le vélo.","Le soleil brille sur la moto.","Mira mange de la purée."]},
  {id:2, mots:["maman","Véro","tomate","tarte","télé","bébé","salade","robot"], phrases:["Maman a préparé une tarte.","Véro mange des tomates.","Le bébé regarde la télé.","Le robot mange de la salade."]},
  {id:3, mots:["Rémi","polo","chat","rat","hibou","lit"], phrases:["Rémi est poli.","C'est un chat.","Le hibou est sur le lit.","Le rat porte un polo."]},
  {id:4, mots:["Amélie","tulipe","lavabo","biberon","forêt"], phrases:["Amélie est malade.","Le bébé boit dans un biberon.","Il y a une tulipe dans la forêt.","Amélie lave le lavabo."]},
  {id:5, mots:["Rita","mémé","Pamela","jupe","fille","garçon","parachute","pile"], phrases:["Rita va chez sa mémé.","Pamela a lavé sa jupe.","Il a vu une fille et un garçon.","Le garçon a une pile pour le parachute."]},
  {id:6, mots:["Sacha","moto","Titi","canari","chou","fille","garçon","faratas"], phrases:["Sacha a acheté une moto verte.","Titi a un petit canari.","Une fille et un garçon mangent du chou.","Sacha prépare des faratas."]},
  {id:7, mots:["chien","chat","poule","roupie","tapis","cahier","crayon","table"], phrases:["La roupie est sur le tapis.","Il y a un cahier et un crayon sous la table.","Le chien et le chat jouent.","La poule est sur le tapis."]},
  {id:8, mots:["Sacha","Lara","maman","olive","four","rêve"], phrases:["Sacha a fait un rêve.","Lara joue avec maman.","Maman cuit les olives au four.","Lara a fait un beau rêve."]},
  {id:9, mots:["Papa","coq","Sami","canard","locomotive","nuit","soleil","robe"], phrases:["Papa voit un canard et un coq.","La locomotive roule la nuit.","Sami porte une belle robe.","Le soleil brille sur la locomotive."]},
  {id:10, mots:["Papi","salade","patate","nuit"], phrases:["Papi a salé la salade.","Il fait nuit.","La patate est dans la salade de Papi.","Papi mange la nuit."]},
  {id:11, mots:["Lili","Méli","banane","nuage","cheval","jus","lit"], phrases:["Lili est sur le lit.","Méli mange une banane.","Un nuage bleu est dans le ciel.","Le cheval de Méli boit un jus."]},
  {id:12, mots:["Mica","pilote","pomelo","fête","farine","samedi","jeudi"], phrases:["Mica a fait une fête samedi.","Le pilote mange un pomelo.","La farine est sur la table.","Jeudi, Mica prépare un gâteau avec de la farine."]},
  {id:13, mots:["Sacha","Léa","gâteau","dragon","séga","mercredi","vendredi","dimanche"], phrases:["Sacha mange un gâteau le dimanche.","Léa danse le séga le vendredi.","Un dragon est sous le lit.","Mercredi, Léa et Sacha font la fête."]},
  {id:14, mots:["Nora","Nicolas","canapé","légumes","joli"], phrases:["Nora mange des légumes.","Nicolas est joli.","Nora et Nicolas sont sur le canapé.","Les légumes de Nora sont jolis."]},
  {id:15, mots:["Mina","Marou","chiens","chou","dragon","route"], phrases:["J'aime les chiens.","Mina coupe un chou pour Marou.","Le dragon est sur la route.","Marou et Mina aiment les chiens."]},
];
export const QCM_POOL: QCMItem[] = [
  {s:"Mira ___ une robe rouge.", a:"a", o:["a","à","as"], tip:"'a' vient du verbe avoir"},
  {s:"Maman ___ préparé une tarte.", a:"a", o:["a","à","as"], tip:"'a' vient du verbe avoir"},
  {s:"Il boit ___ lait.", a:"du", o:["du","de","des"], tip:"du = de + le"},
  {s:"Papi ___ salé la salade.", a:"a", o:["a","à","as"], tip:"'a' vient du verbe avoir"},
  {s:"Rita va ___ pied.", a:"à", o:["a","à","as"], tip:"'à' indique la direction"},
  {s:"Le bébé va ___ l'école.", a:"à", o:["a","à","as"], tip:"'à' indique la direction"},
  {s:"Pamela ___ lavé sa jupe.", a:"a", o:["a","à","as"], tip:"'a' vient du verbe avoir"},
  {s:"Le chat ___ le chien jouent.", a:"et", o:["et","est","ai"], tip:"'et' relie deux mots"},
  {s:"Le hibou ___ sur le lit.", a:"est", o:["et","est","ai"], tip:"'est' vient du verbe être"},
  {s:"___ cartable est lourd.", a:"Son", o:["Son","Sa","Ses"], tip:"cartable = masculin → son"},
  {s:"___ jupe est belle.", a:"Sa", o:["Son","Sa","Ses"], tip:"jupe = féminin → sa"},
  {s:"Mica ___ fait une fête.", a:"a", o:["a","à","as"], tip:"'a' vient du verbe avoir"},
  {s:"Lili est ___ le lit.", a:"sur", o:["sur","sous","dans"], tip:""},
  {s:"Le chien est ___ le vélo.", a:"sur", o:["sur","sous","dans"], tip:""},
  {s:"Il y a un crayon ___ la table.", a:"sous", o:["sur","sous","dans"], tip:""},
];
export const GT: Record<string, GameType> = { MIRROR:'mirror', ANAGRAM:'anagram', BLANK:'blank', TILE:'tile', QCM:'qcm' };
export const LABELS: Record<GameType, string> = { mirror:'👀 Mot Miroir', anagram:'🔤 Lettres', blank:'📝 Mot Manquant', tile:'🧩 Phrase', qcm:'❓ Bon Mot' };
export const COLORS: Record<GameType, string> = { mirror:'#4F46E5', anagram:'#7C3AED', blank:'#EA580C', tile:'#059669', qcm:'#C2410C' };
export const CONFETTI = ['#94A3B8','#CBD5E1','#93C5FD','#86EFAC','#FDE68A','#FCA5A5','#F0ABFC','#BFDBFE'];
export const ROUNDS = 10;
