const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  evaluation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evaluation',
    required: true,
  },
  response: {
    type: String, // O cualquier otro tipo dependiendo de la pregunta
    required: true,
  }
});

module.exports = mongoose.model('Response', ResponseSchema);
