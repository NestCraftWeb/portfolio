document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const scoreDisplay = document.getElementById('score');
    const startBtn = document.getElementById('start-btn');

    let score = 0;
    let gameInterval;
    let starTimeout;

    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');

        // Random position within game area
        const maxX = gameArea.clientWidth - 30;
        const maxY = gameArea.clientHeight - 30;
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);

        star.style.left = x + 'px';
        star.style.top = y + 'px';

        star.addEventListener('click', () => {
            score++;
            scoreDisplay.textContent = score;
            star.remove();
        });

        gameArea.appendChild(star);

        // Remove star after 2 seconds if not clicked
        starTimeout = setTimeout(() => {
            star.remove();
        }, 2000);
    }

    function startGame() {
        score = 0;
        scoreDisplay.textContent = score;
        gameArea.innerHTML = '';
        startBtn.disabled = true;

        gameInterval = setInterval(createStar, 1000);

        // Stop game after 30 seconds
        setTimeout(() => {
            clearInterval(gameInterval);
            startBtn.disabled = false;
            alert('Game over! Your score: ' + score);
        }, 30000);
    }

    startBtn.addEventListener('click', startGame);
});
