interface Props { onBack: () => void; }
export default function MathApp({ onBack }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#1a1528', padding: 24, color: '#ece6f8', textAlign: 'center' }}>
      <button onClick={onBack} style={{ marginBottom: 24, background: 'none', border: 'none', color: '#e0c07a', cursor: 'pointer' }}>← Retour</button>
      <h2>🔮 Mathématiques</h2>
      <p style={{ color: '#a0a0b8', marginTop: 12 }}>Module en cours de construction. Bientôt disponible.</p>
    </div>
  );
}
