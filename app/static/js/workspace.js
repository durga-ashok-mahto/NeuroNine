/**
 * NeuroNine Workspace Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------------------
    // 1. Dashboard Common Interface Controllers (Theme, sound, sidebar)
    // -----------------------------------------------------------------
    // Listen for theme changed event to reset canvas styles
    document.addEventListener("themechanged", () => {
        resetCanvasThemes();
    });

    // -----------------------------------------------------------------
    // 2. Canvas Drawing Core Operations
    // -----------------------------------------------------------------
    const canvas = document.getElementById("digit-canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    
    const btnBrush = document.getElementById("btn-brush");
    const btnEraser = document.getElementById("btn-eraser");
    const btnClear = document.getElementById("btn-clear");
    const btnUndo = document.getElementById("btn-undo");
    const btnRedo = document.getElementById("btn-redo");
    const btnSave = document.getElementById("btn-save");
    
    const brushSizeSlider = document.getElementById("brush-size");
    const brushSizeVal = document.getElementById("brush-size-val");
    
    const btnPredict = document.getElementById("btn-submit");
    const btnSpinner = document.getElementById("btn-spinner");
    const btnText = document.getElementById("btn-text");
    const toastSuccess = document.getElementById("toast-success");
    const btnSpeak = document.getElementById("btn-speak");

    let isDrawing = false;
    let currentTool = "brush"; // brush, eraser
    let brushSize = parseInt(brushSizeSlider.value);
    
    // Canvas history stacks
    let undoStack = [];
    let redoStack = [];
    const maxHistory = 25;

    // Theme matching colors
    let strokeColor = "#ffffff";
    let canvasBgColor = "#0b0f19";

    function resetCanvasThemes() {
        const isLightTheme = document.documentElement.classList.contains("light-theme");
        strokeColor = isLightTheme ? "#101820" : "#ffffff";
        canvasBgColor = isLightTheme ? "#fbfbfb" : "#0b0f19";
        
        // If canvas is blank, redraw initial background
        if (undoStack.length === 0) {
            ctx.fillStyle = canvasBgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            // Keep content, but convert background fill colors if desired
            // For now, redraw current image state
            restoreState(undoStack[undoStack.length - 1]);
        }
    }

    // Set canvas sizes
    canvas.width = 300;
    canvas.height = 300;
    
    // Initial paint background
    resetCanvasThemes();
    saveState(); // push blank canvas state

    // Track cursor coordinates
    let lastX = 0;
    let lastY = 0;

    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        
        // Begin drawing path
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        if (currentTool === "eraser") {
            ctx.strokeStyle = canvasBgColor;
        } else {
            ctx.strokeStyle = strokeColor;
        }
        
        ctx.lineTo(x, y);
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    }

    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            ctx.closePath();
            saveState();
        }
    }

    // Canvas event bindings
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    // Touch events for mobile compatibility
    canvas.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            startDrawing(touch);
        }
    });
    canvas.addEventListener("touchmove", (e) => {
        if (e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            draw(touch);
        }
    });
    canvas.addEventListener("touchend", (e) => {
        e.preventDefault();
        stopDrawing();
    });

    // -----------------------------------------------------------------
    // 3. Toolbar Tool Commands
    // -----------------------------------------------------------------
    btnBrush.addEventListener("click", () => {
        currentTool = "brush";
        btnBrush.classList.add("active");
        btnEraser.classList.remove("active");
    });

    btnEraser.addEventListener("click", () => {
        currentTool = "eraser";
        btnEraser.classList.add("active");
        btnBrush.classList.remove("active");
    });

    btnClear.addEventListener("click", () => {
        ctx.fillStyle = canvasBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Reset stacks, leaving only blank state
        undoStack = [];
        redoStack = [];
        saveState();
        updateHistoryButtons();
    });

    // History state recorders
    function saveState() {
        // limit size
        if (undoStack.length >= maxHistory) {
            undoStack.shift();
        }
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        redoStack = []; // reset redo stack on active new draws
        updateHistoryButtons();
    }

    function restoreState(imageData) {
        if (imageData) {
            ctx.putImageData(imageData, 0, 0);
        }
    }

    btnUndo.addEventListener("click", () => {
        if (undoStack.length > 1) {
            const current = undoStack.pop();
            redoStack.push(current);
            const prev = undoStack[undoStack.length - 1];
            restoreState(prev);
            updateHistoryButtons();
        }
    });

    btnRedo.addEventListener("click", () => {
        if (redoStack.length > 0) {
            const next = redoStack.pop();
            undoStack.push(next);
            restoreState(next);
            updateHistoryButtons();
        }
    });

    function updateHistoryButtons() {
        btnUndo.disabled = undoStack.length <= 1;
        btnRedo.disabled = redoStack.length === 0;
    }

    // Brush size controller
    brushSizeSlider.addEventListener("input", () => {
        brushSize = parseInt(brushSizeSlider.value);
        brushSizeVal.textContent = brushSize;
    });

    // Download locally
    btnSave.addEventListener("click", () => {
        const link = document.createElement("a");
        link.download = "digit_drawing.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });

    // -----------------------------------------------------------------
    // 4. Predict Button Action and API connection
    // -----------------------------------------------------------------
    const resultsPanel = document.getElementById("results-panel");
    const predDigit = document.getElementById("pred-digit");
    const predConf = document.getElementById("pred-conf");
    const predTime = document.getElementById("pred-time");
    const top3List = document.getElementById("top-3-list");
    const chartContainer = document.getElementById("chart-container");
    
    let lastPredictedDigit = null;
    const digitWords = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

    function isCanvasBlank() {
        let bgR = 11, bgG = 15, bgB = 25;
        if (document.documentElement.classList.contains("light-theme")) {
            bgR = 255; bgG = 255; bgB = 255;
        }
        
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i];
            const g = imgData[i+1];
            const b = imgData[i+2];
            if (Math.abs(r - bgR) > 10 || Math.abs(g - bgG) > 10 || Math.abs(b - bgB) > 10) {
                return false;
            }
        }
        return true;
    }

    function showToast(message, isError = false) {
        const toastText = document.getElementById("toast-text");
        toastText.textContent = message;
        if (isError) {
            toastSuccess.style.borderColor = "var(--error-color)";
            const icon = toastSuccess.querySelector(".toast-icon");
            if (icon) {
                icon.textContent = "✕";
                icon.style.backgroundColor = "var(--error-color)";
                icon.style.color = "#ffffff";
            }
        } else {
            toastSuccess.style.borderColor = "rgba(0, 255, 102, 0.25)";
            const icon = toastSuccess.querySelector(".toast-icon");
            if (icon) {
                icon.textContent = "✓";
                icon.style.backgroundColor = "#00ff66";
                icon.style.color = "#101820";
            }
        }
        toastSuccess.classList.add("show");
        setTimeout(() => {
            toastSuccess.classList.remove("show");
        }, 3000);
    }

    btnPredict.addEventListener("click", () => {
        // Blank check
        if (isCanvasBlank()) {
            showToast("Blank canvas detected. Please draw a digit.", true);
            return;
        }
        
        // Disable toolbar & submit buttons
        btnBrush.disabled = true;
        btnEraser.disabled = true;
        btnClear.disabled = true;
        btnUndo.disabled = true;
        btnRedo.disabled = true;
        btnSave.disabled = true;
        btnPredict.disabled = true;
        brushSizeSlider.disabled = true;
        canvas.style.pointerEvents = "none";
        canvas.classList.add("thinking-glow");

        btnSpinner.style.display = "inline-block";
        btnText.textContent = "Analyzing Stroke...";

        const dataUrl = canvas.toDataURL("image/png");

        fetch("/api/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ image: dataUrl })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(err.message || "Prediction failed") });
            }
            return res.json();
        })
        .then(data => {
            if (data.status === "success") {
                // Populate results panel
                resultsPanel.style.display = "block";
                lastPredictedDigit = data.predicted_digit;
                predDigit.textContent = data.predicted_digit;
                predConf.textContent = `Confidence: ${(data.confidence * 100).toFixed(1)}%`;
                predTime.textContent = `Latency: ${data.prediction_time.toFixed(1)}ms`;
                
                // Pop top 3 candidates list
                top3List.innerHTML = "";
                data.top_3.forEach(item => {
                    const row = document.createElement("div");
                    row.style.display = "flex";
                    row.style.justifyContent = "space-between";
                    row.style.fontSize = "0.76rem";
                    row.style.padding = "0.15rem 0";
                    row.style.color = "var(--text-main)";
                    row.style.borderBottom = "1px solid rgba(255,255,255,0.03)";
                    
                    const digitLabel = document.createElement("span");
                    digitLabel.textContent = `${item.digit} (${digitWords[item.digit]})`;
                    
                    const probLabel = document.createElement("span");
                    probLabel.textContent = `${(item.probability * 100).toFixed(1)}%`;
                    probLabel.style.fontWeight = "700";
                    if (item.digit === data.predicted_digit) {
                        probLabel.style.color = "var(--primary)";
                    }
                    
                    row.appendChild(digitLabel);
                    row.appendChild(probLabel);
                    top3List.appendChild(row);
                });
                
                // Populate chart
                chartContainer.innerHTML = "";
                data.probabilities.forEach((prob, index) => {
                    const barWrapper = document.createElement("div");
                    barWrapper.style.display = "flex";
                    barWrapper.style.flexDirection = "column";
                    barWrapper.style.alignItems = "center";
                    barWrapper.style.height = "100%";
                    barWrapper.style.flex = "1";
                    
                    const barFill = document.createElement("div");
                    barFill.style.width = "50%";
                    barFill.style.borderRadius = "2px 2px 0 0";
                    barFill.style.transition = "height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                    barFill.style.height = "0%";
                    
                    if (index === data.predicted_digit) {
                        barFill.style.background = "var(--primary)";
                        barFill.style.boxShadow = "0 0 8px var(--primary)";
                    } else {
                        barFill.style.background = "rgba(91, 124, 250, 0.15)";
                    }
                    
                    const label = document.createElement("span");
                    label.textContent = index;
                    label.style.fontSize = "0.6rem";
                    label.style.fontWeight = "600";
                    label.style.marginTop = "0.2rem";
                    label.style.color = index === data.predicted_digit ? "var(--text-main)" : "var(--text-sub)";
                    
                    barWrapper.appendChild(barFill);
                    barWrapper.appendChild(label);
                    chartContainer.appendChild(barWrapper);
                    
                    setTimeout(() => {
                        barFill.style.height = `${Math.max(4, prob * 100)}%`;
                    }, 50);
                });
                
                // Save to prediction history list
                try {
                    let history = JSON.parse(localStorage.getItem("prediction_history") || "[]");
                    if (history.length >= 100) history.pop();
                    history.unshift({
                        id: 'pred_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        inputType: "Draw",
                        digit: data.predicted_digit,
                        confidence: data.confidence,
                        latency: data.prediction_time,
                        timestamp: new Date().toISOString(),
                        image: dataUrl,
                        top3: data.top_3
                    });
                    localStorage.setItem("prediction_history", JSON.stringify(history));
                } catch (e) {
                    console.error("Failed to write localStorage prediction list:", e);
                }
                
                showToast("Prediction complete!", false);
            }
        })
        .catch(err => {
            console.error("Prediction error:", err);
            showToast(err.message || "Failed to classify input.", true);
        })
        .finally(() => {
            // Re-enable
            btnBrush.disabled = false;
            btnEraser.disabled = false;
            btnClear.disabled = false;
            btnSave.disabled = false;
            btnPredict.disabled = false;
            brushSizeSlider.disabled = false;
            canvas.style.pointerEvents = "auto";
            canvas.classList.remove("thinking-glow");
            updateHistoryButtons();
            
            btnSpinner.style.display = "none";
            btnText.textContent = "Predict Digit";
        });
    });

    if (btnSpeak) {
        btnSpeak.addEventListener("click", () => {
            if (lastPredictedDigit !== null) {
                if (localStorage.getItem("voice") === "off") {
                    console.log("Speech synthesis is disabled in preferences.");
                    return;
                }
                
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel(); // cancel current speech
                    
                    const textToSpeak = `The predicted digit is ${digitWords[lastPredictedDigit]}`;
                    const utterance = new SpeechSynthesisUtterance(textToSpeak);
                    utterance.rate = 0.95;
                    
                    // Retrieve natural English voice
                    const voices = window.speechSynthesis.getVoices();
                    const englishVoice = voices.find(v => 
                        v.lang.startsWith('en') && 
                        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft'))
                    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
                    
                    if (englishVoice) {
                        utterance.voice = englishVoice;
                    }
                    
                    utterance.onerror = (e) => {
                        console.error("SpeechSynthesis error:", e);
                    };
                    
                    window.speechSynthesis.speak(utterance);
                } else {
                    console.warn("Speech synthesis not supported in this browser.");
                }
            }
        });
    }
});
