// src/components/ParentDashboard.tsx
import { useState, useEffect } from 'react';
import { getErrors, getProgress, getParentStats } from '../utils/storage';
import type { ErrorCounts, Completed } from '../types';

interface ParentDashboardProps { profileId: string; onBack: () => void; }

export default function ParentDashboard({ profileId, onBack }: ParentDashboardProps) {
  const [stats, setStats] = useState({ sessions: 0, correct: 0, total: 0, lastDate: '' });
  const [errors, setErrors] = useState<ErrorCounts>({});
  const [progress, setProgress] = useState<Completed>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getParentStats(profileId), getErrors(profileId), getProgress(profileId)])
      .then(([s, e, p]) => { setStats(s); setErrors(e); setProgress(p); setLoading(false); });
  }, [profileId]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>⏳ Chargement...</div>;

  const topErrors = Object.entries(errors).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const dictCount = Object.keys(progress).length;
  const avgScore = dictCount > 0 ? Math.round(Object.values(progress).reduce((a, b) => a + b, 0) / dictCount) : 0;

  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#F8FAFC' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 24, padding: 28, boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: '#1E293B' }}>👨‍👩‍ Tableau de bord</h2>
          <button onClick={onBack} style={{ padding: '8px 16px', borderRadius: 12, background: '#E2E8F0', border: 'none', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>← Retour</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#F0F9FF', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#4F46E5' }}>{stats.sessions}</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Séances</div>
          </div>
          <div style={{ background: '#F0FDF4', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#16A34A' }}>{avgScore}%</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Score moyen</div>
          </div>
          <div style={{ background: '#FFF7ED', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#EA580C' }}>{topErrors.length}</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Erreurs fréquentes</div>
          </div>
        </div>
        <h3 style={{ color: '#334155', marginBottom: 12 }}>📊 Progression par dictée</h3>
        {Object.keys(progress).length === 0 ? <p style={{ color: '#64748B', fontStyle: 'italic' }}>Aucune dictée terminée.</p> : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {Object.entries(progress).map(([id, pct]) => (
              <span key={id} style={{ padding: '6px 12px', borderRadius: 20, background: pct >= 80 ? '#DCFCE7' : pct >= 50 ? '#FEF08A' : '#FEE2E2', color: pct >= 80 ? '#166534' : pct >= 50 ? '#854D0E' : '#991B1B', fontWeight: 700, fontSize: 13 }}>Dictée {id}: {pct}%</span>
            ))}
          </div>
        )}
        <h3 style={{ color: '#334155', marginBottom: 12 }}>⚠️ Mots à retravailler</h3>
        {topErrors.length === 0 ? <p style={{ color: '#64748B', fontStyle: 'italic' }}>Aucune erreur récurrente. Bravo !</p> : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {topErrors.map(([word, count]) => (
              <li key={word} style={{ padding: '10px 0', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>{word}</span>
                <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>{count}x</span>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: 24, padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <p style={{ margin: 0, color: '#64748B', fontSize: 14, textAlign: 'center' }}>📅 Dernière activité : {stats.lastDate || 'Aucune'}</p>
        </div>
      </div>
    </div>
  );
}