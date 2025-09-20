// Theme + header + bug modal

(function themeToggle(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');

  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  else root.setAttribute(
    'data-theme',
    window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  );

  btn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();


(function headerJS(){
  const header = document.querySelector('.site-header');
  const links  = [...document.querySelectorAll('.nav-link[href]')];
  const toggle = document.querySelector('.nav-toggle');

  // Active link by pathname
  const here = location.pathname.replace(/\/+$/, '') || '/';
  links.forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/+$/, '') || '/';
    if (href === here) a.classList.add('active');
    if (here !== '/' && href !== '/' && here.startsWith(href)) a.classList.add('active');
  });

  // Mobile menu
  const setOpen = (open) => {
    header.classList.toggle('menu-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
  };
  toggle?.addEventListener('click', () => setOpen(!header.classList.contains('menu-open')));
  window.addEventListener('click', (e) => { if (!header.contains(e.target)) setOpen(false); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
})();

(function bugReport(){
  const modal = document.getElementById('bugModal');
  const btn = document.getElementById('reportBugBtn');
  const ctxEl = document.getElementById('bugContext');
  const descEl = document.getElementById('bugDesc');
  const emailBtn = document.getElementById('bugEmail');
  const copyBtn = document.getElementById('bugCopy');
  const toast = document.getElementById('bugToast');

  function gatherContext() {
    return {
      page: location.href,
      referrer: document.referrer || null,
      time: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      language: navigator.language,
      userAgent: navigator.userAgent,
      screen: { width: screen.width, height: screen.height, pixelRatio: window.devicePixelRatio || 1 },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      scrollY: Math.round(window.scrollY),
      theme: document.documentElement.getAttribute('data-theme') || 'dark'
    };
  }

  function openModal() {
    ctxEl.textContent = JSON.stringify(gatherContext(), null, 2);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    setTimeout(() => descEl.focus(), 0);
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }
  function showToast(msg='Copied!') {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1400);
  }
  function buildEmailBody() {
    return [
      'Bug description:',
      (descEl.value.trim() || '(please fill in)'),
      '',
      'Context:',
      ctxEl.textContent
    ].join('\n');
  }

  btn?.addEventListener('click', openModal);
  document.addEventListener('click', (e) => { if (e.target.matches('[data-close]')) closeModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  emailBtn?.addEventListener('click', () => {
    const subject = encodeURIComponent('Bug report: hassan-el-bouz.com');
    const body = encodeURIComponent(buildEmailBody());
    location.href = `mailto:helbouz@ethz.ch?subject=${subject}&body=${body}`;
  });

  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(buildEmailBody());
      showToast('Copied to clipboard');
    } catch {
      showToast('Copy failed');
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const bugBtn = document.querySelector(".bug-report-btn");
  if (bugBtn) {
    bugBtn.addEventListener("click", () => {
      const bug = prompt("Please describe the bug you encountered:");
      if (bug) {
        // For now, just log it
        console.log("Bug reported:", bug);

        // Option 1: send by email (mailto)
        window.location.href = `mailto:helbouz@ethz.ch?subject=Bug Report&body=${encodeURIComponent(bug)}`;

        // Option 2: later, send to server endpoint with fetch()
      }
    });
  }
});

