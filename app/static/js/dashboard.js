/**
 * NeuroNine Premium Dashboard Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    
    // -----------------------------------------------------------------
    // 3. Notification Center Interaction
    // -----------------------------------------------------------------
    const notificationBtn = document.getElementById("notification-btn");
    const badge = notificationBtn.querySelector(".badge");
    
    notificationBtn.addEventListener("click", () => {
        if (badge) {
            badge.style.display = "none";
        }
    });

    // -----------------------------------------------------------------
    // 5. Bento Card Spotlight Hover Spot Effect & Click Redirection
    // -----------------------------------------------------------------
    const bentoCards = document.querySelectorAll(".bento-card");
    
    bentoCards.forEach(card => {
        // Spotlight hover spot coordinates calculator
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty("--x", `${x}px`);
            card.style.setProperty("--y", `${y}px`);
        });
        
        // Click routing handler
        card.addEventListener("click", () => {
            const route = card.getAttribute("data-route");
            if (route) {
                window.location.href = route;
            }
        });
    });

    // -----------------------------------------------------------------
    // 6. Neural Network Feedforward Canvas Simulation
    // -----------------------------------------------------------------
    const canvas = document.getElementById("neural-net-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let animationFrameId;
        
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
        
        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                initNetwork();
            }, 100);
        });
        resizeCanvas();
        
        let nodes = [];
        let connections = [];
        let signals = [];
        
        // Define Network layers: Inputs, Hidden 1, Hidden 2, Outputs
        const layerLayout = [3, 4, 4, 3];
        
        function initNetwork() {
            nodes = [];
            connections = [];
            signals = [];
            
            const w = canvas.width;
            const h = canvas.height;
            const paddingX = 80;
            const paddingY = 30;
            
            const layerCount = layerLayout.length;
            const colWidth = (w - paddingX * 2) / (layerCount - 1);
            
            // 1. Generate Nodes
            for (let i = 0; i < layerCount; i++) {
                const nodeCount = layerLayout[i];
                const colX = paddingX + i * colWidth;
                const rowHeight = (h - paddingY * 2) / (nodeCount - 1 || 1);
                
                nodes[i] = [];
                for (let j = 0; j < nodeCount; j++) {
                    const rowY = nodeCount === 1 ? h / 2 : paddingY + j * rowHeight;
                    nodes[i].push({
                        x: colX,
                        y: rowY,
                        pulse: Math.random() * Math.PI * 2,
                        pulseSpeed: 0.05 + Math.random() * 0.05
                    });
                }
            }
            
            // 2. Generate Connections between adjacent layers
            for (let i = 0; i < layerCount - 1; i++) {
                const currentLayer = nodes[i];
                const nextLayer = nodes[i + 1];
                
                for (let j = 0; j < currentLayer.length; j++) {
                    for (let k = 0; k < nextLayer.length; k++) {
                        connections.push({
                            from: currentLayer[j],
                            to: nextLayer[k],
                            strength: 0.15 + Math.random() * 0.4
                        });
                    }
                }
            }
        }
        
        initNetwork();
        
        // Spawn feedforward signals traversing from layer 0 to layer 3
        function spawnSignal() {
            if (nodes.length === 0) return;
            // Spawn from a random input node
            const startNodeIdx = Math.floor(Math.random() * nodes[0].length);
            const startNode = nodes[0][startNodeIdx];
            
            // Pick a connection leaving this node
            const validConns = connections.filter(c => c.from === startNode);
            if (validConns.length > 0) {
                const conn = validConns[Math.floor(Math.random() * validConns.length)];
                signals.push({
                    from: conn.from,
                    to: conn.to,
                    progress: 0,
                    speed: 0.015 + Math.random() * 0.02,
                    layerIndex: 0
                });
            }
        }
        
        let lastSpawnTime = 0;
        
        function drawNetwork(timestamp) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const isLightTheme = document.documentElement.classList.contains("light-theme");
            
            // 1. Draw Connection Lines
            ctx.lineWidth = 1;
            connections.forEach(c => {
                ctx.beginPath();
                ctx.moveTo(c.from.x, c.from.y);
                ctx.lineTo(c.to.x, c.to.y);
                const alpha = c.strength * (isLightTheme ? 0.09 : 0.07);
                ctx.strokeStyle = isLightTheme ? `rgba(91, 124, 250, ${alpha})` : `rgba(144, 202, 249, ${alpha})`;
                ctx.stroke();
            });
            
            // 2. Draw & Animate Moving Signals
            if (timestamp - lastSpawnTime > 400) {
                spawnSignal();
                lastSpawnTime = timestamp;
            }
            
            for (let i = signals.length - 1; i >= 0; i--) {
                const s = signals[i];
                s.progress += s.speed;
                
                const curX = s.from.x + (s.to.x - s.from.x) * s.progress;
                const curY = s.from.y + (s.to.y - s.from.y) * s.progress;
                
                // Draw signal head glowing dot
                ctx.beginPath();
                ctx.arc(curX, curY, 3, 0, Math.PI * 2);
                ctx.fillStyle = isLightTheme ? "rgba(91, 124, 250, 0.7)" : "rgba(144, 202, 249, 0.7)";
                ctx.shadowBlur = isLightTheme ? 0 : 6;
                ctx.shadowColor = "#5B7CFA";
                ctx.fill();
                ctx.shadowBlur = 0; // reset
                
                if (s.progress >= 1) {
                    // Check if it reached the final layer
                    if (s.layerIndex < layerLayout.length - 2) {
                        // Find a connection leaving the current target node to the next layer
                        const validConns = connections.filter(c => c.from === s.to);
                        if (validConns.length > 0) {
                            const conn = validConns[Math.floor(Math.random() * validConns.length)];
                            signals.push({
                                from: conn.from,
                                to: conn.to,
                                progress: 0,
                                speed: 0.015 + Math.random() * 0.02,
                                layerIndex: s.layerIndex + 1
                            });
                        }
                    }
                    signals.splice(i, 1);
                }
            }
            
            // 3. Draw Nodes
            nodes.forEach((layer, layerIdx) => {
                layer.forEach(node => {
                    node.pulse += node.pulseSpeed;
                    const pulseRadius = 4.5 + Math.sin(node.pulse) * 0.8;
                    
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
                    
                    if (layerIdx === 0) {
                        ctx.fillStyle = isLightTheme ? "#7895B2" : "#90CAF9";
                    } else if (layerIdx === layerLayout.length - 1) {
                        ctx.fillStyle = "#5B7CFA";
                    } else {
                        ctx.fillStyle = isLightTheme ? "#6B7A8F" : "#7895B2";
                    }
                    
                    ctx.shadowBlur = isLightTheme ? 0 : 5;
                    ctx.shadowColor = ctx.fillStyle;
                    ctx.fill();
                    ctx.shadowBlur = 0; // reset
                });
            });
            
            animationFrameId = requestAnimationFrame(drawNetwork);
        }
        
        requestAnimationFrame(drawNetwork);
    }
});
