(function () {
  const root = document.querySelector('[data-directory-root]');
  if (!root) {
    return;
  }

  const searchInput = root.querySelector('#search-input');
  const cards = Array.from(root.querySelectorAll('.business-card'));
  const filterPills = Array.from(root.querySelectorAll('.filter-pill'));
  const countEl = root.querySelector('#directory-count');
  const noResults = root.querySelector('#no-results');
  let currentCategory = 'all';

  function normalize(value) {
    return (value || '').toLowerCase().trim();
  }

  function filterCards() {
    const searchTerm = normalize(searchInput.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const name = normalize(card.dataset.name);
      const category = normalize(card.dataset.category);
      const contact = normalize(card.dataset.contact);
      const matchesSearch = !searchTerm || name.includes(searchTerm) || category.includes(searchTerm) || contact.includes(searchTerm);
      const matchesCategory = currentCategory === 'all' || category === currentCategory;
      const isVisible = matchesSearch && matchesCategory;

      card.classList.toggle('hidden', !isVisible);
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (countEl) {
      countEl.textContent = visibleCount;
    }

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  }

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');
  if (initialQuery) {
    searchInput.value = initialQuery;
  }

  searchInput.addEventListener('input', filterCards);

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((button) => button.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = normalize(pill.dataset.category);
      filterCards();
    });
  });

  filterCards();
})();
