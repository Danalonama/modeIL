// English / Hebrew switch, shared by every page. Load it in <head> (not deferred) so page
// scripts can read ModeLang.get() while they render.
//
// Markup contract:
//   [data-lang-toggle]        a <button> that switches language (one in the desktop nav, one in the mobile menu)
//   [data-he]                 Hebrew HTML for that element; the English original is kept and restored
//   [data-he-placeholder], [data-he-aria-label], [data-he-title]
//                             Hebrew values for those attributes
// Nav, footer, mobile-menu and skip-link labels are translated here once for all pages.
// Pages with script-rendered text register ModeLang.onChange(fn) and re-render.
(function () {
  var KEY = 'modeil-lang';
  var lang = 'en';
  try { if (localStorage.getItem(KEY) === 'he') lang = 'he'; } catch (e) {}

  // Set direction before the body paints, so a Hebrew visitor doesn't see an English flash.
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');

  // Shared chrome, keyed by the English text (lower case).
  var COMMON = {
    'designers': 'מעצבים',
    'boutiques': 'בוטיקים',
    'bridal': 'כלות',
    'map': 'מפה',
    'about': 'אודות',
    'talk to me': 'דברו איתי',
    'accessibility': 'נגישות',
    'israeli fashion index': 'אינדקס האופנה הישראלית',
    'skip to content': 'דילוג לתוכן',
    'buy me a coffee': 'קנו לי קפה',
    'israeli fashion index -made with ❤️ by dana shimoni · © 2026 · all rights reserved':
      'אינדקס האופנה הישראלית · נעשה באהבה ❤️ על ידי דנה שמעוני · © 2026 · כל הזכויות שמורות'
  };
  var COMMON_ATTR = {
    'Open menu': 'פתיחת תפריט',
    'Close menu': 'סגירת תפריט',
    'Menu': 'תפריט',
    'Main': 'ראשי',
    'Mobile': 'תפריט נייד',
    'Footer': 'כותרת תחתונה',
    'Buy Me a Coffee (opens in a new tab)': 'קנו לי קפה (נפתח בלשונית חדשה)'
  };

  // Tag labels (style, type, values), keyed by the English display label in lower case.
  var TAGS = {
    'accessories': 'אקססוריז', 'activewear': 'ספורט', 'artisan': 'אומנותי', 'boutique': 'בוטיק',
    'bridal': 'כלות', 'casual': 'יומיומי', 'concept store': 'קונספט סטור', 'conceptual': 'קונספטואלי',
    'contemporary': 'עכשווי', 'denim': 'ג׳ינס', 'edgy': 'נועז', 'festival': 'פסטיבל', 'footwear': 'הנעלה',
    'handmade': 'עבודת יד', 'jewelry': 'תכשיטים', 'knitwear': 'סריגים', 'legacy': 'מורשת',
    'lingerie': 'הלבשה תחתונה', 'luxury': 'יוקרה', 'made in israel': 'תוצרת ישראל', 'men': 'גברים',
    'menswear': 'גברים', 'minimalist': 'מינימליסטי', 'modest': 'צנוע', 'multi-brand': 'רב-מותגי',
    'natural fabrics': 'בדים טבעיים', 'natural stones': 'אבנים טבעיות', 'natural': 'טבעי', 'prints': 'הדפסים',
    'ready-to-wear': 'מוכן ללבישה', 'size inclusive': 'מידות מכילות', 'size-inclusive': 'מידות מכילות',
    'streetwear': 'סטריטוויר', 'studio': 'סטודיו', 'surf': 'גלישה', 'sustainable': 'בר-קיימא',
    'swimwear': 'בגדי ים', 'unisex': 'יוניסקס', 'boutique chain': 'רשת בוטיקים', 'vintage': 'וינטג׳'
  };

  var originals = new WeakMap(); // element -> { html, attrs: {name: value} }
  function orig(el) {
    var o = originals.get(el);
    if (!o) { o = { html: null, attrs: {} }; originals.set(el, o); }
    return o;
  }
  function setHtml(el, he) {
    var o = orig(el);
    if (o.html === null) o.html = el.innerHTML;
    el.innerHTML = lang === 'he' ? he : o.html;
  }
  function setAttr(el, name, he) {
    var o = orig(el);
    if (!(name in o.attrs)) o.attrs[name] = el.getAttribute(name);
    if (lang === 'he') el.setAttribute(name, he);
    else if (o.attrs[name] === null) el.removeAttribute(name);
    else el.setAttribute(name, o.attrs[name]);
  }

  var fontLoaded = false;
  function loadHebrewFont() {
    if (fontLoaded) return;
    fontLoaded = true;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@300;400;500;700;900&display=swap';
    document.head.appendChild(l);
  }

  function translateChrome() {
    var scope = document.querySelectorAll('nav a, nav span, footer a, footer div, [data-mobile-menu] a, .skip-link');
    for (var i = 0; i < scope.length; i++) {
      var el = scope[i];
      if (el.children.length || el.hasAttribute('data-he')) continue; // leaf text only
      var o = orig(el);
      if (o.html === null) o.html = el.innerHTML;
      var he = COMMON[o.html.replace(/\s+/g, ' ').trim().toLowerCase()];
      if (he) el.textContent = lang === 'he' ? he : o.html;
    }
    var labelled = document.querySelectorAll('[aria-label]');
    for (var j = 0; j < labelled.length; j++) {
      var a = labelled[j];
      if (a.hasAttribute('data-he-aria-label')) continue;
      var ao = orig(a);
      var en = 'aria-label' in ao.attrs ? ao.attrs['aria-label'] : a.getAttribute('aria-label');
      if (COMMON_ATTR[en]) setAttr(a, 'aria-label', COMMON_ATTR[en]);
    }
  }

  function translateMarked() {
    var els = document.querySelectorAll('[data-he]');
    for (var i = 0; i < els.length; i++) setHtml(els[i], els[i].getAttribute('data-he'));
    ['placeholder', 'aria-label', 'title'].forEach(function (name) {
      var marked = document.querySelectorAll('[data-he-' + name + ']');
      for (var k = 0; k < marked.length; k++) setAttr(marked[k], name, marked[k].getAttribute('data-he-' + name));
    });
  }

  function updateToggles() {
    var he = lang === 'he';
    var btns = document.querySelectorAll('[data-lang-toggle]');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (!b.firstChild) {
        b.innerHTML = '<span lang="en">EN</span><span lang="he">עב</span>';
        b.addEventListener('click', function () { ModeLang.set(lang === 'he' ? 'en' : 'he'); });
      }
      b.classList.toggle('is-he', he);
      // Announce the action, in the language you are switching to
      b.setAttribute('aria-label', he ? 'Switch to English' : 'מעבר לעברית');
      b.setAttribute('lang', he ? 'en' : 'he');
    }
  }

  var listeners = [];
  function apply() {
    var he = lang === 'he';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', he ? 'rtl' : 'ltr');
    if (he) loadHebrewFont();
    translateChrome();
    translateMarked();
    updateToggles();
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](lang); } catch (e) { if (window.console) console.error(e); }
    }
  }

  window.ModeLang = {
    get: function () { return lang; },
    isHe: function () { return lang === 'he'; },
    // Pick the string for the current language: ModeLang.t('Website', 'לאתר')
    t: function (en, he) { return lang === 'he' && he != null ? he : en; },
    // A tag label in the current language: ModeLang.tag('Minimalist')
    tag: function (label) { return lang === 'he' ? (TAGS[String(label).toLowerCase()] || label) : label; },
    set: function (next) {
      next = next === 'he' ? 'he' : 'en';
      if (next === lang) return;
      lang = next;
      try { localStorage.setItem(KEY, lang); } catch (e) {}
      apply();
    },
    onChange: function (fn) { listeners.push(fn); },
    // Re-run the static translation, e.g. after a page script rewrote marked elements
    refresh: function () { translateChrome(); translateMarked(); updateToggles(); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
