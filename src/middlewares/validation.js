const { check, validationResult } = require('express-validator');

const registerValidation = [
    check('username', 'Name is required').not().isEmpty(),
    check('role', 'role is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];
  
const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
];


// Validaciones para la creación de un empleado
const validateEmployeeCreation = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Please include a valid email'),
  check('position').not().isEmpty().withMessage('Position is required'),
  check('department').not().isEmpty().withMessage('Department is required'),
  check('manager').optional().isMongoId().withMessage('Manager must be a valid MongoDB ID'),
];

const validateEvaluation = [
    check('period', 'El periodo es obligatorio').notEmpty(),
    check('type', 'El tipo es obligatorio').notEmpty(),
    check('employeeId', 'El ID del empleado es obligatorio y debe ser válido').isMongoId(),
    check('questions', 'Las preguntas son obligatorias y deben ser un array').isArray(),
];

  
// Validación para crear una pregunta
const validateQuestion = [
    check('text').not().isEmpty().withMessage('Text is required'),
    check('type').isIn(['rating', 'text', 'multiple-choice']).withMessage('Invalid type'),
  ];

// Middleware para manejar la validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
    registerValidation,
    loginValidation,
    validateEmployeeCreation,
    validateEvaluation,
    validateQuestion,
    handleValidationErrors,
};
