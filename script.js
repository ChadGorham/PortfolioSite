// PARALLAX SCROLLING
(function () {
  const container = document.querySelector(".scroll-container");
  const scenes = document.querySelectorAll(".scene");

  function updateParallax() {
    const scrollX = container.scrollLeft;
    const viewportWidth = window.innerWidth;

    scenes.forEach((scene, index) => {
      const base = index * viewportWidth;
      const offset = scrollX - base;

      const back = scene.querySelector(".layer-back");
      const mid = scene.querySelector(".layer-mid");
      const front = scene.querySelector(".layer-front");

      if (back) back.style.transform = `translateX(${offset * 0.2}px)`;
      if (mid) mid.style.transform = `translateX(${offset * 0.4}px)`;
      if (front) front.style.transform = `translateX(${offset * 0.6}px)`;
    });
  }

  container.addEventListener("scroll", updateParallax);
  window.addEventListener("resize", updateParallax);
  updateParallax();
})();

// PROJECT TOOLTIP FOLLOWING CURSOR
(function () {
  const cards = document.querySelectorAll(".project-card");
  const tooltips = document.querySelectorAll(".wow-tooltip");

  function hideAllTooltips() {
    tooltips.forEach((tip) => {
      tip.style.opacity = 0;
    });
  }

  cards.forEach((card) => {
    const id = card.getAttribute("data-tooltip-id");
    const tooltip = document.getElementById(id);
    if (!tooltip) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      tooltip.style.left = `${rect.left + x}px`;
      tooltip.style.top = `${rect.top + y - 10}px`;
      tooltip.style.opacity = 1;
    });

    card.addEventListener("mouseleave", () => {
      tooltip.style.opacity = 0;
    });
  });
})();

// AMBIENT AUDIO TOGGLE
(function () {
  const toggle = document.getElementById("ambientToggle");
  const audio = document.getElementById("ambientAudio");

  if (!toggle || !audio) return;

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });
})();
