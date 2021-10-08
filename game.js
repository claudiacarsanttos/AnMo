function restartGame() {
    document.getElementById("RestartButton").style.display = "none";
    givenTime = 200;
    startTime = new Date().getTime();
    isGameOver = false;
    isFirstTime = true;
    currentLevel = 1;
    monsters = [];
    boxes = [];
    goodThings = [];
    keys = [];
    initialiseMap();
    player.x = playerInitX;
    player.y = playerInitY;
    player.bullets = 8;
    player.velX = 0;
    player.velY = 0;
    player.score = initScore;
}

var isStarted = false;
// Iniciar função do jogo
function startGame() {
    var playerName = "Ayana";
    player.name = playerName;
    isStarted = true;
    startTime = new Date().getTime();
    initialiseMap();
    document.getElementById("SplashScreen").style.display = "none";
    document.getElementById("canvas").style.display = "block";
}
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 1400,
    height = 900,
    player = {
      x : width/2-90,
      y : height-25,
      width : 5,
      height : 5,
      speed: 3,
      velX: 0,
      velY: 0,
      jumping:false,
      grounded: false,
      projectileTimer: Date.now(),
      shootDelay: 200,
      name: "Ayana",
      score: 0,
      cheatmode: false,
      bullets: 8
    },
    keys = [],
    friction = 0.80,
    gravity = 0.3,
    projectiles = [];
canvas.width = width;
canvas.height = height;

var playerInitX = width/2-90;
var playerInitY = height-25;
var initScore = 0;

var gameWidth = 1230;

var monsters = [];
var goodThings = [];
var exit;
var portalStart, portalEnd;

var score = 100;
var startTime;
var givenTime = 200; // tempo do jogo
var elapsedTime, remainingTime;

// Manuseio nivelado
var isGameOver = false;
var isNextLevel = false;
var isFirstTime = true;
var scoreTable;
var currentLevel = 1;

var facing = "E";
// Contador arbitrário
var count = 0;
var  currX, currY;

// para criação de plataforma
var boxes = []

var PATH_CHAR = "images/sprite_sheet4.png";

// Personagem
var CHAR_WIDTH = 50,//largura
    CHAR_HEIGHT = 60,//altura
    IMAGE_START_EAST_Y = 0,//leste - direita
    IMAGE_START_WEST_Y = 58,//oeste - esquerda
    SPRITE_WIDTH = 0;

// Tamanho das Culinárias
var COIN_WIDTH = 40,
    COIN_HEIGHT = 29,
    COIN_SPRITE_WIDTH = 40;

var PROJECTILE_WIDTH = 23,
    PROJECTILE_HEIGHT = 7;

var projectileSpriteY = 0;

var coinSpriteX = 0;

var TEXT_PRELOADING = "Carregando ...", 
    TEXT_PRELOADING_X = 200, 
    TEXT_PRELOADING_Y = 200;

var charImage = new Image();
charImage.src = PATH_CHAR;

var monsterImageChina = new Image();
monsterImageChina.src = "images/culinaria_chinesa.png";
    
var monsterImageFranca = new Image();
monsterImageFranca.src = "images/culinaria_franca.png";

var goodThingImageAngola = new Image();
goodThingImageAngola.src = "images/calula_angola.png";
    
var goodThingImageMocambique = new Image();
goodThingImageMocambique.src = "images/ngumbi_mocambique.png";

var tileImage = new Image();
tileImage.src = "images/tile_sprite.png";

var exitImageAngola = new Image();
exitImageAngola.src = "images/exit_sprite_angola.png";
    
var exitImageMocambique = new Image();
exitImageMocambique.src = "images/exit_sprite_mocambique.png";        

var bgImage = new Image();
bgImage.src = "images/background_sprite1.png";
    
var bgAngola = new Image();
bgAngola.src = "images/background_angola.png";
    
var bgMocambique = new Image();
bgMocambique.src = "images/background_mocambique.png";
    
