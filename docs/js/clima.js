// API de OpenWeather - Clave gratuita (requiere registro)
// Para usar este código, obtén tu API key en: https://openweathermap.org/api
const API_KEY = '16c48a32c0099792c82a699be85e4a8c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Elementos del DOM
const formulario = document.getElementById('formulario-clima');
const inputCiudad = document.getElementById('ciudad-input');
const indicadorCarga = document.getElementById('indicador-carga');
const mensajeError = document.getElementById('mensaje-error');
const resultadosClima = document.getElementById('resultados-clima');

// Elementos de resultados
const nombreCiudad = document.getElementById('nombre-ciudad');
const horaLocal = document.getElementById('hora-local');
const horaCiudad = document.getElementById('hora-ciudad');
const iconoClima = document.getElementById('icono-clima');
const temperatura = document.getElementById('temperatura');
const descripcionClima = document.getElementById('descripcion-clima');
const tempDetalle = document.getElementById('temp-detalle');
const humedadDetalle = document.getElementById('humedad-detalle');
const sensacionDetalle = document.getElementById('sensacion-detalle');
const vientoDetalle = document.getElementById('viento-detalle');
const presionDetalle = document.getElementById('presion-detalle');
const visibilidadDetalle = document.getElementById('visibilidad-detalle');

// Mapeo de iconos de clima
const iconosClima = {
    '01d': '☀️', // clear sky (día)
    '01n': '🌙', // clear sky (noche)
    '02d': '🌤️', // few clouds (día)
    '02n': '🌤️', // few clouds (noche)
    '03d': '☁️', // scattered clouds (día)
    '03n': '☁️', // scattered clouds (noche)
    '04d': '☁️', // broken clouds (día)
    '04n': '☁️', // broken clouds (noche)
    '09d': '🌧️', // shower rain (día)
    '09n': '🌧️', // shower rain (noche)
    '10d': '🌦️', // rain (día)
    '10n': '🌧️', // rain (noche)
    '11d': '⛈️', // thunderstorm (día)
    '11n': '⛈️', // thunderstorm (noche)
    '13d': '❄️', // snow (día)
    '13n': '❄️', // snow (noche)
    '50d': '🌫️', // mist (día)
    '50n': '🌫️'  // mist (noche)
};

// Manejar el envío del formulario
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const ciudad = inputCiudad.value.trim();
    
    if (ciudad === '') {
        mostrarError('Por favor, ingresa el nombre de una ciudad');
        return;
    }

    // Obtener clima
    await obtenerClima(ciudad);
});

// Función para obtener datos del clima
async function obtenerClima(ciudad) {
    try {
        // Mostrar indicador de carga
        mostrarCarga(true);
        ocultarError();
        ocultarResultados();

        // Construir URL de la petición
        const url = `${BASE_URL}?q=${encodeURIComponent(ciudad)}&appid=${API_KEY}&units=metric&lang=es`;

        // Realizar petición
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                throw new Error('Ciudad no encontrada. Por favor, verifica el nombre.');
            } else if (respuesta.status === 401) {
                throw new Error('API key inválida. Por favor, configura una clave válida.');
            } else {
                throw new Error('Error al obtener los datos del clima');
            }
        }

        // Procesar respuesta
        const datos = await respuesta.json();
        mostrarClima(datos);

    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
    } finally {
        mostrarCarga(false);
    }
}

// Función para mostrar los datos del clima
function mostrarClima(datos) {
    try {
        // Extraer datos
        const ciudad = datos.name;
        const pais = datos.sys.country;
        const temp = Math.round(datos.main.temp);
        const humedad = datos.main.humidity;
        const sensacion = Math.round(datos.main.feels_like);
        const descripcion = datos.weather[0].description;
        const icono = datos.weather[0].icon;
        const viento = (datos.wind.speed * 3.6).toFixed(1); // Convertir m/s a km/h
        const presion = datos.main.pressure;
        const visibilidad = (datos.visibility / 1000).toFixed(2);
        const timezoneOffset = datos.timezone; // Desplazamiento de zona horaria en segundos

        // Actualizar elementos
        nombreCiudad.textContent = `${ciudad}, ${pais}`;
        
        // Mostrar hora local del dispositivo
        horaLocal.textContent = obtenerHoraLocal();
        
        // Mostrar hora de la ciudad (basada en timezone offset de OpenWeather)
        horaCiudad.textContent = obtenerHoraCiudad(timezoneOffset);
        iconoClima.textContent = iconosClima[icono] || '🌡️';
        temperatura.textContent = temp;
        descripcionClima.textContent = descripcion;

        // Detalles
        tempDetalle.textContent = `${temp}°C`;
        humedadDetalle.textContent = `${humedad}%`;
        sensacionDetalle.textContent = `${sensacion}°C`;
        vientoDetalle.textContent = `${viento} km/h`;
        presionDetalle.textContent = `${presion} hPa`;
        visibilidadDetalle.textContent = `${visibilidad} km`;

        // Mostrar resultados
        mostrarResultados(true);

    } catch (error) {
        console.error('Error al procesar datos:', error);
        mostrarError('Error al procesar los datos del clima');
    }
}

// Función para obtener la fecha actual
function obtenerFechaActual() {
    const fecha = new Date();
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Función para obtener la hora local del dispositivo
function obtenerHoraLocal() {
    const fecha = new Date();
    const opciones = {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return fecha.toLocaleString('es-ES', opciones);
}

// Función para obtener la hora de la ciudad (usando timezone offset de OpenWeather)
function obtenerHoraCiudad(timezoneOffset) {
    // timezoneOffset está en segundos
    // Crear una fecha UTC
    const ahora = new Date();
    const timestampUTC = ahora.getTime();
    
    // Calcular la hora en la zona horaria de la ciudad
    const horaCity = new Date(timestampUTC + timezoneOffset * 1000);
    
    const opciones = {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC' // Mostrar como UTC porque ya aplicamos el offset
    };
    
    // Para mostrar correctamente, formatear manualmente
    const horas = String(horaCity.getUTCHours()).padStart(2, '0');
    const minutos = String(horaCity.getUTCMinutes()).padStart(2, '0');
    const segundos = String(horaCity.getUTCSeconds()).padStart(2, '0');
    
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dia = diasSemana[horaCity.getUTCDay()];
    
    return `${dia} ${horas}:${minutos}:${segundos}`;
}

// Funciones de utilidad para mostrar/ocultar elementos
function mostrarCarga(mostrar) {
    if (mostrar) {
        indicadorCarga.classList.remove('oculto');
    } else {
        indicadorCarga.classList.add('oculto');
    }
}

function mostrarError(mensaje) {
    mensajeError.textContent = `❌ ${mensaje}`;
    mensajeError.classList.remove('oculto');
}

function ocultarError() {
    mensajeError.classList.add('oculto');
}

function mostrarResultados(mostrar) {
    if (mostrar) {
        resultadosClima.classList.remove('oculto');
    } else {
        resultadosClima.classList.add('oculto');
    }
}

function ocultarResultados() {
    resultadosClima.classList.add('oculto');
}

// Permitir buscar con Enter
inputCiudad.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        formulario.dispatchEvent(new Event('submit'));
    }
});

// Mensaje de bienvenida en consola
console.log('%c🌤️ API del Clima - OpenWeather', 'color: #f59e0b; font-size: 16px; font-weight: bold;');
console.log('%cPara usar esta API, obtén tu clave gratuita en: https://openweathermap.org/api', 'color: #6366f1; font-size: 12px;');
console.log('%cReemplaza "demo" con tu API_KEY en el código JavaScript', 'color: #ef4444; font-size: 12px;');
