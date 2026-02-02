/* ============================================
   APEX AI - JavaScript
   Enhanced with animated canvas backgrounds
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initHeroCanvas();
    initCTACanvas();
    initFadeInAnimations();
    initSmoothScroll();
    initMobileMenu();
    initMobileStickyCTA();
});

/**
 * Animated waveform canvas for hero section
 */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function drawWave(yOffset, amplitude, frequency, speed, color, lineWidth) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        for (let x = 0; x <= canvas.width; x += 2) {
            const y = yOffset +
                Math.sin((x * frequency) + (time * speed)) * amplitude +
                Math.sin((x * frequency * 0.5) + (time * speed * 0.7)) * (amplitude * 0.5);

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
    }

    function drawParticles() {
        const particleCount = Math.floor(canvas.width / 50);

        for (let i = 0; i < particleCount; i++) {
            const x = (i / particleCount) * canvas.width + Math.sin(time * 0.5 + i) * 30;
            const y = canvas.height * 0.3 + Math.sin(time * 0.3 + i * 0.5) * 100;
            const size = 1 + Math.sin(time + i) * 0.5;
            const alpha = 0.2 + Math.sin(time * 0.5 + i) * 0.15;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 113, 227, ${alpha})`;
            ctx.fill();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw multiple wave layers
        drawWave(canvas.height * 0.5, 60, 0.003, 0.8, 'rgba(0, 113, 227, 0.15)', 2);
        drawWave(canvas.height * 0.55, 40, 0.004, 1.0, 'rgba(0, 113, 227, 0.12)', 1.5);
        drawWave(canvas.height * 0.6, 80, 0.002, 0.6, 'rgba(0, 198, 255, 0.08)', 2.5);
        drawWave(canvas.height * 0.45, 30, 0.005, 1.2, 'rgba(124, 58, 237, 0.1)', 1);

        // Draw floating particles
        drawParticles();

        // Draw gradient glow at center
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height * 0.4, 0,
            canvas.width / 2, canvas.height * 0.4, canvas.width * 0.4
        );
        gradient.addColorStop(0, 'rgba(0, 113, 227, 0.08)');
        gradient.addColorStop(0.5, 'rgba(0, 113, 227, 0.03)');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        time += 0.015;
        animationId = requestAnimationFrame(animate);
    }

    // Handle resize
    window.addEventListener('resize', resize);
    resize();
    animate();

    // Pause animation when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    });

    observer.observe(canvas);
}

/**
 * Animated waveform canvas for CTA section
 */
function initCTACanvas() {
    const canvas = document.getElementById('cta-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    function resize() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }

    function drawWave(yOffset, amplitude, frequency, speed, color, lineWidth) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        for (let x = 0; x <= canvas.width; x += 2) {
            const y = yOffset +
                Math.sin((x * frequency) + (time * speed)) * amplitude +
                Math.sin((x * frequency * 0.7) + (time * speed * 1.3)) * (amplitude * 0.3);

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw wave layers
        drawWave(canvas.height * 0.6, 50, 0.004, 0.6, 'rgba(0, 113, 227, 0.2)', 2);
        drawWave(canvas.height * 0.5, 30, 0.005, 0.8, 'rgba(0, 198, 255, 0.15)', 1.5);
        drawWave(canvas.height * 0.7, 40, 0.003, 0.5, 'rgba(124, 58, 237, 0.12)', 2);

        time += 0.01;
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();

    // Only start animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.1 });

    observer.observe(canvas);
}

/**
 * Fade-in animations on scroll using Intersection Observer
 */
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (!fadeElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach((element, index) => {
        // Stagger animation delay
        element.style.transitionDelay = `${index % 5 * 0.1}s`;
        observer.observe(element);
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Close mobile menu if open
                const mobileNav = document.getElementById('mobile-nav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    document.getElementById('mobile-menu-toggle').classList.remove('active');
                    document.body.style.overflow = '';
                }

                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');

        // Toggle body scroll
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
}

/**
 * Mobile sticky CTA - shows after scrolling past hero
 */
function initMobileStickyCTA() {
    const stickyCTA = document.getElementById('mobile-sticky-cta');
    const hero = document.getElementById('hero');

    if (!stickyCTA || !hero) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Check viewport width at trigger time, not initialization
            const isMobile = window.innerWidth <= 768;

            if (!entry.isIntersecting && isMobile) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }, {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
    });

    observer.observe(hero);

    // Handle resize to hide on desktop
    window.addEventListener('resize', debounce(function () {
        if (window.innerWidth > 768) {
            stickyCTA.classList.remove('visible');
        }
    }, 250));
}

/**
 * Debounce utility
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
