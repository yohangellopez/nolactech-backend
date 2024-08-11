const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  evaluation: { type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' },
  answer: { type: String, required: true },
});

module.exports = mongoose.model('Answer', AnswerSchema);
