const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var tiro = 0;

function resizeGameDiv() {
    var gameDiv = document.getElementById("game-div");
    var header = document.getElementById("header").offsetHeight;
    var footer = document.getElementById("footer").offsetHeight;
    var windowHeight = window.innerHeight;

    var calcHeight = windowHeight - header - footer;

    gameDiv.style.height = calcHeight + "px";
    canvas.height = gameDiv.offsetHeight;
    canvas.width = gameDiv.offsetWidth;
}

resizeGameDiv();

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

        const image = new Image();
        image.src = './img/spaceship.png'

        image.onload = () => {
            this.image = image;
            this.width = 75;
            this.height = 75;
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

const player = new Player();
const projectiles = []
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


function animate() {
    requestAnimationFrame(animate);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    projectiles.forEach(projectiles => {
        projectiles.update();
    })

    if (keys.ArrowUp.pressed && player.position.y >= 0) {
        player.velocity.y = -3;
    } else if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -3;
        player.rotation = -.15;
    } else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 3;
        player.rotation = .15;
    } else if (keys.ArrowDown.pressed && player.position.y + player.height <= canvas.height) {
        player.velocity.y = 3;
    } else {
        player.velocity.x = 0;
        player.velocity.y = 0;
        player.rotation = 0;
    }
}

animate();



window.addEventListener('keydown', (e) => {

    switch (e.key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = true;
            break;
        case 'Control':
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
            break;
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = false;
            break;
    }
})