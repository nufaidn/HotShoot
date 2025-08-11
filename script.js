document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functionality
  initHeroSlider();
  initGalleryFilter();
  initTestimonialSlider();
  initSmoothScroll();
  initFormHandling();
  initMobileMenu();
  initScrollEffects();
  initLightbox();
  initBackToTop();
  initAnimations();
  initStatsCounter();
  initNewsletterForm();
});

// Hero Slider Functionality
function initHeroSlider() {
  const heroImages = document.querySelectorAll('.hero-image');
  const dots = document.querySelectorAll('.hero-dots .dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    heroImages.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % heroImages.length;
    showSlide(next);
  }

  function goToSlide(index) {
    showSlide(index);
  }

  // Auto-advance slides
  function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopSlideshow() {
    clearInterval(slideInterval);
  }

  // Event listeners
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      stopSlideshow();
      startSlideshow();
    });
  });

  // Pause slideshow on hover
  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', stopSlideshow);
  hero.addEventListener('mouseleave', startSlideshow);

  // Start slideshow
  startSlideshow();
}

// Gallery Filter Functionality
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.galeri-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter items
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Testimonial Slider Functionality
function initTestimonialSlider() {
  const testimonials = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    currentTestimonial = index;
  }

  function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(next);
  }

  function prevTestimonial() {
    const prev = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(prev);
  }

  // Auto-advance testimonials
  setInterval(nextTestimonial, 6000);

  // Event listeners for navigation
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');

  if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
  if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);

  // Event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showTestimonial(index));
  });
}

// Smooth Scroll Functionality
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Form Handling
function initFormHandling() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show loading
    showLoading();
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
      hideLoading();
      return;
    }
    
    // Simulate form submission delay
    setTimeout(() => {
      // Send to WhatsApp
      sendToWhatsApp(data);
      
      // Hide loading
      hideLoading();
      
      // Show success message
      showSuccessMessage();
      
      // Reset form
      form.reset();
    }, 1500);
  });

  // Auto-fill package selection
  const packageLinks = document.querySelectorAll('[data-paket]');
  packageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const paket = link.getAttribute('data-paket');
      const paketSelect = document.getElementById('paket');
      if (paketSelect) {
        paketSelect.value = paket;
        paketSelect.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Form Validation
function validateForm(data) {
  const required = ['nama', 'email', 'whatsapp', 'paket', 'tanggal', 'waktu', 'lokasi'];
  
  for (let field of required) {
    if (!data[field] || data[field].trim() === '') {
      showError(`Field ${field} harus diisi`);
      return false;
    }
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showError('Format email tidak valid');
    return false;
  }
  
  // Date validation
  const selectedDate = new Date(data.tanggal);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    showError('Tanggal tidak boleh di masa lalu');
    return false;
  }
  
  return true;
}

// Send to WhatsApp
function sendToWhatsApp(data) {
  const message = `*Detail Booking HotShoot Photography*%0A%0A` +
    `*Nama:* ${data.nama}%0A` +
    `*Email:* ${data.email}%0A` +
    `*WhatsApp:* ${data.whatsapp}%0A` +
    `*Paket:* ${data.paket}%0A` +
    `*Tanggal:* ${data.tanggal}%0A` +
    `*Waktu:* ${data.waktu}%0A` +
    `*Lokasi:* ${data.lokasi}%0A` +
    `*Catatan:* ${data.catatan || '-'}%0A%0A` +
    `Terima kasih telah memilih HotShoot Photography!`;
  
  const waLink = `https://wa.me/6285922053573?text=${message}`;
  window.open(waLink, '_blank');
}

// Mobile Menu Functionality
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close menu when clicking on a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}

// Scroll Effects
function initScrollEffects() {
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });

  // Parallax effect for hero
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    });
  }
}

// Lightbox Functionality
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.querySelector('.close-lightbox');
  
  if (!lightbox || !closeBtn) return;

  // Close lightbox
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// Global lightbox functions
window.openLightbox = function(button) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  
  const item = button.closest('.galeri-item');
  const img = item.querySelector('img');
  const title = item.querySelector('h3').textContent;
  const description = item.querySelector('p').textContent;
  
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxTitle.textContent = title;
  lightboxDescription.textContent = description;
  
  lightbox.style.display = 'block';
  document.body.style.overflow = 'hidden';
};

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Animations on Scroll
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observe elements with data-aos attribute
  document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
  });

  // Add animation classes
  document.querySelectorAll('.keunggulan-item, .paket-card, .galeri-item').forEach(el => {
    el.classList.add('fade-in');
  });
}

// Stats Counter Animation
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number[data-target]');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Newsletter Form
function initNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    if (!email) {
      showError('Masukkan email Anda');
      return;
    }
    
    // Simulate subscription
    showSuccessMessage('Terima kasih! Anda telah berlangganan newsletter kami.');
    newsletterForm.reset();
  });
}

// Utility Functions
function showLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'block';
}

function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'none';
}

function showSuccessMessage(message = 'Permintaan booking telah dikirim! Kami akan hubungi Anda segera.') {
  const notification = document.createElement('div');
  notification.className = 'notification success';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Remove notification
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

function showError(message) {
  const notification = document.createElement('div');
  notification.className = 'notification error';
  notification.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Remove notification
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add notification styles
const notificationStyles = `
  .notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 400px;
  }
  
  .notification.show {
    transform: translateX(0);
  }
  
  .notification.success {
    border-left: 4px solid #10b981;
  }
  
  .notification.error {
    border-left: 4px solid #ef4444;
  }
  
  .notification i {
    font-size: 1.25rem;
  }
  
  .notification.success i {
    color: #10b981;
  }
  
  .notification.error i {
    color: #ef4444;
  }
  
  .notification span {
    color: #374151;
    font-weight: 500;
  }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Add CSS for animations
const animationStyles = `
  .fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }
  
  .fade-in.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  .navbar.scrolled {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .navbar {
    transition: all 0.3s ease;
  }
  
  body.menu-open {
    overflow: hidden;
  }
`;

const animationStyleSheet = document.createElement('style');
animationStyleSheet.textContent = animationStyles;
document.head.appendChild(animationStyleSheet);

// Performance optimization
let ticking = false;

function updateOnScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      // Update scroll-based animations here
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', updateOnScroll, { passive: true });

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

function initAll() {
  // All initialization functions are already called above
  console.log('HotShoot Photography website initialized successfully!');
}