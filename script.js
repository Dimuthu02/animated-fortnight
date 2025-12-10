// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all interactive features
    initSmoothScrolling();
    initCardAnimations();
    initStoryNavigation();
    initParticlesCanvas();
    initScrollReveal();
    initCTAButton();
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Interactive Card Animations
function initCardAnimations() {
    const cards = document.querySelectorAll('.card-interactive');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('click', function() {
            // Add a click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Show day information
            const day = this.getAttribute('data-day');
            showDayInfo(day);
        });
    });
}

function showDayInfo(day) {
    const messages = {
        '1': 'Day 1-2: Starting with brainstorming and conceptualization',
        '2': 'Day 3-4: Exploring design possibilities and visual aesthetics',
        '3': 'Day 5-6: Creating initial animation prototypes',
        '4': 'Day 7: First week milestone celebration!',
        '5': 'Day 8-9: Building interactive components',
        '6': 'Day 10-11: Refining visuals and animations',
        '7': 'Day 12-13: Integrating storytelling elements',
        '8': 'Day 14: Grand finale showcase presentation!'
    };
    
    const message = messages[day] || 'Exploring creative possibilities...';
    
    // Create temporary notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Dynamic Story Navigation
function initStoryNavigation() {
    const storyBtns = document.querySelectorAll('.story-btn');
    const storyCards = document.querySelectorAll('.story-card');
    
    storyBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and cards
            storyBtns.forEach(b => b.classList.remove('active'));
            storyCards.forEach(c => c.classList.remove('story-active'));
            
            // Add active class to current button and card
            this.classList.add('active');
            storyCards[index].classList.add('story-active');
        });
    });
    
    // Set first button as active
    if (storyBtns.length > 0) {
        storyBtns[0].classList.add('active');
    }
}

// Interactive Particles Canvas
function initParticlesCanvas() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    
    // Configuration constants
    const INITIAL_PARTICLE_COUNT = 100;
    const MAX_PARTICLE_COUNT = 200;
    const PARTICLES_PER_MOUSE_MOVE = 3;
    const MAX_CONNECTIONS_PER_PARTICLE = 3;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.x -= (dx / distance) * force * 2;
                this.y -= (dy / distance) * force * 2;
            }
            
            // Boundary check
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            
            // Decrease size
            if (this.size > 0.2) this.size -= 0.01;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create initial particles
    function createParticles() {
        for (let i = 0; i < INITIAL_PARTICLE_COUNT; i++) {
            particles.push(new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }
    }
    createParticles();
    
    // Mouse move event
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        // Add particles at mouse position
        for (let i = 0; i < PARTICLES_PER_MOUSE_MOVE; i++) {
            particles.push(new Particle(mouseX, mouseY));
        }
    });
    
    // Animation loop
    function animate() {
        ctx.fillStyle = 'rgba(45, 52, 54, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            // Remove small particles
            if (particles[i].size <= 0.2) {
                particles.splice(i, 1);
            }
        }
        
        // Draw connections (optimized - limit connections per particle)
        for (let i = 0; i < particles.length; i++) {
            let connectionCount = 0;
            
            for (let j = i + 1; j < particles.length && connectionCount < MAX_CONNECTIONS_PER_PARTICLE; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    connectionCount++;
                }
            }
        }
        
        // Keep particle count reasonable
        if (particles.length > MAX_PARTICLE_COUNT) {
            particles = particles.slice(-MAX_PARTICLE_COUNT);
        }
        
        requestAnimationFrame(animate);
    }
    animate();
}

// Scroll Reveal Animation
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.classList.add('scroll-reveal');
        observer.observe(item);
    });
}

// CTA Button Action
function initCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Scroll to first week section
            const week1Section = document.querySelector('#week1');
            if (week1Section) {
                week1Section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Add celebration animation
            createConfetti();
        });
    }
}

// Confetti Effect
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
            z-index: 9999;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const duration = Math.random() * 2000 + 2000;
        const startTime = Date.now();
        
        function animateConfetti() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const x = (Math.random() - 0.5) * 200;
                confetti.style.transform = `
                    translateY(${progress * (window.innerHeight + 50)}px)
                    translateX(${x}px)
                    rotate(${progress * 720}deg)
                `;
                confetti.style.opacity = 1 - progress;
                requestAnimationFrame(animateConfetti);
            } else {
                confetti.remove();
            }
        }
        
        animateConfetti();
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


