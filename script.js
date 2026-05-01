document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you only want it to animate once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.fade-up-section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Animate the hero section immediately on load if it's already in view
    const heroSection = document.getElementById('about');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('visible');
        }, 100); // slight delay for better visual effect
    }

    // Initialize Vanilla Tilt for 3D physics hover effects
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".card-hover"), {
            max: 8,
            speed: 400,
            glare: false,
            scale: 1.02,
            transition: true,
            easing: "cubic-bezier(.03,.98,.52,.99)"
        });
    }

    // Hero Spotlight Effect
    const spotlight = document.getElementById('hero-spotlight');
    const heroSection_move = document.getElementById('about');

    if (spotlight && heroSection_move) {
        heroSection_move.addEventListener('mousemove', (e) => {
            const rect = heroSection_move.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Use transform3d for hardware acceleration (smoother performance)
            requestAnimationFrame(() => {
                spotlight.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
                spotlight.style.opacity = '1';
            });
        });

        heroSection_move.addEventListener('mouseleave', () => {
            spotlight.style.opacity = '0';
        });
    }

    // Terminal Typing Effect
    const terminalLines = [
        "Initializing Vibe...",
        "Systems: High Performance",
        "Vision: Crafting Dreams"
    ];
    
    let lineIdx = 0;
    let charIdx = 0;
    const typingSpeed = 60;
    const nextLineDelay = 1200;

    function typeLine() {
        if (lineIdx < terminalLines.length) {
            const currentLine = terminalLines[lineIdx];
            const element = document.getElementById(`terminal-line-${lineIdx + 1}`);
            
            if (element && charIdx < currentLine.length) {
                element.textContent += currentLine.charAt(charIdx);
                charIdx++;
                setTimeout(typeLine, typingSpeed);
            } else if (element) {
                element.classList.remove('typing-cursor');
                lineIdx++;
                charIdx = 0;
                if (lineIdx < terminalLines.length) {
                    const nextElement = document.getElementById(`terminal-line-${lineIdx + 1}`);
                    if (nextElement) {
                        nextElement.classList.add('typing-cursor');
                        setTimeout(typeLine, nextLineDelay);
                    }
                }
            }
        }
    }

    // Start typing after reveal animation (sync with stagger-4 delay)
    setTimeout(typeLine, 2200);

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && closeMobileMenuBtn && mobileMenuOverlay) {
        const toggleMenu = (show) => {
            if (show) {
                mobileMenuOverlay.classList.remove('translate-x-full');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            } else {
                mobileMenuOverlay.classList.add('translate-x-full');
                document.body.style.overflow = ''; // Restore scroll
            }
        };

        mobileMenuBtn.addEventListener('click', () => toggleMenu(true));
        closeMobileMenuBtn.addEventListener('click', () => toggleMenu(false));

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
    }
});
