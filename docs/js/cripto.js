// ===== CONFIGURACIÓN COINGECKO API =====
const BASE_URL_CRIPTO = 'https://api.coingecko.com/api/v3/simple/price?ids=';

// Mapeo de nombres legibles a IDs de CoinGecko
const criptosMap = {
    'bitcoin': 'bitcoin',
    'ethereum': 'ethereum',
    'cardano': 'cardano',
    'solana': 'solana',
    'ripple': 'ripple',
    'polkadot': 'polkadot',
    'dogecoin': 'dogecoin',
    'litecoin': 'litecoin',
    'chainlink': 'chainlink',
    'uniswap': 'uniswap'
};

// DOM Elements
const formularioCripto = document.getElementById('formulario-cripto');
const criptoSelect = document.getElementById('cripto-select');
const indicadorCarga = document.getElementById('indicador-carga');
const mensajeError = document.getElementById('mensaje-error');
const resultadosCripto = document.getElementById('resultados-cripto');

// Event Listeners
formularioCripto.addEventListener('submit', buscarCripto);

// Función para buscar criptomoneda
async function buscarCripto(e) {
    e.preventDefault();
    
    const criptoBusqueda = criptoSelect.value;
    
    if (!criptoBusqueda) {
        mostrarError('Por favor selecciona una criptomoneda');
        return;
    }

    mostrarCarga(true);
    limpiarResultados();

    try {
        const params = 'vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_7d_change=true&include_market_cap_change_24h=true&precision=2';
        const respuesta = await fetch(`${BASE_URL_CRIPTO}${criptosMap[criptoBusqueda]}&${params}`);
        
        if (!respuesta.ok) {
            mostrarError('Error al conectar con la API');
            mostrarCarga(false);
            return;
        }

        const datos = await respuesta.json();
        const criptoData = datos[criptosMap[criptoBusqueda]];

        if (criptoData) {
            mostrarCripto(criptoBusqueda, criptoData);
        } else {
            mostrarError('Datos no disponibles para esta criptomoneda');
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al obtener los datos de la criptomoneda');
    } finally {
        mostrarCarga(false);
    }
}

// Función para mostrar los datos de la criptomoneda
function mostrarCripto(cripto, datos) {
    // Obtener nombre legible
    const nombreMap = {
        'bitcoin': 'Bitcoin',
        'ethereum': 'Ethereum',
        'cardano': 'Cardano',
        'solana': 'Solana',
        'ripple': 'Ripple',
        'polkadot': 'Polkadot',
        'dogecoin': 'Dogecoin',
        'litecoin': 'Litecoin',
        'chainlink': 'Chainlink',
        'uniswap': 'Uniswap'
    };

    const simboloMap = {
        'bitcoin': 'BTC',
        'ethereum': 'ETH',
        'cardano': 'ADA',
        'solana': 'SOL',
        'ripple': 'XRP',
        'polkadot': 'DOT',
        'dogecoin': 'DOGE',
        'litecoin': 'LTC',
        'chainlink': 'LINK',
        'uniswap': 'UNI'
    };

    const nombre = nombreMap[cripto] || cripto;
    const simbolo = simboloMap[cripto] || cripto.toUpperCase();
    
    // Extraer datos
    const precio = datos.usd ? `$${datos.usd.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A';
    const cambio24h = datos.usd_24h_change ? `${datos.usd_24h_change.toFixed(2)}%` : 'N/A';
    const cambio7d = datos.usd_7d_change ? `${datos.usd_7d_change.toFixed(2)}%` : 'N/A';
    const marketCap = datos.usd_market_cap ? `$${(datos.usd_market_cap / 1e9).toFixed(2)}B` : 'N/A';
    const volumen = datos.usd_24h_vol ? `$${(datos.usd_24h_vol / 1e6).toFixed(2)}M` : 'N/A';

    // Actualizar DOM
    document.getElementById('nombre-cripto').textContent = nombre;
    document.getElementById('simbolo-cripto').textContent = simbolo;
    document.getElementById('precio-cripto').textContent = precio;
    
    // Cambio 24h con color según positivo/negativo
    const cambio24Element = document.getElementById('cambio24-cripto');
    cambio24Element.textContent = cambio24h;
    cambio24Element.className = 'valor';
    if (datos.usd_24h_change > 0) {
        cambio24Element.classList.add('positivo');
        cambio24Element.textContent = '📈 ' + cambio24h;
    } else if (datos.usd_24h_change < 0) {
        cambio24Element.classList.add('negativo');
        cambio24Element.textContent = '📉 ' + cambio24h;
    }
    
    // Cambio 7d
    const cambio7Element = document.getElementById('cambio7-cripto');
    cambio7Element.textContent = cambio7d;
    cambio7Element.className = 'valor';
    if (datos.usd_7d_change > 0) {
        cambio7Element.classList.add('positivo');
    } else if (datos.usd_7d_change < 0) {
        cambio7Element.classList.add('negativo');
    }
    
    document.getElementById('marketcap-cripto').textContent = marketCap;
    document.getElementById('volumen-cripto').textContent = volumen;
    
    // Supply (puede no estar disponible en esta API)
    document.getElementById('supply-cripto').textContent = 'Disponible en CoinGecko';
    
    // Fecha de actualización
    const ahora = new Date();
    const fechaFormato = ahora.toLocaleString('es-ES');
    document.getElementById('fecha-actualizacion').textContent = `Última actualización: ${fechaFormato}`;

    resultadosCripto.classList.remove('oculto');
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
    resultadosCripto.classList.add('oculto');
}
