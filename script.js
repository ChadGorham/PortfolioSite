/* ═══════════════════════════════════════════════
   CHAD GORHAM PORTFOLIO — SCRIPT
   ═══════════════════════════════════════════════ */

// ── MAP MODAL ──────────────────────────────────

const mapModal   = document.getElementById('mapModal');
const openMapBtn = document.getElementById('openMap');
const closeMapBtn= document.getElementById('closeMap');
const mapTooltip = document.getElementById('mapTooltip');
const tooltipName= mapTooltip.querySelector('.tooltip-name');
const tooltipSub = mapTooltip.querySelector('.tooltip-sub');

function openMap() {
  mapAudio.currentTime = 0;
  mapAudio.volume = 0.12;
  mapAudio.play().catch(() => {});
  mapModal.classList.add('open');
  mapModal.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  closeMapBtn.focus();
}

function closeMap() {
  mapModal.classList.remove('open');
  mapModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  mapTooltip.style.opacity = '0';
  openMapBtn.focus();
}

openMapBtn.addEventListener('click', openMap);
closeMapBtn.addEventListener('click', closeMap);

// Close on backdrop click
mapModal.addEventListener('click', (e) => {
  if (e.target === mapModal) closeMap();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mapModal.classList.contains('open')) closeMap();
});


// ── MAP REGION INTERACTIONS ────────────────────

const regions = document.querySelectorAll('.map-region');

regions.forEach(region => {

  region.addEventListener('mousemove', (e) => {
    tooltipName.textContent = region.dataset.name;
    tooltipSub.textContent  = region.dataset.subtitle || '';
    mapTooltip.style.opacity = '1';

    // Keep tooltip inside viewport
    const tw = 180;
    const th = 80;
    let left = e.clientX + 18;
    let top  = e.clientY + 18;
    if (left + tw > window.innerWidth  - 12) left = e.clientX - tw - 12;
    if (top  + th > window.innerHeight - 12) top  = e.clientY - th - 12;

    mapTooltip.style.left = left + 'px';
    mapTooltip.style.top  = top  + 'px';
  });

  region.addEventListener('mouseleave', () => {
    mapTooltip.style.opacity = '0';
  });

  region.addEventListener('click', () => {
    teleportAudio.currentTime = 0;
    teleportAudio.volume = 0.12;
    teleportAudio.play().catch(() => {});
    const sectionId = region.dataset.section;

    // Flash effect on click
    region.classList.add('flash');
    setTimeout(() => region.classList.remove('flash'), 280);

    // Close modal then scroll to section
    setTimeout(() => {
      closeMap();
      setTimeout(() => {
        if (sectionId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const target = document.getElementById(sectionId);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 320);
    }, 220);
  });

  // Keyboard support
  region.setAttribute('tabindex', '0');
  region.setAttribute('role', 'button');
  region.setAttribute('aria-label',
    `Navigate to ${region.dataset.name} section`);

  region.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      region.click();
    }
  });
});


// ── MAP / TELEPORT SOUND EFFECTS ──────────────
// Ambient music has been removed; these remain to keep map clicks audible.

const teleportAudio = document.getElementById('teleportAudio');
const mapAudio = document.getElementById('mapAudio');


// ── SMOOTH ANCHOR SCROLL ───────────────────────

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── ACTIVE NAV HIGHLIGHT ───────────────────────

const navLinks   = document.querySelectorAll('.nav-links a');
const allSections= document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  { rootMargin: `-${62 + 20}px 0px -55% 0px`, threshold: 0 }
);

allSections.forEach(s => sectionObserver.observe(s));


// ── PARALLAX ELEMENTS ─────────────────────────

const parallaxEls = document.querySelectorAll('[data-parallax-speed]');
let parallaxTicking = false;

function runParallax() {
  const sy = window.scrollY;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallaxSpeed) || 0;
    el.style.transform = `translateY(${sy * speed}px)`;
  });
  parallaxTicking = false;
}

if (parallaxEls.length) {
  window.addEventListener('scroll', () => {
    if (!parallaxTicking) { requestAnimationFrame(runParallax); parallaxTicking = true; }
  }, { passive: true });
  runParallax();
}


// ── NAVBAR SCROLL SHADOW + HEARTHSTONE ─────────

