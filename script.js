document.addEventListener("DOMContentLoaded", () => {
    
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

    tl.to(".greeting", { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
      .to(".name", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to(".title", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to(".description", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to(".cta-button", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to(".scroll-down", { opacity: 1, duration: 1 }, "-=0.2");

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
            if(targetId === "#") return;
            const target = document.querySelector(targetId);
            if(target) {
                gsap.to(window, {duration: 1, scrollTo: {y: target, offsetY: 70}});
            }
        });
    });

});
