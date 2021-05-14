const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const modalEl = document.querySelector('#modalEl');
const bigScoreEl = document.querySelector('#bigScoreEl');
const colemanFace = document.querySelector('#colemanFace');
console.log(colemanFace);

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    const imageHeight = this.radius * 2;
    const imageWidth = imageHeight / colemanFace.height * colemanFace.width;
    c.drawImage(colemanFace, this.x - imageWidth / 2, this.y - this.radius, imageWidth, imageHeight);
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const friction = 0.98;

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

const originX = canvas.width / 2;
const originY = canvas.height / 2;

let player = new Player(originX, originY, 10, 'white');
let projectiles = [];
let enemies = [];
let particles = [];

function init() {
  player = new Player(originX, originY, 10, 'white');
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;  
  scoreEl.innerHTML = score;
  bigScoreEl.innerHTML = score;
  c.fillStyle = 'rgba(0, 0, 0, 1)';
  c.fillRect(0, 0, canvas.width, canvas.height);
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (50 - 10) + 10;
    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const angle = Math.atan2(originY - y, originX - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 100)
}

player.draw();

let animationId
let score = 0;

function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = 'rgba(0, 0, 0, 0.1)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  particles.forEach((particle, particleIndex) => {
    if (particle.alpha <= 0) {
      particles.splice(particleIndex, 1);
    } else {
      particle.update();
    }
  });

  projectiles.forEach((projectile, projectileIndex) => {
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(projectileIndex, 1)
      }, 0);
    }
    projectile.update();
  })
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    // game over
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
      bigScoreEl.innerHTML = score;
      modalEl.style.display = 'flex';
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // when projectiles touch enemy
      if (dist - enemy.radius - projectile.radius < 1) {

        // create explosions
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(new Particle(
            projectile.x,
            projectile.y,
            Math.random() * 2,
            enemy.color,
            {
              x: (Math.random() - 0.5) * (Math.random() * 5),
              y: (Math.random() - 0.5) * (Math.random() * 5),
            }
          ))
        }
        if (enemy.radius - 10 > 5) {
          // increase score
          score += 100;
          scoreEl.innerHTML = score;

          gsap.to(enemy, {
            radius: enemy.radius - 10
          });
          enemy.radius -= 10;
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0)
        } else {
          // increase score more for removing enemy
          score += 250;
          scoreEl.innerHTML = score;
          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0)
        }
      }
    });
  })
}

addEventListener('click', (event) => {
  const angle = Math.atan2(event.clientY - originY, event.clientX - originX);
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  }
  projectiles.push(new Projectile(originX, originY, 5, 'white', velocity))
})

startGameBtn.addEventListener('click', () => {
  init();
  animate();
  spawnEnemies();
  modalEl.style.display = 'none';
})