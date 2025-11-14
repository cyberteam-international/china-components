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
  let lastScroll = 0;
  const header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
    }

    lastScroll = currentScroll;
  });
});
