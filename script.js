/* ============================================
   APEX AI - Premium JavaScript
   Particle mesh, cursor effects, and premium animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initParticleMesh();
    initAmbientCanvas();
    initCursorGlow();
    initFadeInAnimations();
    initSmoothScroll();
    initMobileMenu();
    initMobileStickyCTA();
    initCounterAnimation();
});

/**
 * Particle mesh network animation for hero
 * Creates connected nodes that form neural pathway patterns
 */
function initParticleMesh() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    function initParticles() {
        particles = [];
        const numParticles = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                baseX: Math.random() * canvas.width,
                baseY: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 113, 227, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 113, 227, ${particle.opacity})`;
            ctx.fill();

            // Glow effect
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, `rgba(0, 113, 227, ${particle.opacity * 0.3})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateParticles() {
        particles.forEach(particle => {
            // Floating movement
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    particle.x -= dx * force * 0.02;
                    particle.y -= dy * force * 0.02;
                }
            }

            // Bounce off edges with padding
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

            // Keep in bounds
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        });
    }

    function animate() {
        drawParticles();
        updateParticles();
        animationId = requestAnimationFrame(animate);
    }

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Handle resize
    window.addEventListener('resize', debounce(resize, 250));
    resize();

    // Visibility optimization
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
    });

    observer.observe(canvas);
    animate();
}

/**
 * Ambient canvas for guarantee and CTA sections
 * Subtle flowing lines
 */
function initAmbientCanvas() {
    const canvases = ['guarantee-canvas', 'cta-canvas'];

    canvases.forEach(canvasId => {
        const canvas = document.getElementById(canvasId);
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

            for (let x = 0; x <= canvas.width; x += 3) {
                const y = yOffset +
                    Math.sin((x * frequency) + (time * speed)) * amplitude +
                    Math.sin((x * frequency * 0.6) + (time * speed * 1.4)) * (amplitude * 0.4);

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

            // Draw flowing lines
            drawWave(canvas.height * 0.3, 40, 0.003, 0.4, 'rgba(0, 113, 227, 0.08)', 1.5);
            drawWave(canvas.height * 0.5, 60, 0.002, 0.3, 'rgba(0, 113, 227, 0.06)', 2);
            drawWave(canvas.height * 0.7, 35, 0.004, 0.5, 'rgba(124, 58, 237, 0.05)', 1.5);

            time += 0.008;
            animationId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', debounce(resize, 250));
        resize();

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
    });
}

/**
 * Cursor glow effect that follows mouse
 */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    // Only on desktop
    if (window.innerWidth <= 768) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Smooth follow
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * Fade-in animations on scroll using Intersection Observer
 */
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (!fadeElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
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
        // Stagger animation delay within each section
        const sectionElements = element.closest('.section, .hero')?.querySelectorAll('.fade-in');
        if (sectionElements) {
            const indexInSection = Array.from(sectionElements).indexOf(element);
            element.style.transitionDelay = `${indexInSection * 0.1}s`;
        }
        observer.observe(element);
    });
}

/**
 * Counter animation for stats
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(counter.dataset.target);
                    let current = 0;
                    const increment = target / 50;
                    const duration = 1500;
                    const stepTime = duration / 50;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, stepTime);

                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
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
