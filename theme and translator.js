// =========================================================================
// 1. INSTANT THEME INITIALIZATION (Runs immediately to prevent flashing)
// =========================================================================
function applyTheme(theme) {
  // Apply to <html> so CSS :root and [data-theme="dark"] selectors work
  document.documentElement.setAttribute('data-theme', theme);
  // Apply to <body> as a fallback for body selectors
  if (document.body) {
    document.body.setAttribute('data-theme', theme);
  }
}

// Instantly apply theme from localStorage before DOM renders
const savedTheme = localStorage.getItem('siteTheme') || 'light';
applyTheme(savedTheme);

// Helper function to set Google Translate cookies across all paths
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

  // Re-verify theme state once <body> is present
  const currentSavedTheme = localStorage.getItem('siteTheme') || 'light';
  applyTheme(currentSavedTheme);

  // --- A. THEME TOGGLE LOGIC ---
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  function updateThemeUI(theme) {
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Paris Night' : 'Paris Day';
  }

  // Update button icons/text on page load
  updateThemeUI(currentSavedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      // If dark, switch to light. Otherwise (if light or null), switch to dark
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

      applyTheme(newTheme);
      localStorage.setItem('siteTheme', newTheme);
      updateThemeUI(newTheme);
    });
  }

  // --- B. LANGUAGE TRANSLATOR LOGIC ---
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

      // Trigger hidden Google Translate dropdown engine
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

// =========================================================================
// 3. GOOGLE TRANSLATE BANNER SHIFT FIX
// =========================================================================
const bodyObserver = new MutationObserver(() => {
  if (document.body && document.body.style.top && document.body.style.top !== '0px') {
    document.body.style.top = '0px';
  }
});

if (document.body) {
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
}
