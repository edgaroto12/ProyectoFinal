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
app.get("/api/cargos/prueba", (req, res) => {
  res.send("La Api esta funcionando bien....");
});
//MANEJO API CARGOS

/** Ruta GET de prueba
 * Devuelve un mensaje y detalles adicionales como el puerto y el estado de la respuesta */
app.get("/api/cargos/prueba1", (req, res) => {
  // Corrección de sintaxis en la ruta '/api/prueba1' (faltaba '/')
  const PORT = 3000; // Definición del puerto utilizado para referenciarlo en la respuesta
  res.status(200).json({
    message: "La API responde bien..",
    port: PORT,
    status: "success",
  });
});

// Consultar los registros de la Tabla
app.get("/api/cargos/obtener", (req, res) => {
  const query = "SELECT * FROM  cargos";
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
app.post("/api/cargos/guardar", (req, res) => {
  // Eliminación de la barra adicional en '/api/guardar/'
  const { id, nombre_cargo, descri_cargo, meseroid } = req.body;

  // Consulta SQL para insertar una nueva persona en la tabla 'persona'
  //const sql
  const sql =
    "INSERT INTO cargos(id, nombre_cargo, descri_cargo, meseroid) VALUES(?,?,?,?)";
  connection.query(
    sql,
    [id, nombre_cargo, descri_cargo, meseroid],
    (error, result) => {
      // Corrección de sintaxis al pasar parámetros a connection.query()

      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(201).json({
          id: result.insertId,
          id,
          nombre_cargo,
          descri_cargo,
          meseroid,
        });
      }
    }
  );
});

// Nueva ruta PUT para actualizar un registro en la base de datos
app.put("/api/cargos/actualizar/:id", (req, res) => {
  const { id } = req.params;
  const { nombre_cargo, descri_cargo, meseroid } = req.body;

  // Validación para asegurar que el campo 'cedula' esté presente
  if (!id) {
    return res.status(400).json({
      error: "El campo 'id' es obligatorio para la actualización.",
    });
  }
  const query = `
      UPDATE cargos 
      SET 
        nombre_cargo = COALESCE(?, nombre_cargo),
        descri_cargo = COALESCE(?, descri_cargo),
        meseroid = COALESCE(?, meseroid)
      WHERE id = ?
    `;

  //const sql =
  //"UPDATE cargos SET nombre_cargo = ?, descri_cargo = ?, meseroid = ? WHERE id = ?";
  connection.query(
    query,
    [nombre_cargo, descri_cargo, meseroid, id],
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
          nombre_cargo,
          descri_cargo,
          meseroid,
        });
      }
    }
  );
});

