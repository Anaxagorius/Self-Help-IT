/**
 * Self-Help IT Portal – Nova Scotia Credit Union
 * main.js – Search, Accordions, Status, Back-to-top
 */

(function () {
  'use strict';

  /* ── Search data index ───────────────────────────────── */
  // Populated from guide cards in the DOM after load
  const searchIndex = [];

  /* ── DOM refs ─────────────────────────────────────────── */
  const searchInput          = document.getElementById('search-input');
  const searchResultsSection = document.getElementById('search-results-section');
  const searchResultsList    = document.getElementById('search-results-list');
  const noResults            = document.getElementById('no-results');
  const mainContent          = document.getElementById('main-categories');
  const backToTop            = document.getElementById('back-to-top');
  const alertBanner          = document.getElementById('alert-banner');
  const alertClose           = document.getElementById('alert-close');
  const themeToggle          = document.getElementById('theme-toggle');

  /* ── Build search index from guide cards ─────────────── */
  function buildSearchIndex() {
    document.querySelectorAll('.guide-card').forEach(function (card) {
      const titleEl    = card.querySelector('.guide-title');
      const introEl    = card.querySelector('.guide-intro');
      const stepsEl    = card.querySelectorAll('.step-text');
      const categoryEl = card.closest('.category-section');
      const catTitle   = categoryEl
        ? categoryEl.querySelector('.category-header h2')?.textContent || ''
        : '';

      const title = titleEl ? titleEl.textContent : '';
      const intro = introEl ? introEl.textContent : '';
      let stepsText = '';
      stepsEl.forEach(function (s) { stepsText += ' ' + s.textContent; });

      searchIndex.push({
        card: card,
        category: catTitle.trim(),
        title: title.trim(),
        body: (intro + ' ' + stepsText).trim(),
        id: card.dataset.id || '',
      });
    });
  }

  /* ── Accordion toggle (multiple cards can be open simultaneously) ── */
  function initAccordions() {
    document.querySelectorAll('.guide-header').forEach(function (header) {
      header.addEventListener('click', function () {
        const card = header.closest('.guide-card');
        const isOpen = card.classList.contains('open');

        card.classList.toggle('open', !isOpen);
        header.setAttribute('aria-expanded', !isOpen);
      });

      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-expanded', 'false');

      // Keyboard support
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  /* ── Quick link navigation ────────────────────────────── */
  function initQuickLinks() {
    document.querySelectorAll('.quick-link-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var href = card.dataset.href;
        if (href) {
          window.location.href = href;
          return;
        }
        var target = document.getElementById(card.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Open first guide in section automatically
          var firstCard = target.querySelector('.guide-card');
          if (firstCard && !firstCard.classList.contains('open')) {
            firstCard.classList.add('open');
            var h = firstCard.querySelector('.guide-header');
            if (h) h.setAttribute('aria-expanded', 'true');
          }
        }
      });
    });
  }

  /* ── Search ──────────────────────────────────────────── */
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /** Escape HTML special characters to prevent XSS when inserting text into innerHTML. */
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Escape text for safe HTML insertion, then wrap matching substrings in <mark>.
   * Both `text` and `query` are HTML-escaped before use so no raw user input
   * reaches innerHTML.
   */
  function highlight(text, query) {
    const safe = escapeHtml(text);
    if (!query) return safe;
    const re = new RegExp('(' + escapeRegex(escapeHtml(query)) + ')', 'gi');
    return safe.replace(re, '<mark>$1</mark>');
  }

  function truncate(text, maxLen) {
    if (text.length <= maxLen) return text;
    // Trim to maxLen then back up to the last word boundary to avoid mid-word cuts
    return text.substring(0, maxLen).replace(/\s+\S*$/, '') + '…';
  }

  function doSearch(query) {
    const q = query.trim().toLowerCase();

    if (q.length < 2) {
      searchResultsSection.classList.remove('visible');
      noResults.classList.remove('visible');
      mainContent.style.display = '';
      return;
    }

    mainContent.style.display = 'none';
    searchResultsList.innerHTML = '';

    const matches = searchIndex.filter(function (item) {
      return (
        item.title.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });

    if (matches.length === 0) {
      searchResultsSection.classList.remove('visible');
      noResults.classList.add('visible');
      return;
    }

    noResults.classList.remove('visible');
    searchResultsSection.classList.add('visible');

    matches.forEach(function (item) {
      const li = document.createElement('li');
      li.className = 'search-result-item';

      const bodySnippet = truncate(item.body, 120);

      li.innerHTML =
        '<div class="sr-category">' + escapeHtml(item.category) + '</div>' +
        '<h4>' + highlight(item.title, query.trim()) + '</h4>' +
        '<p>' + highlight(bodySnippet, query.trim()) + '</p>';

      li.addEventListener('click', function () {
        // Clear search, scroll to card
        searchInput.value = '';
        doSearch('');
        setTimeout(function () {
          item.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          item.card.classList.add('open');
          const h = item.card.querySelector('.guide-header');
          if (h) h.setAttribute('aria-expanded', 'true');
        }, 100);
      });

      searchResultsList.appendChild(li);
    });
  }

  function initSearch() {
    if (!searchInput) return;
    let debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        doSearch(searchInput.value);
      }, 250);
    });

    // Allow Escape to clear search
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        doSearch('');
      }
    });
  }

  /* ── Dark / Light Theme ──────────────────────────────── */
  function applyTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    if (themeToggle) {
      themeToggle.textContent = dark ? '☀️ Light' : '🌙 Dark';
      themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function initThemeToggle() {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = saved === 'dark' || (saved === null && prefersDark);
    applyTheme(dark);

    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var isDark = document.body.classList.contains('dark-mode');
        applyTheme(!isDark);
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');
      });
    }
  }

  /* ── Back to top ─────────────────────────────────────── */
  function initBackToTop() {
    if (!backToTop) return;
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Alert banner dismiss ─────────────────────────────── */
  function initAlertBanner() {
    if (!alertClose || !alertBanner) return;
    alertClose.addEventListener('click', function () {
      alertBanner.classList.remove('visible');
    });
  }

  /* ── Status refresh (simulated) ───────────────────────── */
  function initStatusBoard() {
    // In a real deployment this would fetch from an API endpoint.
    // For demo purposes the status is set in the HTML statically.
    const lastUpdated = document.getElementById('status-last-updated');
    if (lastUpdated) {
      const now = new Date();
      lastUpdated.textContent = 'Last checked: ' + now.toLocaleTimeString('en-CA', {
        hour: '2-digit', minute: '2-digit'
      });
    }
  }

  /* ── Smooth header search on mobile (focus scroll) ────── */
  function initMobileSearchScroll() {
    if (!searchInput) return;
    searchInput.addEventListener('focus', function () {
      if (window.innerWidth < 768) {
        setTimeout(function () {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 150);
      }
    });
  }

  /* ── Boot ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    buildSearchIndex();
    initAccordions();
    initQuickLinks();
    initSearch();
    initBackToTop();
    initAlertBanner();
    initStatusBoard();
    initMobileSearchScroll();

    // Optionally show alert banner (set to visible if there's a known outage)
    // alertBanner.classList.add('visible');
  });
})();
