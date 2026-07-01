/**
 * NeuroNine Premium Register Controller
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
    const registerForm = document.getElementById("register-form");
    const nameInput = document.getElementById("name-input");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const confirmInput = document.getElementById("confirm-input");
    
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const confirmError = document.getElementById("confirm-error");
    
    const passwordToggle = document.getElementById("password-toggle");
    const confirmToggle = document.getElementById("confirm-toggle");
    
    const strengthFill = document.getElementById("strength-fill");
    const strengthLabel = document.getElementById("strength-label");
    
    const btnSubmit = document.getElementById("btn-submit");
    const btnSpinner = document.getElementById("btn-spinner");
    const btnText = document.getElementById("btn-text");
    const toastSuccess = document.getElementById("toast-success");
    
    // -----------------------------------------------------------------
    // 3. Password Visibility Toggles
    // -----------------------------------------------------------------
    let isPasswordVisible = false;
    let isConfirmVisible = false;
    
    const eyeOpenSvg = `<svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const eyeOffSvg = `<svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
    
    passwordToggle.addEventListener("click", () => {
        isPasswordVisible = !isPasswordVisible;
        passwordInput.type = isPasswordVisible ? "text" : "password";
        passwordToggle.innerHTML = isPasswordVisible ? eyeOffSvg : eyeOpenSvg;
    });
    
    confirmToggle.addEventListener("click", () => {
        isConfirmVisible = !isConfirmVisible;
        confirmInput.type = isConfirmVisible ? "text" : "password";
        confirmToggle.innerHTML = isConfirmVisible ? eyeOffSvg : eyeOpenSvg;
    });
    
    // -----------------------------------------------------------------
    // 4. Form Real-time Validation & Password Strength Check
    // -----------------------------------------------------------------
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    function validateName() {
        const val = nameInput.value.trim();
        if (val === "") {
            nameInput.classList.remove("is-invalid");
            nameError.style.display = "none";
            return false;
        }
        
        if (val.length < 2) {
            nameInput.classList.add("is-invalid");
            nameError.style.display = "block";
            return false;
        } else {
            nameInput.classList.remove("is-invalid");
            nameError.style.display = "none";
            return true;
        }
    }
    
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
    
    function checkPasswordStrength(password) {
        if (password.length === 0) {
            return { label: "Strength: None", width: "0%", color: "transparent" };
        }
        if (password.length < 6) {
            return { label: "Strength: Weak", width: "33%", color: "#ff4d4d" };
        }
        
        let score = 0;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (password.length >= 8) score++; // bonus for longer passwords
        
        if (score <= 2) {
            return { label: "Strength: Weak", width: "33%", color: "#ff4d4d" };
        } else if (score === 3 || score === 4) {
            return { label: "Strength: Medium", width: "66%", color: "#ffa502" };
        } else {
            return { label: "Strength: Strong", width: "100%", color: "#2ed573" };
        }
    }
    
    function validatePassword() {
        const val = passwordInput.value;
        if (val === "") {
            passwordInput.classList.remove("is-invalid");
            passwordError.style.display = "none";
            return false;
        }
        
        if (val.length < 6) {
            passwordInput.classList.add("is-invalid");
            passwordError.style.display = "block";
            return false;
        } else {
            passwordInput.classList.remove("is-invalid");
            passwordError.style.display = "none";
            return true;
        }
    }
    
    function validateConfirmPassword() {
        const val = confirmInput.value;
        if (val === "") {
            confirmInput.classList.remove("is-invalid");
            confirmError.style.display = "none";
            return false;
        }
        
        if (val !== passwordInput.value) {
            confirmInput.classList.add("is-invalid");
            confirmError.style.display = "block";
            return false;
        } else {
            confirmInput.classList.remove("is-invalid");
            confirmError.style.display = "none";
            return true;
        }
    }
    
    function validateFormState() {
        const isNameValid = nameInput.value.trim().length >= 2;
        const isEmailValid = emailRegex.test(emailInput.value.trim());
        const isPasswordValid = passwordInput.value.length >= 6;
        const isConfirmValid = confirmInput.value === passwordInput.value;
        
        btnSubmit.disabled = !(isNameValid && isEmailValid && isPasswordValid && isConfirmValid);
    }
    
    // Keypress strength check triggers
    passwordInput.addEventListener("input", () => {
        const strength = checkPasswordStrength(passwordInput.value);
        strengthFill.style.width = strength.width;
        strengthFill.style.backgroundColor = strength.color;
        strengthLabel.textContent = strength.label;
        strengthLabel.style.color = strength.color === "transparent" ? "var(--text-sub)" : strength.color;
    });
    
    // Blur validations
    nameInput.addEventListener("blur", validateName);
    emailInput.addEventListener("blur", validateEmail);
    passwordInput.addEventListener("blur", validatePassword);
    confirmInput.addEventListener("blur", validateConfirmPassword);
    
    // Instant clear when correcting
    nameInput.addEventListener("input", () => {
        if (nameInput.classList.contains("is-invalid")) validateName();
        validateFormState();
    });
    
    emailInput.addEventListener("input", () => {
        if (emailInput.classList.contains("is-invalid")) validateEmail();
        validateFormState();
    });
    
    passwordInput.addEventListener("input", () => {
        if (passwordInput.classList.contains("is-invalid")) validatePassword();
        if (confirmInput.value !== "") validateConfirmPassword();
        validateFormState();
    });
    
    confirmInput.addEventListener("input", () => {
        if (confirmInput.classList.contains("is-invalid")) validateConfirmPassword();
        validateFormState();
    });
    
    // -----------------------------------------------------------------
    // 5. Submit Event Handlers
    // -----------------------------------------------------------------
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Sanity checks
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmValid = validateConfirmPassword();
        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) return;
        
        // Lock fields and show spinner
        nameInput.disabled = true;
        emailInput.disabled = true;
        passwordInput.disabled = true;
        confirmInput.disabled = true;
        btnSubmit.disabled = true;
        
        btnSpinner.style.display = "inline-block";
        btnText.textContent = "Creating Account...";
        
        // Simulate database query/registration latency
        setTimeout(() => {
            toastSuccess.classList.add("show");
            
            // Redirect after visual toast duration
            setTimeout(() => {
                window.location.href = "/login";
            }, 1600);
        }, 1200);
    });
});
