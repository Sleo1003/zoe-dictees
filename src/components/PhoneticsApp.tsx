// src/components/PhoneticsApp.tsx - Version avec chargement des voix
import { useState, useEffect } from 'react';

export default function PhoneticsApp() {
  const [status, setStatus] = useState('⏳ Chargement des voix...');
  const [voicesReady, setVoicesReady] = useState(false);

  // Attendre que les voix soient disponibles (spécifique Chromium/Raspberry Pi)
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('🎤 [DEBUG] Voix disponibles:', voices.length);
      
      if (voices.length > 0) {
        setVoicesReady(true);
        setStatus('👇 Clique sur une carte pour écouter');
        return true;
      }
      return false;
    };

    // Essai immédiat
    if (loadVoices()) return;

    // Écouter l'événement de chargement des voix
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };

    // Fallback : réessayer après 2 secondes si onvoiceschanged ne se déclenche pas
    const timer = setTimeout(() => {
      if (!voicesReady) {
        loadVoices();
        if (!voicesReady) {
          setStatus('⚠️ Voix non chargées. Clique quand même pour tester.');
        }
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [voicesReady]);

  const parler = (mot: string, langue: string) => {
    console.log('🎤 [DEBUG] parler() pour:', mot, langue);
    
    if (!('speechSynthesis' in window)) {
      setStatus('❌ API non supportée');
      return;
    }

    window.speechSynthesis.cancel();
    
    const voix = new SpeechSynthesisUtterance(mot);
    voix.lang = langue;
    voix.rate = 0.7;
    voix.pitch = 1.1;
    
    // FORCER une voix disponible si possible
    const voices = window.speechSynthesis.getVoices();
    const voiceFr = voices.find(v => v.lang.startsWith('fr'));
    const voiceEn = voices.find(v => v.lang.startsWith('en'));
    voix.voice = langue === 'fr-FR' ? voiceFr || null : voiceEn || null;
    
    voix.onstart = () => {
      console.log('✅ [DEBUG] Lecture START');
      setStatus(`🔊 En cours : "${mot}"`);
    };
    
    voix.onend = () => {
      console.log('✅ [DEBUG] Lecture END');
      setStatus(`✅ Terminé : "${mot}"`);
    };
    
    voix.onerror = (e) => {
      console.error('❌ [DEBUG] Erreur:', e);
      setStatus(`⚠️ Erreur : ${e.error}`);
    };

    window.speechSynthesis.speak(voix);
    console.log('📢 [DEBUG] speak() envoyé');
  };

  // Si les voix ne sont pas prêtes, afficher un message d'attente
  if (!voicesReady) {
    return (
      <div style={{ maxWidth: 600, margin: '3rem auto', padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2>🔊 Explorateur de Sons</h2>
        <p style={{ fontSize: '1.2rem', color: '#666', margin: '1rem 0' }}>{status}</p>
        <p style={{ fontSize: '0.9rem', color: '#999' }}>
          💡 Astuce : Sur Raspberry Pi, les voix peuvent mettre 2-3 secondes à charger.<br/>
          Si rien ne se passe, clique quand même sur les cartes ci-dessous 👇
        </p>
        
        {/* Cartes visibles même en chargement */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => parler('chat', 'fr-FR')} style={{ padding: '1rem 1.5rem', border: '3px solid #2563eb', background: '#eff6ff', borderRadius: '12px', cursor: 'pointer', fontSize: '1.1rem' }}>
            🇫🇷 chat
          </button>
          <button onClick={() => parler('chef', 'en-US')} style={{ padding: '1rem 1.5rem', border: '3px solid #dc2626', background: '#fef2f2', borderRadius: '12px', cursor: 'pointer', fontSize: '1.1rem' }}>
            🇬🇧 chef
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 850, margin: '2rem auto', padding: '1.5rem', fontFamily: 'system-ui, sans-serif', background: '#fff', borderRadius: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🔊 Test Son : "ch"</h2>
      
      <div style={{ 
        background: '#f0f9ff', padding: '0.8rem', borderRadius: '10px', 
        textAlign: 'center', marginBottom: '1.5rem', fontWeight: 500 
      }}>
        {status}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => parler('chat', 'fr-FR')}
          style={{ flex: 1, minWidth: 240, padding: '1.5rem', borderRadius: '14px', border: '3px solid #2563eb', background: '#eff6ff', cursor: 'pointer', fontSize: '1.1rem' }}
        >
          🇫🇷 <strong>chat</strong><br/><span style={{ fontSize: '0.9rem', color: '#666' }}>/ʃa/</span>
        </button>

        <button 
          onClick={() => parler('chef', 'en-US')}
          style={{ flex: 1, minWidth: 240, padding: '1.5rem', borderRadius: '14px', border: '3px solid #dc2626', background: '#fef2f2', cursor: 'pointer', fontSize: '1.1rem' }}
        >
          🇬🇧 <strong>chef</strong><br/><span style={{ fontSize: '0.9rem', color: '#666' }}>/tʃɛf/</span>
        </button>
      </div>
    </div>
  );
}