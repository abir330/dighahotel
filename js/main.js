/**
 * HOTEL DOLLHOUSE — OFFICIAL LUXURY WEBSITE JAVASCRIPT
 * Location: Barrister Colony, Old Digha, West Bengal | Ph: +91 9433171430
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveWeather();
  initHeader();
  initHeroMotion();
  initLanguageToggle();
  initReservationDates();
  initGalleryFilterAndModal();
  initSightseeingFilter();
  initReviews();
  initPolicyAccordion();
  initFAQAccordion();
  initEnquiryForms();
});

// 0. Live Coastal Weather via Open-Meteo (Old Digha: Lat 21.6278, Lon 87.5323)
async function initLiveWeather() {
  const weatherEl = document.getElementById('liveWeatherText');
  if (!weatherEl) return;

  const wmoWeather = {
    0: 'Sunny Beach',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Gentle Sea Breeze',
    45: 'Coastal Fog',
    48: 'Foggy Breeze',
    51: 'Light Coastal Drizzle',
    53: 'Passing Drizzle',
    55: 'Dense Drizzle',
    61: 'Light Ocean Rain',
    63: 'Moderate Rain',
    65: 'Heavy Coastal Rain',
    80: 'Passing Showers',
    81: 'Coastal Showers',
    82: 'Tropical Downpour',
    95: 'Thunderstorm',
    96: 'Storm with Hail'
  };

  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=21.6278&longitude=87.5323&current=temperature_2m,weather_code');
    if (!res.ok) throw new Error('Weather API network error');
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const condition = wmoWeather[code] || 'Gentle Sea Breeze';
    weatherEl.textContent = `${temp}°C · ${condition}`;
  } catch (err) {
    weatherEl.textContent = '28°C · Gentle Sea Breeze';
  }
}

// 1. Sticky Header & Mobile Navigation
function initHeader() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  }
}

// Defensive Security Helper: HTML Entity Escaping against DOM-based XSS
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Date Validation & Netlify Forms Helpers
function setupDateValidation(checkinEl, checkoutEl) {
  if (!checkinEl || !checkoutEl) return;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (d) => d.toISOString().split('T')[0];
  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);

  checkinEl.min = todayStr;
  checkoutEl.min = tomorrowStr;

  if (!checkinEl.value) checkinEl.value = todayStr;
  if (!checkoutEl.value) checkoutEl.value = tomorrowStr;

  checkinEl.addEventListener('change', () => {
    const checkinDate = new Date(checkinEl.value);
    if (isNaN(checkinDate.getTime())) return;

    const minCheckout = new Date(checkinDate);
    minCheckout.setDate(minCheckout.getDate() + 1);
    const minCheckoutStr = formatDate(minCheckout);
    checkoutEl.min = minCheckoutStr;

    if (!checkoutEl.value || new Date(checkoutEl.value) <= checkinDate) {
      checkoutEl.value = minCheckoutStr;
    }
  });

  checkoutEl.addEventListener('change', () => {
    if (checkinEl.value && new Date(checkoutEl.value) <= new Date(checkinEl.value)) {
      const minCheckout = new Date(checkinEl.value);
      minCheckout.setDate(minCheckout.getDate() + 1);
      checkoutEl.value = formatDate(minCheckout);
    }
  });
}

function validateDates(checkinVal, checkoutVal) {
  const todayStr = new Date().toISOString().split('T')[0];
  if (!checkinVal || checkinVal < todayStr) {
    alert('Please select a valid Check-In date (today or in the future).');
    return false;
  }
  if (!checkoutVal || checkoutVal <= checkinVal) {
    alert('Check-Out date must be after Check-In date.');
    return false;
  }
  return true;
}

async function postToNetlify(form) {
  try {
    const formData = new FormData(form);
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });
  } catch (err) {
    console.warn('Netlify form submission sync:', err);
  }
}

// 2. Reservation Bar Initial Dates & WhatsApp + Netlify Form Submit
function initReservationDates() {
  const checkinInput = document.getElementById('resCheckin');
  const checkoutInput = document.getElementById('resCheckout');
  setupDateValidation(checkinInput, checkoutInput);

  const quickBar = document.getElementById('quickReservationForm');
  if (quickBar) {
    quickBar.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkin = document.getElementById('resCheckin').value;
      const checkout = document.getElementById('resCheckout').value;
      const guests = document.getElementById('resGuests').value;
      const room = document.getElementById('resRoom').value;

      if (!validateDates(checkin, checkout)) return;

      const message = `*HOTEL DOLLHOUSE — DIRECT RESERVATION ENQUIRY*\n` +
        `📍 *Location:* Barrister Colony, Old Digha\n` +
        `📅 *Check-In:* ${checkin}\n` +
        `📅 *Check-Out:* ${checkout}\n` +
        `👥 *Guests:* ${guests}\n` +
        `🛏️ *Preferred Room:* ${room}\n\n` +
        `Please confirm availability and direct booking rate. Thank you!`;

      // Post to Netlify forms asynchronously
      postToNetlify(quickBar);

      // Open WhatsApp directly with opener isolation
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/919433171430?text=${encoded}`, '_blank', 'noopener,noreferrer');
    });
  }
}

// 3. Sightseeing 8 Default + Show All 20 Filter
function initSightseeingFilter() {
  const tabs = document.querySelectorAll('.sightseeing-nav-tabs .tab-btn');
  const cards = Array.from(document.querySelectorAll('.sightseeing-card'));
  const toggleBtn = document.getElementById('toggleAttractionsBtn');
  const toggleText = document.getElementById('toggleAttractionsText');

  let currentCategory = 'all';
  let isExpanded = false;
  const DEFAULT_LIMIT = 8;

  function renderCards() {
    let matchingCards = [];
    cards.forEach(card => {
      const match = currentCategory === 'all' || card.dataset.category === currentCategory;
      if (match) {
        matchingCards.push(card);
      } else {
        card.style.display = 'none';
        card.classList.remove('collapsed-hidden');
      }
    });

    matchingCards.forEach((card, index) => {
      card.style.display = 'flex';
      if (!isExpanded && index >= DEFAULT_LIMIT) {
        card.classList.add('collapsed-hidden');
      } else {
        card.classList.remove('collapsed-hidden');
      }
    });

    if (toggleBtn) {
      if (matchingCards.length <= DEFAULT_LIMIT) {
        toggleBtn.style.display = 'none';
      } else {
        toggleBtn.style.display = 'inline-flex';
        toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        if (toggleText) {
          toggleText.textContent = isExpanded 
            ? 'Show Fewer Attractions' 
            : `Show All ${matchingCards.length} Attractions`;
        }
      }
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category || 'all';
      renderCards();
    });
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      renderCards();
    });
  }

  // Initial render with first 8
  renderCards();
}

// 4. Bento Photo Gallery & Accessible Lightbox (Swipe, Arrow keys, Esc, Focus Trap)
function initGalleryFilterAndModal() {
  const filterTabs = document.querySelectorAll('.gallery-filter-tabs .tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImage');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  let activeList = Array.from(galleryItems);
  let currentIndex = 0;
  let lastActiveElement = null;

  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      activeList = [];

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          activeList.push(item);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Modal open on click and keyboard Enter/Space
  galleryItems.forEach(item => {
    const triggerOpen = () => {
      currentIndex = activeList.indexOf(item);
      if (currentIndex === -1) currentIndex = 0;
      openModal();
    };

    item.addEventListener('click', triggerOpen);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerOpen();
      }
    });
  });

  function openModal() {
    if (!activeList.length) return;
    lastActiveElement = document.activeElement;
    const targetItem = activeList[currentIndex];
    const fullSrc = targetItem.dataset.full || targetItem.querySelector('img').src;
    const caption = targetItem.dataset.caption || '';

    modalImg.src = fullSrc;
    modalCaption.textContent = caption;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus close button initially
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  function showNext() {
    if (!activeList.length) return;
    currentIndex = (currentIndex + 1) % activeList.length;
    openModal();
  }

  function showPrev() {
    if (!activeList.length) return;
    currentIndex = (currentIndex - 1 + activeList.length) % activeList.length;
    openModal();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Touch Swipe Support
    let touchStartX = 0;
    let touchStartY = 0;
    modal.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length === 1) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Ensure horizontal swipe dominant
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
          if (deltaX < 0) {
            showNext();
          } else {
            showPrev();
          }
        }
      }
    }, { passive: true });
  }

  // Keyboard navigation & Focus Trap
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      showNext();
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showPrev();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = [closeBtn, prevBtn, nextBtn].filter(Boolean);
      if (!focusable.length) return;

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });
}

// 4.2 Hero Video Prefers-Reduced-Motion Support
function initHeroMotion() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleMotionChange = (e) => {
    if (e.matches) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  };

  handleMotionChange(motionQuery);
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', handleMotionChange);
  }
}

// 4.3 EN / বাংলা Dynamic Language Toggle
function initLanguageToggle() {
  const toggleBtn = document.getElementById('langToggleBtn');
  if (!toggleBtn) return;

  const pills = toggleBtn.querySelectorAll('.lang-pill');

  const translations = {
    en: {
      'nav-home': 'Home',
      'nav-about': 'About',
      'nav-rooms': 'Rooms',
      'nav-amenities': 'Amenities',
      'nav-guide': 'Digha Guide',
      'nav-gallery': 'Gallery',
      'nav-reviews': 'Reviews',
      'nav-policies': 'Policies',
      'nav-location': 'Location',
      'nav-contact': 'Contact',
      'cta-contact': 'Contact Us',
      'hero-eyebrow': 'Boutique Coastal Retreat · Old Digha',
      'hero-title': 'Experience Unhurried Hospitality by the Bay of Bengal',
      'hero-subtitle': 'Nestled within the serene residential canopy of Barrister Colony, Hotel Dollhouse offers air-conditioned comfort, handcrafted woodwork, and ambient designer ceilings — just 2 minutes from Old Digha\'s sea beach.',
      'badge-beach': '2 Min Walk to Sea Beach',
      'badge-station': '5 Min to Railway Station',
      'badge-couples': 'Family & Couple Friendly',
      'badge-owner': 'Direct Owner Booking',
      'btn-explore': 'Explore Rooms',
      'btn-call': 'Direct Call +91 9433171430',
      'about-eyebrow': 'Discover Hotel Dollhouse',
      'about-title': 'A Peaceful Haven in Old Digha\'s Barrister Colony',
      'rooms-eyebrow': 'Accommodations & Comfort',
      'rooms-title': 'Rooms Crafted for Restful Coastal Getaways',
      'reviews-eyebrow': 'Guest Impressions',
      'reviews-title': 'Loved by Families & Travelers in Old Digha',
      'policies-eyebrow': 'Stay Guidelines & Transparency',
      'policies-title': 'Hotel Policies & Stay Guidelines',
      'contact-eyebrow': 'Connect Directly',
      'contact-title': 'Plan Your Digha Holiday with Us'
    },
    bn: {
      'nav-home': 'নীড়',
      'nav-about': 'পরিচিতি',
      'nav-rooms': 'রুমসমূহ',
      'nav-amenities': 'সুবিধাসমূহ',
      'nav-guide': 'দীঘা গাইড',
      'nav-gallery': 'গ্যালারি',
      'nav-reviews': 'রিভিউ',
      'nav-policies': 'নিয়মাবলী',
      'nav-location': 'লোকেশন',
      'nav-contact': 'যোগাযোগ',
      'cta-contact': 'যোগাযোগ',
      'hero-eyebrow': 'বুটিক কোস্টাল রিট্রিট · ওল্ড দীঘা',
      'hero-title': 'বঙ্গোপসাগরের কোল ঘেঁষে শান্ত ও মনোরম অবকাশ',
      'hero-subtitle': 'ব্যারিস্টার কলোনির শান্ত ছায়াঘেরা পরিবেশে হোটেল ডলহাউস দিচ্ছে এসি স্বাচ্ছন্দ্য, কাঠের কারুকার্য ও আধুনিক সিলিং—ওল্ড দীঘা সমুদ্র সৈকত থেকে মাত্র ২ মিনিটের হাঁটা পথ।',
      'badge-beach': '২ মিনিটে সমুদ্র সৈকত',
      'badge-station': '৫ মিনিটে দীঘা স্টেশন',
      'badge-couples': 'পরিবার ও কাপল ফ্রেন্ডলি',
      'badge-owner': 'সরাসরি মালিকের সাথে বুকিং',
      'btn-explore': 'রুম দেখুন',
      'btn-call': 'সরাসরি কল +91 9433171430',
      'about-eyebrow': 'হোটেল ডলহাউসের সাথে পরিচিত হোন',
      'about-title': 'ওল্ড দীঘার ব্যারিস্টার কলোনিতে শান্ত শান্তির নীড়',
      'rooms-eyebrow': 'থাকার ব্যবস্থা ও সুযোগ-সুবিধা',
      'rooms-title': 'আরামদায়ক উপকূলীয় ছুটির জন্য সাজানো রুম',
      'reviews-eyebrow': 'অতিথিদের মতামত',
      'reviews-title': 'ওল্ড দীঘায় পরিবার ও ভ্রমণকারীদের বিশ্বস্ত ঠিকানা',
      'policies-eyebrow': 'নিয়মাবলী ও স্বচ্ছতা',
      'policies-title': 'হোটেল পলিসি ও অতিথিদের গাইডলাইন',
      'contact-eyebrow': 'সরাসরি কথা বলুন',
      'contact-title': 'হোটেল ডলহাউসে আপনার বুকিং নিশ্চিত করুন'
    }
  };

  let currentLang = localStorage.getItem('dollhouse_lang') || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('dollhouse_lang', lang);
    document.documentElement.lang = lang;

    pills.forEach(p => {
      p.classList.toggle('active', p.dataset.lang === lang);
    });

    const dict = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        const svg = el.querySelector('svg');
        if (svg) {
          el.innerHTML = '';
          el.appendChild(svg);
          el.appendChild(document.createTextNode(' ' + dict[key]));
        } else {
          el.textContent = dict[key];
        }
      }
    });
  }

  toggleBtn.addEventListener('click', () => {
    applyLanguage(currentLang === 'en' ? 'bn' : 'en');
  });

  if (currentLang !== 'en') {
    applyLanguage(currentLang);
  }
}

// 4.5 Guest Reviews Dynamic Loader
async function initReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  try {
    const res = await fetch('data/reviews.json');
    if (!res.ok) return;
    const reviews = await res.json();
    if (!Array.isArray(reviews) || reviews.length === 0) return;

    const html = reviews.map(rev => {
      const name = escapeHTML(rev.name || '');
      const initials = name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
      const rating = Number.isInteger(rev.rating) ? Math.min(Math.max(rev.rating, 1), 5) : 5;
      const stars = '★'.repeat(rating);
      const title = escapeHTML(rev.title || '');
      const comment = escapeHTML(rev.comment || '');
      const room = escapeHTML(rev.room || '');
      const location = escapeHTML(rev.location || '');
      const date = escapeHTML(rev.date || '');

      return `
        <article class="review-card">
          <div class="review-header">
            <div class="review-stars">${stars}</div>
            <span class="review-date">${date}</span>
          </div>
          <h3 class="review-title">${title}</h3>
          <p class="review-comment">“${comment}”</p>
          <div class="review-author-wrap">
            <div class="review-avatar">${initials}</div>
            <div class="review-author-meta">
              <span class="review-author-name">${name}</span>
              <span class="review-author-room">${room} · ${location}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    container.innerHTML = html;
  } catch (err) {
    console.warn('Reviews loaded from semantic fallback:', err);
  }
}

// 4.6 Stay Policies Accordion
function initPolicyAccordion() {
  const policyItems = document.querySelectorAll('.policy-item');
  if (!policyItems.length) return;

  policyItems.forEach(item => {
    const questionBtn = item.querySelector('.policy-question');
    const answer = item.querySelector('.policy-answer');
    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      policyItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.policy-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
        const otherBtn = otherItem.querySelector('.policy-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// 5. FAQ Accordion
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// 6. Contact & Full Enquiry Form Handler
function initEnquiryForms() {
  const checkinInput = document.getElementById('enqCheckin');
  const checkoutInput = document.getElementById('enqCheckout');
  setupDateValidation(checkinInput, checkoutInput);

  const form = document.getElementById('fullEnquiryForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('enqName').value.trim();
      const phone = document.getElementById('enqPhone').value.trim();
      const email = document.getElementById('enqEmail').value.trim() || 'Not specified';
      const checkin = document.getElementById('enqCheckin').value;
      const checkout = document.getElementById('enqCheckout').value;
      const guests = document.getElementById('enqGuests').value;
      const room = document.getElementById('enqRoom').value;
      const notes = document.getElementById('enqNotes').value.trim();

      if (!validateDates(checkin, checkout)) return;

      const message = `*NEW RESERVATION ENQUIRY — HOTEL DOLLHOUSE*\n\n` +
        `👤 *Guest Name:* ${name}\n` +
        `📞 *Contact Number:* ${phone}\n` +
        `✉️ *Email:* ${email}\n` +
        `📅 *Check-In:* ${checkin}\n` +
        `📅 *Check-Out:* ${checkout}\n` +
        `👥 *Guests:* ${guests}\n` +
        `🛏️ *Preferred Room:* ${room}\n` +
        (notes ? `📝 *Special Requests:* ${notes}\n\n` : `\n`) +
        `_Sent via Hotel Dollhouse Official Website._`;

      // Post to Netlify forms in background
      postToNetlify(form);

      // Open WhatsApp directly with prefilled message and opener isolation
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/919433171430?text=${encoded}`, '_blank', 'noopener,noreferrer');
    });
  }
}
