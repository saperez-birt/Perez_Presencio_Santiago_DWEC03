let cartas = [];
let cartasSeleccionadas = [];
let vidas = 3;
let nivel;
let tiempoNivel;
let tiempoRestante = 0;
let puntuacion = 0;
let bloquearClicks = false;
let parejasEncontradas = 0;
let errores = 0;
let temporizador;
let tiempoJugadoTotal = 0;

window.onload = () => {
    setearNivel();
    iniciarJuego();
    ajustarTamano();
};

function setearNivel() {
    let level = localStorage.getItem('level');
    if (level === 'facil') {
        nivel = 1;
        tiempoNivel = 1;
    } else if (level === 'medio') {
        nivel = 8;
        tiempoNivel = 49;
    } else if (level === 'dificil') {
        nivel = 16;
        tiempoNivel = 83;
    }
}

function iniciarJuego() {
    tiempoRestante += tiempoNivel;
    parejasEncontradas = 0;
    bloquearClicks = false;
    document.getElementById('nivel-completado').style.display = 'none';
    generarTablero();
    actualizarUI();
    iniciarTemporizador();
}

async function generarTablero() {
    cartas = crearCartas();
    barajarCartas(cartas);
    console.log(cartas);
    renderizarTablero(cartas);
}

function crearCartas() {
    let cartas = [];
    let numParejas = nivel + 1;
    let bonificacionId = Math.floor(Math.random() * numParejas) + 1;

    // La primera pareja que se crea siempre es la de bonificacion asignandole un numero aleatorio entre 1 y el numero de parejas
    cartas.push({ id: bonificacionId, pareja: false, bonificacion: true, activate: false });
    cartas.push({ id: bonificacionId, pareja: false, bonificacion: false });

    for (let i = 1; i <= numParejas; i++) {
        if (i != bonificacionId) {
            cartas.push({ id: i, pareja: false });
            cartas.push({ id: i, pareja: false });
        }
    }

    return cartas;
}

// Algoritmo de Fisher-Yates para barajar las cartas
function barajarCartas(cartas) {
    for (let i = cartas.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
    return cartas;
}

function renderizarTablero(cartas) {
    let tablero = document.getElementById('tablero');
    tablero.innerHTML = '';
    cartas.forEach((carta, index) => {
        let elemento = crearElemento(carta, index);
        tablero.appendChild(elemento);
    });
}

function crearElemento(carta, index) {
    let elemento = document.createElement('div');
    elemento.classList.add('carta');
    elemento.dataset.id = index;
    elemento.dataset.valor = carta.id;

    if (carta.bonificacion) {
        elemento.classList.add('bonificacion');
        elemento.addEventListener('dblclick', activarBonificacion);
    } else {
        elemento.addEventListener('click', seleccionarCarta);
    }

    elemento.addEventListener('mouseenter', agregarAnimacionRebote);

    return elemento;
}

function activarBonificacion(event) {
    let elemento = event.target;
    let index = elemento.dataset.id;
    let carta = cartas[index];

    if (!carta.activate) {
        carta.activate = true;
        elemento.classList.add('activada');
        mostrarMensajeBonificacion('¡Bonificación activada!');

        elemento.addEventListener('animationend', () => {
            elemento.classList.remove('activada');
        }, { once: true });
    }
    seleccionarCarta(event);
}

function mostrarMensajeBonificacion(mensaje) {
    let mensajeElemento = document.getElementById('mensaje-bonificacion');
    mensajeElemento.innerText = mensaje;
    mensajeElemento.style.display = 'block';
    setTimeout(() => {
        mensajeElemento.style.display = 'none';
    }, 3000);
}

function seleccionarCarta(event) {
    let elemento = event.target;
    if (bloquearClicks || elemento.classList.contains('revelada')) {
        return;
    }

    let index = elemento.dataset.id;
    let carta = cartas[index];

    console.log(carta);
    elemento.classList.add('revelada');

    elemento.innerText = carta.id;

    cartasSeleccionadas.push({ elemento, carta });
    if (cartasSeleccionadas.length === 2) {
        bloquearClicks = true;
        verificarPareja();
    }
}

function verificarPareja() {
    let [seleccion1, seleccion2] = cartasSeleccionadas;
    console.log(seleccion1, seleccion2);
    let carta1 = seleccion1.carta;
    let carta2 = seleccion2.carta;

    if (carta1.id === carta2.id) {
        if (((carta1.bonificacion && carta1.activate) || (carta2.bonificacion && carta2.activate))) {
            puntuacion += 1000;
        }
        parejasEncontradas++;
        console.log(parejasEncontradas);
        puntuacion += 10;
        seleccion1.elemento.classList.add('encontrada');
        seleccion2.elemento.classList.add('encontrada');
        cartasSeleccionadas = [];
        bloquearClicks = false;
        if (parejasEncontradas === nivel + 1) {
            clearInterval(temporizador);
            mostrarPanelNivelCompletado(); 
        }
    } else {
        if (errores === 3) {
            puntuacion -= 10;
        }
        setTimeout(() => {
            seleccion1.elemento.classList.remove('revelada');
            seleccion1.elemento.innerText = '';
            seleccion2.elemento.classList.remove('revelada');
            seleccion2.elemento.innerText = '';
            cartasSeleccionadas = [];
            bloquearClicks = false;
        }, 1000);

        if (carta1.bonificacion || carta2.bonificacion) {
            carta1.bonificacion = false;
            carta2.bonificacion = false;
        }
    }
}

function agregarAnimacionRebote(event) {
    if (!bloquearClicks){
        let elemento = event.target;
        bloquearClicks = true;
        elemento.classList.add('rebote');
        elemento.addEventListener('animationend', () => {
            elemento.classList.remove('rebote');
            bloquearClicks = false;
        }, { once: true });
    }
}

function actualizarUI() {
    let vidasContainer = document.getElementById('vidas');
    vidasContainer.innerHTML = '';
    for (let i = 0; i < vidas; i++) {
        let corazon = document.createElement('img');
        corazon.src = 'assets/images/vida.png';
        corazon.alt = 'corazon';
        vidasContainer.appendChild(corazon);
    }
    document.getElementById('info-level').innerText = `Level ${nivel}`;
    document.getElementById('time').innerText = tiempoNivel;
    document.getElementById('puntos').innerText = puntuacion;
}

function iniciarTemporizador() {
    if (temporizador) clearInterval(temporizador);
    temporizador = setInterval(() => {
        tiempoRestante--;
        tiempoJugadoTotal++;
        document.getElementById('time').innerText = tiempoRestante;
        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            vidas--;
            if (vidas > 0) {
                alert('Nivel reiniciado. Inténtalo de nuevo.');
                iniciarJuego();
            } else {
                mostrarPanelGameOver();
            }
        }
    }, 1000);
}

