document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutBtn = document.getElementById('logoutBtn'); // Declarar logoutBtn aquí


    if (!token) {
        alert('No tienes acceso. Por favor, inicia sesión.');
        window.location.href = '/'; // Redirige al login
        return;
    }

    // Opciones para la petición
    const options = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    

    try {
        const response = await fetch('http://localhost:3000/cursos-protegidos', options);
        const data = await response.json();

        if (response.ok) {
            // Actualizar el mensaje de bienvenida con el nombre del usuario
            welcomeMessage.textContent = `Bienvenido, ${data.nombre}`;

           

        } else {
            welcomeMessage.textContent = 'No tienes acceso. Por favor, inicia sesión.';
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
        welcomeMessage.textContent = 'Ocurrió un error al intentar cargar los datos.';
    }
});

// Añadir el listener para el botón de cerrar sesión
if (logoutBtn) {
    logoutBtn.addEventListener('click', manejarLogout);
} else {
    console.warn('No se encontró el elemento con ID "logoutBtn".');
}

 // Función para manejar el cierre de sesión
 function manejarLogout(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del enlace

    // Confirmación opcional antes de cerrar sesión
    const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (!confirmar) return;

    try {
        // Eliminar el token del localStorage
        localStorage.removeItem('token');
        console.log('Token eliminado del localStorage.');
        alert('Sesión cerrada exitosamente.');
        window.location.href = '/'; // Redirige al login
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al intentar cerrar sesión.');
    }

     



}

