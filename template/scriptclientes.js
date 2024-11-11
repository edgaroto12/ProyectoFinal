// Espera a que el contenido de la página esté completamente cargado antes de ejecutar
// el código.
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del formulario y botones en el DOM.
  const form = document.getElementById("clientesForm"); // Formulario para crear o actualizar una persona.
  //const updateBtn = document.getElementById("updateBtn"); // Botón para actualizar personas.
  const tableBody = document.querySelector("#clientesTable tbody"); // Cuerpo de la tabla donde se muestran las personas.

  // Llama a la función para obtener y mostrar las personas cuando la página se carga.
  fetchCliente();

  let isEditing = false; // Bandera que indica si el usuario está en modo edición.
  let actualId = null; // Almacena la cédula de la persona que se está editando.

  // Obtiene la lista de personas de la API.
  function fetchCliente() {
    fetch("/api/clientes/obtener")
      .then((response) => response.json())
      .then((data) => renderCliente(data.data)) // Llama a renderPersonas para mostrar los datos en la tabla.
      .catch((error) => console.error("Error fetching cliente:", error)); // Muestra un error en la consola si falla la solicitud.
  }

  // Renderiza las personas en la tabla.
  function renderCliente(cliente) {
    tableBody.innerHTML = ""; // Limpia la tabla antes de agregar los datos.
    cliente.forEach((clientes) => {
      // Crea una fila para cada persona.
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${clientes.id}</td>
              <td>${clientes.nombre}</td>
              <td>${clientes.apellido}</td>
              <td>${clientes.cedula}</td>
              <td>${clientes.telefono}</td>
              <td>${clientes.direccion}</td>
              <td>${clientes.correoelectronico}</td>
              <td class="actions">
                  <button class="button-edt" onclick="editClientes('${clientes.id}')">Editar</button>
                  <button class="button-del" onclick="deleteClientes('${clientes.id}')">Eliminar</button>
              </td>`;
      tableBody.appendChild(row); // Agrega la fila a la tabla.
    });
  }

  // Maneja el evento de envío del formulario.
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario.

    // Obtiene los datos ingresados en el formulario.
    const id = from.id.value;
    const nombre = form.nombre.value;
    const apellido = form.apellido.value;
    const cedula = form.cedula.value;
    const telefono = form.telefono.value;
    const direccion = form.direccion.value;
    const correoelectronico = form.correoelectronico.value;

    const clientesData = {
      id,
      nombre,
      apellido,
      cedula,
      telefono,
      direccion,
      correoelectronico,
    }; // Datos de la persona en un objeto.

    if (isEditing) {
      // Si está en modo edición, actualiza la persona con la cédula actual.
      updateClientes(actualId, clientesData);
      //updatecargos(actualid, cargosData);
    } else {
      // Si no está en modo edición, crea una nueva persona.
      createClientes(clientesData);
    }
  });

  // Función para Agregar un nuvo registro a Persona.
  function createClientes(clientes) {
    fetch("/api/clientes/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientes),
    })
      .then(fetchCliente) // Refresca la lista de personas después de crear una nueva.
      .catch((error) => console.error("Error creating clientes:", error));
  }

  // Función para editar una persona. Obtiene los datos de una persona usando
  //su cédula y los muestra en el formulario.
  window.editClientes = (id) => {
    isEditing = true; // Cambia a modo edición.
    actualId = id; // Almacena la cédula de la persona que se está editando.

    // Solicita los datos de la persona usando la API.
    fetch(`/api/clientes/obtener/${id}`)
      .then(() => {
        const row = Array.from(
          document.querySelectorAll("#clientesTable tbody tr")
        ).find((tr) => tr.cells[0].textContent === id);

        document.getElementById("id").value = row.cells[0].textContent;
        document.getElementById("nombre").value = row.cells[1].textContent;
        document.getElementById("apellido").value = row.cells[2].textContent;
        document.getElementById("cedula").value = row.cells[3].textContent;
        document.getElementById("telefono").value = row.cells[4].textContent;
        document.getElementById("direccion").value = row.cells[5].textContent;
        document.getElementById("correoelectronico").value =
          row.cells[6].textContent;

        actualId = id; // Establece el cedula actual
        document.getElementById("submitBtn").style.display = "inline";
      })
      .catch((error) =>
        console.error("Error al obtener datos del cliente:", error)
      );
  };

  // Función para actualizar una persona.
  function updateClientes(id, updatedData) {
    isEditing = false;
    fetch(`/api/clientes/actualizar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then(() => {
        fetchCliente(); // Refresca la lista de personas.
        resetForm(); // Resetea el formulario.
      })
      .catch((error) => console.error("Error updating clientes:", error));
  }

  window.deleteClientes = (id) => {
    fetch(`/api/clientes/eliminar/${id}`, { method: "DELETE" })
      .then(fetchCliente)
      .catch((error) => console.error("Error Al borrar el registro", error));
  };

  function resetForm() {
    form.reset();
    isEditing = false;
    actualId = null;
  }
});
