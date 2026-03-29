import React from 'react';
import styles from '../../pages/TakeQuiz.module.css';

export default function TakeQuizLoading() {
  return (
    <div className={`page-container ${styles.loadingContainer}`}>
      <div className={styles.loadingInner}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Загрузка теста...</p>
      </div>
    </div>
  );
}
