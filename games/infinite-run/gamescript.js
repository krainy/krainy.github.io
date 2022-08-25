const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('gm-btn');
const scoreP = document.getElementById('score');
ctx.filter = 'none';
var far_obs = 9;



console.log(ctx)


function resizeGameDiv() {
    var gameDiv = document.getElementById("core-div");
    var header = document.getElementById("header").offsetHeight;
    var footer = document.getElementById("footer").offsetHeight;
    var windowHeight = window.innerHeight;

    var calcHeight = windowHeight - header - footer;

    gameDiv.style.height = calcHeight + "px";
    canvas.height = gameDiv.offsetHeight;
    canvas.width = gameDiv.offsetWidth;
}

resizeGameDiv();
console.log("width: " + canvas.width + " height: " + canvas.height);

ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

console.log(ctx)

function scoreController(realScore) {
    var score = Math.floor(realScore / 10);
    if (score < 10) {
        scoreP.textContent = "0000" + score;
    } else if (score >= 10 && score < 100) {
        scoreP.textContent = "000" + score;
    } else if (score >= 100 && score < 1000) {
        scoreP.textContent = "00" + score;
    } else if (score >= 1000 && score < 10000) {
        scoreP.textContent = "0" + score;
    } else {
        scoreP.textContent = score;
    }
}

var jumpd = false;
var gravity = 1;
var gameover = false;
var score = 0;

class Player {
    constructor() {
        this.position = {
            x: canvas.width / 3,
            y: 900
        }

        this.velocity = {
            x: 0,
            y: 0
        }
        this.frames = {
            max: 8,
            value: 0,
            elapsed: 0
        }

        //this.dirtHeight = 20;

        const image = new Image();
        image.src = './sprite/lilcat-Sheet.png'

        image.onload = () => {
            this.image = image;
            ctx.imageSmoothingEnabled = false;
            console.log(image)
            this.width = 64;
            this.height = 64;
            this.position = {
                x: canvas.width / 4,
                y: canvas.height - this.height - 12
            }

        }
    }

    draw() {
        ctx.save();

        ctx.imageSmoothingEnabled = false;
        console.log(ctx.imageSmoothingEnabled)
        ctx.drawImage(
            this.image,
            this.frames.value * (this.image.width / 8),
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }

        if (this.frames.elapsed % 6 === 0) {
            if (this.frames.value < this.frames.max - 1) {
                this.frames.value++;
            } else {
                this.frames.value = 0;
            }
        }
        ctx.restore();
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            if (this.position.y + this.height + this.velocity.y + 13 <= canvas.height) {
                this.velocity.y += gravity;
            } else {
                this.velocity.y = 0;
                jumpd = true;
            }
        }
    }
}

class Dirt {
    constructor({ position }) {
        this.position = {
            x: position.x,
            y: canvas.height - this.height
        }
        this.velocity = {
            x: -5
        }

        const image = new Image();
        image.src = './sprite/groundDirt.png'

        image.onload = () => {
            this.image = image;
            this.width = 64;
            this.height = 16;
            this.position = {
                x: position.x,
                y: canvas.height - this.height
            }
        }

        this.randomXGroundImage = Math.round(Math.random() * 3);
    }


    draw() {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            this.image,
            this.randomXGroundImage * 32,
            0,
            this.image.width / 2,
            this.image.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

    }

    update() {
        if (this.image) {
            this.position.x += this.velocity.x;
            this.velocity.x += -0.001;

            if (this.position.x + this.width < 0) {
                this.randomXTopImage = Math.round((Math.random() * 3));
                this.position.x = canvas.width + 1;
            }

            this.draw();
        }
    }
}

class topGround {
    constructor({ position }) {
        this.position = {
            x: position.x,
            y: canvas.height - this.height
        }
        this.velocity = {
            x: -5
        }

        const image = new Image();
        image.src = './sprite/topground.png'

        image.onload = () => {
            this.image = image;
            this.width = 64;
            this.height = 20;
            this.position = {
                x: position.x,
                y: canvas.height - this.height
            }
        }

        this.randomXTopImage = Math.round((Math.random() * 3));
    }


