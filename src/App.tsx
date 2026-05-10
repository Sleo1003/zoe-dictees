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

export default function App() {
  const [vue, setVue] = useState<'home' | 'french' | 'english' | 'math' | 'phonetics' | 'profile' | 'dashboard'>('profile');
  const [activeProfile, setActiveProfile] = useState<string | null>(null);

  useEffect(() => {
    getActiveProfile().then(pid => {
      if (pid) { setActiveProfile(pid); setVue('home'); }
    });
  }, []);

  if (vue === 'profile') {
    return <ProfileSelector 
      onProfileSelected={(pid) => { setActiveProfile(pid); setVue('home'); }} 
      onOpenDashboard={() => activeProfile ? setVue('dashboard') : setVue('profile')} 
    />;
  }

  if (vue === 'dashboard' && activeProfile) {
    return <ParentDashboard profileId={activeProfile} onBack={() => setVue('home')} />;
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {vue !== 'home' && activeProfile && (
        <button onClick={() => setVue('home')} style={{ position: 'fixed', top: 15, left: 15, zIndex: 9999, padding: '10px 14px', background: '#fff', border: '2px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>🏠 Accueil</button>
      )}
      {vue === 'home' && <HomePage onSelectSubject={(s: any) => setVue(s)} onOpenDashboard={() => setVue('dashboard')} />}
      {vue === 'french' && activeProfile && <FrenchApp onBack={() => setVue('home')} profileId={activeProfile} />}
      {vue === 'english' && activeProfile && <EnglishApp onBack={() => setVue('home')} profileId={activeProfile} />}
      {vue === 'math' && activeProfile && <MathApp onBack={() => setVue('home')} profileId={activeProfile} />}
      {vue === 'phonetics' && activeProfile && <PhoneticsApp onBack={() => setVue('home')} profileId={activeProfile} />}
    </div>
  );
}