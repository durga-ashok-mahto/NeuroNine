/**
 * NeuroNine Premium Login Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------------------
    // 1. Particle Canvas System (matching Splash styling)
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
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const passwordToggle = document.getElementById("password-toggle");
    const btnSubmit = document.getElementById("btn-submit");
    const btnSpinner = document.getElementById("btn-spinner");
    const btnText = document.getElementById("btn-text");
    const btnGuest = document.getElementById("btn-guest");
    const toastSuccess = document.getElementById("toast-success");
    
    // -----------------------------------------------------------------
    // 3. Password Visibility Toggle
    // -----------------------------------------------------------------
    let isPasswordVisible = false;
    const eyeOpenSvg = `<svg id="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const eyeOffSvg = `<svg id="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
    
    passwordToggle.addEventListener("click", () => {
        isPasswordVisible = !isPasswordVisible;
        passwordInput.type = isPasswordVisible ? "text" : "password";
        passwordToggle.innerHTML = isPasswordVisible ? eyeOffSvg : eyeOpenSvg;
    });
    
    // -----------------------------------------------------------------
    // 4. Form Real-time Validation
    // -----------------------------------------------------------------
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    function validateEmail() {
        const val = emailInput.value.trim();
        // If empty and not focused out yet, don't show invalid state immediately
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
    
    function validatePassword() {
        const val = passwordInput.value;
        if (val === "") {
            passwordInput.classList.add("is-invalid");
            passwordError.style.display = "block";
            return false;
        } else {
            passwordInput.classList.remove("is-invalid");
            passwordError.style.display = "none";
            return true;
        }
    }
    
    function validateFormState() {
        const isEmailValid = emailRegex.test(emailInput.value.trim());
        const isPasswordValid = passwordInput.value !== "";
        
        btnSubmit.disabled = !(isEmailValid && isPasswordValid);
    }
    
    // Event listeners for validations
    emailInput.addEventListener("blur", validateEmail);
    emailInput.addEventListener("input", () => {
        if (emailInput.classList.contains("is-invalid")) {
            validateEmail();
        }
        validateFormState();
    });
    
    passwordInput.addEventListener("blur", validatePassword);
    passwordInput.addEventListener("input", () => {
        if (passwordInput.classList.contains("is-invalid")) {
            validatePassword();
        }
        validateFormState();
    });
    
    // -----------------------------------------------------------------
    // 5. Form Submissions
    // -----------------------------------------------------------------
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Final sanity verification checks
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        if (!isEmailValid || !isPasswordValid) return;
        
        // Prevent double submit and lock form
        emailInput.disabled = true;
        passwordInput.disabled = true;
        btnSubmit.disabled = true;
        btnGuest.disabled = true;
        
        btnSpinner.style.display = "inline-block";
        btnText.textContent = "Authenticating...";
        
        // Simulate authentication delay
        setTimeout(() => {
            toastSuccess.classList.add("show");
            
            // Redirect after toast display buffer
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);
        }, 1200);
    });
    
    // Guest Entrance
    btnGuest.addEventListener("click", () => {
        emailInput.disabled = true;
        passwordInput.disabled = true;
        btnSubmit.disabled = true;
        btnGuest.disabled = true;
        btnGuest.textContent = "Entering Workspace...";
        
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 300);
    });
});
