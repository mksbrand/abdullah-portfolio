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
  const current = document.querySelector('.tab-panel.active');
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
  moveTabIndicator();
  tabNav.classList.remove('open');
  burger.classList.remove('active');

  const activateNext = () => {
    panels.forEach(p => p.classList.toggle('active', p.dataset.panel === tabName));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    revealVisible();
    splitAllHeadings();
    if (tabName === 'skills') animateSkillBars();
  };

  if (current && current.dataset.panel !== tabName) {
    current.classList.add('leaving');
    setTimeout(() => {
      current.classList.remove('leaving');
      activateNext();
    }, 260);
  } else {
    activateNext();
  }
}

/* ---- Sliding underline indicator beneath active tab ---- */
function moveTabIndicator() {
  const indicator = document.getElementById('tabIndicator');
  const active = document.querySelector('.tab-btn.active');
  if (!indicator || !active) return;
  indicator.style.left = active.offsetLeft + 'px';
  indicator.style.width = active.offsetWidth + 'px';
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
let sharedMouseX = -9999, sharedMouseY = -9999;
window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
  sharedMouseX = e.clientX;
  sharedMouseY = e.clientY;
});
window.addEventListener('mouseleave', () => { sharedMouseX = -9999; sharedMouseY = -9999; });

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

  // Constellation: connect nearby grid nodes to the cursor with fading lines
  const REACH = 170;
  if (sharedMouseX > -1000) {
    nodes.forEach(n => {
      const dx = n.x - sharedMouseX;
      const dy = n.y - sharedMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REACH) {
        const strength = 1 - dist / REACH;
        ctx.beginPath();
        ctx.moveTo(sharedMouseX, sharedMouseY);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = `rgba(0,246,255,${strength * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2 + strength * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${strength * 0.7})`;
        ctx.fill();
      }
    });
    ctx.beginPath();
    ctx.arc(sharedMouseX, sharedMouseY, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,246,255,0.8)';
    ctx.shadowColor = 'rgba(0,246,255,0.9)';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(drawGrid);
}
requestAnimationFrame(drawGrid);

/* ============================================================
   CONTACT FORM — EmailJS INTEGRATION
============================================================ */
(function () {
  const PUBLIC_KEY = 'flG3J47Zu6wbJAuFm';
  const SERVICE_ID = 'service_5vfymdk';
  const TEMPLATE_ID = 'template_nvud4tx';
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

/* ============================================================
   ULTRA ANIMATION UPGRADE — v3.0
   Text splitting · 3D tilt · magnetic buttons · custom cursor
   ripple clicks · scroll-driven parallax · flying shapes
============================================================ */

/* ---------------------------------------------------------
   1) TEXT SPLITTING — wraps every character in a <span class="char">
      while preserving nested elements (e.g. <span class="accent">)
--------------------------------------------------------- */
function splitChars(el) {
  if (!el || el.dataset.split === 'true') return;
  el.dataset.split = 'true';

  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3 && child.textContent.trim().length) {
        const frag = document.createDocumentFragment();
        [...child.textContent].forEach((ch) => {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = ch === ' ' ? '\u00A0' : ch;
          frag.appendChild(span);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        walk(child);
      }
    });
  };
  walk(el);

  el.querySelectorAll('.char').forEach((c, i) => c.style.setProperty('--i', i));
}

function splitAllHeadings() {
  document.querySelectorAll('.tab-panel.active .section-head h2').forEach(splitChars);
}

// Hero name stays as the original glitch text (no char-splitting — it distorted
// the layout). Only section headings get the flying-letters treatment.
document.addEventListener('DOMContentLoaded', () => {
  splitAllHeadings();
});

/* ---------------------------------------------------------
   2) SCROLL-DRIVEN REVEAL DIRECTIONS
      Give each .reveal element a flight direction + stagger delay
--------------------------------------------------------- */
(function assignRevealDirections() {
  const dirs = ['up', 'left', 'right', 'scale'];
  document.querySelectorAll('.reveal').forEach((el, i) => {
    if (!el.hasAttribute('data-dir')) {
      // project cards & mini cards get more dramatic directions
      if (el.classList.contains('project-card')) {
        el.setAttribute('data-dir', i % 2 === 0 ? 'left' : 'right');
      } else if (el.classList.contains('mini-card') || el.classList.contains('achieve-card')) {
        el.setAttribute('data-dir', 'scale');
      } else if (el.classList.contains('timeline-item')) {
        el.setAttribute('data-dir', i % 2 === 0 ? 'left' : 'right');
      } else {
        el.setAttribute('data-dir', dirs[i % dirs.length]);
      }
    }
    el.style.setProperty('--rd', (i % 5) * 0.08 + 's');
  });
})();

