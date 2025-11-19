// ===== CONFIGURACIÓN POKEAPI =====
const BASE_URL_POKEMON = 'https://pokeapi.co/api/v2/pokemon/';

// DOM Elements
const formularioPokemon = document.getElementById('formulario-pokemon');
const pokemonInput = document.getElementById('pokemon-input');
const indicadorCarga = document.getElementById('indicador-carga');
const mensajeError = document.getElementById('mensaje-error');
const resultadosPokemon = document.getElementById('resultados-pokemon');

// Event Listeners
formularioPokemon.addEventListener('submit', buscarPokemon);

// Función para buscar Pokémon
async function buscarPokemon(e) {
    e.preventDefault();
    
    const pokemonBusqueda = pokemonInput.value.trim().toLowerCase();
    
    if (!pokemonBusqueda) {
        mostrarError('Por favor ingresa el nombre o ID de un Pokémon');
        return;
    }

    mostrarCarga(true);
    limpiarResultados();

    try {
        const respuesta = await fetch(`${BASE_URL_POKEMON}${pokemonBusqueda}`);
        
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                mostrarError('Pokémon no encontrado. Intenta con otro nombre o ID.');
            } else {
                mostrarError('Error al conectar con la API');
            }
            mostrarCarga(false);
            return;
        }

        const datos = await respuesta.json();
        mostrarPokemon(datos);

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al obtener los datos del Pokémon');
    } finally {
        mostrarCarga(false);
    }
}

// Función para mostrar los datos del Pokémon
function mostrarPokemon(pokemon) {
    // Extraer datos
    const nombre = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id;
    const imagen = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                   pokemon.sprites?.front_default || '';
    const peso = pokemon.weight ? (pokemon.weight / 10) + ' kg' : 'N/A';
    const altura = pokemon.height ? (pokemon.height / 10) + ' m' : 'N/A';
    
    // Tipos
    let tipos = pokemon.types?.map(t => t.type.name.toUpperCase()).join(', ') || 'N/A';
    
    // Estadísticas
    const stats = pokemon.stats;
    const velocidad = stats?.find(s => s.stat.name === 'speed')?.base_stat || 'N/A';
    const ataque = stats?.find(s => s.stat.name === 'attack')?.base_stat || 'N/A';
    
    // Habilidades
    let habilidades = pokemon.abilities?.map(a => a.ability.name).join(', ') || 'N/A';

    // Actualizar DOM
    document.getElementById('nombre-pokemon').textContent = nombre;
    document.getElementById('imagen-pokemon').src = imagen;
    document.getElementById('imagen-pokemon').alt = nombre;
    document.getElementById('id-pokemon').textContent = `#${id}`;
    document.getElementById('tipo-pokemon').textContent = tipos;
    document.getElementById('peso-pokemon').textContent = peso;
    document.getElementById('altura-pokemon').textContent = altura;
    document.getElementById('velocidad-pokemon').textContent = velocidad;
    document.getElementById('ataque-pokemon').textContent = ataque;
    
    // Habilidades
    const habilidadesLista = document.getElementById('habilidades-lista');
    if (pokemon.abilities && pokemon.abilities.length > 0) {
        habilidadesLista.innerHTML = pokemon.abilities
            .map(a => `<span class="habilidad-badge">${a.ability.name}</span>`)
            .join('');
    } else {
        habilidadesLista.innerHTML = '<span class="habilidad-badge">N/A</span>';
    }

    resultadosPokemon.classList.remove('oculto');
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
    resultadosPokemon.classList.add('oculto');
}
