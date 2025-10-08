const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = Math.random() * 0.2 - 0.1;
    this.speedY = Math.random() * 0.2 - 0.1;
    this.opacity = Math.random() * 0.15 + 0.05;
    const colors = [
      "155, 135, 245", // Soft purple
      "240, 147, 251", // Soft pink
      "137, 207, 240", // Soft blue
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around screen
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }

  draw() {
    ctx.shadowBlur = 5;
    ctx.shadowColor = `rgba(${this.color}, ${this.opacity * 0.5})`;
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

const particles = [];
const particleCount = 15;

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw particles
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animate);
}

animate();

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
