// Mobile Menu Modal Toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const mobileMenuModal = document.getElementById("mobileMenuModal");

  // Open mobile menu modal
  if (menuToggle && mobileMenuModal) {
    menuToggle.addEventListener("click", function () {
      mobileMenuModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  // Close mobile menu modal
  if (menuClose && mobileMenuModal) {
    menuClose.addEventListener("click", function () {
      mobileMenuModal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Close menu when clicking on a menu item
  const mobileMenuItems = document.querySelectorAll(".mobile-nav-menu a");
  mobileMenuItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (mobileMenuModal) {
        mobileMenuModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // Smooth scrolling for anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#") {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
});

// Lenis Smooth Scroll
if (window.scrollY > 0) {
  window.scrollTo(0, 0);
}

const classesToExclude = [];

function getCurrentScale() {
  const body = document.body;
  const transform = window.getComputedStyle(body).transform;
  if (transform && transform !== "none") {
    const matrix = transform.match(/matrix\(([^)]+)\)/);
    if (matrix) {
      const values = matrix[1].split(",");
      return parseFloat(values[0]) || 1;
    }
  }
  return 1;
}

let currentScale = getCurrentScale();

const lenis = new Lenis({
  duration: 2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
  infinite: false,
  autoRaf: true,
  autoResize: true,
  syncTouch: false,

  prevent: (node) => {
    return classesToExclude.some(
      (className) =>
        node.classList.contains(className) || node.closest(`.${className}`)
    );
  },

  virtualScroll: (e) => {
    const newScale = getCurrentScale();

    if (newScale !== currentScale) {
      currentScale = newScale;
    }

    if (currentScale !== 1) {
      e.deltaY = e.deltaY / currentScale;
      e.deltaX = e.deltaX / currentScale;
    }

    return true;
  },
});

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    currentScale = getCurrentScale();
    lenis.resize();
  }, 100);
});

window.addEventListener("load", () => {
  classesToExclude.forEach((className) => {
    document.querySelectorAll(`.${className}`).forEach((element) => {
      element.setAttribute("data-lenis-prevent", "");
    });
  });
});

lenis.on("scroll", (e) => {
  // console.log('Scroll event:', e);
});

// GSAP ScrollTrigger integration
gsap.registerPlugin(ScrollTrigger);

// Fade-in animations for all headings
gsap.utils.toArray(".fade-in").forEach((element) => {
  gsap.from(element, {
    opacity: 0,
    y: 40,
    duration: 1,
    scrollTrigger: {
      trigger: element,
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();

  // Button click handlers (you can customize these)
  const primaryButtons = document.querySelectorAll(
    ".btn-primary, .btn-secondary"
  );
  primaryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Add your form/modal logic here
      console.log("Button clicked:", this.textContent);
      // Example: open a contact form modal
    });
  });

  // Add scroll effect to header
  const header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});
