let voicesReady = false;
function ensure() { if (!window.speechSynthesis || voicesReady) return; window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => { voicesReady = true; }; }
export const getVoice = () => { ensure(); const v = window.speechSynthesis?.getVoices() || []; return v.find(x => x.lang.includes('fr') && /Amélie|Audrey|Julie|Marie/i.test(x.name)) || v.find(x => x.lang.includes('fr')) || null; };
export const speak = (t: string, r = 0.6) => { if (typeof window === 'undefined') return; window.speechSynthesis.cancel(); setTimeout(() => { try { const u = new SpeechSynthesisUtterance(t); u.lang = 'fr-FR'; u.rate = r; u.pitch = 1.1; const v = getVoice(); if (v) u.voice = v; window.speechSynthesis.speak(u); } catch {} }, 100); };
