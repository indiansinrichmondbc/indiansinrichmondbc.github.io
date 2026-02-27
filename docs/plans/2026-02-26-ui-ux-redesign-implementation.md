# UI/UX Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Indians in Richmond BC directory from table-based to card-based layout with search, filtering, and mobile responsiveness.

**Architecture:** Convert HTML table rows to card grid with CSS Grid, add vanilla JS for search/filter, use CSS variables for theming.

**Tech Stack:** Jekyll, SCSS, vanilla JavaScript, CSS Grid, CSS Custom Properties

---

### Task 1: Update SCSS styles with new design system

**Files:**
- Modify: `assets/css/style.scss`

**Step 1: Read existing style file**

Read: `assets/css/style.scss`

**Step 2: Add CSS variables and new styles**

Replace the content with:
```scss
---
---

:root {
  --primary: #1a365d;
  --primary-dark: #122744;
  --accent: #ed8936;
  --bg-light: #f7fafc;
  --card-bg: #ffffff;
  --text-primary: #2d3748;
  --text-muted: #718096;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --radius: 8px;
}

body {
  background: var(--bg-light);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.intro h3 {
  color: var(--primary);
  font-size: 28px;
  margin-bottom: 20px;
}

/* Search Bar */
.search-container {
  margin-bottom: 20px;
}

#search-input {
  width: 100%;
  padding: 14px 20px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: var(--radius);
  transition: border-color 0.2s, box-shadow 0.2s;
}

#search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
}

/* Category Filter Pills */
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.filter-pill {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: #e2e8f0;
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-pill:hover {
  background: #cbd5e0;
}

.filter-pill.active {
  background: var(--primary);
  color: white;
}

/* Card Grid */
.business-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

@media (max-width: 1023px) {
  .business-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .business-grid {
    grid-template-columns: 1fr;
  }
}

/* Business Card */
.business-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.business-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.business-card.hidden {
  display: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.business-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.category-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: #edf2f7;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Category badge colors */
.category-dentist { background: #bee3f8; color: #2b6cb0; }
.category-education { background: #c6f6d5; color: #276749; }
.category-garage-coating { background: #feebc8; color: #975a16; }
.category-gurdwara { background: #fae8ff; color: #6b46c1; }
.category-handyman { background: #fed7e2; color: #b83280; }
.category-insurance { background: #bee3f8; color: #2c5282; }
.category-movers { background: #c6f6d5; color: #276749; }
.category-painter { background: #fed7d7; color: #c53030; }
.category-rentals { background: #e9d8fd; color: #6b46c1; }
.category-realtor { background: #bee3f8; color: #2b6cb0; }
.category-restaurant { background: #feebc8; color: #c05621; }
.category-rv-rentals { background: #c6f6d5; color: #276749; }
.category-sports { background: #fed7e2; color: #b83280; }
.category-temple { background: #fae8ff; color: #6b46c1; }
.category-grocery { background: #c6f6d5; color: #276749; }
.category-mortgage { background: #bee3f8; color: #2c5282; }

.card-details {
  flex: 1;
  font-size: 14px;
}

.card-contact {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.card-contact svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.card-contact a {
  color: var(--text-primary);
  text-decoration: none;
}

.card-contact a:hover {
  color: var(--accent);
}

.card-links {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--primary);
  text-decoration: none;
}

.card-link:hover {
  color: var(--accent);
  text-decoration: underline;
}

/* Add Listing Button */
.add-listing-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius);
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.add-listing-btn:hover {
  background: #dd6b20;
  color: white;
  text-decoration: none;
}

.fullwidth-section {
  background: white;
  padding: 40px 20px;
  margin-top: 40px;
}

section {
  max-width: 800px;
  margin: 0 auto 30px;
}

section h2 {
  color: var(--primary);
  font-size: 24px;
  margin-bottom: 16px;
}

/* No results message */
.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-size: 16px;
}

/* Header section adjustments */
.container > .intro {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.container > .intro h3 {
  margin-bottom: 0;
}
```

**Step 3: Commit**

```bash
git add assets/css/style.scss
git commit -m "feat: add new design system with CSS variables and card styles"
```

---

### Task 2: Rebuild index.md with card-based layout

**Files:**
- Modify: `index.md`

**Step 1: Read index.md again for full context**

Read: `index.md`

**Step 2: Replace content with card-based layout**

