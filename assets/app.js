document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Footer Year
  const yearSpan = document.getElementById('y');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Theme Toggling
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  
  // Check local storage or preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // 3. Header Active State
  const links = document.querySelectorAll('.nav-link[href]');
  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  
  links.forEach(link => {
    const href = (link.getAttribute('href') || '').replace(/\/+$/, '') || '/';
    if (href === currentPath || (currentPath !== '/' && href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('active');
    }
  });

  // 4. Mobile Menu
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  
  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.contains('menu-open');
      header.classList.toggle('menu-open', !isOpen);
      navToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (header.classList.contains('menu-open') && !header.contains(e.target)) {
        header.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});