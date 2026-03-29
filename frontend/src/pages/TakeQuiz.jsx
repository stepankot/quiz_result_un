import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TakeQuizLoading from '../components/takeQuiz/TakeQuizLoading';
import TakeQuizError from '../components/takeQuiz/TakeQuizError';
import TakeQuizResult from '../components/takeQuiz/TakeQuizResult';
import TakeQuizStep from '../components/takeQuiz/TakeQuizStep';

const createSelectedAnswers = (questionsCount) => new Array(questionsCount).fill(null);

const calculateScore = (questions, selectedAnswers) => questions.reduce((correctAnswers, question, index) => {
  const selectedIndex = selectedAnswers[index];

  if (selectedIndex !== null && selectedIndex !== undefined && question.answers[selectedIndex]?.isCorrect) {
    return correctAnswers + 1;
  }

  return correctAnswers;
}, 0);

const saveQuizHistory = (historyEntry) => {
  try {
    const existing = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    existing.push(historyEntry);
    localStorage.setItem('quiz_history', JSON.stringify(existing));
  } catch {
    localStorage.setItem('quiz_history', JSON.stringify([historyEntry]));
  }
};

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
        setSelectedAnswers(createSelectedAnswers(data.questions.length));
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
    const correct = calculateScore(questions, selectedAnswers);
    setScore(correct);

    saveQuizHistory({
      date: new Date().toISOString(),
      totalQuestions: questions.length,
      correctAnswers: correct
    });

    setFinished(true);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers(createSelectedAnswers(quiz.questions.length));
    setFinished(false);
    setScore(0);
  };

  if (loading) {
    return <TakeQuizLoading />;
  }

  if (error) {
    return <TakeQuizError error={error} onGoHome={() => navigate('/')} />;
  }

  if (finished) {
    return (
      <TakeQuizResult
        quizTitle={quiz.title}
        score={score}
        total={quiz.questions.length}
        onGoHome={() => navigate('/')}
        onRestart={handleRestart}
      />
    );
  }

  const question = quiz.questions[currentIndex];
  const total = quiz.questions.length;
  const selectedAnswer = selectedAnswers[currentIndex];
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <TakeQuizStep
      currentIndex={currentIndex}
      total={total}
      progress={progress}
      question={question}
      selectedAnswer={selectedAnswer}
      onSelectAnswer={handleSelectAnswer}
      onPrev={handlePrev}
      onNext={handleNext}
      onFinish={handleFinish}
      onGoHome={() => navigate('/')}
    />
  );
}
