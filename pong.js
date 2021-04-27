const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');


ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);



var game = {
    run: 0,
    winner: 0,
    pointsToWin: 3,
    difficulity: "Easy"

}

var ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 7,
    xV: 3,
    yV: 3,
    color: "white",
    resetBall: function () {
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        var plusOrMinus2 = Math.random() < 0.5 ? -1 : 1;
        this.xV = 3 * plusOrMinus;
        this.yV = 3 * plusOrMinus2;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
    }
}


var player = {
    x: 30,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "white"

}

var cpu = {
    x: canvas.width - 30,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    speed: 5,
    score: 0,
    color: "white"

}

function drawRectangle(x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h, c);
}

function drawCircle(x, y, r, c) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}


function callback() {

    //Check if we have a winner
    if (player.score >= game.pointsToWin || cpu.score >= game.pointsToWin) {
        game.winner = 1;
        game.run = 0;
    }

    update();
    requestAnimationFrame(callback);

}


function update() {
    if (game.run > 0) { //Game running
        if (game.run == 2) { //Loading ball

            if ((ball.x + ball.radius) - (canvas.width / 2) > 0) {
                ball.x -= 2;
            }

            if ((ball.x - ball.radius) - (canvas.width / 2) < 0) {
                ball.x += 2;
            }

            if (ball.y - (canvas.height / 2) > 0) {
                ball.y -= 2;
            }

            if (ball.y - (canvas.height / 2) < 0) {
                ball.y += 2;
            }

            ball.color = "gray";

        } else { //Game in play

            //moving the ball
            ball.x += (ball.xV);
            ball.y += (ball.yV);

            //bounce the ball 
            if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
                ball.yV = -ball.yV;
            }


            //BALL hitting CPU
            if (ball.x + ball.radius >= cpu.x && ball.y <= (cpu.y + cpu.height) && ball.y >= cpu.y) {
                ball.xV = -ball.xV;
                ball.x = ball.x - 10;

                ball.xV *= 1.03;
                ball.yV *= 1.03;


            }

            //BALL hitting Player
            if (ball.x - ball.radius <= player.x + player.width && ball.y <= (player.y + player.height) && ball.y >= (player.y)) {
                ball.x = ball.x + 10;
                ball.xV = -ball.xV;
                ball.xV *= 1.03;
                ball.yV *= 1.03;
            }


            //CPU 
            if (game.difficulity == "Expert") {
                cpu.y = ball.y - 30;
            } else {
                cpu.y += cpu.speed;
            }


            if (cpu.y < 0 || (cpu.y + cpu.height) > canvas.height) {
                cpu.speed = - cpu.speed;
            } else {

                if (game.difficulity == "Hard") {
                    if (ball.y - (cpu.y + (cpu.height / 2)) > 0) {
                        cpu.speed = Math.abs(cpu.speed);
                    }

                    if (ball.y - (cpu.y + (cpu.height / 2)) < 0) {
                        cpu.speed = Math.abs(cpu.speed) * -1;
                    }
                }
            }



            //point
            if (ball.x - ball.radius <= 0) {
                cpu.score++;
                game.run = 2;
            }

            if (ball.x + ball.radius >= canvas.width) {
                player.score++;
                game.run = 2;
            }

            ball.color = "white";

        }

        drawRectangle(0, 0, canvas.width, canvas.height, "black");
        drawRectangle(player.x, player.y, player.width, player.height, player.color);
        drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);
        drawCircle(ball.x, ball.y, ball.radius, ball.color);

    } else {  //Game not running


        drawRectangle(0, 0, canvas.width, canvas.height, "black");


        if (game.winner) {
            let winnerName = cpu.score > player.score ? "CPU WON" : "Player Won";

            ctx.fillStyle = "WHITE";
            ctx.font = "54px Georgia";
            ctx.textAlign = "center";
            ctx.fillText(winnerName, (canvas.width / 2), 360);
        }

        ctx.fillStyle = "GREEN";
        ctx.font = "54px Georgia";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Click to start", (canvas.width / 2), (canvas.height / 2));


        ctx.fillStyle = "White";
        ctx.font = "16px Georgia";
        ctx.textAlign = "center";
        ctx.fillText("Difficuluty : " + game.difficulity, (canvas.width / 2), 30);
        ctx.fillText("Change with key: D", (canvas.width / 2), 50);


        ctx.fillStyle = "White";
        ctx.font = "12px Georgia";
        ctx.fillText("P G B M", 700, 360);
        ctx.fillText("PongGameByMuhsin", 700, 380);



    }

    ctx.fillStyle = "WHITE";

    ctx.font = "16px Georgia";
    ctx.fillText("Player: " + player.score, canvas.width / 4, 30);

    ctx.font = "16px Georgia";
    ctx.fillText("CPU: " + cpu.score, (canvas.width / 4) * 3, 30);


}


canvas.addEventListener('mousemove', event => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    player.y = canvas.height * scale;
});


canvas.addEventListener('mousedown', event => {
    if (game.run != 1) {
        ball.resetBall();
        game.run = 1;
    }
    if (game.winner) {
        cpu.score = 0;
        player.score = 0;
        game.winner = 0;
    }
});


window.addEventListener('keydown', event => {
    if (event.code == 'KeyD' && game.run == 0) {
        if (game.difficulity == "Easy") {
            game.difficulity = "Hard";
        } else if (game.difficulity == "Hard") {
            game.difficulity = "Expert";
        } else {
            game.difficulity = "Easy";
        }
    }
});



//INIT
drawRectangle(player.x, player.y, player.width, player.height, player.color);
drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);
drawCircle(ball.x, ball.y, ball.radius, ball.color);
ball.resetBall();
callback(10);