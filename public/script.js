// Harry's Personal Training - JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Set copyright year
  const copyrightEl = document.getElementById('copyright');
  if (copyrightEl) {
    copyrightEl.textContent = `© ${new Date().getFullYear()} Harry's Personal Training. All rights reserved.`;
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      const isOpen = !mobileMenu.classList.contains('hidden');

      mobileMenu.classList.toggle('hidden');

      // Animate hamburger
      const lines = mobileMenuBtn.querySelectorAll('span');
      lines.forEach(line => {
        if (isOpen) {
          line.classList.remove('active');
        } else {
          line.classList.add('active');
        }
      });
    });

    // Close mobile menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
        const lines = mobileMenuBtn.querySelectorAll('span');
        lines.forEach(line => line.classList.remove('active'));
      });
    });
  }

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        navbar.classList.add('bg-background/95', 'backdrop-blur-sm');
      } else {
        navbar.classList.remove('bg-background/95', 'backdrop-blur-sm');
      }
    });
  }

  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'SENDING...';
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(function() {
        alert("Message sent successfully! We'll get back to you within 24 hours.");
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }

  // Consultation form handling
  const consultationForm = document.getElementById('consultation-form');
  if (consultationForm) {
    // Handle injury details visibility
    const hasInjuriesRadios = consultationForm.querySelectorAll('input[name="hasInjuries"]');
    const injuryDetailsContainer = document.getElementById('injury-details-container');

    if (hasInjuriesRadios.length && injuryDetailsContainer) {
      hasInjuriesRadios.forEach(radio => {
        radio.addEventListener('change', function() {
          if (this.value === 'yes') {
            injuryDetailsContainer.classList.remove('hidden');
          } else {
            injuryDetailsContainer.classList.add('hidden');
          }
        });
      });
    }

    consultationForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'BOOKING CONSULTATION...';
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(function() {
        alert("Consultation booked successfully! We'll contact you within 24 hours to confirm your appointment.");
        consultationForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Reset injury details visibility
        if (injuryDetailsContainer) {
          injuryDetailsContainer.classList.add('hidden');
        }
      }, 2000);
    });
  }

  // Booking form handling (book-consultation page)
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'SENDING REQUEST...';
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(function() {
        alert("Consultation request received! I'll be in touch within 24 hours to confirm your slot.");
        bookingForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
});
