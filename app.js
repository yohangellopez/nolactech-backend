require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const nocache = require("nocache");
const morgan = require('morgan');
const errorHandler = require("./src/middlewares/errorHandler");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require("./src/config/database");
const swagger = require('./swagger');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 solicitudes por ventana de tiempo
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Sanitización de datos para prevenir inyecciones NoSQL
app.use(mongoSanitize());

app.use(nocache());
app.use(cors());
app.set("json spaces", 2);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb" }));
app.use(compression());
app.use(morgan('dev'));

// Conexión a la base de datos
connectDB();

// routes
app.use(express.static("public"));
app.use(require("./src/routes/web"));
app.use('/api', require("./src/routes/api"));
// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

app.use(errorHandler);

module.exports = app;
