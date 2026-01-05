document.addEventListener("DOMContentLoaded", () => {

    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Custom Cursor
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with lag which is handled by CSS transition, just update pos
        // But for smoother GSAP feel:
        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.15,
            ease: "power2.out"
        });

        // Also update dot with GSAP for consistency if mixed
        gsap.to(cursorDot, {
            x: posX,
            y: posY,
            duration: 0
        });
    });

    // Cursor Hover Effects
    const hoverables = document.querySelectorAll("a, button, .project-card, input, textarea");
    hoverables.forEach(el => {
        el.addEventListener("mouseenter", () => {
            gsap.to(cursorOutline, {
                scale: 1.5,
                borderColor: "rgba(123, 47, 247, 0.5)",
                backgroundColor: "rgba(123, 47, 247, 0.1)"
            });
        });
        el.addEventListener("mouseleave", () => {
            gsap.to(cursorOutline, {
                scale: 1,
                borderColor: "#ffffff",
                backgroundColor: "transparent"
            });
        });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links li");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("active");
    });

    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            hamburger.classList.remove("active");
        });
    });

    // Hero Animations
    const tl = gsap.timeline();

    // Helper to split text into chars
    function splitTextToChars(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const nodes = [...el.childNodes];
            el.innerHTML = ''; // Clear content
            el.style.opacity = 1; // Make container visible

            nodes.forEach(node => {
                if (node.nodeType === 3) { // Text node
                    const letters = node.textContent.split('');
                    letters.forEach(letter => {
                        if (letter.trim() === '') {
                            el.appendChild(document.createTextNode(' '));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'char';
                            span.textContent = letter;
                            el.appendChild(span);
                        }
                    });
                } else if (node.nodeType === 1) { // Element node (e.g., .accent)
                    const wrapper = document.createElement(node.tagName);
                    Array.from(node.attributes).forEach(attr => wrapper.setAttribute(attr.name, attr.value));
                    // Assuming simple text content inside
                    const letters = node.textContent.split('');
                    letters.forEach(letter => {
                        if (letter.trim() === '') {
                            wrapper.appendChild(document.createTextNode(' '));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'char';
                            span.textContent = letter;
                            wrapper.appendChild(span);
                        }
                    });
                    el.appendChild(wrapper);
                }
            });
        });
    }

    // Split Name and Title
    splitTextToChars('.name');
    splitTextToChars('.title');

    // Hero Animations
    // const tl = gsap.timeline(); // Already declared above


    tl.to(".greeting", { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
        .to(".name .char", {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, "-=0.2")
        .to(".title .char", {
            opacity: 1,
            y: 0,
            stagger: 0.03,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.4")
        .to(".description", { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
        .to(".cta-button", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(".scroll-down", { opacity: 1, duration: 1 }, "-=0.2");

    // Add hover effect listeners to new chars (since they were created dynamically)
    // The CSS :hover handles simplest cases, but for GSAP hover flair:
    document.querySelectorAll('.char').forEach(char => {
        char.addEventListener('mouseenter', () => {
            gsap.to(char, {
                scale: 1.3,
                color: "#f107a3",
                duration: 0.3,
                y: -10,
                ease: "power1.out"
            });
        });
        char.addEventListener('mouseleave', () => {
            gsap.to(char, {
                scale: 1,
                color: "inherit",
                duration: 0.3,
                y: 0,
                ease: "power1.in"
            });
        });
    });

    // Floating Shapes Animation
    gsap.to(".shape-1", {
        x: 50,
        y: 50,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".shape-2", {
        x: -30,
        y: -40,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Scroll Animations

    // About Section
    gsap.from(".about-image", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%",
        },
        x: -50,
        opacity: 0,
        duration: 1
    });

    gsap.from(".about-text", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%",
        },
        x: 50,
        opacity: 0,
        duration: 1
    });

    // Skill Bars
    gsap.utils.toArray(".progress").forEach(bar => {
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: "top 90%",
            },
            width: bar.getAttribute("data-width"),
            duration: 1.5,
            ease: "power2.out"
        });
    });

    // Projects Stagger
    gsap.utils.toArray(".project-card").forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Experience Timeline
    gsap.utils.toArray(".timeline-item").forEach((item, i) => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
            },
            opacity: 1,
            x: 0, // Reset any transform
            duration: 0.8,
            delay: i * 0.2
        });
    });

    // Navigation Active Link on Scroll
    const sections = document.querySelectorAll("header, section");
    const navLi = document.querySelectorAll(".nav-links li a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute("id");
            }
        });

        navLi.forEach((li) => {
            li.classList.remove("active");
            if (li.getAttribute("href").includes(current)) {
                li.classList.add("active");
            }
        });
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            const target = document.querySelector(targetId);
            if (target) {
                gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 70 } });
            }
        });
    });

});
