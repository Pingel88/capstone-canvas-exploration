const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth * (2/3);
canvas.height = innerHeight;

class Point {
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

let userPoints = [];
let points = [];
let timer;

function plotPoints() {
  let x = canvas.width / 2;
  let y = canvas.height / 2;

  let counter = 0;
  setInterval(() => {
    let userPointsSelector = Math.floor(Math.random() * userPoints.length);
    points.push(new Point(x, y, 1, 'red'));
    x = (points[counter].x + userPoints[userPointsSelector].x) * .5;
    y = (points[counter].y + userPoints[userPointsSelector].y) * .5;
    counter++
  }, 0.1);
}

let animationId

function animate() {
  animationId = requestAnimationFrame(animate);
  userPoints.forEach((point) => {
    point.draw();
  })
  points.forEach((point) => {
    point.draw();
  })
}

addEventListener('click', (event) => {
  if (event.clientX > innerWidth - canvas.width) {
    userPoints.push(new Point(event.clientX - (innerWidth - canvas.width), event.clientY, 5, 'white'));
  }
})

animate();

go.addEventListener('click', () => {
  plotPoints();
})

potato.addEventListener('click', () => {
  cancelAnimationFrame(animationId);
})