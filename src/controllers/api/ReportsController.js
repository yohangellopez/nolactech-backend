require('dotenv').config()
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const Controller = require('../Controller');
const Employee = require('../../models/Employee');
const Evaluation = require('../../models/Evaluation');
const role = require('../../middlewares/role');

class controller  extends Controller {
    constructor() {
        super();
        this.routes();
    }

    routes() {

        this.router.get('/employee/:id',role(['admin', 'manager']), async(req, res) => {
            try {
                const evaluations = await Evaluation.find({ employee: req.params.id }).populate('questions');
                res.json(evaluations);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        });  
        
        this.router.get('/department/:id',role(['admin', 'manager']), async(req, res) => {
            try {
                const employees = await Employee.find({ department: req.params.id });
                const evaluations = await Evaluation.find({ employee: { $in: employees.map(emp => emp._id) } }).populate('questions');
                res.json(evaluations);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        });

        
        
    }
}
module.exports = new controller().router;