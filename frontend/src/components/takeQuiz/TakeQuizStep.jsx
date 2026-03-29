import React from 'react';
import styles from '../../pages/TakeQuiz.module.css';

export default function TakeQuizStep({
  currentIndex,
  total,
  progress,
  question,
  selectedAnswer,
  onSelectAnswer,
  onPrev,
  onNext,
  onFinish,
  onGoHome
}) {
  const isLast = currentIndex === total - 1;
  const isAnswerSelected = selectedAnswer !== null && selectedAnswer !== undefined;

  return (
    <div className="page-container">
      <div className={styles.quizHeader}>
        <button
          className={`btn-secondary ${styles.backBtn}`}
          onClick={onGoHome}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Назад
        </button>
        <div className={styles.questionCounter}>
          {currentIndex + 1} из {total}
        </div>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={`glass-card ${styles.questionCard}`}>
        <div className={styles.questionBadge}>
          Вопрос {currentIndex + 1}
        </div>
        <h2 className={styles.questionText}>
          {question.text}
        </h2>
      </div>

      <div className={styles.answersList}>
        {question.answers.map((answer, index) => {
          const selected = selectedAnswer === index;

          return (
            <button
              key={index}
              onClick={() => onSelectAnswer(index)}
              className={`${styles.answerBtn} ${selected ? styles.answerBtnSelected : ''}`}
            >
              <span className={`${styles.answerLetter} ${selected ? styles.answerLetterSelected : ''}`}>
                {String.fromCharCode(65 + index)}
              </span>
              {answer.text}
            </button>
          );
        })}
      </div>

      <div className={styles.navRow}>
        <button
          className="btn-secondary"
          onClick={onPrev}
          disabled={currentIndex === 0}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Предыдущий вопрос
        </button>

        {isLast ? (
          <button
            className="btn-primary"
            onClick={onFinish}
            disabled={!isAnswerSelected}
          >
            Завершить
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={onNext}
            disabled={!isAnswerSelected}
          >
            Следующий вопрос
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
