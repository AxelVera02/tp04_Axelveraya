// ===== CONFIGURACIÓN REST COUNTRIES API =====
const BASE_URL_PAISES = 'https://restcountries.com/v3.1/name/';

// DOM Elements
const formularioPaises = document.getElementById('formulario-paises');
const paisInput = document.getElementById('pais-input');
const indicadorCarga = document.getElementById('indicador-carga');
const mensajeError = document.getElementById('mensaje-error');
const resultadosPais = document.getElementById('resultados-pais');

// Event Listeners
formularioPaises.addEventListener('submit', buscarPais);

// Función para buscar país
async function buscarPais(e) {
    e.preventDefault();
    
    const paisBusqueda = paisInput.value.trim().toLowerCase();
    
    if (!paisBusqueda) {
        mostrarError('Por favor ingresa el nombre de un país');
        return;
    }

    mostrarCarga(true);
    limpiarResultados();

    try {
        // Primero intenta búsqueda exacta/parcial
        let respuesta = await fetch(`${BASE_URL_PAISES}${paisBusqueda}?fullText=false`);
        
        if (!respuesta.ok || respuesta.status === 404) {
            // Si no encuentra, intenta con fullText=true para búsquedas más amplias
            respuesta = await fetch(`${BASE_URL_PAISES}${paisBusqueda}?fullText=true`);
        }

        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                mostrarError('País no encontrado. Intenta con otro nombre o código ISO (ej: "NL" para Países Bajos, "RU" para Rusia).');
            } else {
                mostrarError('Error al conectar con la API');
            }
            mostrarCarga(false);
            return;
        }

        const datos = await respuesta.json();
        
        if (datos.length > 0) {
            mostrarPais(datos[0]);
        } else {
            mostrarError('País no encontrado. Intenta con otro nombre o código ISO.');
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al obtener los datos del país');
    } finally {
        mostrarCarga(false);
    }
}

// Función para mostrar los datos del país
function mostrarPais(pais) {
    // Extraer datos con validación
    const nombre = pais.name?.common || pais.name?.official || 'N/A';
    const capital = pais.capital?.[0] || 'N/A';
    const poblacion = pais.population ? pais.population.toLocaleString('es-ES') : 'N/A';
    const region = pais.region || 'N/A';
    const area = pais.area ? pais.area.toLocaleString('es-ES') : 'N/A';
    const bandera = pais.flags?.svg || pais.flags?.png || '';
    
    // Idiomas
    let idiomas = 'N/A';
    if (pais.languages) {
        idiomas = Object.values(pais.languages).join(', ');
    }
    
    // Zonas horarias
    let zonas = 'N/A';
    if (pais.timezones) {
        zonas = pais.timezones.slice(0, 2).join(', ');
    }

    // Actualizar DOM
    document.getElementById('nombre-pais').textContent = nombre;
    document.getElementById('bandera-pais').src = bandera;
    document.getElementById('bandera-pais').alt = `Bandera de ${nombre}`;
    document.getElementById('capital-pais').textContent = capital;
    document.getElementById('poblacion-pais').textContent = poblacion;
    document.getElementById('region-pais').textContent = region;
    document.getElementById('area-pais').textContent = area;
    document.getElementById('idiomas-pais').textContent = idiomas;
    document.getElementById('zonas-pais').textContent = zonas;

    resultadosPais.classList.remove('oculto');
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
    resultadosPais.classList.add('oculto');
}
