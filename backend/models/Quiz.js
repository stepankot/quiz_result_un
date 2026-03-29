const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  answers: [AnswerSchema]
});

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    questions: [QuestionSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', QuizSchema);
