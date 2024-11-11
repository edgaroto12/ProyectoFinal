// Importación de módulos
const path = require("path"); // Para ejecutar desde index.html

const express = require("express");
const connection = require("./conexion");
const { error } = require("console");

// Inicialización de la aplicación Express
const app = express();
app.use(express.json()); // Middleware para parsear solicitudes con formato JSON

app.use(express.urlencoded({ extended: true }));
// Servir el archivo index.html
app.use(express.static(path.join(__dirname, "template")));

// Ruta GET para verificar el estado de la API
app.get("/api/pedidos/prueba", (req, res) => {
  res.send("La Api esta funcionando bien....");
});

/** Ruta GET de prueba
 * Devuelve un mensaje y detalles adicionales como el puerto y el estado de la respuesta */
app.get("/api/pedidos/prueba1", (req, res) => {
  // Corrección de sintaxis en la ruta '/api/prueba1' (faltaba '/')
  const PORT = 3000; // Definición del puerto utilizado para referenciarlo en la respuesta
  res.status(200).json({
    message: "La API responde bien..",
    port: PORT,
    status: "success",
  });
});

/*const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});*/
