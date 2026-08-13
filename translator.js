// 1. Helper function to set Google Translate cookies
function setGoogleTranslateCookie(lang) {
  document.cookie = "googtrans=/en/" + lang + "; path=/";
  document.cookie = "googtrans=/en/" + lang + "; domain=" + window.location.hostname + "; path=/";
}

// 2. Read saved language from previous pages BEFORE Google Translate loads
const savedLang = localStorage.getItem('site_language') || 'en';
if (savedLang !== 'en') {
  setGoogleTranslateCookie(savedLang);
}

// 3. Inject the dropdown HTML dynamically into any page that imports this script
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById('langSwitcherContainer');
  
  if (container) {
    container.innerHTML = `
      <div class="lang-switcher notranslate" translate="no">
        <label for="langSelect" id="lblLanguage">Language / Bhasha:</label>
        <select id="langSelect" class="notranslate" translate="no">
          <option value="en">🇬🇧 ENGLISH</option>
          <option value="pt">🇧🇷 BRASIL</option>
          <option value="cs">🇨🇿 CZECH</option>
          <option value="de">🇩🇪 DEUTSCH</option>
          <option value="es">🇪🇸 ESPAÑOL</option>
          <option value="fr">🇫🇷 FRANÇAIS</option>
          <option value="el">🇬🇷 ΕΛΛΗΝΙΚΑ</option>
          <option value="it">🇮🇹 ITALIANO</option>
          <option value="es">🇲🇽 LATINO</option>
          <option value="nl">🇳🇱 NEDERLANDS</option>
          <option value="pl">🇵🇱 POLSKI</option>
          <option value="pt">🇵🇹 PORTUGAL</option>
          <option value="ru">🇷🇺 РУССКИЙ</option>
          <option value="ro">🇷🇴 ROMÂNĂ</option>
          <option value="sr">🇷🇸 SRPSKI</option>
          <option value="tr">🇹🇷 TÜRKÇE</option>
          <option value="ko">🇰🇷 한국어</option>
          <option value="ja">🇯🇵 日本語</option>
          <option value="hi">🇮🇳 HINDI / हिंदी</option>
        </select>
      </div>
      <div id="google_translate_element" style="display:none;"></div>
    `;

    const langSelect = document.getElementById('langSelect');
    langSelect.value = savedLang;

    // Handle language change by user
    langSelect.addEventListener('change', function () {
      const selectedLang = this.value;
      localStorage.setItem('site_language', selectedLang);
      setGoogleTranslateCookie(selectedLang);

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

// 4. Initialize Google Translate API
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    autoDisplay: false
  }, 'google_translate_element');
}

// Dynamically inject the Google Translate API script
const gtScript = document.createElement('script');
gtScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
document.head.appendChild(gtScript);

// 5. Hide Google top header bar automatically
const bodyObserver = new MutationObserver(() => {
  if (document.body.style.top && document.body.style.top !== '0px') {
    document.body.style.top = '0px';
  }
});
bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });