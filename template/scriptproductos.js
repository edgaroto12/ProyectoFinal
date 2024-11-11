// Espera a que el contenido de la página esté completamente cargado antes de ejecutar
// el código.
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del formulario y botones en el DOM.
  const form = document.getElementById("productosForm"); // Formulario para crear o actualizar una persona.
  //const updateBtn = document.getElementById("updateBtn"); // Botón para actualizar personas.
  const tableBody = document.querySelector("#productosTable tbody"); // Cuerpo de la tabla donde se muestran las personas.

  // Llama a la función para obtener y mostrar las personas cuando la página se carga.
  fetchProducto();

  let isEditing = false; // Bandera que indica si el usuario está en modo edición.
  let actualId = null; // Almacena la cédula de la persona que se está editando.

  // Obtiene la lista de personas de la API.
  function fetchProducto() {
    fetch("/api/productos/obtener")
      .then((response) => response.json())
      .then((data) => renderProducto(data.data)) // Llama a renderPersonas para mostrar los datos en la tabla.
      .catch((error) => console.error("Error fetching producto:", error)); // Muestra un error en la consola si falla la solicitud.
  }

  // Renderiza las personas en la tabla.
  function renderProducto(producto) {
    tableBody.innerHTML = ""; // Limpia la tabla antes de agregar los datos.
    producto.forEach((productos) => {
      // Crea una fila para cada persona.
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${productos.id}</td>
            <td>${productos.nombre_plato}</td>
            <td>${productos.tipo_plato}</td>
            <td>${productos.descripcion_plato}</td>
            <td>${productos.tipo_cocina}</td>
            <td class="actions">
                <button class="button-edt" onclick="editProductos('${productos.id}')">Editar</button>
                <button class="button-del" onclick="deleteProductos('${productos.id}')">Eliminar</button>
            </td>`;
      tableBody.appendChild(row); // Agrega la fila a la tabla.
    });
  }

  // Maneja el evento de envío del formulario.
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario.

    // Obtiene los datos ingresados en el formulario.
    const id = from.id.value;
    const nombre_plato = form.nombre_plato.value;
    const tipo_plato = form.tipo_plato.value;
    const descripcion_plato = form.descripcion_plato.value;
    const tipo_cocina = form.tipo_cocina.value;

    const productosData = {
      id,
      nombre_plato,
      tipo_plato,
      descripcion_plato,
      tipo_cocina,
    }; // Datos de la persona en un objeto.

    if (isEditing) {
      // Si está en modo edición, actualiza la persona con la cédula actual.
      updateProductos(actualId, productosData);
      //updatecargos(actualid, cargosData);
    } else {
      // Si no está en modo edición, crea una nueva persona.
      createProductos(productosData);
    }
  });

  // Función para Agregar un nuvo registro a Persona.
  function createProductos(productos) {
    fetch("/api/productos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productos),
    })
      .then(fetchProducto) // Refresca la lista de personas después de crear una nueva.
      .catch((error) => console.error("Error creating productos:", error));
  }

  // Función para editar una persona. Obtiene los datos de una persona usando
  //su cédula y los muestra en el formulario.
  window.editProductos = (id) => {
    isEditing = true; // Cambia a modo edición.
    actualId = id; // Almacena la cédula de la persona que se está editando.

    // Solicita los datos de la persona usando la API.
    fetch(`/api/productos/obtener/${id}`)
      .then(() => {
        const row = Array.from(
          document.querySelectorAll("#productosTable tbody tr")
        ).find((tr) => tr.cells[0].textContent === id);

        document.getElementById("id").value = row.cells[0].textContent;
        document.getElementById("nombre_plato").value =
          row.cells[1].textContent;

        document.getElementById("tipo_plato").value = row.cells[1].textContent;

        document.getElementById("descripcion_plato").value =
          row.cells[2].textContent;

        document.getElementById("tipo_cocina").value = row.cells[3].textContent;

        actualId = id; // Establece el cedula actual
        document.getElementById("submitBtn").style.display = "inline";
      })
      .catch((error) =>
        console.error("Error al obtener datos del producto:", error)
      );
  };

  // Función para actualizar una persona.
  function updateProductos(id, updatedData) {
    isEditing = false;
    fetch(`/api/productos/actualizar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then(() => {
        fetchProducto(); // Refresca la lista de personas.
        resetForm(); // Resetea el formulario.
      })
      .catch((error) => console.error("Error updating productos:", error));
  }

  window.deleteProductos = (id) => {
    fetch(`/api/productos/eliminar/${id}`, { method: "DELETE" })
      .then(fetchProducto)
      .catch((error) => console.error("Error Al borrar el registro", error));
  };

  function resetForm() {
    form.reset();
    isEditing = false;
    actualId = null;
  }
});
