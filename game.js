const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

const sounds = {
    eat: new Audio("sounds/audiopacman.mp3"),
    powerup: new Audio("sounds/pacman-eating-cherry.mp3"),
    die: new Audio("sounds/pacman-dies.mp3"),
    eatGhost: new Audio("sounds/pacman-eating-ghost.mp3"),
    inicio: new Audio("sounds/pacman-song.mp3")
};

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let lives = 3;
let ghostCount = 4;
let ghostImageLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];

// Game variables
//nuevo, quitarlo si no sirve
let showFood = true; // controla si se dibuja la comida o no
//quitar si no funciona
let ghostVulnerableTime = 0;      // tiempo restante en segundos
let ghostVulnerableTimer = null;  // para guardar el setInterval


let fps = 30;
let pacman;
let oneBlockSize = 20;
let score = 0;
let isGameOver = false;
let ghosts = [];
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";


//1 pared
//0 vacio
// 21 columnas 
// 23 filas


let levels = [ //nivel 1
    [
    [1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1],
    [1, 2, 2, 2, 2,  2, 2, 2, 1, 2,  2, 2, 1, 2, 2,  2, 2, 2, 2, 4,  1],
    [1, 2, 1, 1, 1,  1, 2, 2, 1, 2,  1, 2, 1, 2, 2,  1, 1, 1, 1, 2,  1],
    [1, 2, 1, 2, 2,  2, 2, 2, 2, 2,  1, 2, 2, 2, 2,  2, 2, 2, 1, 2,  1],
    [1, 2, 2, 2, 2,  2, 1, 1, 2, 2,  1, 2, 2, 1, 1,  2, 2, 2, 2, 2,  1],
    [1, 2, 1, 1, 1,  2, 1, 1, 2, 2,  1, 2, 2, 1, 1,  2, 1, 1, 1, 2,  1],
    [1, 4, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  1],
    [1, 1, 1, 1, 1,  2, 2, 2, 1, 1,  1, 1, 1, 2, 2,  2, 1, 1, 1, 1,  1],
    [0, 0, 0, 0, 1,  2, 1, 2, 2, 2,  2, 2, 2, 2, 1,  2, 1, 0, 0, 0,  0],
    [1, 1, 1, 1, 1,  2, 1, 2, 1, 1,  0, 1, 1, 2, 1,  2, 1, 1, 1, 1,  1],
    [2, 2, 2, 2, 2,  2, 2, 2, 1, 0,  0, 0, 1, 2, 2,  2, 2, 2, 2, 2,  2],
    [1, 1, 2, 1, 1,  2, 1, 2, 1, 0,  0, 0, 1, 2, 1,  2, 1, 1, 2, 1,  1],
    [0, 1, 2, 2, 1,  2, 1, 2, 1, 1,  1, 1, 1, 2, 1,  2, 1, 2, 2, 1,  0],
    [0, 1, 2, 2, 1,  2, 1, 2, 2, 2,  2, 2, 2, 2, 1,  2, 1, 2, 2, 1,  0],
    [1, 1, 2, 2, 1,  2, 1, 2, 1, 1,  1, 1, 1, 2, 1,  2, 1, 2, 2, 1,  1],
    [1, 4, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 4,  1],
    [1, 2, 1, 1, 1,  2, 1, 1, 1, 2,  1, 2, 1, 1, 1,  2, 1, 1, 1, 2,  1],
    [1, 2, 2, 2, 1,  2, 2, 2, 2, 2,  1, 2, 2, 2, 2,  2, 1, 2, 2, 2,  1],
    [1, 1, 2, 2, 1,  2, 1, 2, 1, 1,  1, 1, 1, 2, 1,  2, 1, 2, 2, 1,  1],
    [1, 2, 2, 2, 2,  2, 1, 2, 2, 2,  1, 2, 2, 2, 1,  2, 2, 2, 2, 2,  1],
    [1, 2, 1, 1, 1,  1, 1, 1, 1, 2,  1, 2, 1, 1, 1,  1, 1, 1, 1, 2,  1],
    [1, 4, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 4,  1],
    [1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1]
],
 //nivel 2
 [
    [1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1],
    [1, 2, 2, 2, 2,  2, 2, 2, 2, 2,  1, 2, 2, 2, 2,  2, 2, 2, 2, 4,  1],
    [1, 2, 1, 1, 1,  2, 1, 1, 1, 2,  1, 2, 1, 1, 1,  2, 1, 1, 1, 2,  1],
    [1, 2, 1, 1, 1,  2, 1, 1, 1, 2,  1, 2, 1, 1, 1,  2, 1, 1, 1, 2,  1],
    [1, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  1],
    [1, 2, 1, 1, 1,  2, 1, 2, 1, 1,  1, 1, 1, 2, 1,  2, 1, 1, 1, 2,  1],
    [1, 4, 2, 2, 2,  2, 1, 2, 2, 2,  1, 2, 2, 2, 1,  2, 2, 2, 2, 2,  1],
    [1, 1, 1, 1, 1,  2, 1, 1, 1, 2,  1, 2, 1, 1, 1,  2, 1, 1, 1, 1,  1],
    [0, 0, 0, 0, 1,  2, 1, 2, 2, 2,  2, 2, 2, 2, 1,  2, 1, 0, 0, 0,  0],
    [1, 1, 1, 1, 1,  2, 1, 2, 1, 1,  0, 1, 1, 2, 1,  2, 1, 1, 1, 1,  1],
    [2, 2, 2, 2, 2,  2, 2, 2, 1, 0,  0, 0, 1, 2, 2,  2, 2, 2, 2, 2,  2],
    [1, 1, 1, 1, 1,  2, 1, 2, 1, 0,  0, 0, 1, 2, 1,  2, 1, 1, 1, 1,  1],
    [0, 0, 0, 0, 1,  2, 1, 2, 1, 1,  1, 1, 1, 2, 1,  2, 1, 0, 0, 0,  0],
    [0, 0, 0, 0, 1,  2, 1, 2, 2, 2,  2, 2, 2, 2, 1,  2, 1, 0, 0, 0,  0],
    [1, 1, 1, 1, 1,  2, 1, 2, 1, 1,  1, 1, 1, 2, 1,  2, 1, 1, 1, 1,  1],
    [1, 4, 2, 2, 2,  2, 2, 2, 2, 2,  1, 2, 2, 2, 2,  2, 2, 2, 2, 4,  1],
    [1, 2, 1, 1, 1,  2, 1, 1, 1, 2,  1, 2, 1, 1, 1,  2, 1, 1, 1, 2,  1],
    [1, 2, 2, 2, 1,  2, 2, 2, 2, 2,  1, 2, 2, 2, 2,  2, 1, 2, 2, 2,  1],
    [1, 1, 2, 2, 1,  2, 1, 2, 1, 1,  1, 1, 1, 2, 1,  2, 1, 2, 2, 1,  1],
    [1, 2, 2, 2, 2,  2, 1, 2, 2, 2,  1, 2, 2, 2, 1,  2, 2, 2, 2, 2,  1],
    [1, 2, 1, 1, 1,  1, 1, 1, 1, 2,  1, 2, 1, 1, 1,  1, 1, 1, 1, 2,  1],
    [1, 4, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 4,  1],
    [1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1],
 ]
 
];