var bgAfrica= new Image();
bgAfrica.src = "images/background_africa.png";

var teleporterImage = new Image();
teleporterImage.src = "images/teleporter_sprite.png";


var hitSnd = new Audio("sounds/hit.wav");
hitSnd.loop = false;

var levelupSnd = new Audio("sounds/levelup.wav");
levelupSnd.loop = false;

var gameoverSnd = new Audio("sounds/gameover.wav");
gameoverSnd.loop = false;


currX = 0;
currY = IMAGE_START_EAST_Y;

// E: saída
// X: monstro
// G: moedas
// P: iniciar portal; T: portal final
// F: monstro voador
// M: plataforma móvel
// #: plataforma
var GAME_MAP = new Array(
    "                                                             ",
    "                                                             ",
    "                                                             ",
    "  E                                                          ",
    "#########                                                    ",
    "       ####                                                  ",
    "       ######    G       ####       X         G              ",
    "###################################################          ",
    "              ##                                         G   ",
    "              ##                       G             ########",
    "              ## X     G                            #########",
    "        ##################                         ##########",
    "#                                   MMMMMMMM                 ",
    "#                             MMMMMMMMMMMMMMMMMMM            ",
    "#                          MMMMM                             ",
    "#  T        X   #######                                      ",
    "####################                                         ",
    "                  ##                                         ",
    "                   ###                                       ",
    "                     #                                       ",
    "                     #                                       ",
    "                                       G                     ",
    "                                                             ",
    "                                                       P     ",
    "                                   MMMMMMMMM    #############",
    "                               MMMMMMMMMMMMM                 ",
    "                       MMMMMMMMMMMMMMMMMMMMM                 ",
    "                                        MMMM                 ",
    "                #####                                        ",
    "           ######                                            ",
    "                                                             ",
    "   X   ###    G    ####                     G                ",
    "############################                                 ",
    "                                                             ",
    "                              MMMMMMMM   MMMMMMMM  MMMMMMMM  ",
    "                                                             ",
    "                     #######                                 ",
    "               X#######                                      ",
    "           #######                                           ",
    "      #######                                                ",
    "                                                             ",
    "####                                                         ",
    "########                                                     ",
    "############        ####   G       X      ####    G     X    ",
    "#############################################################"
    )
function initialiseMap() {
    var y,x;
    for(y=0; y<GAME_MAP.length; y++) {
        var start = null, end = null;
        var isMovable = false;
        for(x=0; x<GAME_MAP[y].length; x++) {
            if(start==null && (GAME_MAP[y].charAt(x) == '#' || GAME_MAP[y].charAt(x) == 'M')) { 
                start = x;
                isMovable = GAME_MAP[y].charAt(x) == 'M' ? true : false;
            }
            if (start != null && GAME_MAP[y].charAt(x) == ' ') {
                end = x - 1;
            }
            if (start != null && x==GAME_MAP[y].length -1) {
                end = x;
            }
            if (start != null && end != null) {
                boxes.push({
                    x: start * 20,
                    y: y*20,
                    width: (end-start+1)*20,
                    height: 20,
                    velY: isMovable ? 0.1 : 0,
                    origY: y*20
                });
                start = end = null;
            }
            if (GAME_MAP[y].charAt(x) == 'X') {
                monsters.push({
                    x: x*20,
                    y: y*20,
                    width: 20,
                    height: 20,
                    direction: "E",
                    velX: Math.random() * (1- 0.4) + 0.4,
                    leftBoundary: x*20-40,
                    rightBoundary: x*20+30,
                    currSpriteX: 0,
                    currSpriteY: IMAGE_START_EAST_Y
                });
            }

            if(GAME_MAP[y].charAt(x) == 'G') {
                goodThings.push({
                    x: x*20,
                    y: y*20,
                    width: 20,
                    height: 20,
                    currSpriteX: 0
                });
            }

            if(GAME_MAP[y].charAt(x) == 'E') {
                exit = {
                    x: x*20,
                    y: y*20,
                    width: 20,
                    height: 20
                };
            }

            if(GAME_MAP[y].charAt(x) == 'P') {
                portalStart = {
                    x: x * 20-17,
                    y: y * 20,
                    width: 20,
                    height: 20
                };
            }
            if(GAME_MAP[y].charAt(x) == 'T') {
                portalEnd = {
                    x: x * 20-18,
                    y: y * 20,
                    width: 32,
                    height: 32
                };
            }
         }
    }
    // quadro de jogo
    boxes.push({
        x: 0,
        y: 0,
        width: 10,
        height: height,
        velY: 0
    });
    boxes.push({
        x: 0,
        y: height - 2,
        width: gameWidth,
        height: 50,
        velY: 0
    });
    boxes.push({
        x: gameWidth - 10,
        y: 0,
        width: 50,
        height: height,
        velY: 0
    });
}

