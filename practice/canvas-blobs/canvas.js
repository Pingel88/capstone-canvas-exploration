// shouldn't use var
const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// c is short for context
const c = canvas.getContext('2d');

              // fillStyle colors all rectangles (fills?) below it
              // can be rgb, hex, or text color
// c.fillStyle = 'rgba(255, 0, 0, 0.5)';
          // x & y are from top-left
          // x, y, width, height
// c.fillRect(100, 100, 100, 100);
// c.fillStyle = 'rgba(0, 255, 0, 0.5)';
// c.fillRect(400, 100, 100, 100);
// c.fillStyle = 'rgba(0, 0, 255, 0.5)';
// c.fillRect(50, 50, 20, 20);
// c.fillStyle = 'rgba(123, 123, 321, 0.5)';
// c.fillRect(500, 300, 123, 48);
// console.log(canvas);

// Line
// c.beginPath();
      // x, y
// c.moveTo(50, 300);
// c.lineTo(300, 100);
// c.lineTo(400, 300);
// c.strokeStyle = "#fa34a3";
// c.stroke();

// Arc / Circle
// c.beginPath();
    // x, y, radius, startAngle (in radians), endAngle (in radians), anti-clockwise (boolean)
// c.arc(300, 300, 30, 0, Math.PI * 2, false);
// c.strokeStyle = 'blue';
// c.stroke();


// for (let i = 0; i < 100; i++) {
//   const x = Math.random() * window.innerWidth;
//   const y = Math.random() * window.innerHeight;
//   const r = Math.floor(Math.random() * 256);
//   const g = Math.floor(Math.random() * 256);
//   const b = Math.floor(Math.random() * 256);
//   c.beginPath();
//   c.arc(x, y, 30, 0, Math.PI * 2, false);
//   c.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;
//   c.stroke();
// }

// let x = Math.random() * innerWidth;
// let y = Math.random() * innerHeight;
// let dx = (Math.random() - 0.5) * 8;
// let dy = (Math.random() - 0.5) * 8;
// let radius = 30;

let mouse = {
  x: undefined,
  y: undefined
}

const maxRadius = 40;
// const minRadius = 2;

const colorArray = [
  '#8C0368',
  '#730255',
  '#04BFAD',
  '#F2D544',
  '#BF622C'
]

window.addEventListener('mousemove',
  function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
})

function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // c.strokeStyle = `rgba(${this.r}, ${this.g}, ${this.b}, 1)`;
    // c.stroke();
    c.fillStyle = this.color;
    c.fill();
  }

  this.update = function() {
    if(this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if(this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
  
    this.x += this.dx;
    this.y += this.dy;

    // interactivity
    if(mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
      if (this.radius < maxRadius) {
        this.radius += 1;
      }
    } else if (this.radius > this.minRadius) {
      this.radius -= 1;
    }
    this.draw();
  }
}

let circleArray = [];

function init() {
  circleArray = [];
  for (let i = 0; i < 5000; i++) {
    const radius = Math.random() * 3 + 1;
    const x = Math.random() * (innerWidth - radius * 2) + radius;
    const y = Math.random() * (innerHeight - radius * 2) + radius;
    const dx = (Math.random() - 0.5);
    const dy = (Math.random() - 0.5);
    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
}

function animate() {
  requestAnimationFrame(animate);
  // same as fillRect but clears it
  c.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }
}

animate();
init();