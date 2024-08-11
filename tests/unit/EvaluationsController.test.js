const request = require('supertest');
const app = require('../../app'); 
const Employee = require('../../src/models/Employee');
const Evaluation = require('../../src/models/Evaluation');
const Question = require('../../src/models/Question');

// Mock de los modelos
jest.mock('../../src/models/Employee');
jest.mock('../../src/models/Evaluation');

describe('POST /api/evaluations', () => {
  let token; // Variable para almacenar el token

  beforeAll(async () => {
    // Loguearse para obtener el token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    token = res.body.token; // Asigna el token obtenido
  });

  beforeEach(() => {
    jest.clearAllMocks();
    Question.findById = jest.fn();
  });

  it('should return 400 if the input validation fails', async () => {
    const res = await request(app)
      .post('/api/evaluations')
      .set('Authorization', `Bearer ${token}`) // Incluye el token en la solicitud
      .send({
        type: 'self',
        employeeId: 'invalidId',
        questions: ['validQuestionId1', 'validQuestionId2']
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 404 if the employee does not exist', async () => {
    // Mock para indicar que el empleado no existe
    Employee.findById.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/evaluations')
      .set('Authorization', `Bearer ${token}`) // Incluye el token en la solicitud
      .send({
        period: '2024-Q4',
        type: 'self',
        employeeId: '64b66396cfa35ced577a7033',
        questions: ['validQuestionId1', 'validQuestionId2']
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body.msg).toEqual('Empleado no encontrado');
  });
});
