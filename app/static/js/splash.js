/**
 * NeuroNine Premium Splash Screen Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------------------
    // 1. Dynamic Canvas Particle System
    // -----------------------------------------------------------------
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    
    let particles = [];
    const particleCount = 45;
    const connectionDistance = 120;
    
    // Adjust canvas resolution dynamically
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Particle Model
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2 + 1.2;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.3 + 0.1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Reflect off viewport walls
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(144, 202, 249, ${this.alpha})`;
            ctx.shadowBlur = 3;
            ctx.shadowColor = "#90CAF9";
            ctx.fill();
            ctx.shadowBlur = 0; // Reset for line optimization
        }
    }
    
    // Spawn network particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Draw synaptic lines between nearby particles
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(120, 149, 178, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Run loop
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
    // 2. Typing Progress Loader & Route Redirection
    // -----------------------------------------------------------------
    const statusText = document.getElementById("status-text");
    const progressFill = document.getElementById("progress-fill");
    const percentText = document.getElementById("percent-text");
    
    const messages = [
        { pct: 0, text: "Initializing AI Engine..." },
        { pct: 18, text: "Loading CNN Model..." },
        { pct: 38, text: "Loading MNIST Dataset..." },
        { pct: 58, text: "Preparing Prediction Engine..." },
        { pct: 78, text: "Almost Ready..." },
        { pct: 93, text: "Welcome to NeuroNine" }
    ];
    
    let currentMessageIndex = -1;
    let progress = 0;
    const totalDuration = 4500; // total duration in milliseconds (~4.5s)
    const tickInterval = 40;     // tick frequency (ms)
    const totalSteps = totalDuration / tickInterval;
    const progressStep = 100 / totalSteps;
    
    let activeTypingTimer = null;
    
    // Typewriter effect character injector
    function runTypewriter(text) {
        if (activeTypingTimer) clearTimeout(activeTypingTimer);
        statusText.textContent = "";
        let charIndex = 0;
        
        function appendChar() {
            if (charIndex < text.length) {
                statusText.textContent += text.charAt(charIndex);
                charIndex++;
                activeTypingTimer = setTimeout(appendChar, 25);
            }
        }
        appendChar();
    }
    
    // Progress calculation loop
    function tickProgress() {
        progress += progressStep;
        if (progress > 100) progress = 100;
        
        const currentPct = Math.floor(progress);
        percentText.textContent = `${currentPct}%`;
        progressFill.style.width = `${currentPct}%`;
        
        // Check message threshold triggers
        for (let i = 0; i < messages.length; i++) {
            if (currentPct >= messages[i].pct) {
                if (currentMessageIndex !== i) {
                    currentMessageIndex = i;
                    runTypewriter(messages[i].text);
                }
            }
        }
        
        if (progress < 100) {
            // Apply speed variance during heavy steps (loading dataset/model) for realistic loading feel
            let multiplier = 1;
            if (currentPct >= 35 && currentPct <= 45) multiplier = 2.0; // Simulate loading heavy MNIST dataset
            if (currentPct >= 72 && currentPct <= 78) multiplier = 1.6; // Simulate CNN initialization
            
            setTimeout(tickProgress, tickInterval * multiplier);
        } else {
            // Wait brief moment, then fade screen and trigger redirect to Login page
            setTimeout(() => {
                document.body.style.opacity = "0";
                setTimeout(() => {
                    window.location.href = "/login";
                }, 850); // Matches the CSS body transition timing
            }, 600);
        }
    }
    
    // Start loading ticker after a short buffer delay
    setTimeout(tickProgress, 500);
});
