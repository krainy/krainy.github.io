const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('gm-btn');
const scoreP = document.getElementById('score');

var tiro = 0;
var canShot = true;

const meteorImage = new Image();
meteorImage.src = './img/Asteroids.png';

const heartImage = new Image();
heartImage.src = './img/heart.png';

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

class Player {
    constructor() {
        this.position = {
            x: canvas.width / 2,
            y: 500
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0

        this.playerLife = 3;

        const image = new Image();
        image.src = './img/spaceship.png'

        image.onload = () => {
            this.image = image;
            this.width = 50;
            this.height = 50;
            this.position = {
                x: canvas.width / 2,
                y: canvas.height - this.height
            }
        }
    }

    draw() {

        ctx.save();

        ctx.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        );

        ctx.rotate(this.rotation);

        ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2);

        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

        ctx.restore();
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;

        this.radius = 3;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();

    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Lifes {
    constructor() {

        const image = new Image();
        image.src = './img/heart.png'

        image.onload = () => {
            this.image = image;
            this.width = image.width;
            this.height = image.height;
            this.position = {
                x: 0,
                y: canvas.height - this.height
            }
        }
    }

    draw() {
        for (var k = 0; k < player.playerLife; k++) {
            ctx.drawImage(this.image, k * this.width, canvas.height - this.height, this.width, this.height);
        }
    }

    update() {
        this.draw();
    }
}


class Meteor {
    constructor({ position, rngMeteorImage }) {

        this.position = position;

        this.velocity = {
            x: 0,
            y: 0
        }

        this.playerHit = false;

        this.meteorLife = 2;

        this.rngMeteorImage = rngMeteorImage;

        const image = new Image();
        image.src = './img/Asteroids.png'

        image.onload = () => {
            this.image = image;
            this.width = (image.width / 4) * 1.3;
            this.height = (image.height) * 1.3;
            this.position = {
                x: position.x,
                y: position.y
            }
        }


    }

    draw() {

        ctx.drawImage(this.image, this.rngMeteorImage, 0, this.image.width / 4, this.image.height, this.position.x, this.position.y, this.width, this.height, this.image.width / 4, this.image.height);

    }

    update({ velocity }) {
        if (this.image) {
            this.draw();

            if (this.position.x > canvas.width - this.image.width) {
                this.position.x = canvas.width;
            }

            this.position.x += velocity.x;
            this.position.y += velocity.y;

            if (this.position.y - this.image.height > canvas.height) {
                const rngPos = Math.floor(Math.random() * 10);
                const rngY = Math.floor(Math.random() * 100);
                const rngX = Math.floor(Math.random() * (canvas.width / 5));
                this.position.y = 0 - this.image.height - rngY;
                this.position.x = (rngPos * (canvas.width / 5)) + rngX;
            }
        }

    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 0,
            y: 7
        }

        this.meteors = []

        for (let i = 0; i < canvas.width / 50; i++) {
            const rngY = Math.floor(Math.random() * 1000);
            const rngX = Math.floor(Math.random() * (canvas.width / 5));
            const xPos = (i * (canvas.width / 5)) + rngX; //ainda vou usar isso aqui.
            const rngImage = Math.floor(Math.random() * 3) * 48;

            this.meteors.push(
                new Meteor({
                    position: {
                        x: (i * (canvas.width / 5)) + rngX,
                        y: 0 - rngY
                    },
                    rngMeteorImage: rngImage
                }))

        }

    }



    update() {
        this.position.y += this.velocity.y;
    }
}



const keys = {
    ArrowUp: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    }
}

const player = new Player();
const projectiles = [];

