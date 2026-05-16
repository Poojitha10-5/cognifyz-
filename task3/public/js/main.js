// ── Runs when the entire page has loaded ─────────────────────
document.addEventListener("DOMContentLoaded", function () {
  // 1. Animate stat counters (500, 8, 4, 100)
  animateCounters();

  // 2. Animate progress bars
  animateProgressBars();

  // 3. Animate elements when they scroll into view
  setupScrollAnimations();

  // 4. Navbar shrinks when you scroll down
  setupNavbarScroll();
});

// ── 1. Counter Animation ──────────────────────────────────────
// Counts up from 0 to the target number
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}

// ── 2. Progress Bar Animation ─────────────────────────────────
// Bars grow from 0% to their target width
function animateProgressBars() {
  const bars = document.querySelectorAll(".progress-bar");

  bars.forEach((bar) => {
    const targetWidth = bar.getAttribute("data-width");

    // Small delay so animation is visible
    setTimeout(() => {
      bar.style.width = targetWidth + "%";
    }, 500);
  });
}

// ── 3. Scroll Animation ───────────────────────────────────────
// Elements fade in when they scroll into the viewport
function setupScrollAnimations() {
  // Create an observer that watches for elements entering view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // only animate once
        }
      });
    },
    { threshold: 0.15 }, // trigger when 15% of element is visible
  );

  // Watch these elements
  const elements = document.querySelectorAll(
    ".feature-card, .timeline-item, .demo-card, .stat-card, .level-card, .contact-info-card",
  );

  elements.forEach((el, index) => {
    // Add initial hidden state
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

    observer.observe(el);
  });
}

// ── 4. Navbar Scroll Effect ───────────────────────────────────
// Navbar gets smaller/solid when scrolled
function setupNavbarScroll() {
  const navbar = document.querySelector(".custom-navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.padding = "8px 0";
      navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
    } else {
      navbar.style.padding = "16px 0";
      navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.2)";
    }
  });
}

// ── 5. Make scroll-animated elements visible ──────────────────
// This CSS class is added by the IntersectionObserver
document.head.insertAdjacentHTML(
  "beforeend",
  `
  <style>
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`,
);
