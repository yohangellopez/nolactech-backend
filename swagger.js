const swaggerJsdoc = require('swagger-jsdoc');

// Opciones de configuración de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mi API',
      version: '1.0.0',
      description: 'Documentación de la API para mi proyecto Node.js',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: ['./src/controllers/api/*.js'], // Ruta a tus archivos de rutas que contienen comentarios Swagger
};

const specs = swaggerJsdoc(options);

// Configuración de Swagger UI

module.exports = specs;
