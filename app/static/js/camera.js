/**
 * NeuroNine Camera Capture Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------------------
    // 1. Dashboard Common Interface Controllers (Theme, sound, sidebar)
    // -----------------------------------------------------------------
    // -----------------------------------------------------------------
    // 2. Camera Controls & Media Stream Controllers
    // -----------------------------------------------------------------
    const video = document.getElementById("camera-stream");
    const preview = document.getElementById("capture-preview");
    const placeholder = document.getElementById("camera-placeholder");
    const placeholderTitle = document.getElementById("placeholder-title");
    const placeholderDesc = document.getElementById("placeholder-desc");
    
    const btnStart = document.getElementById("btn-start");
    const btnCapture = document.getElementById("btn-capture");
    const btnRetake = document.getElementById("btn-retake");
    const btnStop = document.getElementById("btn-stop");
    
    const btnPredict = document.getElementById("btn-submit");
    const btnSpinner = document.getElementById("btn-spinner");
    const btnText = document.getElementById("btn-text");
    
    const toastSuccess = document.getElementById("toast-success");
    const toastText = document.getElementById("toast-text");

    let localStream = null;

    function showToast(message, isError = false) {
        const toast = document.getElementById("toast-success");
        const icon = toast.querySelector(".toast-icon");
        
        toastText.textContent = message;
        if (isError) {
            toast.style.borderColor = "var(--error-color)";
            icon.textContent = "✕";
            icon.style.backgroundColor = "var(--error-color)";
            icon.style.color = "#ffffff";
        } else {
            toast.style.borderColor = "rgba(0, 255, 102, 0.25)";
            icon.textContent = "✓";
            icon.style.backgroundColor = "#00ff66";
            icon.style.color = "#101820";
        }
        
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    // Start Webcam Stream
    btnStart.addEventListener("click", () => {
        placeholderTitle.textContent = "Requesting Access...";
        placeholderDesc.textContent = "Please authorize camera access permissions in the browser prompt.";
        
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
            .then(stream => {
                localStream = stream;
                video.srcObject = stream;
                video.style.display = "block";
                preview.style.display = "none";
                placeholder.style.display = "none";
                video.play();
                
                // Toggle Button States
                btnStart.disabled = true;
                btnCapture.disabled = false;
                btnStop.disabled = false;
                btnRetake.disabled = true;
                btnPredict.disabled = true;
            })
            .catch(error => {
                console.error("Camera access failed:", error);
                placeholderTitle.textContent = "Webcam Unavailable";
                placeholderDesc.textContent = "Camera access denied, or hardware is occupied by another process. Please check permissions.";
                showToast("Webcam access failed. Verify permissions.", true);
            });
    });

    // Capture Static Snapshot Frame
    btnCapture.addEventListener("click", () => {
        if (!localStream) return;
        
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        const ctx = canvas.getContext("2d");
        // Draw matched frames
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Show picture preview
        preview.src = canvas.toDataURL("image/png");
        video.style.display = "none";
        preview.style.display = "block";
        
        btnCapture.disabled = true;
        btnRetake.disabled = false;
        btnPredict.disabled = false;
    });

    // Retake snapshot stream
    btnRetake.addEventListener("click", () => {
        preview.src = "";
        preview.style.display = "none";
        video.style.display = "block";
        
        btnCapture.disabled = false;
        btnRetake.disabled = true;
        btnPredict.disabled = true;
    });

    // Stop Stream tracks
    btnStop.addEventListener("click", () => {
        stopWebcam();
    });

    function stopWebcam() {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
        }
        
        video.srcObject = null;
        video.style.display = "none";
        preview.style.display = "none";
        preview.src = "";
        
        placeholderTitle.textContent = "Camera Offline";
        placeholderDesc.textContent = "Webcam stream disconnected. Click Start Camera to initialize the capture interface.";
        placeholder.style.display = "flex";
        
        // Toggle states
        btnStart.disabled = false;
        btnCapture.disabled = true;
        btnRetake.disabled = true;
        btnStop.disabled = true;
        btnPredict.disabled = true;
    }

    // Stop camera when leaving view
    window.addEventListener("beforeunload", () => {
        stopWebcam();
    });

    // -----------------------------------------------------------------
    // 3. Predict Button Action and API connection
    // -----------------------------------------------------------------
    const resultsPanel = document.getElementById("results-panel");
    const predDigit = document.getElementById("pred-digit");
    const predConf = document.getElementById("pred-conf");
    const predTime = document.getElementById("pred-time");
    const top3List = document.getElementById("top-3-list");
    const chartContainer = document.getElementById("chart-container");
    const btnSpeak = document.getElementById("btn-speak");
    
    let lastPredictedDigit = null;
    const digitWords = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

    btnPredict.addEventListener("click", () => {
        if (!preview.src) {
            showToast("No frame snapshot captured.", true);
            return;
        }

        btnCapture.disabled = true;
        btnRetake.disabled = true;
        btnStop.disabled = true;
        btnPredict.disabled = true;

        const cameraCard = document.querySelector(".camera-card");
        if (cameraCard) cameraCard.classList.add("thinking-glow");

        btnSpinner.style.display = "inline-block";
        btnText.textContent = "Analyzing Stream Frame...";

        fetch("/api/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ image: preview.src })
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
                        inputType: "Camera",
                        digit: data.predicted_digit,
                        confidence: data.confidence,
                        latency: data.prediction_time,
                        timestamp: new Date().toISOString(),
                        image: preview.src,
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
            showToast(err.message || "Failed to classify capture.", true);
        })
        .finally(() => {
            btnCapture.disabled = true; // Still disabled because preview is shown
            btnRetake.disabled = false;
            btnStop.disabled = false;
            btnPredict.disabled = false;
            
            const cameraCard = document.querySelector(".camera-card");
            if (cameraCard) cameraCard.classList.remove("thinking-glow");

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
                    window.speechSynthesis.cancel();
                    
                    const textToSpeak = `The predicted digit is ${digitWords[lastPredictedDigit]}`;
                    const utterance = new SpeechSynthesisUtterance(textToSpeak);
                    utterance.rate = 0.95;
                    
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
