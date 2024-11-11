// Espera a que el contenido de la página esté completamente cargado antes de ejecutar
// el código.
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del formulario y botones en el DOM.
  const form = document.getElementById("pedidosForm"); // Formulario para crear o actualizar una persona.
  //const updateBtn = document.getElementById("updateBtn"); // Botón para actualizar personas.
  const tableBody = document.querySelector("#pedidosTable tbody"); // Cuerpo de la tabla donde se muestran las personas.

  // Llama a la función para obtener y mostrar las personas cuando la página se carga.
  fetchPedido();

  let isEditing = false; // Bandera que indica si el usuario está en modo edición.
  let actualId = null; // Almacena la cédula de la persona que se está editando.

  // Obtiene la lista de personas de la API.
  function fetchPedido() {
    fetch("/api/pedidos/obtener")
      .then((response) => response.json())
      .then((data) => renderPedido(data.data)) // Llama a renderPersonas para mostrar los datos en la tabla.
      .catch((error) => console.error("Error fetching pedido:", error)); // Muestra un error en la consola si falla la solicitud.
  }

  // Renderiza las personas en la tabla.
  function renderPedido(pedido) {
    tableBody.innerHTML = ""; // Limpia la tabla antes de agregar los datos.
    pedido.forEach((pedidos) => {
      // Crea una fila para cada persona.
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${pedidos.id}</td>
            <td>${pedidos.nombre_cliente}</td>
            <td>${pedidos.numero_mesa}</td>
            <td>${pedidos.nombre_mesero}</td>
            <td class="actions">
                <button class="button-edt" onclick="editPedidos('${pedidos.id}')">Editar</button>
                <button class="button-del" onclick="deletePedidos('${pedidos.id}')">Eliminar</button>
            </td>`;
      tableBody.appendChild(row); // Agrega la fila a la tabla.
    });
  }

  // Maneja el evento de envío del formulario.
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario.

    // Obtiene los datos ingresados en el formulario.
    const id = from.id.value;
    const nombre_cliente = form.nombre_cliente.value;
    const numero_mesa = form.numero_mesa.value;
    const nombre_mesero = form.nombre_mesero.value;

    const pedidosData = { id, nombre_cliente, numero_mesa, nombre_mesero }; // Datos de la persona en un objeto.

    if (isEditing) {
      // Si está en modo edición, actualiza la persona con la cédula actual.
      updatePedidos(actualId, pedidosData);
      //updatecargos(actualid, cargosData);
    } else {
      // Si no está en modo edición, crea una nueva persona.
      createPedidos(pedidosData);
    }
  });

  // Función para Agregar un nuvo registro a Persona.
  function createPedidos(pedidos) {
    fetch("/api/pedidos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedidos),
    })
      .then(fetchPedido) // Refresca la lista de personas después de crear una nueva.
      .catch((error) => console.error("Error creating pedidos:", error));
  }

  // Función para editar una persona. Obtiene los datos de una persona usando
  //su cédula y los muestra en el formulario.
  window.editPedidos = (id) => {
    isEditing = true; // Cambia a modo edición.
    actualId = id; // Almacena la cédula de la persona que se está editando.

    // Solicita los datos de la persona usando la API.
    fetch(`/api/pedidos/obtener/${id}`)
      .then(() => {
        const row = Array.from(
          document.querySelectorAll("#pedidosTable tbody tr")
        ).find((tr) => tr.cells[0].textContent === id);

        document.getElementById("id").value = row.cells[0].textContent;
        document.getElementById("nombre_cliente").value =
          row.cells[1].textContent;
        document.getElementById("numero_mesa").value = row.cells[2].textContent;
        document.getElementById("nombre_mesero").value =
          row.cells[3].textContent;

        actualId = id; // Establece el cedula actual
        document.getElementById("submitBtn").style.display = "inline";
      })
      .catch((error) =>
        console.error("Error al obtener datos del pedido:", error)
      );
  };

  // Función para actualizar una persona.
  function updatePedidos(id, updatedData) {
    isEditing = false;
    fetch(`/api/pedidos/actualizar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then(() => {
        fetchPedido(); // Refresca la lista de personas.
        resetForm(); // Resetea el formulario.
      })
      .catch((error) => console.error("Error updating pedidos:", error));
  }

  window.deletePedidos = (id) => {
    fetch(`/api/pedidos/eliminar/${id}`, { method: "DELETE" })
      .then(fetchPedido)
      .catch((error) => console.error("Error Al borrar el registro", error));
  };

  function resetForm() {
    form.reset();
    isEditing = false;
    actualId = null;
  }
});
