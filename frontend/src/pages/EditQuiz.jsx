import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditQuiz.module.css';

const emptyAnswer = () => ({ text: '', isCorrect: false });
const emptyQuestion = () => ({ text: '', answers: [emptyAnswer(), emptyAnswer()] });

export default function EditQuiz() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    fetch('/api/quiz')
      .then((res) => {
        if (!res.ok) throw new Error('Тест не найден');
        return res.json();
      })
      .then((data) => setQuiz(data))
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleTitleChange = (value) => {
    setQuiz((prev) => ({ ...prev, title: value }));
    setSaveStatus(null);
  };

  const handleQuestionTextChange = (qIndex, value) => {
    const updated = quiz.questions.map((q, i) =>
      i === qIndex ? { ...q, text: value } : q
    );
    setQuiz((prev) => ({ ...prev, questions: updated }));
    setSaveStatus(null);
  };

  const handleAnswerTextChange = (qIndex, aIndex, value) => {
    const updated = quiz.questions.map((q, i) => {
      if (i !== qIndex) return q;
      const answers = q.answers.map((a, j) =>
        j === aIndex ? { ...a, text: value } : a
      );
      return { ...q, answers };
    });
    setQuiz((prev) => ({ ...prev, questions: updated }));
    setSaveStatus(null);
  };

  const handleSetCorrect = (qIndex, aIndex) => {
    const updated = quiz.questions.map((q, i) => {
      if (i !== qIndex) return q;
      const answers = q.answers.map((a, j) => ({
        ...a,
        isCorrect: j === aIndex
      }));
      return { ...q, answers };
    });
    setQuiz((prev) => ({ ...prev, questions: updated }));
    setSaveStatus(null);
  };

  const handleAddAnswer = (qIndex) => {
    const updated = quiz.questions.map((q, i) =>
      i === qIndex ? { ...q, answers: [...q.answers, emptyAnswer()] } : q
    );
    setQuiz((prev) => ({ ...prev, questions: updated }));
  };

  const handleDeleteAnswer = (qIndex, aIndex) => {
    const updated = quiz.questions.map((q, i) => {
      if (i !== qIndex) return q;
      const answers = q.answers.filter((_, j) => j !== aIndex);
      return { ...q, answers };
    });
    setQuiz((prev) => ({ ...prev, questions: updated }));
    setSaveStatus(null);
  };

  const handleAddQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, emptyQuestion()]
    }));
  };

  const handleDeleteQuestion = (qIndex) => {
    if (quiz.questions.length <= 1) return;
    const updated = quiz.questions.filter((_, i) => i !== qIndex);
    setQuiz((prev) => ({ ...prev, questions: updated }));
    setSaveStatus(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/quiz', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: quiz.title, questions: quiz.questions })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Ошибка сохранения');
      }
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`page-container ${styles.loadingContainer}`}>
        <div className={styles.loadingInner}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Загрузка теста...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className={`page-container ${styles.errorContainer}`}>
        <div className={`glass-card ${styles.errorCard}`}>
          <div className={styles.errorText}>
            {fetchError}
          </div>
          <button className="btn-primary" onClick={() => navigate('/')}>На главную</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Top bar */}
      <div className={styles.topBar}>
        <button
          className={`btn-secondary ${styles.backButton}`}
          onClick={() => navigate('/')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Назад
        </button>

        <div className={styles.editorLabel}>
          РЕДАКТОР ТЕСТА
        </div>
      </div>

      {/* Title */}
      <div className={`glass-card ${styles.titleCard}`}>
        <label className={styles.fieldLabel}>
          Название теста
        </label>
        <input
          type="text"
          value={quiz.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Введите название теста..."
          className={styles.titleInput}
        />
      </div>

      {/* Questions */}
      <div className={styles.questionsList}>
        {quiz.questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className={`glass-card ${styles.questionCard}`}
          >
            {/* Question header */}
            <div className={styles.questionHeader}>
              <span className={styles.questionBadge}>
                Вопрос {qIndex + 1}
              </span>
              <button
                className="btn-danger"
                onClick={() => handleDeleteQuestion(qIndex)}
                disabled={quiz.questions.length <= 1}
                title="Удалить вопрос"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Удалить вопрос
              </button>
            </div>

            {/* Question text */}
            <input
              type="text"
              value={question.text}
              onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
              placeholder="Текст вопроса..."
              className={styles.questionInput}
            />

            {/* Answers */}
            <div className={styles.answersList}>
              {question.answers.map((answer, aIndex) => (
                <div
                  key={aIndex}
                  className={`${styles.answerRow} ${answer.isCorrect ? styles.answerRowCorrect : ''}`}
                >
                  <label
                    className={styles.correctLabel}
                    title="Отметить как правильный"
                  >
                    <div
                      onClick={() => handleSetCorrect(qIndex, aIndex)}
                      className={`${styles.correctToggle} ${answer.isCorrect ? styles.correctToggleActive : ''}`}
                    >
                      {answer.isCorrect && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </label>

                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) => handleAnswerTextChange(qIndex, aIndex, e.target.value)}
                    placeholder={`Вариант ${String.fromCharCode(65 + aIndex)}...`}
                    className={styles.answerInput}
                  />

                  <button
                    onClick={() => handleDeleteAnswer(qIndex, aIndex)}
                    disabled={question.answers.length <= 2}
                    className={styles.deleteAnswerButton}
                    title="Удалить вариант"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Add answer button */}
            <button
              onClick={() => handleAddAnswer(qIndex)}
              className={styles.addAnswerButton}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Добавить вариант ответа
            </button>
          </div>
        ))}
      </div>

      {/* Add question */}
      <button
        onClick={handleAddQuestion}
        className={styles.addQuestionButton}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        Добавить вопрос
      </button>

      {/* Save area */}
      <div className={`glass-card ${styles.saveCard}`}>
        <div className={styles.saveStatusWrap}>
          {saveStatus === 'success' && (
            <div className={`${styles.saveStatus} ${styles.saveStatusSuccess}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Тест успешно сохранён
            </div>
          )}
          {saveStatus === 'error' && (
            <div className={`${styles.saveStatus} ${styles.saveStatusError}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Ошибка при сохранении
            </div>
          )}
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <div className={styles.saveSpinner} />
              Сохранение...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Сохранить
            </>
          )}
        </button>
      </div>
    </div>
  );
}
