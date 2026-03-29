import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: '3px solid rgba(44,90,160,0.2)',
            borderTopColor: 'var(--brand-primary)',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--brand-soft)', fontWeight: 500 }}>Загрузка теста...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <div className="glass-card" style={{ padding: '48px 32px' }}>
          <div style={{ color: 'var(--negative)', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>
            {fetchError}
          </div>
          <button className="btn-primary" onClick={() => navigate('/')}>На главную</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          className="btn-secondary"
          style={{ padding: '8px 20px', fontSize: '13px' }}
          onClick={() => navigate('/')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Назад
        </button>

        <div style={{ fontSize: '13px', color: 'var(--brand-soft)', fontWeight: 600, letterSpacing: '0.5px' }}>
          РЕДАКТОР ТЕСТА
        </div>
      </div>

      {/* Title */}
      <div className="glass-card" style={{ marginBottom: '28px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--brand-soft)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
          Название теста
        </label>
        <input
          type="text"
          value={quiz.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Введите название теста..."
          style={{ fontSize: '18px', fontWeight: 700, padding: '12px 18px' }}
        />
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
        {quiz.questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="glass-card"
            style={{ position: 'relative', paddingBottom: '24px' }}
          >
            {/* Question header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
              <span
                style={{
                  flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-medium))',
                  color: '#fff', borderRadius: 'var(--radius-pill)',
                  padding: '4px 14px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px'
                }}
              >
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
              style={{ marginBottom: '20px' }}
            />

            {/* Answers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {question.answers.map((answer, aIndex) => (
                <div
                  key={aIndex}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-lg)',
                    background: answer.isCorrect ? 'rgba(39,174,96,0.07)' : 'rgba(255,255,255,0.5)',
                    border: answer.isCorrect ? '1.5px solid rgba(39,174,96,0.3)' : '1.5px solid rgba(44,90,160,0.1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Correct radio */}
                  <label
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
                    title="Отметить как правильный"
                  >
                    <div
                      onClick={() => handleSetCorrect(qIndex, aIndex)}
                      style={{
                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                        border: answer.isCorrect ? '2px solid var(--positive)' : '2px solid rgba(44,90,160,0.25)',
                        background: answer.isCorrect ? 'var(--positive)' : 'transparent',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {answer.isCorrect && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </label>

                  {/* Answer text */}
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) => handleAnswerTextChange(qIndex, aIndex, e.target.value)}
                    placeholder={`Вариант ${String.fromCharCode(65 + aIndex)}...`}
                    style={{ flex: 1, background: 'transparent', border: 'none', boxShadow: 'none', padding: '4px 0' }}
                  />

                  {/* Delete answer */}
                  <button
                    onClick={() => handleDeleteAnswer(qIndex, aIndex)}
                    disabled={question.answers.length <= 2}
                    style={{
                      flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
                      border: 'none', background: 'transparent', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: question.answers.length <= 2 ? 'rgba(192,57,43,0.25)' : 'var(--negative)',
                      transition: 'background 0.15s'
                    }}
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
              style={{
                background: 'transparent', border: '1.5px dashed rgba(44,90,160,0.3)',
                borderRadius: 'var(--radius-lg)', padding: '9px 20px',
                color: 'var(--brand-medium)', fontFamily: 'var(--font-family)',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s ease', width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
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
        style={{
          background: 'transparent',
          border: '2px dashed rgba(44,90,160,0.25)',
          borderRadius: 'var(--radius-xl)', padding: '16px 24px',
          color: 'var(--brand-primary)', fontFamily: 'var(--font-family)',
          fontSize: '15px', fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.2s ease', width: '100%', marginBottom: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        Добавить вопрос
      </button>

      {/* Save area */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          {saveStatus === 'success' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--positive)', fontWeight: 600, fontSize: '14px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Тест успешно сохранён
            </div>
          )}
          {saveStatus === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--negative)', fontWeight: 600, fontSize: '14px' }}>
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
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: '#fff',
                animation: 'spin 0.8s linear infinite'
              }} />
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
