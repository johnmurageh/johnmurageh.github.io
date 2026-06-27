document.addEventListener("DOMContentLoaded", () => {
    // Set current year in footer
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Intersection Observer for scroll animations (fade-in-up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    // Mobile Navigation Toggle
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links a");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        // Close menu on link click
        links.forEach((link) => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }

    // Card Spotlight Mouse Coordinates Tracker
    const cards = document.querySelectorAll(".glass-card");
    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // Tech Canvas Particle Connection Network
    const canvas = document.getElementById("tech-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            constructor(x, y) {
                this.x = x || Math.random() * canvas.width;
                this.y = y || Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 2 + 1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
                ctx.fill();
            }

            update() {
                // Bounce on boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Move
                this.x += this.vx;
                this.y += this.vy;

                // Interact with mouse (faint pull towards mouse)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= dx * force * 0.02;
                        this.y -= dy * force * 0.02;
                    }
                }
            }
        }

        const initParticles = () => {
            particles = [];
            // Adaptive particle count based on screen size
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                // Draw lines to mouse
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const alpha = (1 - dist / mouse.radius) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`; // Primary line connections are blue, mouse connects are emerald!
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            drawLines();
            requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });

        resizeCanvas();
        animate();
    }
});
