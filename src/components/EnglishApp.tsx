interface EnglishAppProps { onBack: () => void; }
export default function EnglishApp({ onBack }: EnglishAppProps) {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <button onClick={onBack}> Retour</button>
      <h1>🌍 English - Bientôt disponible</h1>
    </div>
  );
}