let currentLevel = 0;
 map = levels[currentLevel];

 function loadLevel(levelIndex) {
    map = levels[levelIndex];
    createNewPacman();
    createGhosts();
    showFood = true;
    ghostVulnerableTime = 0;
    if (ghostVulnerableTimer) clearInterval(ghostVulnerableTimer);
}


let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize,
    },
];


let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
};

let gameLoop = () => {
     if (isGameOver) return; // Detiene todo si ya termino
    update();
    draw();
};

setInterval(() => {
    showFood = !showFood;
}, 200); // alterna cada 200 ms )

let restartPacmanAndGhosts = () => {
    createNewPacman();
    createGhosts();
};
/*
let onGhostCollision = () => {
    lives--;
    restartPacmanAndGhosts();
    if (lives == 0) {
    }
};*/


let onGhostCollision = () => {
    lives--;

    if (lives === 0) {
        isGameOver = true;       //  Detiene todo el juego
        drawGameOver();              // Muestra el mensaje de go
        return;
    }

    restartPacmanAndGhosts(); // Solo si aun tiene vidas
};


let update = () => {
    pacman.moveProcess();
    pacman.eat();
    updateGhosts();
    if (pacman.checkGhostCollision(ghosts)) {
        onGhostCollision();
    }
    if (isLevelCleared()) {
    currentLevel++;
    if (currentLevel >= levels.length) {
        isGameOver = true;
        drawVictory();
    } else {
        loadLevel(currentLevel);
    }
}

};

