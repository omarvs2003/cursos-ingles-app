// frontend/perfil.js

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userIdSpan = document.getElementById('user-id');
    const userNombreSpan = document.getElementById('user-nombre');
    const userEmailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logoutBtn');
    const welcomeMessage = document.getElementById('welcome-message');

    if (!token) {
        alert('No tienes acceso. Por favor, inicia sesión.');
        window.location.href = '/'; // Redirige al login
        return;
    }

    // Función para decodificar el JWT y obtener el payload
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Error al decodificar el token:', e);
            return null;
        }
    }

    // Función para cargar la información del usuario
    async function cargarPerfil() {
        try {
            // Opciones para la petición
            const options = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };

            const response = await fetch('http://localhost:3000/cursos-protegidos', options);
            const data = await response.json();

            if (response.ok) {
                // Actualizar los campos del perfil con los datos obtenidos
                welcomeMessage.textContent = `Bienvenido, ${data.nombre}`;
                userIdSpan.textContent = data.id;
                userNombreSpan.textContent = data.nombre;
                userEmailSpan.textContent = data.email;
                console.log('Perfil cargado correctamente.');
            } else {
                alert(data.error || 'Error al cargar el perfil.');
                console.warn('No se pudo obtener la información del perfil.');
            }
        } catch (error) {
            console.error('Error al cargar el perfil:', error);
            alert('Ocurrió un error al cargar tu perfil.');
        }
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

    // Cargar la información del perfil al cargar la página
    cargarPerfil();

    // Añadir el listener para el botón de cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', manejarLogout);
    } else {
        console.warn('No se encontró el elemento con ID "logoutBtn".');
    }
});