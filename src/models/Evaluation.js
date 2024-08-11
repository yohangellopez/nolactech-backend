const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
  period: {
    type: String, // Por ejemplo, "Q1 2024", "Anual 2024"
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'], // Puedes ajustar estos valores según tu lógica
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['self', 'peer', 'manager'], // Ejemplos de tipos de evaluación
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Referencia al modelo Employee
    required: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
}, { timestamps: true });

const Evaluation = mongoose.model('Evaluation', EvaluationSchema);

module.exports = Evaluation;