function spawnMonsters() {
    var y,x;
    for(y=0; y<GAME_MAP.length; y++) {
        var start = null, end = null;

        for(x=0; x<GAME_MAP[y].length; x++) {
            if (GAME_MAP[y].charAt(x) == 'X') {
                monsters.push({
                    x: x*20,
                    y: y*20,
                    width: 20,
                    height: 20,
                    direction: "E",
                    velX: Math.random(),
                    leftBoundary: x*20-30,
                    rightBoundary: x*20+30,
                    currSpriteX: 0,
                    currSpriteY: IMAGE_START_EAST_Y
                });
            }
        }
    }
}

function update() {
    if(isStarted === true) {
        if(currentLevel <= 2){
            count++;
            if(!isGameOver == true) {
                executeCommands();
            }
           // Atualizar valores
            updateProjectiles();
            updateSpriteSheetCoordinates();
            updatePlayerVelocity();
            updatePlayerCoordinates();
            updateMonstersCoordinates();

            clearCanvas();

            // Desenhar objetos
            drawBackground();
            drawExit();
            drawPlatforms();
            drawMonsters();
            drawPortals();
            drawPlayer();
            drawGoodThings();
            drawGUI();
            drawPlayerName();


            // Lidar com colisão 
            // Movimentação do passarinho
            //handlePlayerMonsterCollision();
            //handleProjectileMonsterCollision();
            handleProjectilePlatformCollision();
            handlePlayerGoodThingCollision();
            handlePlayerExitCollision();
            handlePlayerPortalCollision();
            handlePlayerPortalCollision();

            handleNextLevel();
            handleGameOver();
       }else{
           drawBackgroundFinal();
       }
    }
    requestAnimationFrame(update);
}

function drawPortals() {
    ctx.drawImage(teleporterImage, 0, 0, 32, 32, portalStart.x, portalStart.y-9, 32, 32);
    ctx.drawImage(teleporterImage, 0, 0, 32, 32, portalEnd.x, portalEnd.y-9, 32, 32);
}
function drawBackground() {
    if (currentLevel == 1)
        ctx.drawImage(bgAngola,0,3, 518,430,0,0,gameWidth,height);
    else if (currentLevel == 2)
        ctx.drawImage(bgMocambique,0,3, 518,430,0,0,gameWidth,height);			     
}

function drawBackgroundFinal(){
    ctx.drawImage(bgAfrica,0,3, 518,430,0,0,gameWidth,height);
}
function drawPlayerName() {
    if(!isGameOver) {
        ctx.font = "18px Arial";
        ctx.fillStyle = "#2E2EFE";
        var len = player.name.length; 
        ctx.fillText(player.name, player.x-len*2, player.y-50);
    }
}
function ScoreRecord(name, score) {
    this.name = name;
    this.score = score;
}

