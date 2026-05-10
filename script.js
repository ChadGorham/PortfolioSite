const scrollContainer = document.querySelector('.scroll-container');
const bg = document.getElementById('bg-layer');
const mid = document.getElementById('mid-layer');
const navLinks = document.querySelectorAll('.nav-links a');

scrollContainer.addEventListener('wheel', (event) => {
  if (window.innerWidth > 960) {
    event.preventDefault();
    scrollContainer.scrollBy({
      left: event.deltaY * 1.4,
      behavior: 'smooth'
    });
  }
}, { passive: false });

scrollContainer.addEventListener('scroll', () => {
  const x = scrollContainer.scrollLeft;
  bg.style.transform = `translateX(${-x * 0.25}px)`;
  mid.style.transform = `translateX(${-x * 0.45}px)`;
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      if (window.innerWidth > 960) {
        scrollContainer.scrollTo({ left: target.offsetLeft, top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: target.offsetTop, left: 0, behavior: 'smooth' });
      }
    }
  });
});
