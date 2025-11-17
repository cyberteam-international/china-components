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

          // Получаем высоту шапки
          const header = document.querySelector(".header");
          const headerHeight = header ? header.offsetHeight : 0;

          // Получаем позицию элемента
          const targetPosition =
            target.getBoundingClientRect().top + window.pageYOffset;

          // Скроллим с учетом высоты шапки
          window.scrollTo({
            top: targetPosition - headerHeight,
            behavior: "smooth",
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

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const toggle = item.querySelector(".faq-toggle");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      // Toggle current item
      const isActive = toggle.classList.contains("active");

      // Close all other items (optional - remove if you want multiple open)
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.querySelector(".faq-toggle").classList.remove("active");
          otherItem.querySelector(".faq-answer").classList.remove("active");
        }
      });

      // Toggle current item
      toggle.classList.toggle("active", !isActive);
      answer.classList.toggle("active", !isActive);
    });
  });

  // Request Modal Functionality
  const requestModal = document.getElementById("requestModal");
  const thankYouModal = document.getElementById("thankYouModal");
  const requestModalClose = document.getElementById("requestModalClose");
  const thankYouModalClose = document.getElementById("thankYouModalClose");
  const closeThankYouModalBtn = document.getElementById("closeThankYouModal");
  const requestForm = document.getElementById("requestForm");

  // Get all buttons that should open the request modal
  const requestButtons = document.querySelectorAll(
    '.btn:not(.menu-toggle):not(.faq-toggle):not([type="submit"]):not(.btn-close-modal)'
  );

  // Function to open request modal
  function openRequestModal() {
    requestModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Function to close request modal
  function closeRequestModal() {
    requestModal.classList.remove("active");
    document.body.style.overflow = "";
    requestForm.reset();
  }

  // Function to open thank you modal
  function openThankYouModal() {
    thankYouModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Function to close thank you modal
  function closeThankYouModal() {
    thankYouModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Add click event to all request buttons
  requestButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      openRequestModal();
    });
  });

  // Close request modal on close button click
  if (requestModalClose) {
    requestModalClose.addEventListener("click", closeRequestModal);
  }

  // Close request modal on overlay click
  if (requestModal) {
    requestModal
      .querySelector(".request-modal-overlay")
      .addEventListener("click", closeRequestModal);
  }

  // Close thank you modal on close button click
  if (thankYouModalClose) {
    thankYouModalClose.addEventListener("click", closeThankYouModal);
  }

  // Close thank you modal on close button click
  if (closeThankYouModalBtn) {
    closeThankYouModalBtn.addEventListener("click", closeThankYouModal);
  }

  // Close thank you modal on overlay click
  if (thankYouModal) {
    thankYouModal
      .querySelector(".thank-you-modal-overlay")
      .addEventListener("click", closeThankYouModal);
  }

  // Handle form submission
  if (requestForm) {
    requestForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("userName");
      const phoneInput = document.getElementById("userPhone");

      // Simple validation
      if (!nameInput.value.trim()) {
        nameInput.classList.add("error");
        return;
      } else {
        nameInput.classList.remove("error");
      }

      if (!phoneInput.value.trim()) {
        phoneInput.classList.add("error");
        return;
      } else {
        phoneInput.classList.remove("error");
      }

      // Close request modal and show thank you modal
      closeRequestModal();
      setTimeout(() => {
        openThankYouModal();
      }, 300);
    });
  }

  // Remove error class on input
  const formInputs = document.querySelectorAll(".form-group input");
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      this.classList.remove("error");
    });
  });
});
