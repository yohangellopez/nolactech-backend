const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'rating', 'multiple-choice'],
    required: true,
  },
  options: [
    {
      type: String,
    },
  ],
}, { timestamps: true });

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
