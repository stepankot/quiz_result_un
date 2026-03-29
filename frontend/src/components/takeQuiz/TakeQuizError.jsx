import React from 'react';
import styles from '../../pages/TakeQuiz.module.css';

export default function TakeQuizError({ error, onGoHome }) {
  return (
    <div className={`page-container ${styles.errorContainer}`}>
      <div className={`glass-card ${styles.errorCard}`}>
        <div className={styles.errorText}>
          {error}
        </div>
        <button className="btn-primary" onClick={onGoHome}>На главную</button>
      </div>
    </div>
  );
}
