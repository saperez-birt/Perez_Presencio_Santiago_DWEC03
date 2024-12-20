import { startTimer } from './timer.js';

const logo = document.getElementById('logo-redondo');

logo.addEventListener('mouseover', function() {
    logo.style.transform = 'scale(1.1)';
    logo.style.boxShadow = '0px 8px 32px rgba(2, 49, 27, 0.5)';
});

logo.addEventListener('mouseout', function() {
    logo.style.transform = 'scale(1)';
    logo.style.boxShadow = 'none';
});

logo.addEventListener('click', function() {
    window.location.href = "manual.html";
});

document.addEventListener('DOMContentLoaded', () => {
    startTimer();
});