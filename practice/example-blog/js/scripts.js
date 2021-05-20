const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const particlesArray = [];
let hue = 0;

addEventListener('resize', function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
})

const mouse = {
  x: undefined,
  y: undefined,
}

canvas.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
  for (let i = 0; i < 2; i++){
    particlesArray.push(new Particle());
  }
});


class Particle {
  constructor(){
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 20 + 1;
    this.speedX = Math.random() - .5;
    this.speedY = Math.random() - .5;
    this.color = `hsl(${hue}, 5%, 80%)`
  }

  update(){
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.3 ) this.size -= 0.2;
  }

  draw(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function handleParticles(){
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    if (particlesArray[i].size <= 0.3){
      particlesArray.splice(i, 1);
      i--;
    }
  }
}

function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  hue += 2;
  requestAnimationFrame(animate);
}

animate();