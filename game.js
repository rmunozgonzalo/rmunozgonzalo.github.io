const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let interval;

const droneImg = new Image();
droneImg.src = "drone.svg";
let isPaused = false;

let score = 0;
let highscores = [];
let lastscore = 0;
let DRONE_HEIGHT = 50;

const drone = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: DRONE_HEIGHT,
    speed: 5,
    moveUp: function() {
        this.y -= this.speed;
    },
    moveDown: function() {
        this.y += this.speed;
    },
    draw: function() {
        ctx.drawImage(droneImg, this.x, this.y, this.width, this.height);
    }
};

const obstacleImg = new Image();
obstacleImg.src = "pajaro.svg";

const obstacle = {
    x: canvas.width,
    y: Math.floor(Math.random() * (canvas.height - 20) + 10),
    width: 50,
    height: 50,
    speed: 3,
    draw: function() {
        ctx.drawImage(obstacleImg, this.x, this.y, this.width, this.height);
    }
};

function pauseGame() {
    isPaused = !isPaused;

    if (isPaused) {
        clearInterval(interval);
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Pausa", canvas.width / 2 - 50, canvas.height / 2);
    } else {
        draw();
        update();
        interval = requestAnimationFrame(loop);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drone.draw();
    obstacle.draw();

    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 20);
}

function update() {
    obstacle.x -= obstacle.speed;

    if (obstacle.x < 0) {
        obstacle.x = canvas.width;
        obstacle.y = Math.floor(Math.random() * (canvas.height - 20) + 10);
        score++;

        // Incrementar la velocidad del obstáculo cada 2 puntos
        if (score % 2 === 0) {
            obstacle.speed += 5; // Aumentar la velocidad en 5
        }
    }

    // Verificar colisión
    if (drone.x < obstacle.x + obstacle.width &&
        drone.x + drone.width > obstacle.x &&
        drone.y < obstacle.y + obstacle.height &&
        drone.y + drone.height > obstacle.y) {
        alert("Game over!");
        updateHighscores(score);
        resetGame();
    }

    document.getElementById("score").textContent = score;
}

function updateHighscores(newScore) {
    if (lastscore >= newScore) {
        return false;
    }
    if (highscores.length < 10 || newScore > highscores[highscores.length - 1].score) {
        highscores.push({ name: "Player", score: newScore });
        highscores.sort(function(a, b) {
            return b.score - a.score;
        });
        if (highscores.length > 10) {
            highscores.splice(10);
        }
        updateHighscoresList();
        lastscore = newScore;
    }
}

function resetGame() {
    score = 0;
    drone.x = 50;
    drone.y = canvas.height / 2;
    obstacle.x = canvas.width;
    obstacle.y = Math.floor(Math.random() * (canvas.height - 20) + 10);
    obstacle.speed = 3; // Restablecer la velocidad del obstáculo
    isGameOver = false;
}

function loop() {
    if (!isPaused) {
        draw();
        update();
        interval = requestAnimationFrame(loop);
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" || event.keyCode === 38) {
        drone.moveUp();
    }
    if (event.key === "ArrowDown" || event.keyCode === 40) {
        drone.moveDown();
    }
});

document.addEventListener("mousemove", function(event) {
    var rect = canvas.getBoundingClientRect();
    var mouseY = event.clientY - rect.top - drone.height / 2;
    if (mouseY < 0) {
        drone.y = 0;
    } else if (mouseY + drone.height > canvas.height) {
        drone.y = canvas.height - drone.height;
    } else {
        drone.y = mouseY;
    }
});

function reset() {
    score = 0;
    drone.x = 50;
    drone.y = canvas.height / 2;
    obstacle.x = canvas.width;
    obstacle.y = Math.floor(Math.random() * (canvas.height - 20) + 10);
}

function updateHighscoresList() {
    const highscoresList = document.getElementById("highScoresList");
    let highscoresHTML = "";

    for (let i = 0; i < highscores.length; i++) {
        highscoresHTML += "<li>" + highscores[i].name + " : " + highscores[i].score + "</li>";
    }

    highscoresList.innerHTML = highscoresHTML;
}

canvas.addEventListener("mousemove", function(event) {
    var mousePos = calculateMousePos(event);
    if (mousePos.y < drone.y) {
        drone.y -= 10; // mover hacia arriba
    } else if (mousePos.y > drone.y + DRONE_HEIGHT) {
        drone.y += 10; // mover hacia abajo
    }
});

function calculateMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = event.clientX - rect.left - root.scrollLeft;
    var mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

document.addEventListener("keydown", function(event) {
    if (event.key === "r" || event.keyCode === 82) {
        reset();
    }
    if (event.key === "Escape" || event.keyCode === 27) {
        pauseGame();
    }
});
