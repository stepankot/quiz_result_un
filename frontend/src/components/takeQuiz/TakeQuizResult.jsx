import React from 'react';
import styles from '../../pages/TakeQuiz.module.css';

export default function TakeQuizResult({
  quizTitle,
  score,
  total,
  onGoHome,
  onRestart
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const isGood = pct >= 70;

  return (
    <div className="page-container">
      <div className={styles.resultWrapper}>
        <div
          className={`${styles.resultIcon} ${isGood ? styles.resultIconGood : styles.resultIconBad}`}
        >
          {isGood ? (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>

        <h1 className={styles.resultTitle}>
          Тест завершён!
        </h1>
        <p className={styles.resultSubtitle}>
          {quizTitle}
        </p>

        <div className={`glass-card ${styles.resultScoreCard}`}>
          <div className={`${styles.resultPct} ${isGood ? styles.resultPctGood : styles.resultPctBad}`}>
            {pct}%
          </div>
          <div className={styles.resultScoreText}>
            {score} из {total} правильных ответов
          </div>
          <div className={styles.resultHint}>
            {isGood ? 'Отличный результат!' : 'Попробуйте ещё раз'}
          </div>
        </div>

        <div className={styles.resultButtons}>
          <button className="btn-primary" onClick={onGoHome}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            На главную
          </button>
          <button className="btn-secondary" onClick={onRestart}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
            </svg>
            Пройти ещё раз
          </button>
        </div>
      </div>
    </div>
  );
}
