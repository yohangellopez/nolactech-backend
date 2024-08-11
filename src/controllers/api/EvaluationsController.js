require('dotenv').config()
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const Controller = require('../Controller');
const Evaluation = require('../../models/Evaluation');
const Employee = require('../../models/Employee');
const role = require('../../middlewares/role');
const {validateEvaluation, handleValidationErrors} = require('../../middlewares/validation');
class controller  extends Controller {
    constructor() {
        super();
        this.routes();
    }

    routes() {
        /**
         * @swagger
         * /api/evaluations:
         *   get:
         *     summary: Obtiene una lista de evaluaciones
         *     description: Devuelve una lista de todas las evaluaciones en el sistema.
         *     responses:
         *       200:
         *         description: Lista de evaluaciones
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   _id:
         *                     type: string
         *                     description: ID de la evaluación
         *                   period:
         *                     type: string
         *                     description: Período de la evaluación
         *                   type:
         *                     type: string
         *                     description: Tipo de evaluación
         *                   employee:
         *                     type: string
         *                     description: ID del empleado asociado
         *                   questions:
         *                     type: array
         *                     items:
         *                       type: string
         *                     description: Lista de IDs de preguntas
         *       500:
         *         description: Error del servidor
         */
        this.router.get('/', async(req, res) => {
            try {
                const evaluations = await Evaluation.find().populate('employee').populate({
                    path: 'questions',
                    select: 'text type options' // Selecciona los campos que deseas de las preguntas
                  });
                res.json(evaluations);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        });

        /**
         * @swagger
         * /api/evaluations/:id:
         *   get:
         *     summary: Obtiene una evaluación
         *     description: Devuelve una evaluación del sistema.
         *     responses:
         *       200:
         *         description: Datos de una evaluación
         *         content:
         *           application/json:
         *             schema:
         *               type: Object
         *               items:
         *                 type: object
         *                 properties:
         *                   _id:
         *                     type: string
         *                     description: ID de la evaluación
         *                   period:
         *                     type: string
         *                     description: Período de la evaluación
         *                   type:
         *                     type: string
         *                     description: Tipo de evaluación
         *                   employee:
         *                     type: string
         *                     description: ID del empleado asociado
         *                   questions:
         *                     type: array
         *                     items:
         *                       type: string
         *                     description: Lista de IDs de preguntas
         *       404: 
         *         description: Evaluación no encontrada
         *       500:
         *         description: Error del servidor
         */
        this.router.get('/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const evaluation = await Evaluation.findById(id).populate('employee').populate('questions');
                if (!evaluation) {
                  return res.status(404).json({ msg: 'Evaluation not found' });
                }
                res.json(evaluation);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        })

        this.router.post('/',role(['admin', 'manager']),validateEvaluation, handleValidationErrors, async (req, res) => {
            try {
                const { period, type, employeeId, questions } = req.body;
                const employee = await Employee.findById(employeeId);
                if (!employee) {
                    return res.status(404).json({ msg: 'Empleado no encontrado' });
                }
                const newEvaluation = new Evaluation({
                    period,
                    type,
                    employee: employeeId,
                    questions
                });
                await newEvaluation.save();
                // verificar que se este guardando en un console.log
                res.status(201).json(newEvaluation);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        })


        this.router.put('/:id',role(['admin', 'manager']), validateEvaluation, handleValidationErrors, async (req, res) => {
            try {
                const { period, status, type, questions } = req.body;
                const updatedEvaluation = await Evaluation.findByIdAndUpdate(
                  req.params.id,
                  { period, status, type, questions },
                  { new: true, runValidators: true }
                );
                if (!updatedEvaluation) return res.status(404).json({ message: 'Evaluation not found' });
                res.status(200).json(updatedEvaluation);
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        })

        this.router.post('/:id/submit',role(['admin', 'manager']), async (req, res) => {
            try {
                const { id } = req.params;
                const evaluation = await Evaluation.findById(id);
                if (!evaluation) {
                  return res.status(404).json({ msg: 'Evaluation not found' });
                }
            
                evaluation.status = 'completed';
                await evaluation.save();
                res.json(evaluation);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        })

        
        
    }
}
module.exports = new controller().router;