function getHighScoreTable() {
    var scoreTable = new Array();
    for(var i=0; i<10; i++) {
        var cookieName = "player" + i;
        var scoreRecord = localStorage.getItem(cookieName);
        if(scoreRecord == null) {
            break;
        } 
        var name = scoreRecord.split("~")[0];
        var score = scoreRecord.split("~")[1];
        scoreTable.push(new ScoreRecord(name, score));
    }
    return scoreTable;
}
//
// Esta função armazena a tabela de pontuação alta para os cookies
//
function setHighScoreTable(table) {
    for (var i = 0; i < 10; i++) {
        // Se i for maior do que o comprimento da saída da tabela de pontuação
        // Do loop for
        if (i >= table.length) break;

        // Controla o nome do cookie
        var cookieName = "player" + i;
        var name = table[i].name;
        var score = table[i].score;

        // Armazene o enésimo registro como um cookie usando o nome do cookie
        localStorage.setItem(cookieName, name +"~"+score);
    }
}

function addHighScore(name, score) {
    var table = getHighScoreTable();

    for(var i=0; i<table.length; i++) {
        if(score >= table[i].score) {
            var record = new ScoreRecord(name, score);
            table.splice(i, 0, record);
            return table;
        }
    }
    if (table.length <= 10) {
        table.push(new ScoreRecord(name, score));
    }
    return table;
}
function setCookie(name, value, expires, path, domain, secure) { 
     var curCookie = name + "=" + escape(value) + 
     ((expires) ? "; expires=" + expires.toGMTString() : "") + 
     ((path) ? "; path=" + path : "") + 
     ((domain) ? "; domain=" + domain : "") + 
     ((secure) ? "; secure" : ""); 
     document.cookie = curCookie; 
} 


function getCookie(name) { 
     var dc = document.cookie; 
     var prefix = name + "="; 
     var begin = dc.indexOf("; " + prefix); 
     if (begin == -1) { 
        begin = dc.indexOf(prefix); 
     if (begin != 0) return null; 
     } else begin += 2; 
     var end = document.cookie.indexOf(";", begin); 
     if (end == -1) end = dc.length; 
     return unescape(dc.substring(begin + prefix.length, end)); 
}

function handleNextLevel() {
    if(isNextLevel == true) {
        // Notificar o jogador que ele terminou o nível atual
        if (currentLevel == 1)
            alert("Parabéns!! Você aprendeu as culinárias da Angola. Vamos para a segunda fase País Moçambique...");
        else if (currentLevel == 2)
            alert("Parabéns!! Você aprendeu as culinárias do Moçambique. Show...");
        // Reposicionar char na origem
        player.x = playerInitX;
        player.y = playerInitY;
        player.velX = 0;
        player.velY = 0;
        player.bullets = 8;
        keys = [];
        // Atualização de pontuação + segundos restantes
        player.score += remainingTime;
        player.score += (100*currentLevel);
        // Atualize a GUI com o número do nível atual
        currentLevel++;
        // Atualizar GUI com novo temporizador + segundos restantes
        givenTime = 200 + remainingTime;
        startTime = new Date().getTime();
        // Preencher o mapa com mais monstros
        boxes = [];
        monsters = [];
        goodThings = [];
        initialiseMap();
        for(var i=1; i<currentLevel; i++) {
            spawnMonsters();
        }
        isNextLevel = false;
    }
}

