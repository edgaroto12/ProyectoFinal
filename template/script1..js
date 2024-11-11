document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Validar credenciales
    if (username === "edgar" && password === "123456") {
      // Si las credenciales son correctas
      alert("¡Inicio de sesión exitoso!");
      window.location.href = "./index.html"; // Redirige a otra página
    } else {
      // Si las credenciales son incorrectas
      errorMessage.textContent = "Usuario o contraseña incorrectos";
    }
  });
