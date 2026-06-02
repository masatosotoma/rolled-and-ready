/**
 * ROLLED AND READY (一碗手擀面) - INTERACTIVE SCRIPTING
 * Core website behavior and interactive animations
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. STATEFUL MULTI-LANGUAGE SYSTEM
  // ==========================================================================
  const htmlElement = document.documentElement;
  const langSwitchBtn = document.getElementById('lang-switch');
  
  // Set default language or fetch persisted language preference
  const initLanguage = () => {
    const savedLang = localStorage.getItem('rolled_ready_lang');
    if (savedLang) {
      htmlElement.setAttribute('lang', savedLang);
    } else {
      // Auto-detect Chinese language locale, otherwise default to English
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith('zh')) {
        htmlElement.setAttribute('lang', 'zh');
      } else {
        htmlElement.setAttribute('lang', 'en');
      }
    }
  };

  // Toggle language and persist in local storage
  const toggleLanguage = () => {
    const currentLang = htmlElement.getAttribute('lang');
    const newLang = currentLang === 'en' ? 'zh' : 'en';
    
    htmlElement.setAttribute('lang', newLang);
    localStorage.setItem('rolled_ready_lang', newLang);
    
    // Add subtle visual feedback transition on content swap
    document.body.style.opacity = '0.9';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  };

  if (langSwitchBtn) {
    langSwitchBtn.addEventListener('click', toggleLanguage);
  }
  
  initLanguage();


  // ==========================================================================
  // 2. STICKY HEADER & SCROLL TRANSFORMATIONS
  // ==========================================================================
  const header = document.getElementById('main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initially in case page loaded scrolled down


  // ==========================================================================
  // 3. MOBILE MENU OVERLAY TRANSITIONS
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileNav = () => {
    const isActive = mobileNav.classList.contains('active');
    
    if (isActive) {
      mobileNav.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
      document.body.style.overflow = ''; // Unlock background scrolling
    } else {
      mobileNav.classList.add('active');
      mobileToggle.innerHTML = '<i class="fa-solid fa-xmark text-xl"></i>';
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    }
  };

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', toggleMobileNav);
  }

  // Close navigation when any link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      if (mobileToggle) {
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
      }
      document.body.style.overflow = '';
    });
  });


  // ==========================================================================
  // 4. MENU CATEGORY TAB FILTERING
  // ==========================================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  const filterMenu = (category) => {
    menuCards.forEach(card => {
      const cardCategory = card.getAttribute('data-item-category');
      
      if (category === 'all' || cardCategory === category) {
        card.classList.remove('hidden');
        // Re-trigger scroll reveal transitions for visible elements
        setTimeout(() => {
          card.classList.add('active');
        }, 50);
      } else {
        card.classList.add('hidden');
      }
    });
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active states from other buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      
      // Add active state to clicked button
      btn.classList.add('active');
      
      // Filter menu items by targeted category
      const targetCategory = btn.getAttribute('data-category');
      filterMenu(targetCategory);
    });
  });

  // Filter for 'noodles' as standard category on load
  filterMenu('noodles');


  // ==========================================================================
  // 5. GUEST RESERVATION FORM AND DRAWER SUBMISSION
  // ==========================================================================
  const bookingForm = document.getElementById('booking-form');
  const successDrawer = document.getElementById('booking-success');
  const resetBookingBtn = document.getElementById('btn-reset-booking');

  // Set today's date as standard placeholder in datepicker
  const dateInput = document.getElementById('book-date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;
    
    dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // Handle Reservation Submission with animations and validation
  if (bookingForm && successDrawer) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Mock Client-Side Validation check success
      const name = document.getElementById('book-name').value.trim();
      const phone = document.getElementById('book-phone').value.trim();
      
      if (name !== '' && phone !== '') {
        // Slide up the success confirmation modal
        successDrawer.classList.add('show');
      }
    });
  }

  // Dismiss Drawer and reset Form fields
  if (resetBookingBtn && successDrawer && bookingForm) {
    resetBookingBtn.addEventListener('click', () => {
      successDrawer.classList.remove('show');
      bookingForm.reset();
      
      // Reset today's date placeholder
      if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;
        dateInput.value = `${yyyy}-${mm}-${dd}`;
      }
    });
  }


  // ==========================================================================
  // 6. SCROLL REVEAL TRIGGERS (Intersection Observer API)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    // Elegant check using modern Intersection Observer
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null, // Viewport
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Stop observing once triggered
          }
        });
      }, observerOptions);

      revealElements.forEach(el => {
        observer.observe(el);
      });
    } else {
      // Fallback in case of legacy browsers: immediately display elements
      revealElements.forEach(el => el.classList.add('active'));
    }
  };

  revealOnScroll();

});