function game() {
    const grids = [new Grid()];
    const lifes = new Lifes();
    var score = 0;

    function animate() {

        scoreController(score);

        if (player.playerLife > 0) {
            requestAnimationFrame(animate);
        } else {
            btn.textContent = "Restart Game";
            btn.style.visibility = "visible";
            btn.disable = false;
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        player.update();
        lifes.update();
        projectiles.forEach((projectile, index) => {
            if (projectile.position.y + projectile.radius <= 0) {
                projectiles.splice(index, 1);
            } else {
                projectile.update();
            }
        })

        grids.forEach((grid) => {
            grid.update();
            grid.meteors.forEach((meteors, i) => {
                meteors.update({ velocity: grid.velocity });
                projectiles.forEach((projectile, j) => {
                    if (projectile.position.y - projectile.radius <= meteors.position.y + meteors.height && projectile.position.x >= meteors.position.x && projectile.position.x - projectile.radius <= meteors.position.x + meteors.height) {

                        meteors.meteorLife -= 1;

                        console.log(meteors.meteorLife);

                        if (meteors.meteorLife <= 0) {
                            score += 1000;
                            grid.meteors.splice(i, 1);

                            setTimeout(() => {
                                const rngIndex = Math.floor(Math.random() * canvas.width / 50)
                                const rngY = Math.floor(Math.random() * 1000);
                                const rngX = Math.floor(Math.random() * (canvas.width / 5));
                                const rngImage = Math.floor(Math.random() * 3) * 48;


                                grid.meteors.push(
                                    new Meteor({
                                        position: {
                                            x: (rngIndex * (canvas.width / 5)) + rngX,
                                            y: 0 - rngY
                                        },
                                        rngMeteorImage: rngImage
                                    }))

                            }, 0)

                        }

                        projectiles.splice(j, 1);
                    }
                })



                if (player.image && meteors.position.x + meteors.width >= player.position.x && meteors.position.x <= player.position.x + player.width && meteors.position.y + meteors.height >= player.position.y && meteors.position.y < player.position.y + player.height && !meteors.playerHit) {
                    grid.meteors.splice(i, 1);
                    player.playerLife--;
                    console.log(player.playerLife);
                    meteors.playerHit = true;
                }

            })

        })

        score++;

        if (keys.ArrowUp.pressed && player.position.y + player.height <= canvas.height) {
            player.velocity.y = -3;
            player.velocity.x = 0;
            player.rotation = 0;
        } else if (keys.ArrowDown.pressed && player.position.y + player.height < canvas.height) {
            player.velocity.y = 3;
            player.velocity.x = 0;
            player.rotation = 0;
        } else if (keys.ArrowLeft.pressed && player.position.x >= 0 && player.position.y <= canvas.height - player.height) {
            player.velocity.x = -3;
            player.velocity.y = 0;
            player.rotation = -.2;
        } else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width && player.position.y <= canvas.height - player.height) {
            player.velocity.x = 3;
            player.velocity.y = 0;
            player.rotation = .2;
        } else {
            player.velocity.x = 0;
            player.velocity.y = 0;
            player.rotation = 0;
            if (player.position.y > canvas.height - player.height) {
                player.position.y = canvas.height - player.height;
                console.log('')
            }
        }

        console.log(player.position.y, player.image.height, canvas.height);
    }



    animate()

}

function startGame() {
    player.position.x = canvas.width / 2;
    player.position.y = canvas.height - player.height;
    player.playerLife = 3;
    btn.style.visibility = "hidden";
    btn.disable = true;
    game();
}

var lastKeyDown = ''

window.addEventListener('keyup', (e) => {
    console.log(e);
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            keys.ArrowUp.pressed = false;
            break;
        case 'ArrowLeft':
        case 'a':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
        case 'd':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowDown':
        case 's':
            keys.ArrowDown.pressed = false;
            break;
        case 'Control':
        case ' ':
            canShot = true;

            break;
    }
})
window.addEventListener('keydown', (e) => {

    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            keys.ArrowUp.pressed = true;
            //lastKeyDown = 'ArrowUp';
            break;
        case 'ArrowLeft':
        case 'a':
            keys.ArrowLeft.pressed = true;
            //lastKeyDown = 'ArrowLeft';
            break;
        case 'ArrowRight':
        case 'd':
            keys.ArrowRight.pressed = true;
            //lastKeyDown = 'ArrowRight';
            break;
        case 'ArrowDown':
        case 's':
            keys.ArrowDown.pressed = true;
            //lastKeyDown = 'ArrowDown';
            break;
        case 'Control':
        case ' ':
            if (canShot) {
                if (tiro == 0) {
                    projectiles.push(new Projectile({
                        position: {
                            x: player.position.x + 10,
                            y: player.position.y
                        },
                        velocity: {
                            x: 0,
                            y: -15
                        }
                    }))

                    tiro += 1;
                } else {
                    projectiles.push(new Projectile({
                        position: {
                            x: player.position.x + player.width - 12,
                            y: player.position.y
                        },
                        velocity: {
                            x: 0,
                            y: -15
                        }
                    }))

                    tiro = 0;
                }
                canShot = false;
            }
            break;
    }
})