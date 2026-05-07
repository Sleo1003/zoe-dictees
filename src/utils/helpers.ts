export const strip = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export const norm = (w: string) => strip(w.toLowerCase().replace(/[.,!?;:"'«»()\-''']/g, '').trim());
export const shuffle = <T>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const pick = <T>(a: T[]) => a[Math.floor(Math.random() * a.length)];
