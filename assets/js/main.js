(function() {
  "use strict";

  // Funções de Scroll e Nav (Mantidas)
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }
  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', function() {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });
  }

  /**
   * Isotope e Lógica "Ver Mais"
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    const container = isotopeItem.querySelector('.isotope-container');

    // Inicialização segura
    imagesLoaded(container, function() {
      initIsotope = new Isotope(container, {
        itemSelector: '.portfolio-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort,
        percentPosition: true, // Crucial para layouts responsivos
        masonry: {
          columnWidth: '.portfolio-item'
        }
      });
    });

    const loadMoreBtn = document.getElementById('loadMore');
    const loadMoreContainer = document.getElementById('loadMoreContainer');

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function() {
        const hiddenItems = document.querySelectorAll('.portfolio-hidden');
        
        // 1. Remove o botão para não atrapalhar o grid
        if (loadMoreContainer) {
          loadMoreContainer.style.setProperty('display', 'none', 'important');
        }

        // 2. Revela as fotos
        hiddenItems.forEach(item => {
          item.classList.remove('d-none');
          item.classList.remove('portfolio-hidden');
        });

        // 3. Força o Isotope a esperar o render do navegador
        imagesLoaded(container, function() {
          initIsotope.reloadItems(); // Lê os novos elementos
          
          // Primeiro ajuste imediato
          initIsotope.layout();

          // Segundo ajuste após um curto delay (resolve o "embolado")
          setTimeout(() => {
            initIsotope.arrange();
          }, 300);
        });
      });
    }

    // Filtros
    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({ filter: this.getAttribute('data-filter') });
      });
    });
  });

  // Outros inits
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') AOS.init({ duration: 600, once: true });
    const preloader = document.querySelector('#preloader');
    if (preloader) preloader.remove();
  });

  const glightbox = GLightbox({ selector: '.glightbox' });
})();