/* ---------------------------------------------------------
   3) SECTION TAG "in-view" underline draw + panel parallax
--------------------------------------------------------- */
const sectionHeadObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.4 });
document.querySelectorAll('.section-head').forEach((el) => sectionHeadObserver.observe(el));

/* ---------------------------------------------------------
   4) 3D TILT ON GLASS CARDS / PROJECT CARDS
--------------------------------------------------------- */
function initTilt() {
  const tiltEls = document.querySelectorAll('.glass-card, .project-card');
  tiltEls.forEach((card) => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = 'true';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -10;
      const ry = (px - 0.5) * 10;
      card.style.transition = 'transform 0.08s linear';
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s var(--ease)';
      card.style.transform = '';
    });
  });
}
initTilt();

/* ---------------------------------------------------------
   5) MAGNETIC BUTTONS — buttons drift toward the cursor
--------------------------------------------------------- */
function initMagnetic() {
  document.querySelectorAll('.btn, .tab-btn').forEach((btn) => {
    if (btn.dataset.magBound) return;
    btn.dataset.magBound = 'true';

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      btn.style.transition = 'transform 0.08s linear';
      btn.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.4s var(--ease)';
      btn.style.transform = 'translate(0,0)';
    });
  });
}
initMagnetic();

/* ---------------------------------------------------------
   6) RIPPLE CLICK EFFECT
--------------------------------------------------------- */
document.addEventListener('click', (e) => {
  const target = e.target.closest('.btn, .tab-btn');
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  ripple.className = 'ripple-el';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  target.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
});

/* ---------------------------------------------------------
   7) CUSTOM CURSOR — lerped dot + ring, scales on hover targets
--------------------------------------------------------- */
(function customCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function ringLoop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(ringLoop);
  }
  ringLoop();

  const hoverSelector = 'a, button, .tab-btn, .glass-card, .project-card, input, textarea, .orbit-item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelector)) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelector)) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });
})();

/* ---------------------------------------------------------
   8) SCROLL PROGRESS BAR
--------------------------------------------------------- */
(function scrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ---------------------------------------------------------
   9) SCROLL-DRIVEN PARALLAX
      Hero portrait + orbit + floating shapes drift with scroll
