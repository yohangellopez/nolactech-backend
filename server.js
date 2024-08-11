const http = require("http");
const app = require("./app")


// Crear servidor HTTP
const httpServer = http.createServer(app);

// Iniciar servidor
httpServer.listen(process.env.HOST_PORT, () => {
  console.log("Server running on port " + process.env.HOST_PORT);
});
