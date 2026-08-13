// =========================================================================
// 1. INSTANT THEME LOAD (Runs before page renders to prevent screen flash)
// =========================================================================
(function () {
  const savedTheme = localStorage.getItem('siteTheme') || 'light';
  // Sets <html data-theme="dark"> or <html data-theme="light">
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

// Helper to set Google Translate Cookies across all subpages
function setTranslateCookie(lang) {
  const domain = window.location.hostname;
  document.cookie = "googtrans=/en/" + lang + "; path=/";
  if (domain && domain !== 'localhost') {
    document.cookie = "googtrans=/en/" + lang + "; domain=" + domain + "; path=/";
  }
}

// =========================================================================
// 2. DOM EVENT LISTENERS (Runs when page finishes loading)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('siteTheme') || 'light';
  
  // Ensure both <html> and <body> get the attribute so [data-theme="dark"] matches
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (document.body) {
    document.body.setAttribute('data-theme', savedTheme);
  }

  // --- A. THEME TOGGLE LOGIC ---
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  function updateThemeUI(theme) {
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Paris Night' : 'Paris Day';
  }

  updateThemeUI(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      // Check current theme
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      // 1. Apply to <html> and <body> so [data-theme="dark"] triggers in CSS
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);

      // 2. Save preference to browser storage
      localStorage.setItem('siteTheme', newTheme);

      // 3. Update button icon and label
      updateThemeUI(newTheme);
    });
  }

  // --- B. LANGUAGE SELECTOR LOGIC ---
  const langSelect = document.getElementById('langSelect');
  const savedLang = localStorage.getItem('siteLanguage');

  if (savedLang) {
    setTranslateCookie(savedLang);
    if (langSelect) {
      langSelect.value = savedLang;
    }
  }

  if (langSelect) {
    langSelect.addEventListener('change', function () {
      const selectedLang = this.value;
      localStorage.setItem('siteLanguage', selectedLang);
      setTranslateCookie(selectedLang);

      const googleCombo = document.querySelector('.goog-te-combo');
      if (googleCombo) {
        googleCombo.value = selectedLang;
        googleCombo.dispatchEvent(new Event('change'));
      } else {
        window.location.reload();
      }
    });
  }
});

// Suppress Google Translate layout shift
const bodyObserver = new MutationObserver(() => {
  if (document.body && document.body.style.top && document.body.style.top !== '0px') {
    document.body.style.top = '0px';
  }
});
if (document.body) {
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
}