    draw() {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            this.image,
            this.randomXTopImage * 32,
            0,
            this.image.width / 2,
            this.image.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        if (this.image) {
            this.position.x += this.velocity.x;
            this.velocity.x += -0.001;

            if (this.position.x + this.width < 0) {
                this.randomXTopImage = Math.round((Math.random() * 3));
                this.position.x = canvas.width + 1;
            }

            this.draw();

        }

    }
}

class House_1 {
    constructor({ position, iterator }) {
        this.position = {
            x: position.x,
            y: position.y
        }
        this.velocity = {
            x: -5
        }

        this.iterator = iterator;

        this.rng = Math.min(500 - this.width, (Math.random() * 500));

        const image = new Image();
        image.src = './sprite/house1.png'

        image.onload = () => {
            this.image = image;
            this.width = 128;
            this.height = 96;
            this.position = {
                x: position.x + Math.min(500 - this.width, (Math.random() * 500)),
                y: canvas.height - this.height - 12
            }
        }
    }

    draw() {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        if (this.image) {
            this.position.x += this.velocity.x;
            this.velocity.x -= 0.001;

            if (this.position.x + this.width < 0) {
                this.position.x = (this.iterator * 500) + canvas.width;
            }
            //console.log(this)

            this.draw();
        }
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: canvas.height - this.height
        }

        this.offset = {
            width: 64,
            height: 16
        }

        this.ground = []
        this.topGround = []
        this.houses = []

        for (let i = 0; i < (canvas.width / 32) + 1; i++) {
            this.ground.push(
                new Dirt({
                    position: {
                        x: i * 32,
                        y: canvas.height - this.height
                    }
                })
            )
            this.topGround.push(
                new topGround({
                    position: {
                        x: i * 32,
                        y: canvas.height - this.height - 4
                    }
                })
            )
        }

        for (let i = 0; i < 10; i++) {
            this.houses.push(
                new House_1({
                    position: {
                        x: (i * 500) + canvas.width,
                        y: canvas.height
                    },
                    iterator: i
                })
            )
        }
    } //aqui vai um update depois
}

const player = new Player();

function game() {

    const grids = [new Grid()];
    player.dirtHeight = Dirt.height;
    score = 0;

    function animate() {
        scoreController(score);

        if (!gameover) {
            window.requestAnimationFrame(animate);
        } else {
            btn.textContent = "Restart Game";
            btn.style.visibility = "visible";
            btn.disable = false;

        }

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.fillRect(0, canvas.height - 16, canvas.width, 1);

        grids.forEach((grid) => {
            grid.ground.forEach((ground, i) => {
                ground.update();



            })
            grid.topGround.forEach((topGround, j) => {
                topGround.update();
            })
            grid.houses.forEach((obstacles, k) => {

                obstacles.update();


                // if (obstacles.position.x + obstacles.width < 0) {
                //     obstacles.position.x = grid.houses[far_obs].position.x + Math.min(500 - this.width, (Math.random() * 500))
                //     far_obs++
                //     if (far_obs > 9) far_obs = 0

                //     console.log(grid.houses[far_obs])
                // }


                if ((player.position.x + player.width >= obstacles.position.x) && (player.position.x <= obstacles.position.x + obstacles.width)) {
                    if ((player.position.y + player.height + player.velocity.y >= obstacles.position.y) && (player.position.y + player.height <= obstacles.position.y + player.velocity.y)) {
                        player.velocity.y = 0;
                        jumpd = true;
                    } else if (player.position.y + player.height >= obstacles.position.y) {
                        console.log("bananas")
                        player.velocity.y = 0;
                        gameover = true;

                        grid.ground.forEach((ground) => {
                            ground.velocity.x = 0
                        })
                        grid.topGround.forEach((topGround) => {
                            topGround.velocity.x = 0
                        })
                        grid.houses.forEach((obstacles) => {
                            obstacles.velocity.x = 0
                        })
                    }
                }

            })
        })


        score++
        player.update();
    }

    animate();
}

function startGame() {

    btn.style.visibility = "hidden";
    btn.disable = true;
    gameover = false;

    game();
}

//arrumar o event listener
addEventListener('keydown', (e) => {

    if ((e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') && jumpd) {
        jump();
    }
})

function eventTouch() {
    if (jumpd) {
        jump();
    }
}

function jump() {
    jumpd = false;
    player.velocity.y -= 20;
}

window.addEventListener('resize', function (e) {
    ctx.imageSmoothingEnabled = false;
}, false)
