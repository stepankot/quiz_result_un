import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TakeQuiz from './pages/TakeQuiz';
import EditQuiz from './pages/EditQuiz';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<TakeQuiz />} />
      <Route path="/edit" element={<EditQuiz />} />
    </Routes>
  );
}

export default App;
