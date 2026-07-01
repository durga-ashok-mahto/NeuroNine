/**
 * NeuroNine Premium Forgot Password Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------------------
    // 1. Particle Canvas System (matching Login & Splash screens)
    // -----------------------------------------------------------------
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    
    let particles = [];
    const particleCount = 40;
    const connectionDistance = 110;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.alpha = Math.random() * 0.25 + 0.08;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(120, 149, 178, ${this.alpha})`;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(107, 122, 143, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
    
    // -----------------------------------------------------------------
    // 2. Element Selectors
    // -----------------------------------------------------------------
    const forgotForm = document.getElementById("forgot-form");
    const emailInput = document.getElementById("email-input");
    const emailError = document.getElementById("email-error");
    
    const btnSubmit = document.getElementById("btn-submit");
    const btnSpinner = document.getElementById("btn-spinner");
    const btnText = document.getElementById("btn-text");
    const toastSuccess = document.getElementById("toast-success");
    
    // -----------------------------------------------------------------
    // 3. Form Real-time Validation
    // -----------------------------------------------------------------
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    function validateEmail() {
        const val = emailInput.value.trim();
        if (val === "") {
            emailInput.classList.remove("is-invalid");
            emailError.style.display = "none";
            return false;
        }
        
        if (!emailRegex.test(val)) {
            emailInput.classList.add("is-invalid");
            emailError.style.display = "block";
            return false;
        } else {
            emailInput.classList.remove("is-invalid");
            emailError.style.display = "none";
            return true;
        }
    }
    
    function validateFormState() {
        const isEmailValid = emailRegex.test(emailInput.value.trim());
        btnSubmit.disabled = !isEmailValid;
    }
    
    // Event listeners
    emailInput.addEventListener("blur", validateEmail);
    emailInput.addEventListener("input", () => {
        if (emailInput.classList.contains("is-invalid")) {
            validateEmail();
        }
        validateFormState();
    });
    
    // -----------------------------------------------------------------
    // 4. Form Submissions
    // -----------------------------------------------------------------
    forgotForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Final sanity verification check
        const isEmailValid = validateEmail();
        if (!isEmailValid) return;
        
        // Prevent double submit and lock form
        emailInput.disabled = true;
        btnSubmit.disabled = true;
        
        btnSpinner.style.display = "inline-block";
        btnText.textContent = "Sending Link...";
        
        // Simulate email sending latency
        setTimeout(() => {
            toastSuccess.classList.add("show");
            
            // Redirect after toast display buffer
            setTimeout(() => {
                window.location.href = "/login";
            }, 1600);
        }, 1200);
    });
});
