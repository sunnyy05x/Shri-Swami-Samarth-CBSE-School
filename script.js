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
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Navbar Scroll Effect ---------- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ---------- Active Nav Link ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  
  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navAnchors.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) a.classList.add('active');
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);

  /* ---------- Scroll-Reveal Animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${i % 4 * 0.1}s`;
    revealObserver.observe(el);
  });

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
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.unobserve(statsBar);
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsBar);
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
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
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
        // Strip the Google visualization wrapper: "/*O_o*/\ngoogle.visualization.Query.setResponse({" ... "});"
        // It starts with "google.visualization.Query.setResponse(" and ends with ");"
        // Wait, text.substring(47) is standard, but a safer regex is:
        const jsonString = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/)[1];
        const json = JSON.parse(jsonString);
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

});