let isLevelCleared = () => {
    for (let row of map) {
        for (let cell of row) {
            if (cell === 2 || cell === 4) return false;
        }
    }
    return true;
};


let drawFoods = () => {

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            //comida normla
            if (map[i][j] == 2) {
                canvasContext.beginPath();
                canvasContext.fillStyle = "#FEB897";
                canvasContext.arc(
                    j * oneBlockSize + oneBlockSize / 2, // centro X
                    i * oneBlockSize + oneBlockSize / 2, // centro Y
                    oneBlockSize / 6,                     // radio
                    0,
                    2 * Math.PI
                );
                canvasContext.fill();
            }
            if(map[i][j] == 4 && showFood){
                //power
                canvasContext.beginPath();
                canvasContext.fillStyle = "#FFFFF";
                canvasContext.arc(
                    j * oneBlockSize + oneBlockSize / 2,
                    i * oneBlockSize + oneBlockSize / 2,
                    oneBlockSize / 3, //mas grande
                    0,
                    2* Math.PI
                );
                canvasContext.fill();
            }
        }
    }
};

let drawRemainingLives = () => {
    canvasContext.font = "20px 'Pixelify Sans'";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));

    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * map.length + 2,
            oneBlockSize,
            oneBlockSize
        );
    }
};

let drawScore = () => {
    canvasContext.font = "20px 'Pixelify Sans'";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length + 1)
    );
};

let drawVulnerableTimer = () => {
    if (ghostVulnerableTime > 0) {
        canvasContext.font = "20px 'Pixelify Sans'";
        canvasContext.fillStyle = "#00ffff";
        canvasContext.fillText(
            `ghosts: ${ghostVulnerableTime}s`,
            110,
            oneBlockSize * (map.length + 1)
        );
    }
};


let draw = () => {
      if (isGameOver) return; // evita dibujar encima del Game Over

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");

    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawScore();
    drawRemainingLives();
    drawVulnerableTimer(); //llamando funciones
};

let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    "#342DCA"
                );
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};

let drawGameOver = () => {
    // Fondo negro sobre el canvas
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    // Texto "GAME OVER"
    canvasContext.font = "30px 'Pixelify Sans'";
    canvasContext.fillStyle = "red";
    canvasContext.fillText("GAME OVER", 60, canvas.height / 2 - 20);

    // Texto de reinicio
    canvasContext.font = "20px 'Pixelify Sans'";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("press f5 para jugar", 30, canvas.height / 2 + 30);
};
    //Texto de Victoria
let drawVictory = () => {
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "30px 'Pixelify Sans'";
    canvasContext.fillStyle = "#00FF00";
    canvasContext.fillText("¡GANASTE TODOS LOS NIVELES!", 10, canvas.height / 2);
};


let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount * 2; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostImageLocations[i % 4].x,
            ghostImageLocations[i % 4].y,
            124,
            116,
            6 + i
        );
        ghosts.push(newGhost);
    }
};

let makeGhostsVulnerable = () => {
    ghostVulnerableTime = 3;

    for (let ghost of ghosts) {
        ghost.isVulnerable = true;
    }

    // Si ya hay un temporizador corriendo, se limpia
    if (ghostVulnerableTimer !== null) {
        clearInterval(ghostVulnerableTimer);
    }

    // Nuevo temporizador que cuenta hacia atras
    ghostVulnerableTimer = setInterval(() => {
        ghostVulnerableTime--;

        if (ghostVulnerableTime <= 0) {
            for (let ghost of ghosts) {
                ghost.isVulnerable = false;
            }

            clearInterval(ghostVulnerableTimer);
            ghostVulnerableTimer = null;
        }
    }, 1000); // cada 1 segundo
};


//createNewPacman();
//createGhosts();
loadLevel(currentLevel);
let gameInterval = setInterval(gameLoop, 1000 / fps);


window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if (k == 37 || k == 65) {
            // left arrow or a
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87) {
            // up arrow or w
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) {
            // right arrow or d
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) {
            // bottom arrow or s
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});
