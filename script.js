/* ============================================
   APEX AI - Premium JavaScript
   Waveform animation, cursor effects, and premium interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initHeroCanvas();
    initAmbientCanvas();
    initCursorGlow();
    initFadeInAnimations();
    initSmoothScroll();
    initMobileMenu();
    initMobileStickyCTA();
    initCounterAnimation();
});

/**
 * Hero waveform animation - flowing frequency lines
 */
function initHeroCanvas() {
    const canvas = document.getElementById('particle-canvas');
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

        // Draw multiple wave layers with slightly faster speeds
        drawWave(canvas.height * 0.5, 60, 0.003, 1.0, 'rgba(0, 113, 227, 0.15)', 2);
        drawWave(canvas.height * 0.55, 40, 0.004, 1.2, 'rgba(0, 113, 227, 0.12)', 1.5);
        drawWave(canvas.height * 0.6, 80, 0.002, 0.8, 'rgba(0, 198, 255, 0.08)', 2.5);
        drawWave(canvas.height * 0.45, 30, 0.005, 1.4, 'rgba(124, 58, 237, 0.1)', 1);

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

        time += 0.022;
        animationId = requestAnimationFrame(animate);
    }

    // Handle resize
    window.addEventListener('resize', debounce(resize, 250));
    resize();

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
            drawWave(canvas.height * 0.3, 40, 0.003, 0.5, 'rgba(0, 113, 227, 0.08)', 1.5);
            drawWave(canvas.height * 0.5, 60, 0.002, 0.4, 'rgba(0, 113, 227, 0.06)', 2);
            drawWave(canvas.height * 0.7, 35, 0.004, 0.6, 'rgba(124, 58, 237, 0.05)', 1.5);

            time += 0.012;
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
 * Cursor glow effect with particle trails
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
    let velocity = 0;
    let lastX = 0;
    let lastY = 0;

    // Create particle trail container
    const trailContainer = document.createElement('div');
    trailContainer.className = 'cursor-trail-container';
    trailContainer.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9998;';
    document.body.appendChild(trailContainer);

    const particles = [];
    const maxParticles = 20;

    class TrailParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 2;
            this.alpha = 0.6;
            this.decay = Math.random() * 0.02 + 0.015;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;

            this.element = document.createElement('div');
            this.element.style.cssText = `
                position: fixed;
                width: ${this.size}px;
                height: ${this.size}px;
                background: radial-gradient(circle, rgba(0, 113, 227, 0.6) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                transform: translate(-50%, -50%);
            `;
            trailContainer.appendChild(this.element);
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.opacity = this.alpha;
            return this.alpha > 0;
        }

        destroy() {
            this.element.remove();
        }
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Calculate velocity
        velocity = Math.sqrt(
            Math.pow(mouseX - lastX, 2) +
            Math.pow(mouseY - lastY, 2)
        );
        lastX = mouseX;
        lastY = mouseY;

        // Spawn particles based on velocity
        if (velocity > 5 && particles.length < maxParticles) {
            particles.push(new TrailParticle(mouseX, mouseY));
        }
    });

    function animate() {
        // Smooth follow
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;

        // Dynamic size based on velocity
        const scale = Math.min(1 + velocity * 0.01, 1.5);
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        glow.style.transform = `translate(-50%, -50%) scale(${scale})`;

        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            if (!particles[i].update()) {
                particles[i].destroy();
                particles.splice(i, 1);
            }
        }

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
 * Counter animation for stats with easing
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');

    // Easing function for smooth animation
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    counters.forEach(counter => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(counter.dataset.target);
                    const duration = 2000; // 2 seconds
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easedProgress = easeOutQuart(progress);
                        const current = Math.floor(target * easedProgress);

                        counter.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                            // Add a subtle pulse effect when complete
                            counter.style.transform = 'scale(1.05)';
                            setTimeout(() => {
                                counter.style.transform = 'scale(1)';
                            }, 150);
                        }
                    }

                    requestAnimationFrame(updateCounter);
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
