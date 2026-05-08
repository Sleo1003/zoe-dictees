interface Props { onBack: () => void; }

export default function EnglishApp({ onBack }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#1a1528', padding: 24, color: '#ece6f8', textAlign: 'center' }}>
      <button onClick={onBack} style={{ marginBottom: 24, background: 'none', border: 'none', color: '#7ec8c0', cursor: 'pointer' }}>← Retour</button>
      <h2>🌿 English</h2>
      <p style={{ color: '#a0a0b8', marginTop: 12 }}>Module en cours de construction. Bientôt disponible.</p>
    </div>
  );
}