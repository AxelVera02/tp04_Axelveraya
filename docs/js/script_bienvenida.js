// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const formulario = document.getElementById('formulario-bienvenida');
    const mensajeBienvenida = document.getElementById('mensaje-bienvenida');
    const areaUsuario = document.getElementById('area-usuario');
    const saludoUsuario = document.getElementById('saludo-usuario');
    const inputNombre = document.getElementById('nombre');
    const inputApellido = document.getElementById('apellido');

    // Verificar si ya hay un usuario guardado en localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
        mostrarAreaUsuario(usuarioGuardado);
    }

    // Manejar el envío del formulario
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener valores del formulario
        const nombre = inputNombre.value.trim();
        const apellido = inputApellido.value.trim();

        // Validar que los campos no estén vacíos
        if (nombre === '' || apellido === '') {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Crear nombre completo
        const nombreCompleto = `${nombre} ${apellido}`;

        // Guardar en localStorage
        localStorage.setItem('usuario', nombreCompleto);

        // Mostrar área de usuario
        mostrarAreaUsuario(nombreCompleto);

        // Limpiar formulario
        formulario.reset();
    });

    // Función para mostrar área de usuario
    function mostrarAreaUsuario(nombreCompleto) {
        // Ocultar formulario
        mensajeBienvenida.style.display = 'none';
        formulario.style.display = 'none';

        // Mostrar área de usuario
        areaUsuario.classList.remove('oculto');

        // Animar saludo
        saludoUsuario.textContent = `¡Bienvenido, ${nombreCompleto}! 👋`;
        saludoUsuario.style.animation = 'none';
        setTimeout(() => {
            saludoUsuario.style.animation = 'fadeInZoom 0.6s ease';
        }, 10);
    }
});

// Función para volver al inicio
function volverAlInicio(event) {
    event.preventDefault();
    // Simplemente recarga la página
    location.reload();
}

// Función para limpiar datos del usuario (opcional)
function cerrarSesion() {
    localStorage.removeItem('usuario');
    location.reload();
}
