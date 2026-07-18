/* ============================================================
   BOOT LOADER
============================================================ */
window.addEventListener('load', () => {
  const boot = document.getElementById('boot-loader');
  setTimeout(() => boot.classList.add('hidden'), 1500);
});

/* ============================================================
   TAB NAVIGATION SYSTEM
============================================================ */
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');
const tabNav = document.getElementById('tabNav');
const burger = document.getElementById('burger');

function goToTab(tabName) {
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
  panels.forEach(p => p.classList.toggle('active', p.dataset.panel === tabName));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  tabNav.classList.remove('open');
  burger.classList.remove('active');
  revealVisible();
  if (tabName === 'skills') animateSkillBars();
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => goToTab(btn.dataset.tab));
});

document.querySelectorAll('[data-goto]').forEach(el => {
  el.addEventListener('click', () => goToTab(el.dataset.goto));
});

burger.addEventListener('click', () => {
  tabNav.classList.toggle('open');
  burger.classList.toggle('active');
});

/* ============================================================
   CURSOR GLOW
============================================================ */
const cursorGlow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

/* ============================================================
   TYPED ROLE TEXT (Hero)
============================================================ */
const roles = [
  'Computer Engineering Student',
  'Embedded Systems Enthusiast',
  'C++ Developer',
  'Digital Logic Designer'
];
const typedEl = document.getElementById('typedRole');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIdx];
  if (!deleting) {
    charIdx++;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIdx--;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

/* ============================================================
   ANIMATED COUNTER (Hero stats)
============================================================ */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    if (el.dataset.done) return;
    const target = parseInt(el.dataset.count, 10);
    let current = 0;
    const step = Math.max(1, Math.round(target / 40));
    const tick = () => {
      current += step;
      if (current >= target) { el.textContent = target; el.dataset.done = 'true'; return; }
      el.textContent = current;
      requestAnimationFrame(tick);
      setTimeout(() => {}, 0);
    };
    let raf;
    const anim = () => {
      current += step;
      if (current >= target) { el.textContent = target; el.dataset.done = 'true'; return; }
      el.textContent = current;
      raf = requestAnimationFrame(anim);
    };
    anim();
  });
}
setTimeout(animateCounters, 1600);

/* ============================================================
   SKILL BAR ANIMATION
============================================================ */
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(fill => {
    const w = fill.dataset.width;
    fill.style.width = w + '%';
  });
  document.querySelectorAll('.skill-pct').forEach(pctEl => {
    if (pctEl.dataset.done) return;
    const target = parseInt(pctEl.dataset.target, 10);
    let current = 0;
    const step = Math.max(1, Math.round(target / 30));
    const anim = () => {
      current += step;
      if (current >= target) { pctEl.textContent = target + '%'; pctEl.dataset.done = 'true'; return; }
      pctEl.textContent = current + '%';
      requestAnimationFrame(anim);
    };
    anim();
  });
}

/* ============================================================
   SCROLL / VISIBILITY REVEAL (also runs on tab switch)
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

function revealVisible() {
  document.querySelectorAll('.tab-panel.active .reveal').forEach(el => {
    revealObserver.observe(el);
  });
}
revealVisible();

/* ============================================================
   BACKGROUND GRID CANVAS (animated circuit-style grid)
============================================================ */
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
let w, h, nodes = [];

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const SPACING = 90;
function initNodes() {
  nodes = [];
  const cols = Math.ceil(w / SPACING) + 1;
  const rows = Math.ceil(h / SPACING) + 1;
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x <= cols; x++) {
      nodes.push({
        x: x * SPACING,
        y: y * SPACING,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
}
initNodes();
window.addEventListener('resize', initNodes);

function drawGrid(time) {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(0,246,255,0.045)';
  ctx.lineWidth = 1;

  for (let x = 0; x <= w; x += SPACING) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y <= h; y += SPACING) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  nodes.forEach(n => {
    const pulse = Math.sin(time * 0.0006 + n.pulse) * 0.5 + 0.5;
    if (pulse > 0.85) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6 + pulse * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,246,255,${pulse * 0.5})`;
      ctx.fill();
    }
  });

  requestAnimationFrame(drawGrid);
}
requestAnimationFrame(drawGrid);

/* ============================================================
   CONTACT FORM — EmailJS INTEGRATION
============================================================ */
(function () {
  const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
  const SERVICE_ID = 'YOUR_SERVICE_ID';
  const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const DESTINATION_EMAIL = 'i246508@isb.nu.edu.pk';

  if (window.emailjs) {
    emailjs.init(PUBLIC_KEY);
  }

  const form = document.getElementById('contact-form');
  const status = document.getElementById('status');
  const sendBtn = document.getElementById('sendBtn');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    status.className = 'sending';
    status.textContent = '> transmitting message...';
    sendBtn.disabled = true;

    const params = {
      from_name: form.from_name.value,
      from_email: form.from_email.value,
      subject: form.subject.value,
      message: form.message.value,
      to_email: DESTINATION_EMAIL
    };

    if (!window.emailjs || PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      setTimeout(() => {
        status.className = 'error';
        status.textContent = '> EmailJS not configured. Add your PUBLIC_KEY / SERVICE_ID / TEMPLATE_ID in script.js';
        sendBtn.disabled = false;
      }, 500);
      return;
    }

    emailjs.send(SERVICE_ID, TEMPLATE_ID, params)
      .then(() => {
        status.className = 'success';
        status.textContent = '> message transmitted successfully.';
        form.reset();
        sendBtn.disabled = false;
      })
      .catch((err) => {
        status.className = 'error';
        status.textContent = '> transmission failed. please try again.';
        sendBtn.disabled = false;
        console.error(err);
      });
  });
})();