function handleGameOver() {
    if(isGameOver == true) { 
        if(isFirstTime == true) {
            var table = addHighScore(player.name, player.score);
            setHighScoreTable(table);
            gameoverSnd.play();
        }
        drawGameOverScreen();
        document.getElementById("RestartButton").style.display = "block";
        isFirstTime = false;
    }
}
function drawGameOverScreen() {
    ctx.fillStyle = "rgba(0, 0, 200, 0.7)";
    ctx.fillRect(50, 50, gameWidth-100, height-100);
    ctx.fillStyle = "#FE642E";
    ctx.font = "100px Arial";
    ctx.fillText("Fim de jogo", 320, 150);

    var table = getHighScoreTable();
    ctx.fillStyle = "#5FB404";
    ctx.fillRect(80, 170, gameWidth-160, height-300);
    ctx.font = "40px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Pontuação Máxima", 450, 210);
     ctx.fillStyle = "#F4FA58";
    ctx.font = "30px Arial";
    for(var i=0; i<table.length; i++) {
        var name = table[i].name;
        var score = table[i].score;
        var numSpaces = 35 - name.length - score.length;
        if(numSpaces + name.length + score.length != 35) console.log("not 35");
        var str = name+ whiteSpace(numSpaces) + score;
        if(str.length != 36) console.log("str len: " + str.length);
        ctx.fillText(name, 480, 240+i*30);
        ctx.fillText(score, 480+145, 240+i*30);
    }
}
function whiteSpace(num) {
    var sp = " ";
    for(var i=0; i<num ;i++) {
        sp += " ";
    }
    return sp;
}
function drawExit() {
    if(goodThings.length == 0 ) {
        if (currentLevel == 1)
            ctx.drawImage(exitImageAngola,0,0, 90,60,exit.x,exit.y-40,90,60);
        else if (currentLevel == 2)
            ctx.drawImage(exitImageMocambique,0,0, 90,60,exit.x,exit.y-40,90,60);
    }
}

function drawGUI() {
    ctx.font="20px Arial";
    ctx.fillStyle = "#2E2EFE";
    ctx.font="20px Arial";
    ctx.fillStyle = "#2E2EFE";
    ctx.fillText("Nível " + currentLevel, gameWidth+80, width/2-300);
    ctx.fillText("Pontuação:",gameWidth+65,width/2-100);
    ctx.strokeRect(gameWidth+60,width/2-90, 100, 30);
    var score = player.score;
    if(score<10) {
        ctx.fillText(score,gameWidth+100,width/2-70);
    } else if (score < 1400) {
        ctx.fillText(score,gameWidth+95,width/2-70);
    } else {
        ctx.fillText(score,gameWidth+90,width/2-70);
    }
    ctx.fillText("Tempo:",gameWidth+80,width/2-250);
    ctx.fillStyle = "#2E2EFE";
    ctx.strokeRect(gameWidth+60,width/2-240, 100, 30);



    elapsedTime = parseInt((new Date().getTime()-startTime)/1400, 10);
    remainingTime = givenTime - elapsedTime;
    if (!isGameOver && remainingTime >= 0) {
        // Hack para uma transição linear suave de valores RGB de verde para vermelho
        var percent = 1 - remainingTime/givenTime;
        var R = Math.round((255 * 100*percent) / 100);
        var G = Math.round((255 * (100 - 100*percent)) / 100) ;
        var B = 0;
        // Barra de cronômetro
        ctx.fillStyle = "rgb(" + R + "," + G + "," + B + ")";
        ctx.fillRect(gameWidth+60+1, width/2-239, 98*(remainingTime/givenTime), 28);
        // Texto do cronômetro
        ctx.fillStyle = "#2E2EFE";
        ctx.fillText(remainingTime,gameWidth+100,width/2-219);
    } 
    if(remainingTime <= 0 && player.cheatmode == false) {
        isGameOver = true;
    }
}

function updateMonstersCoordinates() {
    for (var i=0; i<monsters.length; i++) {
        var monster = monsters[i];
        if(monster.direction=="E") {
            monster.x += monster.velX;
        } else {
            monster.x -= monster.velX;
        }

        if(monster.x > monster.rightBoundary) {
            monster.direction = "W";
        }
        if(monster.x < monster.leftBoundary) {
            monster.direction = "E";
        }
        // Atualizar coords de folha de sprite
        if (count%10==0) monster.currSpriteX += CHAR_WIDTH;
        if(monster.direction=="E") {
            monster.currSpriteY = 0;
        } else {
            monster.currSpriteY = 0;
        }
        if (monster.currSpriteX >= SPRITE_WIDTH) {
            monster.currSpriteX = 0;
        }
    }
}

