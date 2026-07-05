let board;
let boardwidth = 360;
let boardheight = 640;
let context;

let mewidth = 40;
let meheight = 30;
let meX = boardwidth/8;
let meY = boardheight/2;
let mee = {
    x : meX,
    y : meY,
    width : mewidth,
    height : meheight
}

let pipeArray = [];
let pipewidth = 64;
let pipeheight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
let meeImg;

let velocityX = -2; //pipes moving left speed
let velocityY = 0; //my jump speed
let gravity = 0.4;

let gameStarted = false;
let gameOver = false;
let score = 0;

let pipeInterval; // handle for setInterval so we can start/stop it

let playBtn;
let replayBtn;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    meeImg = new Image();
    meeImg.src = "meee.png";
    meeImg.onload = function() {
        context.drawImage(meeImg, mee.x,mee.y, mee.width, mee.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "top.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "bottom.png";

    playBtn = document.getElementById("play");
    replayBtn = document.getElementById("replay");

    playBtn.addEventListener("click", startGame);
    replayBtn.addEventListener("click", restartGame);

    requestAnimationFrame(update);
    document.addEventListener("keydown" , moveMee);
}

function startGame() {
    gameStarted = true;
    playBtn.style.display = "none";
    pipeInterval = setInterval(placePipe, 1500);
}

function restartGame() {
    pipeArray = [];
    mee.y = meY;
    velocityY = 0;
    score = 0;
    gameOver = false;
    replayBtn.style.display = "none";
    clearInterval(pipeInterval);
    pipeInterval = setInterval(placePipe, 1500);
}

function update() {
    requestAnimationFrame(update);

    if(!gameStarted){
        return;
    }

    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    mee.y = Math.max(mee.y + velocityY , 0);
    context.drawImage(meeImg, mee.x, mee.y, mee.width, mee.height);

    if(mee.y > boardheight){
        gameOver = true;
        endGame();
    }

    for(let i = 0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

        if(!pipe.passed && mee.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
        }

        if(detectCollision(mee, pipe)){
            gameOver = true;
            endGame();
        }
    }
    while(pipeArray.length > 0 && pipeArray[0].x < -pipewidth){
            pipeArray.shift();
        }

        //score
        context.fillStyle = "#0ff";
        context.font = "bold 50px 'Courier New', Courier, monospace";
        context.strokeStyle = "#000";
        context.lineWidth = 2;
        context.strokeText(score, 5, 45)
        context.fillText(score, 5, 45);

        if(gameOver){
            context.fillText("GAME OVER", 35, 350);
        }
}

function endGame() {
    clearInterval(pipeInterval);
    replayBtn.style.display = "block";
}

function placePipe() {
    if(gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeheight/4 - Math.random()*(pipeheight/2);
    let openingSpace = boardheight/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeheight + openingSpace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveMee(e){
    if(!gameStarted || gameOver){
        return;
    }
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        velocityY = -6;
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}