import { useState } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import FrenchApp from './components/FrenchApp';
import EnglishApp from './components/EnglishApp';
import MathApp from './components/MathApp';
import PhoneticsApp from './components/PhoneticsApp';

export default function App() {
  const [vue, setVue] = useState<'home' | 'french' | 'english' | 'math' | 'phonetics'>('home');

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {vue !== 'home' && (
        <button onClick={() => setVue('home')} style={{ position: 'fixed', top: 15, left: 15, zIndex: 9999, padding: '10px 14px', background: '#fff', border: '2px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>🏠 Accueil</button>
      )}
      {vue === 'home' && <HomePage onSelectSubject={(s: any) => setVue(s)} />}
      {vue === 'french' && <FrenchApp onBack={() => setVue('home')} />}
      {vue === 'english' && <EnglishApp onBack={() => setVue('home')} />}
      {vue === 'math' && <MathApp onBack={() => setVue('home')} />}
      {vue === 'phonetics' && <PhoneticsApp onBack={() => setVue('home')} />}
    </div>
  );
}