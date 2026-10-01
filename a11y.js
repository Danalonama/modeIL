// Mobile menu, shared by every page.
// Markup contract: [data-mobile-menu] on the overlay, [data-mobile-menu-open] on the
// hamburger button, [data-mobile-menu-close] on the overlay's close button.
(function () {
  const menu = document.querySelector('[data-mobile-menu]');
  const openBtn = document.querySelector('[data-mobile-menu-open]');
  if (!menu || !openBtn) return;
  const closeBtn = menu.querySelector('[data-mobile-menu-close]');
  let open = false;
  let hideTimer = null;

  function setOpen(next) {
    if (next === open) return;
    open = next;
    clearTimeout(hideTimer);
    openBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      menu.style.setProperty('display', 'flex', 'important');
      menu.style.flexDirection = 'column';
      void menu.offsetWidth; // flush the display change so the slide-in transition runs
      menu.style.transform = 'translateX(0)';
      document.body.style.overflow = 'hidden';
      // preventScroll: the menu is still sliding in, don't let the browser scroll sideways to it
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    } else {
      menu.style.transform = 'translateX(100%)';
      document.body.style.overflow = '';
      // display:none takes the off-screen links out of the tab order
      hideTimer = setTimeout(() => menu.style.setProperty('display', 'none', 'important'), 350);
      openBtn.focus();
    }
  }
  window.toggleMobileMenu = () => setOpen(!open);

  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key !== 'Tab') return;
    // Keep Tab inside the open menu
    const items = [...menu.querySelectorAll('a[href], button')];
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // If the window grows past the mobile breakpoint the hamburger disappears; close with it
  window.addEventListener('resize', () => {
    if (open && getComputedStyle(openBtn).display === 'none') setOpen(false);
  });
})();