function Projectile(x, y, direction, size, color, speed) {
    this.x = x;
    this.y = y;
    this.direction = facing;
    this.size = size;
    this.color = color;
    this.speed = speed;
    this.currSpriteY = facing == "E" ? 0 : 7;
}

function updateProjectiles() {
    for (var key in projectiles) {
        if(projectiles[key].direction == "E")
            projectiles[key].x += 5; 
        else 
            projectiles[key].x -= 5; 
        if (projectiles[key].x > canvas.width || projectiles[key].x < 0) {
            projectiles.splice(key, 1);
        }
    }
}

function drawSquare(x, y, size, color) {
    ctx.fillStyle = "red";
    ctx.fillRect(Math.round(x), Math.round(y), size, size);
}
function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
}
function updatePlayerVelocity() {
    player.velX *= friction;
    player.velY += gravity;
}
function handleProjectileMonsterCollision() {
    for (var key in projectiles) {
        for(var i=0; i<monsters.length; i++) {
            var monster = monsters[i];
            if (projectiles[key] == null) {
                continue;
            }
            if (
                projectiles[key].x < monster.x + monster.width &&
                projectiles[key].x + 10 > monster.x &&
                projectiles[key].y < monster.y + monster.height &&
                projectiles[key].y + 10 > monster.y
            ) {
                hitSnd.play();
                monsters.splice(i, 1);
                projectiles.splice(key, 1);
                player.score += 10;
            }
        }
    }
}

function handleProjectilePlatformCollision() {
    for(var key in projectiles) {
        for(var i=0; i<boxes.length; i++) {
            if(projectiles[key] == null) continue;
            if (
                projectiles[key].x < boxes[i].x + boxes[i].width &&
                projectiles[key].x + 10 > boxes[i].x &&
                projectiles[key].y < boxes[i].y + boxes[i].height &&
                projectiles[key].y + 10 > boxes[i].y
            ) {
                projectiles.splice(key, 1);
            }
        }
    }
}

function handlePlayerMonsterCollision() {
    // Lidando com colisão com monstro
    for(var i=0; i<monsters.length; i++) {
        var monster = monsters[i];
        if (
            player.x < monster.x + monster.width &&
            player.x + monster.width > monster.x &&
            player.y < monster.y + monster.height &&
            player.y + player.height > monster.y &&
            player.cheatmode == false
        ) {
            isGameOver = true;
        }
    }
}

function handlePlayerGoodThingCollision() {
    // Lidando com colisão com monstro
    for(var i=0; i<goodThings.length; i++) {
        var g = goodThings[i];
        if (
            player.x < g.x + g.width &&
            player.x + g.width > g.x &&
            player.y < g.y + g.height &&
            player.y + player.height >g.y
        ) {
            goodThings.splice(i, 1);
            player.score += 10;
        }
    }
}
function handlePlayerPortalCollision() {
    if (
        player.x < portalStart.x + portalStart.width &&
        player.x + portalStart.width > portalStart.x &&
        player.y < portalStart.y + portalStart.height &&
        player.y + player.height >portalStart.y 
    ) {
        player.x = portalEnd.x;
        player.y = portalEnd.y - 20;
    }
}

function handlePlayerExitCollision() {
    if (
        player.x < exit.x + exit.width &&
        player.x + exit.width > exit.x &&
        player.y < exit.y + exit.height &&
        player.y + player.height >exit.y &&
        goodThings.length == 0
    ) {
        isNextLevel = true;
        levelupSnd.play();
    }
}