// Nueva ruta PUT para actualizar un registro en la base de datos
app.delete("/api/cargos/eliminar/:id", (req, res) => {
  const { id } = req.params;

  // Validación para asegurar que el campo 'cedula' esté presente
  if (!id) {
    return res
      .status(400)
      .json({ error: "El campo 'Id' es obligatorio para el borrado." });
  }

  const query = "DELETE FROM cargos WHERE id = ?";
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

//API MANEJO DE CLIENTES
// Consultar los registros de la Tabla
app.get("/api/clientes/obtener", (req, res) => {
  const query = "SELECT * FROM  clientes";
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
app.post("/api/clientes/guardar", (req, res) => {
  // Eliminación de la barra adicional en '/api/guardar/'
  const {
    id,
    nombre,
    apellido,
    cedula,
    telefono,
    direccion,
    correoelectronico,
  } = req.body;

  // Consulta SQL para insertar una nueva persona en la tabla 'persona'
  //const sql
  const sql =
    "INSERT INTO clientes(id, nombre, apellido, cedula, telefono, direccion, correoelectronico) VALUES(?,?,?,?,?,?,?)";
  connection.query(
    sql,
    [id, nombre, apellido, cedula, telefono, direccion, correoelectronico],
    (error, result) => {
      // Corrección de sintaxis al pasar parámetros a connection.query()

      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(201).json({
          id: result.insertId,
          id,
          nombre,
          apellido,
          cedula,
          telefono,
          direccion,
          correoelectronico,
        });
      }
    }
  );
});

// Nueva ruta PUT para actualizar un registro en la base de datos
app.put("/api/clientes/actualizar/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, cedula, telefono, direccion, correoelectronico } =
    req.body;

  // Validación para asegurar que el campo 'cedula' esté presente
  if (!id) {
    return res.status(400).json({
      error: "El campo 'id' es obligatorio para la actualización.",
    });
  }
  const query = `
      UPDATE clientes 
      SET 
        nombre = COALESCE(?, nombre),
        apellido = COALESCE(?, apellido),
        cedula = COALESCE(?, cedula),
        telefono = COALESCE(?, telefono),
        direccion = COALESCE(?, direccion),
        correoelectronico = COALESCE(?, correoelectronico),
      WHERE id = ?
    `;

  //const sql =
  //"UPDATE cargos SET nombre_cargo = ?, descri_cargo = ?, meseroid = ? WHERE id = ?";
  connection.query(
    query,
    [nombre, apellido, cedula, telefono, direccion, correoelectronico, id],
    (error, result) => {
      if (error) {
        res.status(500).json({ error });
      } else if (result.affectedRows === 0) {
        res.status(404).json({
          message: "No se encontró el id del cliente proporcionada.",
        });
      } else {
        res.status(200).json({
          message: "Registro actualizado exitosamente",
          id,
          nombre,
          apellido,
          cedula,
          telefono,
          direccion,
          correoelectronico,
        });
      }
    }
  );
});

// Nueva ruta PUT para actualizar un registro en la base de datos
app.delete("/api/clientes/eliminar/:id", (req, res) => {
  const { id } = req.params;

  // Validación para asegurar que el campo 'cedula' esté presente
  if (!id) {
    return res
      .status(400)
      .json({ error: "El campo 'Id' es obligatorio para el borrado." });
  }

  const query = "DELETE FROM clientes WHERE id = ?";
  connection.query(query, [id], (error, result) => {
    if (error) {
      res.status(500).json({ error });
    } else if (result.affectedRows === 0) {
      res.status(404).json({
        message: "No se encontró un cliente con el Id proporcionado.",
      });
    } else {
      res.status(200).json({ message: `Registro Borrado exitosamente: ${id}` });
    }
  });
});

// Consultar los registros de la Tabla
app.get("/api/pedidos/obtener", (req, res) => {
  const query = "SELECT * FROM  pedidos";
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
app.post("/api/pedidos/guardar", (req, res) => {
  // Eliminación de la barra adicional en '/api/guardar/'
  const { id, nombre_cliente, numero_mesa, nombre_mesero, clienteid } =
    req.body;

  // Consulta SQL para insertar una nueva persona en la tabla 'persona'
  //const sql
  const sql =
    "INSERT INTO pedidos(id, nombre_cliente, numero_mesa, nombre_mesero,clienteid) VALUES(?,?,?,?,?)";
  connection.query(
    sql,
    [id, nombre_cliente, numero_mesa, nombre_mesero, clienteid],
    (error, result) => {
      // Corrección de sintaxis al pasar parámetros a connection.query()

      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(201).json({
          id: result.insertId,
          id,
          nombre_cliente,
          numero_mesa,
          nombre_mesero,
          clienteid,
        });
      }
    }
  );
});

//API MANEJO DE PEDIDOS
// Nueva ruta PUT para actualizar un registro en la base de datos
app.put("/api/pedidos/actualizar/:id", (req, res) => {
  const { id } = req.params;
  const { nombre_cliente, numero_mesa, nombre_mesero, clienteid } = req.body;

  // Validación para asegurar que el campo 'cedula' esté presente
  if (!id) {
    return res.status(400).json({
      error: "El campo 'id' es obligatorio para la actualización.",
    });
  }
  const query = `
      UPDATE pedidos 
      SET 
        nombre_cliente = COALESCE(?, nombre_cliente),
        numero_mesa = COALESCE(?, numero_mesa),
        descripcion_plato = COALESCE(?, descripcion_plato),
        clienteid = COALESCE(?, clienteid)
      WHERE id = ?
    `;

  //const sql =
  //"UPDATE cargos SET nombre_cargo = ?, descri_cargo = ?, meseroid = ? WHERE id = ?";
  connection.query(
    query,
    [nombre_cliente, numero_mesa, nombre_mesero, clienteid, id],
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
          nombre_cliente,
          numero_mesa,
          nombre_mesero,
          clienteid,
        });
      }
    }
  );
});

// Nueva ruta PUT para actualizar un registro en la base de datos
app.delete("/api/pedidos/eliminar/:id", (req, res) => {
  const { id } = req.params;

  // Validación para asegurar que el campo 'cedula' esté presente
  if (!id) {
    return res
      .status(400)
      .json({ error: "El campo 'Id' es obligatorio para el borrado." });
  }

  const query = "DELETE FROM pedidos WHERE id = ?";
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

//API MANEJO DE PRODUCTOS

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
  const { id, nombre_plato, tipo_plato, descripcion_plato, tipo_cocina } =
    req.body;

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
