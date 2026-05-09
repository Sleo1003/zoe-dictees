export const playAudio = async (
  word: string,
  langOrRate?: 'fr' | 'en' | 'fr-FR' | 'en-US' | number
): Promise<boolean> => {
  let lang: 'fr' | 'en' = 'fr';
  let rate = 0.75;

  if (typeof langOrRate === 'number') {
    rate = langOrRate;
  } else if (typeof langOrRate === 'string') {
    lang = langOrRate.startsWith('en') ? 'en' : 'fr';
  }

  const piperPath = `/audio/${lang}/${word.toLowerCase()}.wav`;
  console.log(`🎵 [Piper] ${piperPath}`);

  return new Promise((resolve) => {
    const audio = new Audio(piperPath);
    audio.onended = () => resolve(true);
    audio.onerror = () => { fallbackSpeak(word, lang, rate); resolve(false); };
    audio.play().catch(() => { fallbackSpeak(word, lang, rate); resolve(false); });
  });
};

const fallbackSpeak = (text: string, lang: 'fr'|'en', rate: number): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) { resolve(false); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
    u.rate = rate; u.pitch = 1.1;
    u.onend = () => resolve(true); u.onerror = () => resolve(false);
    window.speechSynthesis.speak(u);
  });
};

if (typeof window !== 'undefined') {
  (window as any).testVoice = (w: string, l?: any) => playAudio(w, l).then(ok => console.log(ok ? '✅' : '❌'));
}
export const preloadAudio = (files: Array<{word: string, lang: 'fr'|'en'}>) => {
  files.forEach(({word, lang}) => new Audio(`/audio/${lang}/${word}.wav`).load());
};
export const speak = playAudio;