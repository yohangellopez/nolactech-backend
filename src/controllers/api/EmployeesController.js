require('dotenv').config()
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const Controller = require('../Controller');
const Employee = require('../../models/Employee');
const role = require('../../middlewares/role');
const {validateEmployeeCreation, handleValidationErrors} = require('../../middlewares/validation');

class controller  extends Controller {
    constructor() {
        super();
        this.routes();
    }

    routes() {

        this.router.get('/', async(req, res) => {
            try {
                // all employees with mongo
                const employees = await Employee.find().populate('manager');
                res.json(employees);
              } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
              }
        });

        this.router.get('/:id', async (req, res) => {
            const { id } = req.params;

            try {
                const employee = await Employee.findById(id).populate('manager');
                if (!employee) {
                  return res.status(404).json({ msg: 'Employee not found' });
                }
                res.json(employee);
              } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
              }
        })

        this.router.post('/',role(['admin', 'manager']), validateEmployeeCreation, handleValidationErrors, async (req, res) => {
            try {
                const { name, email, position, department, manager } = req.body;

                // Crear un nuevo documento en la colección de empleados
                const newEmployee = new Employee({
                  name,
                  email,
                  position,
                  department,
                  manager, // Opcional, puede estar vacío
                });
            
                // Guardar el nuevo empleado en la base de datos
                await newEmployee.save();

                // Devolver el empleado creado
                res.status(201).json(newEmployee);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        })


        this.router.put('/:id',role(['admin', 'manager']), validateEmployeeCreation, handleValidationErrors, async (req, res) => {
            try {
                const { id } = req.params;
                const { name, email, position, department, manager } = req.body;
                const employee = await Employee.findById(id);
                // Encontrar el empleado por ID y actualizar sus datos
                const updatedEmployee = await Employee.findByIdAndUpdate(
                    id,
                    { name, email, position, department, manager },
                    { new: true, runValidators: true } // `new: true` devuelve el documento actualizado
                );
            
                if (!updatedEmployee) {
                    return res.status(404).json({ message: 'Empleado no encontrado' });
                }
            
                // Devolver el empleado actualizado
                res.status(200).json(updatedEmployee);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        })

        this.router.delete('/:id', role(['admin']),async (req, res) => {
            try {
                const { id } = req.params;
                // delete employee by id
                const employee = await Employee.findByIdAndDelete(id);
                if (!employee) {
                  return res.status(404).json({ msg: 'Employee not found' });
                }
                res.json({ msg: 'Employee removed' });
            } catch (err) {
                res.status(500).send(err.message);
            }
        })

        
        
    }
}
module.exports = new controller().router;