/* ==========================================================================
   Portfolio – Surafel Tesfaye
   Vanilla JS, no dependencies. Each feature is a small, independent function.
   ========================================================================== */
(() => {
    'use strict';

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* Theme --------------------------------------------------------------- */
    function initTheme() {
        const STORAGE_KEY = 'theme';
        const toggle = $('#theme-toggle');
        const metaTheme = $('meta[name="theme-color"]');
        if (!toggle) return;

        const read = () => {
            try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
        };
        const save = (value) => {
            try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage unavailable */ }
        };

        const apply = (theme) => {
            root.setAttribute('data-theme', theme);
            toggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
            if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#f7f7fa' : '#0c0d12');
        };

        apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

        toggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            apply(next);
            save(next);
        });

        // Follow the system setting until the visitor chooses a theme themselves
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
            if (!read()) apply(event.matches ? 'light' : 'dark');
        });
    }

    /* Header & mobile menu ------------------------------------------------ */
    function initNavigation() {
        const header = $('#site-header');
        const toggle = $('#nav-toggle');
        const list = $('#primary-nav');
        if (!header || !toggle || !list) return;

        const setOpen = (open) => {
            list.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            document.body.classList.toggle('nav-open', open);
        };

        toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

        $$('a', list).forEach((link) => link.addEventListener('click', () => setOpen(false)));

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                setOpen(false);
                toggle.focus();
            }
        });

        document.addEventListener('click', (event) => {
            if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setOpen(false);
        });

        window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
            if (event.matches) setOpen(false);
        });

        // Solid, blurred header once the page has been scrolled
        let ticking = false;
        const update = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }, { passive: true });
        update();
    }

    /* Highlight the nav link of the section in view ----------------------- */
    function initActiveLink() {
        const links = $$('.nav-list a');
        const sections = links
            .map((link) => $(link.getAttribute('href')))
            .filter(Boolean);
        if (!sections.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((link) => {
                    const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('active', isCurrent);
                    if (isCurrent) link.setAttribute('aria-current', 'location');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach((section) => observer.observe(section));
    }

    /* Skill bars fill once, when the skills section is reached ------------ */
    function initSkills() {
        const skills = $('#skills-list');
        if (!skills) return;

        if (!('IntersectionObserver' in window) || prefersReducedMotion.matches) {
            skills.classList.add('is-visible');
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        observer.observe(skills);
    }

    /* Contact form -------------------------------------------------------- */
    function initContactForm() {
        const form = $('#contact-form');
        if (!form) return;

        const button = $('#submit-btn', form);
        const label = $('.btn-label', button);
        const status = $('#form-status');
        const endpoint = form.dataset.ajaxEndpoint;
        const idleText = label.textContent;

        const reset = (delay) => {
            setTimeout(() => {
                label.textContent = idleText;
                button.removeAttribute('data-state');
                button.disabled = false;
            }, delay);
        };

        const setStatus = (message, type) => {
            status.textContent = message;
            status.classList.remove('is-success', 'is-error');
            if (type) status.classList.add(`is-${type}`);
        };

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            label.textContent = 'Sending...';
            button.disabled = true;
            setStatus('', null);

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' }
                });
                const result = await response.json().catch(() => ({}));

                if (!response.ok) throw new Error(result.message || 'Failed to send message');

                label.textContent = 'Message Sent!';
                button.dataset.state = 'success';
                setStatus('Thanks for reaching out. Your message has been sent.', 'success');
                form.reset();
                reset(3000);
            } catch (error) {
                console.error(error);
                label.textContent = 'Error! Try Again';
                button.dataset.state = 'error';
                setStatus('Your message could not be sent. Please try again or email me directly.', 'error');
                reset(3000);
            }
        });
    }

    /* Footer year --------------------------------------------------------- */
    function initYear() {
        const year = $('#year');
        if (year) year.textContent = new Date().getFullYear();
    }

    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initNavigation();
        initActiveLink();
        initSkills();
        initContactForm();
        initYear();
    });
})();
