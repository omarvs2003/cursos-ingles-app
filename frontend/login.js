document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que el formulario recargue la página
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Opciones para el fetch (petición POST a /login)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    };
  
    try {
      // Suponiendo que el backend corre en http://localhost:3000
      const response = await fetch('http://localhost:3000/login', options);
      const data = await response.json();
  
      const messageDiv = document.getElementById('message');
  
      if (response.ok) {
        // Login exitoso
        localStorage.setItem('token', data.token);
        // Redirigir al dashboard
        window.location.href = 'dashboard.html';
      } else {
        // Error en login
        messageDiv.textContent = `Error: ${data.error}`;
      }
    } catch (error) {
      console.error('Error al realizar la petición', error);
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'Error interno al intentar iniciar sesión.';
    }
  });