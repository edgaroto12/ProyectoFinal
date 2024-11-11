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
app.get("/api/productos/prueba", (req, res) => {
  res.send("La Api esta funcionando bien....");
});

/** Ruta GET de prueba
 * Devuelve un mensaje y detalles adicionales como el puerto y el estado de la respuesta */
app.get("/api/productos/prueba1", (req, res) => {
  // Corrección de sintaxis en la ruta '/api/prueba1' (faltaba '/')
  const PORT = 3000; // Definición del puerto utilizado para referenciarlo en la respuesta
  res.status(200).json({
    message: "La API responde bien..",
    port: PORT,
    status: "success",
  });
});

// Consultar los registros de la Tabla
app.get("/api/productos/obtener", (req, res) => {
  const query = "SELECT * FROM  productos";
  connection.query(query, (error, result) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Error de recuperacion datos",
        datails: error.message,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Datos de la tabla",
        data: result,
      });
      //res.json(result);
    }
  });
});
/* Crear api POST */
// Ruta POST para guardar un registro en la base de datos*/
app.post("/api/productos/guardar", (req, res) => {
  // Eliminación de la barra adicional en '/api/guardar/'
  const { id, nombre_plato, tipo_plato, descripcion_plato, tipo_cocina } = req.body;

  // Consulta SQL para insertar una nueva persona en la tabla 'persona'
  //const sql
  const sql =
    "INSERT INTO productos(id, nombre_plato, tipo_plato, descripcion_plato, tipo_cocina) VALUES(?,?,?,?,?)";
  connection.query(
    sql,
    [id, nombre_plato, tipo_plato, descripcion_plato, tipo_cocina],
    (error, result) => {
      // Corrección de sintaxis al pasar parámetros a connection.query()

      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(201).json({
          id: result.insertId,
          id,
          nombre_plato,
          tipo_plato,
          descripcion_plato,
          tipo_cocina,
        });
      }
    }
  );
});

// Nueva ruta PUT para actualizar un registro en la base de datos
app.put("/api/productos/actualizar/:id", (req, res) => {
  const { id } = req.params;
  const { nombre_plato, tipo_plato, descripcion_plato, tipo_cocina } = req.body;

  // Validación para asegurar que el campo 'cedula' esté presente
  if (!id) {
    return res.status(400).json({
      error: "El campo 'id' es obligatorio para la actualización.",
    });
  }
  const query = `
      UPDATE productos 
      SET 
        nombre_plato = COALESCE(?, nombre_plato),
        tipo_plato = COALESCE(?, tipo_plato),
        descripcion_plato = COALESCE(?, descripcion_plato),
        tipo_cocina = COALESCE(?, tipo_cocina)
      WHERE id = ?
    `;

  //const sql =
  //"UPDATE cargos SET nombre_cargo = ?, descri_cargo = ?, meseroid = ? WHERE id = ?";
  connection.query(
    query,
    [nombre_plato, tipo_plato, descripcion_plato, tipo_cocina, id],
    (error, result) => {
      if (error) {
        res.status(500).json({ error });
      } else if (result.affectedRows === 0) {
        res.status(404).json({
          message: "No se encontró el id del mesero proporcionada.",
        });
      } else {
        res.status(200).json({
          message: "Registro actualizado exitosamente",
          id,
          nombre_plato,
          tipo_plato,
          descripcion_plato,
          tipo_cocina,
        });
      }
    }
  );
});

// Nueva ruta PUT para actualizar un registro en la base de datos
app.delete("/api/productos/eliminar/:id", (req, res) => {
  const { id } = req.params;

  // Validación para asegurar que el campo 'cedula' esté presente
  if (!id) {
    return res
      .status(400)
      .json({ error: "El campo 'Id' es obligatorio para el borrado." });
  }

  const query = "DELETE FROM productos WHERE id = ?";
  connection.query(query, [id], (error, result) => {
    if (error) {
      res.status(500).json({ error });
    } else if (result.affectedRows === 0) {
      res.status(404).json({
        message: "No se encontró una persona con el Id proporcionado.",
      });
    } else {
      res.status(200).json({ message: `Registro Borrado exitosamente: ${id}` });
    }
  });
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
