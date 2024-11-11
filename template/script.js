// Espera a que el contenido de la página esté completamente cargado antes de ejecutar
// el código.
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del formulario y botones en el DOM.
  const form = document.getElementById("cargosForm"); // Formulario para crear o actualizar una persona.
  //const updateBtn = document.getElementById("updateBtn"); // Botón para actualizar personas.
  const tableBody = document.querySelector("#cargosTable tbody"); // Cuerpo de la tabla donde se muestran las personas.

  // Llama a la función para obtener y mostrar las personas cuando la página se carga.
  fetchCargo();

  let isEditing = false; // Bandera que indica si el usuario está en modo edición.
  let actualId = null; // Almacena la cédula de la persona que se está editando.

  // Obtiene la lista de personas de la API.
  function fetchCargo() {
    fetch("/api/cargos/obtener")
      .then((response) => response.json())
      .then((data) => renderCargo(data.data)) // Llama a renderPersonas para mostrar los datos en la tabla.
      .catch((error) => console.error("Error fetching cargo:", error)); // Muestra un error en la consola si falla la solicitud.
  }

  // Renderiza las personas en la tabla.
  function renderCargo(cargo) {
    tableBody.innerHTML = ""; // Limpia la tabla antes de agregar los datos.
    cargo.forEach((cargos) => {
      // Crea una fila para cada persona.
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${cargos.id}</td>
            <td>${cargos.nombre_cargo}</td>
            <td>${cargos.descri_cargo}</td>
            <td class="actions">
                <button class="button-edt" onclick="editCargos('${cargos.id}')">Editar</button>
                <button class="button-del" onclick="deleteCargos('${cargos.id}')">Eliminar</button>
            </td>`;
      tableBody.appendChild(row); // Agrega la fila a la tabla.
    });
  }

  // Maneja el evento de envío del formulario.
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario.

    // Obtiene los datos ingresados en el formulario.
    const id = from.id.value;
    const nombre_cargo = form.nombre_cargo.value;
    const descri_cargo = form.descri_cargo.value;

    const cargosData = { id, nombre_cargo, descri_cargo }; // Datos de la persona en un objeto.

    if (isEditing) {
      // Si está en modo edición, actualiza la persona con la cédula actual.
      updateCargos(actualId, cargosData);
      //updatecargos(actualid, cargosData);
    } else {
      // Si no está en modo edición, crea una nueva persona.
      createCargos(cargosData);
    }
  });

  // Función para Agregar un nuvo registro a Persona.
  function createCargos(cargos) {
    fetch("/api/cargos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cargos),
    })
      .then(fetchCargo) // Refresca la lista de personas después de crear una nueva.
      .catch((error) => console.error("Error creating cargos:", error));
  }

  // Función para editar una persona. Obtiene los datos de una persona usando
  //su cédula y los muestra en el formulario.
  window.editCargos = (id) => {
    isEditing = true; // Cambia a modo edición.
    actualId = id; // Almacena la cédula de la persona que se está editando.

    // Solicita los datos de la persona usando la API.
    fetch(`/api/cargos/obtener/${id}`)
      .then(() => {
        const row = Array.from(
          document.querySelectorAll("#cargosTable tbody tr")
        ).find((tr) => tr.cells[0].textContent === id);

        document.getElementById("id").value = row.cells[0].textContent;
        document.getElementById("nombre_cargo").value =
          row.cells[1].textContent;
        document.getElementById("descri_cargo").value =
          row.cells[2].textContent;

        actualId = id; // Establece el cedula actual
        document.getElementById("submitBtn").style.display = "inline";
      })
      .catch((error) =>
        console.error("Error al obtener datos de la persona:", error)
      );
  };

  // Función para actualizar una persona.
  function updateCargos(id, updatedData) {
    isEditing = false;
    fetch(`/api/cargos/actualizar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then(() => {
        fetchCargo(); // Refresca la lista de personas.
        resetForm(); // Resetea el formulario.
      })
      .catch((error) => console.error("Error updating cargos:", error));
  }

  window.deleteCargos = (id) => {
    fetch(`/api/cargos/eliminar/${id}`, { method: "DELETE" })
      .then(fetchCargo)
      .catch((error) => console.error("Error Al borrar el registro", error));
  };

  function resetForm() {
    form.reset();
    isEditing = false;
    actualId = null;
  }
});
