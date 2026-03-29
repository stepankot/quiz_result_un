import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

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
      <div className={styles.header}>
        <div className={styles.versionBadge}>
          <span className={styles.versionText}>
            Quiz 0.1
          </span>
        </div>

        <h1 className={styles.title}>
          {loadingTitle ? (
            <span className={styles.titleLoading}>Загрузка...</span>
          ) : (
            quizTitle
          )}
        </h1>
        <p className={styles.subtitle}>
          Проверьте свои знания и отслеживайте прогресс
        </p>
      </div>

      {/* Action buttons */}
      <div className={`glass-card ${styles.actionsCard}`}>
        <h2 className={styles.actionsTitle}>
          Начать
        </h2>
        <div className={styles.buttonsRow}>
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
        <h2 className={styles.historyTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-medium)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          История прохождений
        </h2>

        {history.length === 0 ? (
          <div className={`glass-card ${styles.emptyCard}`}>
            <div className={styles.emptyIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-pale)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v18H3z" />
                <path d="M9 9h6M9 13h4" />
              </svg>
            </div>
            <p className={styles.emptyText}>
              История пуста
            </p>
            <p className={styles.emptySubtext}>
              Пройдите тест, чтобы увидеть результаты здесь
            </p>
          </div>
        ) : (
          <div className={styles.historyList}>
            {[...history].reverse().map((entry, index) => {
              const pct = entry.totalQuestions > 0
                ? Math.round((entry.correctAnswers / entry.totalQuestions) * 100)
                : 0;
              const isGood = pct >= 70;
              return (
                <div
                  key={index}
                  className={`glass-card ${styles.historyItem}`}
                >
                  <div>
                    <div className={styles.historyDate}>
                      {formatDate(entry.date)}
                    </div>
                    <div className={styles.historyScore}>
                      {entry.correctAnswers} из {entry.totalQuestions} правильных ответов
                    </div>
                  </div>
                  <div className={`${styles.scoreBadge} ${isGood ? styles.scoreBadgeGood : styles.scoreBadgeBad}`}>
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
