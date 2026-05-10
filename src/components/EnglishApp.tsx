// src/components/EnglishApp.tsx

interface Props { 
  onBack: () => void; 
  profileId?: string; // Accepté pour compatibilité
}

export default function EnglishApp({ onBack, profileId }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#1a1528', padding: 24, color: '#ece6f8', textAlign: 'center' }}>
      <button 
        onClick={onBack} 
        style={{ marginBottom: 24, background: 'none', border: 'none', color: '#7ec8c0', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
      >
        ← Retour à l'accueil
      </button>
      <div style={{ maxWidth: 400, margin: '4rem auto' }}>
        <h1 style={{ fontSize: 40, marginBottom: 16 }}>🌿 English</h1>
        <p style={{ color: '#a0a0b8', fontSize: 18, lineHeight: 1.6 }}>
          Module en cours de construction.<br/>
          Bientôt disponible pour {profileId ? 'ce profil' : 'tous'} !
        </p>
      </div>
    </div>
  );
}