Replace everything from line 5 to line 226 with:
```markdown
<div class="container">
  <div class="intro">
    <h3>Indians in Richmond, BC</h3>
    <a href="mailto:adichourasiya@gmail.com" class="add-listing-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      Add Listing
    </a>
  </div>

  <div class="search-container">
    <input type="text" id="search-input" placeholder="Search businesses...">
  </div>

  <div class="filter-container">
    <button class="filter-pill active" data-category="all">All</button>
    <button class="filter-pill" data-category="dentist">Dentist</button>
    <button class="filter-pill" data-category="education">Education</button>
    <button class="filter-pill" data-category="garage coating">Garage Coating</button>
    <button class="filter-pill" data-category="gurdwara">Gurdwara</button>
    <button class="filter-pill" data-category="handyman">Handyman</button>
    <button class="filter-pill" data-category="insurance">Insurance</button>
    <button class="filter-pill" data-category="movers">Movers</button>
    <button class="filter-pill" data-category="painter">Painter</button>
    <button class="filter-pill" data-category="rentals">Rentals</button>
    <button class="filter-pill" data-category="realtor">Realtor</button>
    <button class="filter-pill" data-category="restaurant">Restaurant</button>
    <button class="filter-pill" data-category="rv rentals">RV Rentals</button>
    <button class="filter-pill" data-category="sports">Sports</button>
    <button class="filter-pill" data-category="temple">Temple</button>
    <button class="filter-pill" data-category="grocery">Grocery</button>
    <button class="filter-pill" data-category="mortgage">Mortgage</button>
  </div>

  <div class="business-grid" id="business-grid">
```

**Step 3: Add card entries**

Replace the table body with card entries. For each table row, convert to:
```html
<div class="business-card" data-name="Best Bite" data-category="restaurant">
  <div class="card-header">
    <h4 class="business-name">Best Bite</h4>
    <span class="category-badge category-restaurant">Restaurant</span>
  </div>
  <div class="card-details">
    <div class="card-contact">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      <a href="tel:+16043704949">6043704949</a>
    </div>
  </div>
</div>
```

Continue for all entries, using appropriate category classes.

**Step 4: Replace script section**

Replace the old script with:
```javascript
<script>
  // Search functionality
  const searchInput = document.getElementById('search-input');
  const cards = document.querySelectorAll('.business-card');
  const filterPills = document.querySelectorAll('.filter-pill');
  let currentCategory = 'all';

  function filterCards() {
    const searchTerm = searchInput.value.toLowerCase();
    
    cards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const category = card.dataset.category.toLowerCase();
      const contact = card.dataset.contact || '';
      
      const matchesSearch = name.includes(searchTerm) || 
                           category.includes(searchTerm) || 
                           contact.includes(searchTerm);
      const matchesCategory = currentCategory === 'all' || 
                              category === currentCategory;
      
      if (matchesSearch && matchesCategory) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
    
    // Show no results message if all hidden
    const visibleCards = document.querySelectorAll('.business-card:not(.hidden)');
    let noResults = document.getElementById('no-results');
    if (visibleCards.length === 0) {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.id = 'no-results';
        noResults.className = 'no-results';
        noResults.textContent = 'No businesses found. Try a different search or category.';
        document.getElementById('business-grid').appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }

  searchInput.addEventListener('input', filterCards);

  // Category filter
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.category;
      filterCards();
    });
  });
</script>
```

**Step 5: Commit**

```bash
git add index.md
git commit -m "feat: convert table to card-based layout with search and filter"
```

---

### Task 3: Test locally

**Step 1: Build the Jekyll site**

Run: `bundle exec jekyll serve`
Expected: Server starts without errors at http://localhost:4000

**Step 2: Test in browser**
- Check cards display in 3 columns on desktop
- Check cards display in 2 columns on tablet resize
- Check cards display in 1 column on mobile resize
- Test search: type "restaurant" - should show only restaurants
- Test filter: click "Temple" pill - should show only temples
- Test combined: search "Himalaya" with "Restaurant" filter
- Check all phone links work
- Check hover effects on cards

**Step 3: Commit**

```bash
git commit -m "test: verify card layout works correctly"
```

---

### Task 4: Final verification and push

**Step 1: Verify no console errors**

Open browser console, refresh page, check for JavaScript errors.

**Step 2: Commit any remaining changes**

```bash
git add -A
git commit -m "feat: complete UI/UX redesign with card layout"
```

**Step 3: Push to remote**

```bash
git push origin master
```

**Plan complete and saved to `docs/plans/2026-02-26-ui-ux-redesign-design.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
