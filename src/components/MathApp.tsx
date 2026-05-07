interface MathAppProps { onBack: () => void; }
export default function MathApp({ onBack }: MathAppProps) {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <button onClick={onBack}>⬅ Retour</button>
      <h1>🔢 Maths - Bientôt disponible</h1>
    </div>
  );
}