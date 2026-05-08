import './index.css';
import { useState } from 'react';
import HomePage from './components/HomePage';
import FrenchApp from './components/FrenchApp';
import EnglishApp from './components/EnglishApp';
import MathApp from './components/MathApp';

type Subject = 'home' | 'french' | 'english' | 'math';

export default function App() {
  const [currentSubject, setCurrentSubject] = useState<Subject>('home');

  const renderSubject = () => {
    switch (currentSubject) {
      case 'french':
        return <FrenchApp onBack={() => setCurrentSubject('home')} />;
      case 'english':
        return <EnglishApp onBack={() => setCurrentSubject('home')} />;
      case 'math':
        return <MathApp onBack={() => setCurrentSubject('home')} />;
      default:
        return <HomePage onSelectSubject={setCurrentSubject} />;
    }
  };

  return <div>{renderSubject()}</div>;
}