function ajustarTamano() {
    let anchoVentana = window.innerWidth;
    let altoVentana = window.innerHeight;
    let tamanoCarta = Math.min(anchoVentana, altoVentana) / 10;
    document.querySelectorAll('.carta').forEach(carta => {
        carta.style.width = `${tamanoCarta}px`;
        carta.style.height = `${tamanoCarta * 1.5}px`;
    });
}

window.addEventListener('resize', ajustarTamano);

function manejarTeclado(event) {
    if (event.key === 'p') {
        if (temporizador) {
            bloquearClicks = true;
            clearInterval(temporizador);
            temporizador = null;
        } else {
            bloquearClicks = false;
            iniciarTemporizador();
        }
    }
}

window.addEventListener('keydown', manejarTeclado);

function mostrarPanelNivelCompletado() {
    document.getElementById('info-tiempo').innerText = `Tiempo sobrante: ${tiempoRestante}`;
    document.getElementById('info-puntos').innerText = `Puntos: ${puntuacion}`;
    document.getElementById('info-vidas').innerText = `Vidas restantes: ${vidas}`;
    document.getElementById('nivel-completado').style.display = 'flex';
}

function mostrarPanelGameOver() {
    document.getElementById('info-nivel').innerText = `NIVEL ALCANZADO: ${nivel}`;
    document.getElementById('info-tiempo-jugado').innerText = `TIEMPO JUGADO: ${tiempoJugadoTotal} segundos`;
    document.getElementById('info-puntuacion-total').innerText = `PUNTUACION TOTAL: ${puntuacion}`;
    document.getElementById('game-over').style.display = 'flex';
}

document.getElementById('siguiente-nivel').addEventListener('click', () => {
    nivel++;
    tiempoNivel += (nivel * 5);
    iniciarJuego();
});

document.getElementById('reiniciar').addEventListener('click', () => {
    window.location.href = 'manual.html';
});

document.getElementById('home').addEventListener('click', () => {
    window.location.href = 'manual.html';
});
