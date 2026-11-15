/**
 * HOTEL DOLLHOUSE — OFFICIAL LUXURY WEBSITE JAVASCRIPT
 * Location: Barrister Colony, Old Digha, West Bengal | Ph: +91 9433171430
 */

document.addEventListener('DOMContentLoaded', () => {
  initOwnerDropdown();
  initMadeByDropdown();
  initHeader();
  initReservationDates();
  initGalleryFilterAndModal();
  initSightseeingFilter();
  initFAQAccordion();
  initEnquiryForms();
});

// 0. Owner Click-Down Dropdown Menu
function initOwnerDropdown() {
  const dropdown = document.getElementById('ownerDropdown');
  const trigger = document.getElementById('ownerTrigger');
  const madeByDropdown = document.getElementById('madeByDropdown');

  if (dropdown && trigger) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (madeByDropdown) madeByDropdown.classList.remove('open');
      const isOpen = dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// 0b. Made By Click-Down Dropdown Menu
function initMadeByDropdown() {
  const dropdown = document.getElementById('madeByDropdown');
  const trigger = document.getElementById('madeByTrigger');
  const ownerDropdown = document.getElementById('ownerDropdown');

  if (dropdown && trigger) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (ownerDropdown) ownerDropdown.classList.remove('open');
      const isOpen = dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// 1. Sticky Header
function initHeader() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

// 2. Reservation Bar Initial Dates
function initReservationDates() {
  const checkinInput = document.getElementById('resCheckin');
  const checkoutInput = document.getElementById('resCheckout');

  if (checkinInput && checkoutInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (d) => d.toISOString().split('T')[0];
    checkinInput.value = formatDate(today);
    checkinInput.min = formatDate(today);
    checkoutInput.value = formatDate(tomorrow);
    checkoutInput.min = formatDate(tomorrow);

    checkinInput.addEventListener('change', () => {
      const selected = new Date(checkinInput.value);
      selected.setDate(selected.getDate() + 1);
      checkoutInput.min = formatDate(selected);
      if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
        checkoutInput.value = formatDate(selected);
      }
    });
  }

  // Handle Quick Reservation Bar Submit via WhatsApp
  const quickBar = document.getElementById('quickReservationForm');
  if (quickBar) {
    quickBar.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkin = document.getElementById('resCheckin').value;
      const checkout = document.getElementById('resCheckout').value;
      const guests = document.getElementById('resGuests').value;
      const room = document.getElementById('resRoom').value;

      const message = `Hello Hotel Dollhouse (Old Digha),\nI would like to check room availability and best rates:\n- Check-in: ${checkin}\n- Check-out: ${checkout}\n- Guests: ${guests}\n- Preferred Room: ${room}\n\nPlease confirm availability. Thank you!`;

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

      const message = `*NEW RESERVATION ENQUIRY — HOTEL DOLLHOUSE*\n\n` +
        `👤 *Guest Name:* ${name}\n` +
        `📞 *Contact Number:* ${phone}\n` +
        `✉️ *Email:* ${email}\n` +
        `📅 *Check-In:* ${checkin}\n` +
        `📅 *Check-Out:* ${checkout}\n` +
        `👥 *Guests:* ${guests}\n` +
        `🛏️ *Preferred Room:* ${room}\n` +
        (notes ? `📝 *Special Requests:* ${notes}\n\n` : `\n`) +
        `_Sent via Dollhouse Official Website._`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/919433171430?text=${encoded}`, '_blank');

      alert("Thank you! Opening WhatsApp to connect directly with Hotel Dollhouse's front desk for instant confirmation.");
    });
  }
}
