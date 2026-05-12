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


// ── AMBIENT AUDIO ──────────────────────────────

const audio     = document.getElementById('ambientAudio');
const audioBtn  = document.getElementById('audioToggle');
const audioIcon = document.getElementById('audioIcon');
let   audioOn   = false;

audioBtn.addEventListener('click', () => {
  if (audioOn) {
    audio.pause();
    audioIcon.textContent = '♪'; // ♪
    audioOn = false;
  } else {
    audio.volume = 0.28;
    audio.play().catch(() => {});
    audioIcon.textContent = '■'; // ■
    audioOn = true;
  }
});


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


// ── NAVBAR SCROLL SHADOW ───────────────────────

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 4px 30px rgba(0,0,0,0.9)'
    : '0 2px 24px rgba(0,0,0,0.85)';
}, { passive: true });
