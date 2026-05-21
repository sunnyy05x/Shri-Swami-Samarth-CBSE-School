/* ===================================================================
   Shri Swami Samarth CBSE School — Interactive Scripts
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile Menu ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  
  // Close menu on link click
  navLinks?.querySelectorAll('a:not(.dropdown-trigger)').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Dropdown toggle for Mobile
  const dropdownTrigger = document.querySelector('.dropdown-trigger');
  const navDropdown = document.querySelector('.nav-dropdown');
  const arrow = dropdownTrigger?.querySelector('.arrow');
  
  dropdownTrigger?.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      navDropdown.classList.toggle('active');
      if (arrow) {
        arrow.style.transform = navDropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }
  });

  /* ---------- Navbar Scroll Effect ---------- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ---------- Active Nav Link ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const complianceAnchors = document.querySelectorAll('.compliance-nav-link');
  
  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navAnchors.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) a.classList.add('active');
        });
        complianceAnchors.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) a.classList.add('active');
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);

  /* ---------- Scroll-Reveal Animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    // Fallback: immediately make all reveal elements visible
    revealEls.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${i % 4 * 0.1}s`;
      revealObserver.observe(el);
    });
  }

  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  let countersStarted = false;
  
  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;
    
    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.count);
      const suffix = counter.dataset.suffix || '';
      const prefix = counter.dataset.prefix || '';
      const duration = 2000;
      const startTime = performance.now();
      
      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        
        if (Number.isInteger(target)) {
          counter.textContent = prefix + Math.round(current).toLocaleString() + suffix;
        } else {
          counter.textContent = prefix + current.toFixed(1) + suffix;
        }
        
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    if (!('IntersectionObserver' in window)) {
      animateCounters();
    } else {
      const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          statsObserver.unobserve(statsBar);
        }
      }, { threshold: 0.1 });
      statsObserver.observe(statsBar);
    }
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('active');
      
      // Close all
      document.querySelectorAll('.accordion-item').forEach(other => {
        other.classList.remove('active');
        other.querySelector('.accordion-body').style.maxHeight = null;
      });
      
      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Contact Form ---------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.querySelector('.form-success');
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    
    form.querySelectorAll('[required]').forEach(input => {
      input.classList.remove('error');
      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;
      }
    });
    
    const email = form.querySelector('#email');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('error');
      valid = false;
    }
    
    if (valid) {
      form.style.display = 'none';
      formSuccess.classList.add('show');
    }
  });

  /* ---------- Smooth scroll for CTA buttons ---------- */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Notice Board / Announcements ---------- */
  const noticeBoardBody = document.getElementById('notice-board-body');
  if (noticeBoardBody) {
    const sheetId = '1iHWHRZFAd4pts13cParkleL0HPgwjpWo0dK76IKURvs';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    fetch(url)
      .then(res => res.text())
      .then(text => {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start === -1 || end === -1) throw new Error('Invalid response format');
        
        let jsonString = text.substring(start, end + 1);
        let json;
        try {
          json = JSON.parse(jsonString);
        } catch (e) {
          // Fallback: Fix unquoted Date objects which Google API sometimes returns
          jsonString = jsonString.replace(/(?:new\s+)?Date\([\d,\s]+\)/g, '"$&"');
          json = JSON.parse(jsonString);
        }
        
        const rows = json.table.rows;
        
        noticeBoardBody.innerHTML = ''; // Clear loading text
        
        let hasNotices = false;

        rows.forEach(row => {
          if (!row.c || !row.c[1] || !row.c[1].v) return; // Skip empty rows (must have at least a Title)

          const dateStr = row.c[0] && row.c[0].v ? (row.c[0].f || row.c[0].v) : '';
          const titleStr = row.c[1].v;
          const descStr = row.c[2] && row.c[2].v ? row.c[2].v : '';

          const item = document.createElement('div');
          item.className = 'notice-item';
          
          let contentHtml = '';
          if (dateStr) {
            contentHtml += `<div class="notice-date">${dateStr}</div>`;
          }
          contentHtml += `<h4 class="notice-title">${titleStr}</h4>`;
          if (descStr) {
            contentHtml += `<p class="notice-desc">${descStr}</p>`;
          }
          
          item.innerHTML = contentHtml;
          noticeBoardBody.appendChild(item);
          hasNotices = true;
        });

        if (!hasNotices) {
          noticeBoardBody.innerHTML = '<div class="notice-item"><p class="notice-desc">No new announcements at this time.</p></div>';
        }
      })
      .catch(err => {
        console.error('Error fetching notices:', err);
        noticeBoardBody.innerHTML = '<div class="notice-item"><p class="notice-desc" style="color:var(--danger)">Failed to load announcements. Please try again later.</p></div>';
      });
  }

  /* ===================================================================
     SCHOOL GALLERY & LIGHTBOX INTERACTION
     =================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const galleryEmpty = document.querySelector('.gallery-empty');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;
      let visibleCount = 0;

      galleryCards.forEach(card => {
        const category = card.dataset.category;
        
        // Add fade-out transition
        card.classList.add('fade-out');
        card.classList.remove('fade-in');
        
        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            card.classList.remove('hidden');
            // Force reflow
            void card.offsetWidth;
            card.classList.add('fade-in');
            card.classList.remove('fade-out');
            visibleCount++;
          } else {
            card.classList.add('hidden');
          }
          
          // Toggle empty gallery section placeholder
          if (galleryEmpty) {
            if (visibleCount === 0) {
              galleryEmpty.style.display = 'block';
            } else {
              galleryEmpty.style.display = 'none';
            }
          }
        }, 300);
      });
    });
  });

  /* ---------- Lightbox Modal ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
  const lightboxNext = lightbox?.querySelector('.lightbox-next');
  const lightboxMedia = lightbox?.querySelector('.lightbox-media-wrapper');
  const lightboxCaption = lightbox?.querySelector('.lightbox-caption');

  let currentItems = []; // Keeps track of active items currently displayed in the filtered grid
  let currentIndex = 0;

  function getVisibleItems() {
    const items = [];
    document.querySelectorAll('.gallery-card:not(.hidden)').forEach(card => {
      const mediaWrap = card.querySelector('.gallery-media-wrapper');
      const title = card.querySelector('.gallery-card-title')?.textContent || '';
      const desc = card.querySelector('.gallery-card-desc')?.textContent || '';
      
      if (mediaWrap) {
        const img = mediaWrap.querySelector('img');
        const isVideo = card.classList.contains('video-card') || mediaWrap.dataset.videoSrc;
        const src = isVideo ? mediaWrap.dataset.videoSrc : img?.getAttribute('src');
        const poster = img?.getAttribute('src');

        items.push({ src, title, desc, isVideo, poster });
      }
    });
    return items;
  }

  function openLightbox(cardElement) {
    if (!lightbox) return;
    
    currentItems = getVisibleItems();
    const title = cardElement.querySelector('.gallery-card-title')?.textContent;
    
    currentIndex = currentItems.findIndex(item => item.title === title);
    if (currentIndex === -1) currentIndex = 0;

    updateLightboxMedia();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lightboxMedia) {
      const video = lightboxMedia.querySelector('video');
      if (video) video.pause();
      lightboxMedia.innerHTML = '';
    }
  }

  function updateLightboxMedia() {
    if (!lightboxMedia || !lightboxCaption || currentItems.length === 0) return;
    
    const item = currentItems[currentIndex];
    lightboxMedia.innerHTML = ''; // Clear current

    if (item.isVideo) {
      const videoEl = document.createElement('video');
      videoEl.src = item.src;
      videoEl.controls = true;
      videoEl.autoplay = true;
      videoEl.loop = true;
      videoEl.style.maxWidth = '100%';
      videoEl.style.maxHeight = '75vh';
      if (item.poster) videoEl.poster = item.poster;
      lightboxMedia.appendChild(videoEl);
    } else {
      const imgEl = document.createElement('img');
      imgEl.src = item.src;
      imgEl.alt = item.title;
      imgEl.style.maxWidth = '100%';
      imgEl.style.maxHeight = '75vh';
      imgEl.style.objectFit = 'contain';
      lightboxMedia.appendChild(imgEl);
    }

    // Update caption
    lightboxCaption.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    `;

    // Hide/show navigation buttons if only 1 item is visible
    if (currentItems.length <= 1) {
      if (lightboxPrev) lightboxPrev.style.display = 'none';
      if (lightboxNext) lightboxNext.style.display = 'none';
    } else {
      if (lightboxPrev) lightboxPrev.style.display = 'flex';
      if (lightboxNext) lightboxNext.style.display = 'flex';
    }
  }

  function navigateLightbox(direction) {
    if (currentItems.length <= 1) return;
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % currentItems.length;
    } else {
      currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    }
    updateLightboxMedia();
  }

  // Attach click listeners to cards' media wrappers
  galleryCards.forEach(card => {
    const mediaWrap = card.querySelector('.gallery-media-wrapper');
    mediaWrap?.addEventListener('click', () => {
      openLightbox(card);
    });
  });

  // Close event triggers
  lightboxClose?.addEventListener('click', closeLightbox);
  
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox('prev');
  });
  
  lightboxNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox('next');
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox('next');
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
  });

});