--------------------------------------------------------- */
(function scrollParallax() {
  let ticking = false;
  function update() {
    const y = window.scrollY;
    const portrait = document.querySelector('.portrait-frame');
    if (portrait) portrait.style.transform = `translateY(${y * 0.08}px) rotateX(${Math.min(y * 0.02, 6)}deg)`;

    const orbit = document.querySelector('.skills-orbit');
    if (orbit) orbit.style.transform = `translateY(${y * 0.05}px)`;

    document.querySelectorAll('.fly-shape').forEach((shape, i) => {
      const speed = 0.02 + (i % 4) * 0.01;
      shape.style.marginTop = `${y * speed * -1}px`;
    });

    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

/* ---------------------------------------------------------
   10) PORTRAIT MOUSE-TILT (subtle 3D parallax on the hero photo)
--------------------------------------------------------- */
(function portraitTilt() {
  const frame = document.querySelector('.portrait-frame');
  const heroRight = document.querySelector('.hero-right');
  if (!frame || !heroRight) return;
  heroRight.addEventListener('mousemove', (e) => {
    const rect = heroRight.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    frame.style.transform = `perspective(1000px) rotateX(${py * -10}deg) rotateY(${px * 10}deg)`;
  });
  heroRight.addEventListener('mouseleave', () => {
    frame.style.transform = '';
  });
})();

/* ---------------------------------------------------------
   11) FLYING BACKGROUND SHAPES
      Injects decorative shapes that fly across the viewport
--------------------------------------------------------- */
(function flyingShapes() {
  const container = document.getElementById('flyShapes');
  if (!container) return;
  const types = ['tri', 'hex', 'ring', 'dot', 'plus'];
  const anims = ['flyAcross1', 'flyAcross2', 'flyAcross3', 'flyAcross4'];
  const COUNT = window.innerWidth < 760 ? 0 : 10;

  for (let i = 0; i < COUNT; i++) {
    const shape = document.createElement('div');
    const type = types[i % types.length];
    const anim = anims[i % anims.length];
    shape.className = `fly-shape ${type}`;
    const duration = 18 + Math.random() * 22;
    const delay = -(Math.random() * duration);
    shape.style.left = `${Math.random() * 100}vw`;
    shape.style.top = `${Math.random() * 100}vh`;
    shape.style.animationName = anim;
    shape.style.animationDuration = `${duration}s`;
    shape.style.animationDelay = `${delay}s`;
    container.appendChild(shape);
  }
})();

/* ---------------------------------------------------------
   12) STAT "POP" ON COUNTER COMPLETE
      Adds a satisfying pulse once each stat finishes counting
--------------------------------------------------------- */
const _origAnimateCounters = animateCounters;
animateCounters = function () {
  document.querySelectorAll('.stat').forEach((statEl) => {
    const numEl = statEl.querySelector('.stat-num');
    if (!numEl || numEl.dataset.popped) return;
    const target = parseInt(numEl.dataset.count, 10);
    const check = setInterval(() => {
      if (parseInt(numEl.textContent, 10) >= target) {
        statEl.classList.add('counted');
        numEl.dataset.popped = 'true';
        clearInterval(check);
      }
    }, 80);
  });
  _origAnimateCounters();
};

/* ---------------------------------------------------------
   13) PROJECT CARD GLARE ELEMENT INJECTION
--------------------------------------------------------- */
document.querySelectorAll('.project-media').forEach((media) => {
  const glare = document.createElement('span');
  glare.className = 'glare';
  media.appendChild(glare);
});

/* ---------------------------------------------------------
   14) INITIAL NAV INDICATOR PLACEMENT
--------------------------------------------------------- */
window.addEventListener('load', () => {
  moveTabIndicator();
});
window.addEventListener('resize', () => {
  moveTabIndicator();
});

/* ============================================================
   UPGRADE v3.1 — even more layers
   Scroll-synced timeline fill · word-reveal paragraphs
   secret easter egg · lit timeline dots
============================================================ */

/* ---------------------------------------------------------
   15) TIMELINE SCROLL-FILL — the vertical energy line grows
       as the timeline scrolls through the viewport, and dots
       "light up" once passed
--------------------------------------------------------- */
(function timelineFill() {
  function update() {
    document.querySelectorAll('.tab-panel.active .timeline').forEach((timeline) => {
      const rect = timeline.getBoundingClientRect();
      const viewportMid = window.innerHeight * 0.75;
      const total = rect.height;
      let progressPx = viewportMid - rect.top;
      progressPx = Math.max(0, Math.min(progressPx, total));
      const pct = total > 0 ? (progressPx / total) * 100 : 0;
      timeline.style.setProperty('--fill', pct + '%');

      timeline.querySelectorAll('.timeline-dot').forEach((dot) => {
        const dotRect = dot.getBoundingClientRect();
        const dotOffset = dotRect.top - rect.top;
        dot.classList.toggle('lit', progressPx >= dotOffset);
      });
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  // Re-run whenever a tab becomes active
  document.querySelectorAll('.tab-btn').forEach((b) => b.addEventListener('click', () => setTimeout(update, 50)));
  setTimeout(update, 300);
})();

/* ---------------------------------------------------------
   16) WORD-BY-WORD PARAGRAPH REVEAL
       Splits target paragraphs into staggered <span class="word">
--------------------------------------------------------- */
function splitWords(el) {
  if (!el || el.dataset.wordSplit === 'true') return;
  el.dataset.wordSplit = 'true';
  const text = el.textContent;
  el.innerHTML = '';
  text.split(/(\s+)/).forEach((chunk) => {
    if (chunk.trim() === '') {
      el.appendChild(document.createTextNode(chunk));
    } else {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = chunk;
      el.appendChild(span);
    }
  });
  el.querySelectorAll('.word').forEach((w, i) => w.style.setProperty('--wi', i));
  el.classList.add('word-reveal');
}
document.querySelectorAll('.about-main p').forEach(splitWords);

/* ---------------------------------------------------------
   17) SECRET EASTER EGG — click the logo 5 times fast
       to trigger a celebratory energy burst
--------------------------------------------------------- */
(function easterEgg() {
  const brand = document.querySelector('.brand');
  if (!brand) return;
  let clicks = 0;
  let lastClick = 0;

  brand.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastClick > 700) clicks = 0;
    clicks++;
    lastClick = now;
    brand.classList.add('charging');
    setTimeout(() => brand.classList.remove('charging'), 150);

    if (clicks >= 5) {
      clicks = 0;
      triggerEasterBurst(e.clientX, e.clientY);
    }
  });

  function triggerEasterBurst(x, y) {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const burst = document.createElement('div');
        burst.className = 'easter-burst';
        burst.style.left = x + 'px';
        burst.style.top = y + 'px';
        burst.style.width = '0px';
        burst.style.height = '0px';
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 900);
      }, i * 150);
    }
    const msg = document.createElement('div');
    msg.className = 'easter-msg';
    msg.textContent = '</ SYSTEM UNLOCKED >';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 1800);
  }
})();

