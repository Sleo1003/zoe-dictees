type Subject = 'home' | 'french' | 'english' | 'math';

interface HomePageProps {
  onSelectSubject: (subject: Subject) => void;
}

export default function HomePage({ onSelectSubject }: HomePageProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 24, textAlign: 'center' }}>
      
      <h1 style={{ color: '#fff', fontSize: 36, marginBottom: 20, fontWeight: 900 }}>
        🎓 Les Apprentissages de Zoé
      </h1>

      {/* IMAGE DU PERSONNAGE */}
      <div style={{ marginBottom: 40 }}>
        <img 
          src="/assets/character.png" 
          alt="Zoé" 
          style={{ maxWidth: '300px', borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} 
        />
      </div>

      {/* BOUTONS DES MATIÈRES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '0 auto' }}>
        
        {/* BOUTON FRANÇAIS */}
        <button 
          onClick={() => onSelectSubject('french')}
          style={{ padding: 20, borderRadius: 16, border: 'none', background: '#3b82f6', color: 'white', fontSize: 20, fontWeight: 800, cursor: 'pointer' }}
        >
           Français (Dictées)
        </button>

        {/* BOUTON ANGLAIS (Vide pour le moment) */}
        <button 
          onClick={() => onSelectSubject('english')}
          style={{ padding: 20, borderRadius: 16, border: 'none', background: '#10b981', color: 'white', fontSize: 20, fontWeight: 800, cursor: 'pointer' }}
        >
           English
        </button>

        {/* BOUTON MATHS (Vide pour le moment) */}
        <button 
          onClick={() => onSelectSubject('math')}
          style={{ padding: 20, borderRadius: 16, border: 'none', background: '#f97316', color: 'white', fontSize: 20, fontWeight: 800, cursor: 'pointer' }}
        >
          🔢 Mathématiques
        </button>

      </div>
    </div>
  );
}