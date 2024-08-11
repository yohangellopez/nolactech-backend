const request = require('supertest');
const Employee = require('../../src/models/Employee');
const app = require('../../app'); 

jest.mock('../../src/models/Employee');

describe('Employee Controller - Create Employee', () => {
  let token; // Variable para almacenar el token

  beforeAll(async () => {
    // Loguearse para obtener el token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    token = res.body.token; // Asigna el token obtenido
  });

  it('should create a new employee successfully', async () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        position: 'Developer',
        department: 'Engineering'
      }
    };

    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`) // Incluye el token en la solicitud
      .send(req.body);
    expect(res.statusCode).toEqual(201);
  });
});
