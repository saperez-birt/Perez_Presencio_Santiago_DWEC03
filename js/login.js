import { startTimer } from './timer.js';

let usuarios = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await cargarUsuarios();
        document.getElementById('login').addEventListener('submit', validarLogin);
    } catch (error) {
        console.error('Error: ', error);
    }
});

async function cargarUsuarios() {
    if (!localStorage.getItem('usuarios')) {
        const response = await fetch('../data/usuarios.json');
        if (!response.ok) {
            throw new Error(`Error al cargar el fichero JSON.`);
        }
        usuarios = await response.json();
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

async function validarLogin(event) {
    event.preventDefault();

    const username = document.getElementById('nombre').value;
    const password = document.getElementById('current-password').value;

    const datosUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioValido = datosUsuarios.find(
        user => user.usuario === username && user.contraseña === password
    );

    if (!/^[a-zA-Z0-9]+$/.test(password)) {
        window.alert("La contraseña no puede contener simbolos especiales.");
        document.getElementById('login').reset();
    } else if (!usuarioValido) {
        window.alert("Usuario o contraseña incorrectos.");
        document.getElementById('login').reset();
    } else {
        localStorage.setItem('usuario', JSON.stringify(usuarioValido));
        startTimer();
        window.location.href = "home.html";
    }
}