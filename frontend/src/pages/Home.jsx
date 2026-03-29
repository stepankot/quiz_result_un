import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingTitle, setLoadingTitle] = useState(true);

  useEffect(() => {
    fetch('/api/quiz')
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setQuizTitle(data.title))
      .catch(() => setQuizTitle('Тест'))
      .finally(() => setLoadingTitle(false));

    try {
      const stored = JSON.parse(localStorage.getItem('quiz_history') || '[]');
      setHistory(Array.isArray(stored) ? stored : []);
    } catch {
      setHistory([]);
    }
  }, []);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-medium))',
            borderRadius: '16px',
            padding: '10px 22px',
            marginBottom: '20px',
            boxShadow: '0 4px 20px rgba(44,90,160,0.25)'
          }}
        >
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Quiz 0.1
          </span>
        </div>

        <h1
          style={{
            fontSize: '42px',
            fontWeight: 800,
            color: 'var(--brand-darkest)',
            lineHeight: 1.1,
            marginBottom: '12px',
            letterSpacing: '-0.5px'
          }}
        >
          {loadingTitle ? (
            <span style={{ color: 'var(--brand-pale)' }}>Загрузка...</span>
          ) : (
            quizTitle
          )}
        </h1>
        <p style={{ color: 'var(--brand-soft)', fontSize: '16px', fontWeight: 500 }}>
          Проверьте свои знания и отслеживайте прогресс
        </p>
      </div>

      {/* Action buttons */}
      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--brand-dark)',
            marginBottom: '20px'
          }}
        >
          Начать
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/quiz')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Запустить тест
          </button>
          <button className="btn-secondary" onClick={() => navigate('/edit')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Редактировать тест
          </button>
        </div>
      </div>

      {/* History section */}
      <div>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--brand-dark)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-medium)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          История прохождений
        </h2>

        {history.length === 0 ? (
          <div
            className="glass-card"
            style={{ textAlign: 'center', padding: '40px 32px' }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(44,90,160,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-pale)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v18H3z" />
                <path d="M9 9h6M9 13h4" />
              </svg>
            </div>
            <p style={{ color: 'var(--brand-pale)', fontSize: '15px', fontWeight: 500 }}>
              История пуста
            </p>
            <p style={{ color: 'var(--brand-pale)', fontSize: '13px', marginTop: '6px' }}>
              Пройдите тест, чтобы увидеть результаты здесь
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...history].reverse().map((entry, index) => {
              const pct = entry.totalQuestions > 0
                ? Math.round((entry.correctAnswers / entry.totalQuestions) * 100)
                : 0;
              const isGood = pct >= 70;
              return (
                <div
                  key={index}
                  className="glass-card"
                  style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}
                >
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--brand-pale)', fontWeight: 500, marginBottom: '4px' }}>
                      {formatDate(entry.date)}
                    </div>
                    <div style={{ fontSize: '15px', color: 'var(--brand-dark)', fontWeight: 600 }}>
                      {entry.correctAnswers} из {entry.totalQuestions} правильных ответов
                    </div>
                  </div>
                  <div
                    style={{
                      background: isGood
                        ? 'rgba(39,174,96,0.12)'
                        : 'rgba(192,57,43,0.10)',
                      color: isGood ? 'var(--positive)' : 'var(--negative)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '6px 18px',
                      fontWeight: 700,
                      fontSize: '15px',
                      minWidth: '60px',
                      textAlign: 'center'
                    }}
                  >
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
