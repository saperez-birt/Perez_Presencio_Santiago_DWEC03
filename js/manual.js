import { startTimer, restartTimer } from './timer.js';

document.addEventListener('DOMContentLoaded', () => {
    startTimer();
});

const levels = document.querySelectorAll('.level');

levels.forEach(function(level) {
    level.addEventListener('mouseover', function() {
        level.style.transform = 'scale(1.1)';
    });
    
    level.addEventListener('mouseout', function() {
        level.style.transform = 'scale(1)';
    });
    
    level.addEventListener('click', function() {
        localStorage.setItem('level', level.id);
        restartTimer();
        window.location.href = "game.html";
    });
});
