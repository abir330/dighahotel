/**
 * HOTEL DOLLHOUSE — OFFICIAL LUXURY WEBSITE JAVASCRIPT
 * Location: Barrister Colony, Old Digha, West Bengal | Ph: +91 9433171430
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveWeather();
  initHeader();
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

      // Open WhatsApp directly
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/919433171430?text=${encoded}`, '_blank');
    });
  }
}

// 3. Sightseeing Tab Filter
function initSightseeingFilter() {
  const tabs = document.querySelectorAll('.sightseeing-nav-tabs .tab-btn');
  const cards = document.querySelectorAll('.sightseeing-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 4. Photo Gallery Filter & Lightbox Modal
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

  // Modal open
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      currentIndex = activeList.indexOf(item);
      if (currentIndex === -1) currentIndex = 0;
      openModal();
    });
  });

  function openModal() {
    if (!activeList.length) return;
    const targetItem = activeList[currentIndex];
    const fullSrc = targetItem.dataset.full || targetItem.querySelector('img').src;
    const caption = targetItem.dataset.caption || '';

    modalImg.src = fullSrc;
    modalCaption.textContent = caption;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % activeList.length;
    openModal();
  }

  function showPrev() {
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
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
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
      const initials = rev.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
      const stars = '★'.repeat(rev.rating || 5);
      return `
        <article class="review-card">
          <div class="review-header">
            <div class="review-stars">${stars}</div>
            <span class="review-date">${rev.date}</span>
          </div>
          <h3 class="review-title">${rev.title}</h3>
          <p class="review-comment">“${rev.comment}”</p>
          <div class="review-author-wrap">
            <div class="review-avatar">${initials}</div>
            <div class="review-author-meta">
              <span class="review-author-name">${rev.name}</span>
              <span class="review-author-room">${rev.room} · ${rev.location}</span>
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

      // Open WhatsApp directly with prefilled message
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/919433171430?text=${encoded}`, '_blank');
    });
  }
}
