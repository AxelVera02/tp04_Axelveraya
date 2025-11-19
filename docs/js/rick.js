// ===== CONFIGURACIÓN RICK & MORTY API =====
const BASE_URL_RICK = 'https://rickandmortyapi.com/api/character/';

// DOM Elements
const formularioRick = document.getElementById('formulario-rick');
const rickInput = document.getElementById('rick-input');
const indicadorCarga = document.getElementById('indicador-carga');
const mensajeError = document.getElementById('mensaje-error');
const resultadosRick = document.getElementById('resultados-rick');

// Event Listeners
formularioRick.addEventListener('submit', buscarPersonaje);

// Función para buscar personaje
async function buscarPersonaje(e) {
    e.preventDefault();
    
    const idBusqueda = rickInput.value.trim();
    
    if (!idBusqueda) {
        mostrarError('Por favor ingresa el ID del personaje');
        return;
    }

    // Validar que sea un número
    if (isNaN(idBusqueda)) {
        mostrarError('El ID debe ser un número');
        return;
    }

    mostrarCarga(true);
    limpiarResultados();

    try {
        const respuesta = await fetch(`${BASE_URL_RICK}${idBusqueda}`);
        
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                mostrarError('Personaje no encontrado. ID válido: 1-826');
            } else {
                mostrarError('Error al conectar con la API');
            }
            mostrarCarga(false);
            return;
        }

        const datos = await respuesta.json();
        mostrarPersonaje(datos);

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al obtener los datos del personaje');
    } finally {
        mostrarCarga(false);
    }
}

// Función para mostrar los datos del personaje
function mostrarPersonaje(personaje) {
    // Extraer datos
    const nombre = personaje.name || 'N/A';
    const id = personaje.id || 'N/A';
    const imagen = personaje.image || '';
    const estado = personaje.status || 'N/A';
    const especie = personaje.species || 'N/A';
    const genero = personaje.gender || 'N/A';
    const origen = personaje.origin?.name || 'N/A';
    const ubicacion = personaje.location?.name || 'N/A';

    // Actualizar DOM
    document.getElementById('nombre-rick').textContent = nombre;
    document.getElementById('imagen-rick').src = imagen;
    document.getElementById('imagen-rick').alt = nombre;
    document.getElementById('id-rick').textContent = id;
    
    // Estado con color según valor
    const estadoElement = document.getElementById('estado-rick');
    estadoElement.textContent = estado;
    estadoElement.className = 'valor';
    if (estado === 'Alive') {
        estadoElement.classList.add('estado-vivo');
    } else if (estado === 'Dead') {
        estadoElement.classList.add('estado-muerto');
    } else {
        estadoElement.classList.add('estado-desconocido');
    }
    
    document.getElementById('especie-rick').textContent = especie;
    document.getElementById('genero-rick').textContent = genero;
    document.getElementById('origen-rick').textContent = origen;
    document.getElementById('ubicacion-rick').textContent = ubicacion;

    resultadosRick.classList.remove('oculto');
}

// Función para mostrar/ocultar carga
function mostrarCarga(mostrar) {
    if (mostrar) {
        indicadorCarga.classList.remove('oculto');
    } else {
        indicadorCarga.classList.add('oculto');
    }
}

// Función para mostrar errores
function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.classList.remove('oculto');
    setTimeout(() => {
        mensajeError.classList.add('oculto');
    }, 5000);
}

// Función para limpiar resultados
function limpiarResultados() {
    mensajeError.classList.add('oculto');
    resultadosRick.classList.add('oculto');
}
