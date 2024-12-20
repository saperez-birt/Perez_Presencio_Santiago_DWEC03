let countdown;
let timer;

export function startTimer() {
    const countdownElement = document.getElementById('countdown');
    countdown = parseInt(localStorage.getItem('countdown')) || 100;

    timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;

        if (countdown <= 0) {
            clearInterval(timer);
            localStorage.removeItem('countdown');
            window.location.href = "login.html";
        } else {
            localStorage.setItem('countdown', countdown);
        }
    }, 1000);
}

export function restartTimer() {
    clearInterval(timer);
    localStorage.removeItem('countdown');
    startTimer();
}

// explicame esto
window.addEventListener('beforeunload', () => {
    clearInterval(timer);
    localStorage.setItem('countdown', countdown);
});
