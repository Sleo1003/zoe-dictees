// src/App.tsx
import { useState, useEffect } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import FrenchApp from './components/FrenchApp';
import EnglishApp from './components/EnglishApp';
import MathApp from './components/MathApp';
import PhoneticsApp from './components/PhoneticsApp';
import ProfileSelector from './components/ProfileSelector';
import ParentDashboard from './components/ParentDashboard';
import { getActiveProfile } from './utils/storage';

type AppView = 'profile' | 'home' | 'french' | 'english' | 'math' | 'phonetics' | 'dashboard';

export default function App() {
  const [view, setView] = useState<AppView>('profile');
  const [activeProfile, setActiveProfile] = useState<string | null>(null);

  useEffect(() => {
    getActiveProfile().then(pid => {
      if (pid) {
        setActiveProfile(pid);
        setView('home');
      }
    });
  }, []);

  // Sélecteur de profils
  if (view === 'profile') {
    return (
      <ProfileSelector
        onProfileSelected={(pid) => {
          setActiveProfile(pid);
          setView('home');
        }}
        onOpenDashboard={() => setView('dashboard')}
      />
    );
  }

  // Tableau de bord parent
  if (view === 'dashboard') {
    return (
      <ParentDashboard
        profileId={activeProfile || ''}
        onBack={() => setView(activeProfile ? 'home' : 'profile')}
      />
    );
  }

  // Interface principale
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {view !== 'home' && activeProfile && (
        <button
          onClick={() => setView('home')}
          style={{
            position: 'fixed', top: 15, left: 15, zIndex: 9999,
            padding: '10px 14px', background: '#fff', border: '2px solid #e5e7eb',
            borderRadius: '10px', cursor: 'pointer', fontWeight: 600
          }}
        >
          🏠 Accueil
        </button>
      )}

      {view === 'home' && activeProfile && (
        <HomePage
          onSelectSubject={(subject: string) => setView(subject as AppView)}
          onOpenDashboard={() => setView('dashboard')}
        />
      )}

      {view === 'french'    && activeProfile && <FrenchApp    onBack={() => setView('home')} profileId={activeProfile} />}
      {view === 'english'   && activeProfile && <EnglishApp   onBack={() => setView('home')} profileId={activeProfile} />}
      {view === 'math'      && activeProfile && <MathApp      onBack={() => setView('home')} profileId={activeProfile} />}
      {view === 'phonetics' && activeProfile && <PhoneticsApp onBack={() => setView('home')} profileId={activeProfile} />}
    </div>
  );
}