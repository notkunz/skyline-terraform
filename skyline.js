// ============ INITIALIZATION ============
document.addEventListener("DOMContentLoaded", () => {
  initializeScrollAnimations();
  initializeFormValidation();
  initializeNavigation();
  initializeServiceCards();
  initializeCarousel();
  initializeScrollSpyNav();
  initializeCounterAnimation();
  initializeSmoothScroll();
});

// ============ SCROLL ANIMATIONS ============
const initializeScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation for multiple elements
        setTimeout(() => {
          entry.target.classList.add("visible");
          entry.target.style.animationDelay = `${index * 0.1}s`;
        }, index * 50);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });

  // Animate section headers on scroll
  document.querySelectorAll(".section-header").forEach((header) => {
    observer.observe(header);
    header.classList.add("fade-in");
  });
};

// ============ SMOOTH SCROLL ============
const initializeSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
};

// ============ FORM VALIDATION & SUBMISSION ============
const initializeFormValidation = () => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const message = form.querySelector("textarea").value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      showNotification("Please fill all required fields", "error");
      return;
    }

    if (!isValidEmail(email)) {
      e.preventDefault();
      showNotification("Please enter a valid email", "error");
      return;
    }

    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Form submission failed");

      form.reset();
      showNotification("Thanks. Your project details are on their way.");
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      showNotification(
        "We couldn't send your message. Please try again.",
        "error",
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  });
};

// ============ FORM FIELD LISTENERS ============
document
  .querySelectorAll(".form-group input, .form-group textarea")
  .forEach((field) => {
    field.addEventListener("input", () => {
      // Real-time validation feedback
      if (field.type === "email" && field.value) {
        field.style.borderColor = isValidEmail(field.value)
          ? "#f59e0b"
          : "#ef4444";
      }
    });

    field.addEventListener("blur", () => {
      // Validate on blur
      if (field.value) {
        if (field.type === "email" && !isValidEmail(field.value)) {
          field.style.borderColor = "#ef4444";
        } else {
          field.style.borderColor = "#cbd5e1";
        }
      }
    });
  });

// ============ UTILITY: EMAIL VALIDATION ============
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// ============ NOTIFICATION SYSTEM ============
const showNotification = (message, type = "success") => {
  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: ${type === "success" ? "#10b981" : "#ef4444"};
                color: white;
                border-radius: 8px;
                font-weight: 600;
                z-index: 10000;
                animation: slideInRight 0.4s ease;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            `;
  notification.textContent = message;

  // Add animation
  const style = document.createElement("style");
  style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.4s ease";
    setTimeout(() => notification.remove(), 400);
  }, 4000);
};

// ============ SERVICE CARDS INTERACTIVITY ============
const initializeServiceCards = () => {
  const cards = document.querySelectorAll(".service-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      showServiceModal(card);
    });

    // Add keyboard accessibility
    card.setAttribute("tabindex", "0");
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        showServiceModal(card);
      }
    });
  });
};

// ============ SERVICE MODAL ============
const showServiceModal = (card) => {
  const title = card.querySelector("h3").textContent;
  const description = card.querySelector("p").textContent;
  const icon = card.querySelector(".service-icon").textContent;

  const modal = document.createElement("div");
  modal.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeIn 0.3s ease;
                backdrop-filter: blur(4px);
            `;

  modal.innerHTML = `
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    max-width: 600px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.4s ease;
                    position: relative;
                ">
                    <button onclick="this.closest('div').parentElement.remove()" style="
                        position: absolute;
                        top: 1.5rem;
                        right: 1.5rem;
                        background: #f59e0b;
                        border: none;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 1.2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#0f172a'; this.style.color='#f59e0b'" onmouseout="this.style.background='#f59e0b'; this.style.color='black'">×</button>
                    
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${icon}</div>
                    <h2 style="font-size: 1.8rem; margin-bottom: 1rem; color: #0f172a; font-weight: 700;">${title}</h2>
                    <p style="color: #64748b; line-height: 1.8; margin-bottom: 2rem;">${description}</p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <button onclick="this.closest('div').parentElement.parentElement.remove(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });" style="
                            background: #f59e0b;
                            color: #0f172a;
                            padding: 0.8rem 1.5rem;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: 600;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 30px rgba(245, 158, 11, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">Get Quote</button>
                        
                        <button onclick="this.closest('div').parentElement.remove()" style="
                            background: #e2e8f0;
                            color: #0f172a;
                            padding: 0.8rem 1.5rem;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: 600;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.background='#cbd5e1'" onmouseout="this.style.background='#e2e8f0'">Close</button>
                    </div>
                </div>
            `;

  // Add animations
  const style = document.createElement("style");
  style.textContent = `
                @keyframes slideUp {
                    from {
                        transform: translateY(40px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
  document.head.appendChild(style);

  document.body.appendChild(modal);

  // Close modal on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Close on ESC key
  const closeOnEsc = (e) => {
    if (e.key === "Escape") {
      modal.remove();
      document.removeEventListener("keydown", closeOnEsc);
    }
  };
  document.addEventListener("keydown", closeOnEsc);
};

// ============ CAROUSEL FUNCTIONALITY ============
const initializeCarousel = () => {
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const indicatorsContainer = document.getElementById("indicators");

  let currentIndex = 0;
  let autoPlayInterval;

  // Create indicators
  slides.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.classList.add("carousel-indicator");
    if (index === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
  });

  const updateCarousel = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateIndicators();
  };

  const updateIndicators = () => {
    document
      .querySelectorAll(".carousel-indicator")
      .forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentIndex);
      });
  };

  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    updateCarousel();
    resetAutoPlay();
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
    resetAutoPlay();
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
    resetAutoPlay();
  };

  const autoPlay = () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    autoPlay();
  };

  // Event listeners
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  // Start auto-play
  autoPlay();

  // Pause on hover
  track.addEventListener("mouseenter", () => clearInterval(autoPlayInterval));
  track.addEventListener("mouseleave", autoPlay);
};

// ============ SCROLL SPY NAVIGATION ============
const initializeScrollSpyNav = () => {
  const sections = document.querySelectorAll(
    '[id="services"], [id="portfolio"], [id="process"], [id="about"], [id="contact"]',
  );
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.style.color = "white";
      if (link.getAttribute("href").slice(1) === current) {
        link.style.color = "#f59e0b";
      }
    });
  });
};

// ============ NAVIGATION ACTIVE STATE ============
const initializeNavigation = () => {
  // CTA buttons
  document
    .querySelectorAll(".btn-primary, .btn-secondary, .cta-btn")
    .forEach((btn) => {
      btn.addEventListener("mouseover", () => {
        btn.style.transform = "translateY(-3px)";
      });
      btn.addEventListener("mouseout", () => {
        btn.style.transform = "translateY(0)";
      });
    });

  // Mobile menu toggle (if needed)
  const navToggle = document.querySelector(".nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const navMenu = document.querySelector("nav ul");
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        document.querySelector(".nav-menu").classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
};

// ============ COUNTER ANIMATION (Stats) ============
const initializeCounterAnimation = () => {
  // Placeholder for stats counters if added
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length === 0) return;

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-count"));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  });
};

// ============ HEADER SCROLL EFFECT ============
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.boxShadow = "none";
  }
});

// ============ PERFORMANCE: LAZY LOADING ============
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img").forEach((img) => imageObserver.observe(img));
}
