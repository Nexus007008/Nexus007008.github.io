// ===== Space Background =====
const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let shootingStars = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  const count = Math.floor((width * height) / 3500);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2
    });
  }
}

function createShootingStar() {
  const startX = Math.random() * width;
  const startY = Math.random() * height * 0.4;
  shootingStars.push({
    x: startX,
    y: startY,
    len: Math.random() * 80 + 40,
    speed: Math.random() * 8 + 6,
    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
    alpha: 1,
    life: 0,
    maxLife: 60 + Math.random() * 40
  });
}

function drawStars(time) {
  ctx.clearRect(0, 0, width, height);

  // subtle gradient overlay
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
  gradient.addColorStop(0, 'rgba(10, 12, 30, 0.3)');
  gradient.addColorStop(1, 'rgba(5, 5, 10, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // stars
  for (const star of stars) {
    const twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 225, 255, ${star.alpha * twinkle})`;
    ctx.fill();
  }

  // shooting stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.life++;
    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    s.alpha = 1 - s.life / s.maxLife;

    if (s.alpha <= 0) {
      shootingStars.splice(i, 1);
      continue;
    }

    const tailX = s.x - Math.cos(s.angle) * s.len;
    const tailY = s.y - Math.sin(s.angle) * s.len;

    const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
    grad.addColorStop(0, `rgba(180, 200, 255, ${s.alpha})`);
    grad.addColorStop(1, 'rgba(180, 200, 255, 0)');

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // occasionally spawn shooting star
  if (Math.random() < 0.008 && shootingStars.length < 3) {
    createShootingStar();
  }
}

function animate(time) {
  drawStars(time * 0.001);
  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate(0);

// ===== Custom Cursor =====
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.18;
  trailY += (mouseY - trailY) * 0.18;
  trail.style.left = trailX + 'px';
  trail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Hover effect on interactive elements
const hoverElements = document.querySelectorAll('a, button, .btn, .card');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    trail.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    trail.classList.remove('hover');
  });
});

// ===== Navigation =====
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}