const navbar = document.getElementById('navbar');
const hearthstone = document.getElementById('hearthstone');

window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 1px 0 #000, 0 4px 30px rgba(0,0,0,0.9)'
    : '';
  hearthstone.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
}, { passive: true });

hearthstone.addEventListener('click', () => {
  if (hearthstone.classList.contains('cooling')) return;
  teleportAudio.currentTime = 0;
  teleportAudio.volume = 0.12;
  teleportAudio.play().catch(() => {});
  hearthstone.classList.add('cooling');
  setTimeout(() => hearthstone.classList.remove('cooling'), 1600);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ── HERO SCENE: SNOWFALL, EMBERS, BRAZIER FIRE ─

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = document.getElementById('hero');

function fitCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width  = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

// Soft round sprite, tinted, reused for every fire/ember particle
function makeSprite(r, g, b) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0,   `rgba(${r},${g},${b},1)`);
  grad.addColorStop(0.4, `rgba(${r},${g},${b},0.5)`);
  grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return c;
}

const SPRITE_HOT  = makeSprite(255, 238, 180);
const SPRITE_MID  = makeSprite(255, 150, 45);
const SPRITE_COOL = makeSprite(210, 55, 15);

// Snow drifting across Dun Morogh + embers rising from the braziers
const weather = {
  canvas: document.getElementById('weatherCanvas'),
  flakes: [],
  embers: [],

  init() {
    Object.assign(this, fitCanvas(this.canvas));
    const count = Math.min(260, Math.max(70, Math.round(this.w * this.h / 8000)));
    this.flakes = Array.from({ length: count }, () => this.makeFlake(true));
    this.embers = Array.from({ length: 24 }, () => this.makeEmber(true));
  },

  makeFlake(anywhere) {
    const z = 0.25 + Math.random() * 0.75;
    return {
      x: Math.random() * this.w,
      y: anywhere ? Math.random() * this.h : -6,
      z,
      r: 0.5 + z * 2.1,
      vy: 0.3 + z * 1.1,
      phase: Math.random() * Math.PI * 2,
      sway: 0.4 + Math.random() * 0.8,
    };
  },

  makeEmber(anywhere) {
    // Mostly from the braziers at the edges, a few from the center fireline
    const side = Math.random();
    const x = side < 0.4 ? this.w * (0.04 + Math.random() * 0.1)
            : side < 0.8 ? this.w * (0.86 + Math.random() * 0.1)
            : Math.random() * this.w;
    return {
      x,
      y: anywhere ? this.h * (0.4 + Math.random() * 0.6) : this.h * 0.82 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.5 + Math.random() * 1.1),
      life: 0,
      max: 160 + Math.random() * 220,
      r: 0.8 + Math.random() * 1.5,
      flick: Math.random() * 10,
    };
  },

  update(t) {
    const wind = Math.sin(t * 0.00035) * 0.7 + 0.35;
    for (const f of this.flakes) {
      f.y += f.vy;
      f.x += wind * f.z + Math.sin(t * 0.001 * f.sway + f.phase) * 0.35 * f.z;
      if (f.y > this.h + 6) Object.assign(f, this.makeFlake(false));
      if (f.x > this.w + 6) f.x = -6;
      if (f.x < -6) f.x = this.w + 6;
    }
    for (const e of this.embers) {
      e.life++;
      e.vx += (Math.random() - 0.5) * 0.06 + wind * 0.004;
      e.x += e.vx;
      e.y += e.vy;
      if (e.life > e.max || e.y < -10) Object.assign(e, this.makeEmber(false));
    }
  },

  draw(t) {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#f2f7fc';
    for (const f of this.flakes) {
      ctx.globalAlpha = 0.3 + f.z * 0.6;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'lighter';
    for (const e of this.embers) {
      const fade = Math.sin(Math.PI * e.life / e.max);
      ctx.globalAlpha = Math.max(0, fade * (0.55 + 0.45 * Math.sin(t * 0.02 + e.flick)));
      const s = e.r * 5;
      ctx.drawImage(SPRITE_MID, e.x - s, e.y - s, s * 2, s * 2);
      ctx.drawImage(SPRITE_HOT, e.x - e.r, e.y - e.r, e.r * 2, e.r * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  },
};

// Particle fire sitting in each brazier basin
class BrazierFire {
  constructor(canvas) {
    this.canvas = canvas;
    this.parts = [];
    this.sparks = [];
  }

  init() {
    Object.assign(this, fitCanvas(this.canvas));
    this.cx = this.w / 2;
    this.rimY = this.h - 50;     // basin rim, matches .brazier-svg layout
    this.spread = this.w * 0.24;
  }

  update(t) {
    if (!this.w) return;
    for (let i = 0; i < 5; i++) {
      // tongues licking up from a few hot spots in the coal bed
      const tongue = Math.sin(t * 0.004 + i * 1.7) * 0.5;
      this.parts.push({
        x: this.cx + (Math.random() - 0.5 + tongue * 0.6) * 2 * this.spread,
        y: this.rimY + 4 - Math.random() * 4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(1.4 + Math.random() * 2.2),
        life: 0,
        max: 26 + Math.random() * 34,
        size: 7 + Math.random() * 10,
      });
    }
    if (Math.random() < 0.18) {
      this.sparks.push({
        x: this.cx + (Math.random() - 0.5) * this.spread,
        y: this.rimY - 20,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(2 + Math.random() * 2.2),
        life: 0,
        max: 50 + Math.random() * 40,
      });
    }

    const sway = Math.sin(t * 0.002) * 0.25;
    this.parts = this.parts.filter(p => {
      p.life++;
      p.vx += (this.cx - p.x) * 0.003 + (Math.random() - 0.5) * 0.22;
      p.x += p.vx + sway;
      p.y += p.vy;
      p.vy *= 0.995;
      return p.life < p.max;
    });
    this.sparks = this.sparks.filter(s => {
      s.life++;
      s.vx += (Math.random() - 0.5) * 0.2;
      s.x += s.vx;
      s.y += s.vy;
      s.vy *= 0.985;
      return s.life < s.max && s.y > 0;
    });
  }

  draw(t) {
    if (!this.w) return;
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'lighter';

    // bed of coals glow
    ctx.globalAlpha = 0.18 + Math.sin(t * 0.008) * 0.05;
    ctx.drawImage(SPRITE_COOL, this.cx - this.spread * 1.3, this.rimY - 22, this.spread * 2.6, 36);

    for (const p of this.parts) {
      const k = p.life / p.max;
      const sprite = k < 0.15 ? SPRITE_HOT : k < 0.5 ? SPRITE_MID : SPRITE_COOL;
      const s = p.size * (1 - k * 0.6);
      ctx.globalAlpha = (1 - k) * (k < 0.15 ? 0.22 : 0.3);
      // stretch vertically so particles read as flame licks, not puffs
      ctx.drawImage(sprite, p.x - s, p.y - s * 1.7, s * 2, s * 3.4);
    }

    ctx.globalAlpha = 1;
    for (const s of this.sparks) {
      const a = 1 - s.life / s.max;
      ctx.globalAlpha = a * (0.6 + 0.4 * Math.sin(s.life * 0.7));
      ctx.drawImage(SPRITE_HOT, s.x - 2, s.y - 2, 4, 4);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}

const fires = [...document.querySelectorAll('.brazier-fire')].map(c => new BrazierFire(c));
let heroVisible = true;
let sceneRunning = false;

function sceneFrame(t) {
  if (!heroVisible) { sceneRunning = false; return; }
  weather.update(t);
  weather.draw(t);
  fires.forEach(f => { f.update(t); f.draw(t); });
  requestAnimationFrame(sceneFrame);
}

function startScene() {
  if (sceneRunning || reduceMotion) return;
  sceneRunning = true;
  requestAnimationFrame(sceneFrame);
}

function initScene() {
  weather.init();
  fires.forEach(f => f.init());
  if (reduceMotion) {
    // One still frame: settled snow and a steady flame, no animation
    fires.forEach(f => { for (let i = 0; i < 60; i++) f.update(i * 16); f.draw(0); });
    weather.draw(0);
  }
}

initScene();

new IntersectionObserver(([entry]) => {
  heroVisible = entry.isIntersecting;
  if (heroVisible) startScene();
}).observe(hero);

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initScene, 150);
});
