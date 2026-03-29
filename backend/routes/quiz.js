const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// GET /api/quiz — return the first quiz or 404
router.get('/', async (req, res) => {
  try {
    const quiz = await Quiz.findOne();
    if (!quiz) {
      return res.status(404).json({ message: 'No quiz found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/quiz — update (or create) the quiz
router.put('/', async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions) {
      return res.status(400).json({ message: 'title and questions are required' });
    }

    let quiz = await Quiz.findOne();

    if (quiz) {
      quiz.title = title;
      quiz.questions = questions;
      await quiz.save();
    } else {
      quiz = await Quiz.create({ title, questions });
    }

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