function drawGoodThings() {
    for(var i=0; i<goodThings.length; i++) {
        var g = goodThings[i];
        if(count%10==0) {
            g.currSpriteX += COIN_WIDTH;
            if (g.currSpriteX >= COIN_SPRITE_WIDTH) {

                g.currSpriteX = 0;
            }
        }
        if (currentLevel == 1)
            ctx.drawImage(goodThingImageAngola,g.currSpriteX, 0, COIN_WIDTH,COIN_HEIGHT,
                g.x,g.y-10,COIN_WIDTH,COIN_HEIGHT);
        else if (currentLevel == 2)
            ctx.drawImage(goodThingImageMocambique,g.currSpriteX, 0, COIN_WIDTH,COIN_HEIGHT,
                g.x,g.y-10,COIN_WIDTH,COIN_HEIGHT);
    }
}

function drawMonsters() {

    for(var i=0; i<monsters.length; i++) {
        var monster = monsters[i];
        //ctx.drawImage(monsterImage,monster.currSpriteX,monster.currSpriteY, CHAR_WIDTH,CHAR_HEIGHT,
                    //monster.x-4,monster.y-11,CHAR_WIDTH,CHAR_HEIGHT);
       if (currentLevel == 1) 
           ctx.drawImage(monsterImageChina,monster.currSpriteX,monster.currSpriteY, CHAR_WIDTH,CHAR_HEIGHT,
                    monster.x-4,monster.y-11,CHAR_WIDTH,CHAR_HEIGHT);
        else if (currentLevel == 2)
            ctx.drawImage(monsterImageFranca,monster.currSpriteX,monster.currSpriteY, CHAR_WIDTH,CHAR_HEIGHT,
                    monster.x-4,monster.y-11,CHAR_WIDTH,CHAR_HEIGHT);
    }
}
function updatePlayerCoordinates() {
    if(player.grounded){
         player.velY = 0;
    }
    player.x += player.velX;
    player.y += player.velY;
}
function drawPlatforms() {
    ctx.fillStyle = "#2E2EFE";
    ctx.beginPath();
    
    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        ctx.drawImage(tileImage,10,50, 10,10,
                    boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

        boxes[i].y -= boxes[i].velY;

        if (Math.round(Math.abs(boxes[i].origY - boxes[i].y)) == 20) {
            boxes[i].velY = -(boxes[i].velY);
        }
        
        var dir = colCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }

    }
}
function drawPlayer() {
    if(!isGameOver) {
        ctx.drawImage(charImage,currX,currY, CHAR_WIDTH,CHAR_HEIGHT,
                    player.x-10,player.y-45,CHAR_WIDTH,CHAR_HEIGHT);
    }
}
function updateSpriteSheetCoordinates() {
    if(facing=="E") {
        currY = IMAGE_START_EAST_Y;
    } else {
        currY = IMAGE_START_WEST_Y;
    }
    if (currX >= SPRITE_WIDTH) {
        currX = 0;
    }
}
function executeCommands() {
    if (keys[38] || keys[87]) {
        // Seta para cima ou espaço
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2;
        }
    }
    if (keys[39] || keys[68]) {
        // Seta direita
        if (player.velX < player.speed) {
            player.velX++;
            if (count%2==0)
                currX += CHAR_WIDTH;
            facing = "E";
        }
    }
    if (keys[37] || keys[65]) {
        // Seta esquerda
        if (player.velX > -player.speed) {
            player.velX--;
            if (count%2==0)
                currX += CHAR_WIDTH;
            facing = "W";
        }
    }
    // Botão c: modo de trapaça ativado
    if(keys[67]) {
        player.cheatmode = true;
    }

    // Botão v: modo de fraude desligado
    if (keys[86]) {
        player.cheatmode = false;
    }
}
function colCheck(shapeA, shapeB) {
    // Obtenha os vetores para verificar
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // Adicione a meia largura e meia altura dos objetos
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // se os vetores xey são menores que a meia largura ou meia altura, eles devem estar dentro do objeto, causando uma colisão
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // Descobre de que lado estamos colidindo (superior, inferior, esquerda ou direita)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}


window.addEventListener("load", function(){
  update();
});

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});
 
document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});