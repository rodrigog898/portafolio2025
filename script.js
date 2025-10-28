const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const html = document.documentElement;

let isDark = true;
html.classList.add('dark');

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    html.classList.toggle('dark', isDark);
    
    if (isDark) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
});

// Intersection Observer for animations
const sections = document.querySelectorAll('section, header');
const navDots = document.querySelectorAll('.nav-dot');

const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -20% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            
            const sectionId = entry.target.id;
            navDots.forEach(dot => {
                if (dot.dataset.section === sectionId) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Navigation dots click handlers
navDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const sectionId = dot.dataset.section;
        const section = document.getElementById(sectionId);
        section.scrollIntoView({ behavior: 'smooth' });
    });
});


// ===== Modal + Carrusel de Proyectos =====
(function () {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const dialog = modal.querySelector('.modal-dialog');
  const btnClose = modal.querySelector('.modal-close');
  const imgEl = modal.querySelector('#carouselImage');
  const dotsEl = modal.querySelector('.carousel-dots');
  const titleEl = modal.querySelector('#modalTitle');
  const descEl = modal.querySelector('#modalDesc');
  const linkEl = modal.querySelector('#modalLink');
  const prevBtn = modal.querySelector('.carousel-nav.prev');
  const nextBtn = modal.querySelector('.carousel-nav.next');

  let images = [];
  let index = 0;

  function parseImages(value) {
    if (!value) return [];
    try {
      // Soporta JSON ['a.png','b.png']
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {
      // Soporta "a.png,b.png,c.png"
      return value.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }

  function renderImage() {
    if (!images.length) return;
    imgEl.src = images[index];
    imgEl.alt = `${titleEl.textContent} - imagen ${index + 1} de ${images.length}`;
    // Dots
    dotsEl.innerHTML = '';
    images.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      if (i === index) b.classList.add('active');
      b.addEventListener('click', () => { index = i; renderImage(); });
      dotsEl.appendChild(b);
    });
  }

  function openModalFromCard(card) {
    const title = card.dataset.title || card.querySelector('h3')?.textContent?.trim() || 'Proyecto';
    const desc = card.dataset.desc || card.querySelector('p')?.textContent?.trim() || '';
    const url = card.dataset.url || '#';
    images = parseImages(card.dataset.images);
    if (!images.length) images = ['img/placeholder.png'];

    titleEl.textContent = title;
    descEl.textContent = desc;
    linkEl.href = url;

    index = 0;
    renderImage();

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    // Foco accesible
    btnClose.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  // Navegación
  function next() {
    if (!images.length) return;
    index = (index + 1) % images.length;
    renderImage();
  }
  function prev() {
    if (!images.length) return;
    index = (index - 1 + images.length) % images.length;
    renderImage();
  }

  // Listeners globales
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  btnClose.addEventListener('click', closeModal);

  // Cerrar al hacer click fuera del diálogo
  modal.addEventListener('click', (e) => {
    if (!dialog.contains(e.target)) closeModal();
  });

  // Teclado
  window.addEventListener('keydown', (e) => {
    if (modal.classList.contains('open')) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
  });

  // Adjuntar a todas las cards
  document.querySelectorAll('.thought-card').forEach(card => {
    card.addEventListener('click', () => openModalFromCard(card));
    // Si quieres que solo el “Ver Más” abra el modal, usa en cambio:
    // card.querySelector('.read-more')?.addEventListener('click', (e) => {
    //   e.stopPropagation();
    //   openModalFromCard(card);
    // });
  });
})();
