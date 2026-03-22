// 📁 src/pages/AiFeedback.js

import { useState } from 'react';
import api from '../api/index';

const AiFeedback = () => {
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/ai/feedback');
      setFeedback(res.data.feedback);
      setStats(res.data.stats);
    } catch (err) {
      setError('피드백 생성 실패. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1917', letterSpacing: '-1px', margin: 0 }}>
          📊 AI 공부 피드백
        </h1>
        <p style={{ color: '#78716c', marginTop: 6, fontSize: '0.95rem' }}>
          오늘 완료한 할 일을 기반으로 AI가 피드백을 생성해드려요
        </p>
      </div>

      {/* 생성 버튼 */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          background: loading ? '#e8e4df' : 'linear-gradient(135deg, #f97316, #ea580c)',
          color: loading ? '#a8a29e' : 'white',
          border: 'none',
          borderRadius: 12,
          padding: '16px 32px',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: loading ? 'none' : '0 4px 20px rgba(249,115,22,0.3)',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
        }}
      >
        {loading ? (
          <>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
            AI가 분석 중이에요...
          </>
        ) : '✨ 오늘의 피드백 받기'}
      </button>

      {/* 에러 */}
      {error && (
        <div style={{
          padding: '16px 20px', background: '#fef2f2',
          border: '1px solid #fecaca', borderRadius: 12,
          color: '#dc2626', marginBottom: 24, fontSize: '0.9rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* 통계 카드 */}
      {stats && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16, marginBottom: 28
        }}>
          {[
            { label: '전체 할 일', value: `${stats.total}개`, icon: '📝' },
            { label: '완료', value: `${stats.completed}개`, icon: '✅' },
            { label: '완료율', value: `${stats.completionRate}%`, icon: '📈' },
            { label: '총 공부시간', value: `${stats.totalMinutes}분`, icon: '⏱' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'white', border: '1px solid #e8e4df',
              borderRadius: 12, padding: '20px 16px', textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f97316' }}>{item.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#78716c', marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* 피드백 본문 */}
      {feedback && (
        <div style={{
          background: 'white', border: '1px solid #e8e4df',
          borderRadius: 16, padding: '32px 36px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          lineHeight: 1.8
        }}>
          {feedback.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return (
                <h2 key={i} style={{
                  fontSize: '1.05rem', fontWeight: 700,
                  color: '#1c1917', margin: '24px 0 10px',
                  paddingBottom: 8, borderBottom: '2px solid #fed7aa',
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  {line.replace('## ', '')}
                </h2>
              );
            }
            if (line.startsWith('- ') || line.startsWith('* ')) {
              return (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  marginBottom: 6, color: '#44403c', fontSize: '0.95rem'
                }}>
                  <span style={{ color: '#f97316', flexShrink: 0, marginTop: 2 }}>▸</span>
                  <span>{line.replace(/^[-*] /, '')}</span>
                </div>
              );
            }
            if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
            return (
              <p key={i} style={{ color: '#44403c', fontSize: '0.95rem', margin: '4px 0' }}>
                {line}
              </p>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AiFeedback;