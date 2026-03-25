document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navigation & Scroll Effects ---
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        // Header background on scroll
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active nav link on scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Smooth scrolling for native anchors
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                     // Close mobile menu if open
                    if (navLinks) {
                        navLinks.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                    if (hamburger) hamburger.classList.remove('active');
                }
            }
        });
    });

    // --- 2. Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn.querySelector('i');
    const body = document.body;

    const savedTheme = localStorage.getItem('gs-theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        
        if (body.classList.contains('light-theme')) {
            localStorage.setItem('gs-theme', 'light');
            themeIcon.className = 'fas fa-sun';
        } else {
            localStorage.setItem('gs-theme', 'dark');
            themeIcon.className = 'fas fa-moon';
        }
    });

    // --- 3. Mobile Menu ---
    const menuToggle = document.querySelector('.menu-toggle');

    if(menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- 4. Contact Form ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnSpan = submitBtn.querySelector('span');
            const originalText = btnSpan.innerText;
            
            btnSpan.innerText = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.className = 'success-msg';
                    formStatus.innerText = "Message sent successfully! I'll be in touch soon.";
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    formStatus.className = 'error-msg';
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.innerText = data["errors"].map(err => err["message"]).join(", ");
                    } else {
                        formStatus.innerText = "There was a problem. Please try again later.";
                    }
                }
            } catch (error) {
                formStatus.className = 'error-msg';
                formStatus.innerText = "Network error. Please try again.";
            } finally {
                btnSpan.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';

                setTimeout(() => {
                    formStatus.className = '';
                    formStatus.innerText = '';
                }, 5000);
            }
        });
    }
    // --- 5. AOS Animation ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 120,
            easing: 'ease-out-cubic'
        });
    }
});
