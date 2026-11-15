(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 5 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a:not(.nav-parent)').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Dropdown labels without a page of their own: open the submenu on mobile
   * (desktop opens it on hover) instead of following the "#" link
   */
  document.querySelectorAll('.navmenu .nav-parent').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      if (!document.querySelector('.mobile-nav-active')) return;
      this.classList.toggle('active');
      this.nextElementSibling.classList.toggle('dropdown-active');
    });
  });

  /**
   * Static form submissions (Formspree / FormHippo).
   * Forms with .js-form submit in the background and show an inline status
   * message. Without JavaScript they fall back to a normal POST.
   */
  document.querySelectorAll('form.js-form').forEach(form => {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('[type="submit"]');

    function setStatus(type, message) {
      if (!status) return;
      status.className = 'form-status is-' + type;
      status.textContent = message;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (button) button.disabled = true;
      setStatus('loading', 'Sending…');

      // Non-production builds: don't send anything, just pretend it worked.
      if (form.dataset.dryRun !== undefined) {
        console.info('[dry run] Form not submitted. Production would POST to ' + form.dataset.dryRun + ':',
          Object.fromEntries(new FormData(form)));
        await new Promise(resolve => setTimeout(resolve, 600));
        form.reset();
        setStatus('success', (form.dataset.success || 'Thanks! Your message has been sent.') +
          ' (Test mode: nothing was actually sent.)');
        if (button) button.disabled = false;
        return;
      }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Request failed');
        form.reset();
        setStatus('success', form.dataset.success || 'Thanks! Your message has been sent.');
      } catch (err) {
        setStatus('error', 'Sorry, something went wrong. Please try again in a few minutes.');
      } finally {
        if (button) button.disabled = false;
      }
    });
  });

})();
