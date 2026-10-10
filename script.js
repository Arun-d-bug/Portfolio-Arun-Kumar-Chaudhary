/**
 * ARUNKUMAR CHAUDHARY — PORTFOLIO INTERACTION ENGINE
 * Vanilla JavaScript (ES6+)
 */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initScrollSpy();
    initBackToTop();
    initDynamicGreeting();
    initSkillsFilter();
    initSkillBars();
    initReveal();
    initContactForm();
    initDynamicYear();
    initLoader();
    initThemeShortcut();
});

/* 1. Theme toggle (saved choice > system preference) */
function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    let saved = null;
    try {
        saved = localStorage.getItem('arun_portfolio_theme');
    } catch (e) {
        /* storage blocked */
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');

    const apply = (t) => {
        document.documentElement.setAttribute('data-theme', t);
        btn.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    };
    apply(theme);

    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        apply(next);
        try {
            localStorage.setItem('arun_portfolio_theme', next);
        } catch (e) {
            /* ignore */
        }
    });
}

/* 2. Mobile nav */
function initMobileNav() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('nav-menu');
    if (!btn || !menu) return;

    const toggle = (open) => {
        const isOpen = open !== undefined ? open : !menu.classList.contains('active');
        menu.classList.toggle('active', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
    };

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle();
    });
    menu.querySelectorAll('.nav-link').forEach((l) => l.addEventListener('click', () => toggle(false)));
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('active') && !menu.contains(e.target) && !btn.contains(e.target)) toggle(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) toggle(false);
    });
}

/* 3. Scroll spy */
function initScrollSpy() {
    const sections = document.querySelectorAll('main section[id]');
    const links = document.querySelectorAll('.nav-menu .nav-link');
    if (!sections.length || !links.length) return;

    let ticking = false;
    const update = () => {
        const pos = window.scrollY + 140;
        let current = sections[0].id;
        sections.forEach((s) => {
            if (pos >= s.offsetTop) current = s.id;
        });
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, {
        passive: true
    });
    update();
}

/* 4. Back to top */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 350);
    }, {
        passive: true
    });
    btn.addEventListener('click', () => window.scrollTo({
        top: 0,
        behavior: 'smooth'
    }));
}

/* 5. Greeting */
function initDynamicGreeting() {
    const el = document.getElementById('dynamic-greeting');
    if (!el) return;
    const h = new Date().getHours();
    let g = 'Late night? Same. I am';
    if (h >= 5 && h < 12) g = 'Good morning! I am';
    else if (h >= 12 && h < 17) g = 'Good afternoon! I am';
    else if (h >= 17 && h < 22) g = 'Good evening! I am';
    el.textContent = g;
}

/* 6. Skills filter */
function initSkillsFilter() {
    const tabs = document.querySelectorAll('.skill-tab-btn');
    const cards = document.querySelectorAll('.skill-category-card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => {
                t.classList.remove('active');
                t.setAttribute('aria-pressed', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-pressed', 'true');

            const filter = tab.getAttribute('data-filter');
            cards.forEach((c) => {
                const show = filter === 'all' || c.getAttribute('data-category') === filter;
                c.style.display = show ? '' : 'none';
            });
            fillBars();
        });
    });
}

/* 7. Skill bars fill when visible */
function fillBars() {
    document.querySelectorAll('.skill-progress.filled').forEach((b) => {
        b.style.width = b.getAttribute('data-width') + '%';
    });
}

function initSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    if (!bars.length) return;

    const fill = (b) => {
        b.classList.add('filled');
        b.style.width = b.getAttribute('data-width') + '%';
    };

    if (!('IntersectionObserver' in window)) {
        bars.forEach(fill);
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
            if (en.isIntersecting) {
                fill(en.target);
                io.unobserve(en.target);
            }
        });
    }, {
        threshold: 0.4
    });
    bars.forEach((b) => io.observe(b));
}

/* 8. Section header reveal */
function initReveal() {
    const heads = document.querySelectorAll('.section-header');
    if (!heads.length) return;
    if (!('IntersectionObserver' in window)) {
        heads.forEach((h) => h.classList.add('in-view'));
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
            if (en.isIntersecting) {
                en.target.classList.add('in-view');
                io.unobserve(en.target);
            }
        });
    }, {
        threshold: 0.2
    });
    heads.forEach((h) => io.observe(h));
}

/* 9. Contact form + toast (client-side demo only) */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-text');
    if (!form) return;

    let timer;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('user-name');
        const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'friend';

        if (toast && toastMsg) {
            toastMsg.textContent = `Thanks, ${name}! Message received. Arun will hit you back soon.`;
            toast.classList.add('show');
            clearTimeout(timer);
            timer = setTimeout(() => toast.classList.remove('show'), 4500);
        }
        form.reset();
    });
}

/* 10. Footer year */
function initDynamicYear() {
    const el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
}

/* 11. Loader: slides away once the page is ready */
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    const hide = () => {
        loader.classList.add('done');
        setTimeout(() => loader.remove(), 800);
    };
    setTimeout(hide, 700);
}

/* 12. Alt + T toggles the theme */
function initThemeShortcut() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            btn.click();
        }
    });
}