/* ============================================================
   ROUND 2 UPGRADE — v4.0
   Cursor spark trail · particle bursts · scroll-to-top rocket
   corner section dial · glitch-scan (CSS driven, no JS needed)
============================================================ */

/* ---------------------------------------------------------
   15) CURSOR SPARK TRAIL (canvas particle system)
--------------------------------------------------------- */
(function cursorTrail() {
  const canvas = document.getElementById('trail-canvas');
  if (!canvas || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  const tctx = canvas.getContext('2d');
  let tw, th;
  function resize() { tw = canvas.width = window.innerWidth; th = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  let particles = [];
  let lastSpawn = 0;

  window.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastSpawn < 25) return; // throttle spawn rate
    lastSpawn = now;
    const colors = ['0,246,255', '168,85,247'];
    particles.push({
      x: e.clientX, y: e.clientY,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      life: 1,
      size: 1.5 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    if (particles.length > 60) particles.shift();
  });

  function loop() {
    tctx.clearRect(0, 0, tw, th);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.life -= 0.025;
      tctx.beginPath();
      tctx.arc(p.x, p.y, Math.max(p.size * p.life, 0), 0, Math.PI * 2);
      tctx.fillStyle = `rgba(${p.color},${Math.max(p.life, 0)})`;
      tctx.shadowBlur = 8;
      tctx.shadowColor = `rgba(${p.color},0.8)`;
      tctx.fill();
    });
    particles = particles.filter((p) => p.life > 0);
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ---------------------------------------------------------
   16) CLICK PARTICLE BURST — small energy shards on every click
--------------------------------------------------------- */
document.addEventListener('click', (e) => {
  const target = e.target.closest('.btn, .tab-btn, .orbit-item, .chip');
  if (!target) return;
  const originX = e.clientX;
  const originY = e.clientY;
  const count = 8;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'burst-particle';
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const dist = 30 + Math.random() * 30;
    particle.style.left = originX + 'px';
    particle.style.top = originY + 'px';
    particle.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
    particle.style.setProperty('--by', `${Math.sin(angle) * dist}px`);
    particle.style.background = i % 2 === 0 ? 'var(--cyan)' : 'var(--purple)';
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 720);
  }
});

/* ---------------------------------------------------------
   17) SCROLL-TO-TOP ROCKET BUTTON
--------------------------------------------------------- */
(function scrollTopButton() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    btn.classList.add('launching');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => btn.classList.remove('launching'), 400);
    }, 300);
  });
})();

/* ---------------------------------------------------------
   18) CORNER SECTION DIAL — shows which tab you're on (0X/08)
--------------------------------------------------------- */
function updateCornerDial(tabName) {
  const fill = document.getElementById('dialFill');
  const label = document.getElementById('dialLabel');
  if (!fill || !label) return;
  const order = ['home', 'about', 'education', 'experience', 'skills', 'projects', 'achievements', 'contact'];
  const idx = Math.max(order.indexOf(tabName), 0);
  const total = order.length;
  const circumference = 163;
  const pct = (idx + 1) / total;
  fill.style.strokeDashoffset = circumference - circumference * pct;
  label.textContent = String(idx).padStart(2, '0') + '/' + String(total).padStart(2, '0');
}
updateCornerDial('home');

// hook into tab switching
const _origGoToTab = goToTab;
goToTab = function (tabName) {
  updateCornerDial(tabName);
  _origGoToTab(tabName);
};

/* ---------------------------------------------------------
   19) RE-BIND TILT / MAGNETIC EFFECTS WHEN NEW PANELS ACTIVATE
      (safety net in case any lazily-rendered elements appear)
--------------------------------------------------------- */
document.addEventListener('click', (e) => {
  if (e.target.closest('.tab-btn, [data-goto]')) {
    setTimeout(() => { initTilt(); initMagnetic(); }, 300);
  }
});
