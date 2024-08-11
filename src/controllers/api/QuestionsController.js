require('dotenv').config()
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const Controller = require('../Controller');
const Question = require('../../models/Question');
const role = require('../../middlewares/role');
const {validateQuestion, handleValidationErrors} = require('../../middlewares/validation');
class controller  extends Controller {
    constructor() {
        super();
        this.routes();
    }

    routes() {

        this.router.get('/', async(req, res) => {
            try {
                const questions = await Question.find();
                res.json(questions);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        });

        this.router.post('/',role(['admin', 'manager']), validateQuestion, handleValidationErrors,async (req, res) => {
            try {
                const { text, type, options } = req.body;
                const newQuestion = new Question({ text, type, options });
                await newQuestion.save();
                res.status(201).json(newQuestion);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        })


        this.router.put('/:id',role(['admin', 'manager']),validateQuestion, handleValidationErrors, async (req, res) => {
            try {
                const { id } = req.params;
                const { text, type, options } = req.body;
                const updatedQuestion = await Question.findByIdAndUpdate(
                id,
                { text, type, options },
                { new: true, runValidators: true }
                );
                if (!updatedQuestion) return res.status(404).json({ message: 'Question not found' });
                res.status(200).json(updatedQuestion);
                
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        })
    }
}
module.exports = new controller().router;