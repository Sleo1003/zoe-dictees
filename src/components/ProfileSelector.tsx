// src/components/ProfileSelector.tsx
import { useState, useEffect } from 'react';
import { getProfiles, saveProfiles, getActiveProfile, saveActiveProfile } from '../utils/storage';
import type { Profile, Level } from '../types';

interface ProfileSelectorProps {
  onProfileSelected: (pid: string) => void;
  onOpenDashboard: () => void;
}

const AVATARS = ['🦁', '🦊', '🐼', '🦄', '🐸', '🐯', '🦋', '🐙'];
const LEVELS: Level[] = ['CP', 'CE1', 'CE2'];

export default function ProfileSelector({ onProfileSelected, onOpenDashboard }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [level, setLevel] = useState<Level>('CP');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  useEffect(() => { getProfiles().then(setProfiles); }, []);

  const handleCreate = () => {
    if (!name.trim()) return;
    const newProfile: Profile = {
      id: `profile_${Date.now()}`,
      name: name.trim(),
      level,
      avatar,
      createdAt: new Date().toISOString()
    };
    const updated = [...profiles, newProfile];
    saveProfiles(updated);
    setProfiles(updated);
    saveActiveProfile(newProfile.id);
    onProfileSelected(newProfile.id);
  };

  const handleSelect = (id: string) => {
    saveActiveProfile(id);
    onProfileSelected(id);
  };

  // Premier lancement : aucun profil → proposer d'en créer un
  if (profiles.length === 0 && !creating) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#F0F9FF,#F8FAFC)', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400, background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>👋</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1E293B', margin: '0 0 8px' }}>Bienvenue !</h1>
          <p style={{ color: '#64748B', marginBottom: 24 }}>Crée un profil pour commencer l'aventure.</p>
          <button onClick={() => setCreating(true)} style={{ padding: '12px 32px', borderRadius: 20, border: 'none', background: '#4F46E5', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>➕ Créer un profil</button>
        </div>
      </div>
    );
  }

  // Formulaire de création
  if (creating) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#F0F9FF,#F8FAFC)', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
          <h2 style={{ textAlign: 'center', color: '#1E293B', margin: '0 0 20px' }}>Nouveau profil</h2>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Prénom" style={{ width: '100%', padding: 14, borderRadius: 12, border: '2px solid #E2E8F0', fontSize: 18, marginBottom: 16, textAlign: 'center' }} />
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {LEVELS.map(l => (
              <button key={l} onClick={() => setLevel(l)} style={{ flex: 1, padding: 10, borderRadius: 12, border: level === l ? '2px solid #4F46E5' : '2px solid #E2E8F0', background: level === l ? '#EEF2FF' : '#fff', fontWeight: 700, color: level === l ? '#4F46E5' : '#64748B', cursor: 'pointer' }}>{l}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            {AVATARS.map(a => (
              <button key={a} onClick={() => setAvatar(a)} style={{ fontSize: 28, width: 48, height: 48, borderRadius: '50%', border: avatar === a ? '3px solid #4F46E5' : '2px solid #E2E8F0', background: avatar === a ? '#EEF2FF' : '#f8fafc', cursor: 'pointer' }}>{a}</button>
            ))}
          </div>
          <button onClick={handleCreate} disabled={!name.trim()} style={{ width: '100%', padding: 14, borderRadius: 16, border: 'none', background: '#4F46E5', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', opacity: name.trim() ? 1 : 0.5 }}>✅ Créer</button>
          <button onClick={() => setCreating(false)} style={{ width: '100%', marginTop: 10, padding: 10, background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>Annuler</button>
        </div>
      </div>
    );
  }

  // Liste des profils
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#F0F9FF,#F8FAFC)', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: '#1E293B' }}>👋 Qui est-ce ?</h2>
          {/* Bouton Parents - toujours visible */}
          <button
            onClick={onOpenDashboard}
            style={{ padding: '6px 12px', borderRadius: 8, background: '#F1F5F9', border: 'none', fontSize: 13, fontWeight: 600, color: '#475569', cursor: 'pointer' }}
          >
            👨‍👩‍ Parents
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {profiles.map(p => (
            <button key={p.id} onClick={() => handleSelect(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, border: '2px solid #E2E8F0', background: '#f8fafc', cursor: 'pointer' }}>
              <span style={{ fontSize: 32 }}>{p.avatar}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, color: '#334155', fontSize: 18 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: '#64748B' }}>{p.level} • Créé le {new Date(p.createdAt).toLocaleDateString()}</div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => setCreating(true)} style={{ width: '100%', padding: 14, borderRadius: 16, border: '2px dashed #CBD5E1', background: '#fff', color: '#4F46E5', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>➕ Ajouter un autre profil</button>
      </div>
    </div>
  );
}