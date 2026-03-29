import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TakeQuiz() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch('/api/quiz')
      .then((res) => {
        if (!res.ok) throw new Error('Тест не найден');
        return res.json();
      })
      .then((data) => {
        setQuiz(data);
        setSelectedAnswers(new Array(data.questions.length).fill(null));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectAnswer = (answerIndex) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = answerIndex;
    setSelectedAnswers(updated);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinish = () => {
    const questions = quiz.questions;
    let correct = 0;
    questions.forEach((q, qi) => {
      const selectedIdx = selectedAnswers[qi];
      if (selectedIdx !== null && selectedIdx !== undefined) {
        if (q.answers[selectedIdx]?.isCorrect) {
          correct++;
        }
      }
    });
    setScore(correct);

    const historyEntry = {
      date: new Date().toISOString(),
      totalQuestions: questions.length,
      correctAnswers: correct
    };
    try {
      const existing = JSON.parse(localStorage.getItem('quiz_history') || '[]');
      existing.push(historyEntry);
      localStorage.setItem('quiz_history', JSON.stringify(existing));
    } catch {
      localStorage.setItem('quiz_history', JSON.stringify([historyEntry]));
    }

    setFinished(true);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setFinished(false);
    setScore(0);
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

  if (error) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <div className="glass-card" style={{ padding: '48px 32px' }}>
          <div style={{ color: 'var(--negative)', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>
            {error}
          </div>
          <button className="btn-primary" onClick={() => navigate('/')}>На главную</button>
        </div>
      </div>
    );
  }

  if (finished) {
    const total = quiz.questions.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const isGood = pct >= 70;

    return (
      <div className="page-container">
        <style>{`@keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 70% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }`}</style>
        <div style={{ textAlign: 'center', paddingTop: '40px' }}>
          <div
            style={{
              width: '96px', height: '96px', borderRadius: '50%',
              background: isGood ? 'rgba(39,174,96,0.12)' : 'rgba(192,57,43,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'popIn 0.5s ease forwards'
            }}
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

          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--brand-darkest)', marginBottom: '8px' }}>
            Тест завершён!
          </h1>
          <p style={{ color: 'var(--brand-soft)', fontSize: '16px', marginBottom: '32px' }}>
            {quiz.title}
          </p>

          <div className="glass-card" style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div
              style={{
                fontSize: '56px', fontWeight: 800,
                color: isGood ? 'var(--positive)' : 'var(--negative)',
                lineHeight: 1, marginBottom: '8px'
              }}
            >
              {pct}%
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--brand-dark)', marginBottom: '4px' }}>
              {score} из {total} правильных ответов
            </div>
            <div style={{ fontSize: '14px', color: 'var(--brand-pale)' }}>
              {isGood ? 'Отличный результат!' : 'Попробуйте ещё раз'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              На главную
            </button>
            <button className="btn-secondary" onClick={handleRestart}>
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

  const question = quiz.questions[currentIndex];
  const total = quiz.questions.length;
  const isLast = currentIndex === total - 1;
  const selectedAnswer = selectedAnswers[currentIndex];
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="page-container">
      {/* Header */}
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
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brand-soft)' }}>
          {currentIndex + 1} из {total}
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: '6px', borderRadius: 'var(--radius-pill)',
          background: 'rgba(44,90,160,0.1)',
          marginBottom: '32px', overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%', borderRadius: 'var(--radius-pill)',
            background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-medium))',
            width: `${progress}%`,
            transition: 'width 0.4s ease'
          }}
        />
      </div>

      {/* Question */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-medium))',
            color: '#fff', borderRadius: 'var(--radius-pill)',
            padding: '4px 14px', fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.5px', marginBottom: '16px'
          }}
        >
          Вопрос {currentIndex + 1}
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-darkest)', lineHeight: 1.4 }}>
          {question.text}
        </h2>
      </div>

      {/* Answers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {question.answers.map((answer, idx) => {
          const isSelected = selectedAnswer === idx;
          return (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(idx)}
              style={{
                width: '100%', textAlign: 'left', padding: '18px 24px',
                borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                fontFamily: 'var(--font-family)', fontSize: '15px', fontWeight: 500,
                border: isSelected
                  ? '2px solid var(--brand-primary)'
                  : '2px solid rgba(44,90,160,0.12)',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(44,90,160,0.10), rgba(74,127,212,0.08))'
                  : 'rgba(255,255,255,0.7)',
                color: isSelected ? 'var(--brand-primary)' : 'var(--brand-darkest)',
                backdropFilter: 'blur(8px)',
                boxShadow: isSelected
                  ? '0 4px 20px rgba(44,90,160,0.15)'
                  : '0 2px 8px rgba(44,90,160,0.06)',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: '14px'
              }}
            >
              <span
                style={{
                  flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700,
                  background: isSelected
                    ? 'linear-gradient(135deg, var(--brand-primary), var(--brand-medium))'
                    : 'rgba(44,90,160,0.08)',
                  color: isSelected ? '#fff' : 'var(--brand-soft)',
                  transition: 'all 0.2s ease'
                }}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              {answer.text}
            </button>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
        <button
          className="btn-secondary"
          onClick={handlePrev}
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
            onClick={handleFinish}
            disabled={selectedAnswer === null || selectedAnswer === undefined}
          >
            Завершить
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={selectedAnswer === null || selectedAnswer === undefined}
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
