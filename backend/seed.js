require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';

const seedData = {
  title: 'Общий тест',
  questions: [
    {
      text: 'Какая страна является самой большой по площади?',
      answers: [
        { text: 'Канада', isCorrect: false },
        { text: 'Китай', isCorrect: false },
        { text: 'Россия', isCorrect: true },
        { text: 'США', isCorrect: false }
      ]
    },
    {
      text: 'Сколько планет в Солнечной системе?',
      answers: [
        { text: '7', isCorrect: false },
        { text: '8', isCorrect: true },
        { text: '9', isCorrect: false },
        { text: '10', isCorrect: false }
      ]
    },
    {
      text: 'Какой химический символ обозначает золото?',
      answers: [
        { text: 'Go', isCorrect: false },
        { text: 'Gd', isCorrect: false },
        { text: 'Au', isCorrect: true }
      ]
    }
  ]
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Quiz.deleteMany({});
    console.log('Cleared existing quizzes');

    const quiz = await Quiz.create(seedData);
    console.log('Seeded quiz:', quiz.title);

    await mongoose.disconnect();
    console.log('Done. Disconnected from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
