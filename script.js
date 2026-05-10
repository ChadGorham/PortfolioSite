const bg = document.getElementById('bg-layer');
const mid = document.getElementById('mid-layer');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  bg.style.transform = `translateY(${-y * 0.25}px)`;
  mid.style.transform = `translateY(${-y * 0.45}px)`;
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      window.scrollTo({ top: target.offsetTop, left: 0, behavior: 'smooth' });
    }
  });
});
