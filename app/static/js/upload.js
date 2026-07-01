/**
 * NeuroNine Upload Image Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------------------
    // 1. Dashboard Common Interface Controllers (Theme, sound, sidebar)
    // -----------------------------------------------------------------
    // -----------------------------------------------------------------
    // 2. Drag & Drop File Handling Logic
    // -----------------------------------------------------------------
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const previewContainer = document.getElementById("preview-container");
    const imagePreview = document.getElementById("image-preview");
    
    const fileNameEl = document.getElementById("file-name");
    const fileSizeEl = document.getElementById("file-size");
    
    const btnRemove = document.getElementById("btn-remove");
    const btnReplace = document.getElementById("btn-replace");
    const btnPredict = document.getElementById("btn-submit");
    const btnSpinner = document.getElementById("btn-spinner");
    const btnText = document.getElementById("btn-text");
    
    const toastSuccess = document.getElementById("toast-success");
    const toastText = document.getElementById("toast-text");

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    // Open selector on click
    dropZone.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Drag and drop event listeners
    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add("drag-over");
        }, false);
    });

    ["dragleave", "dragend", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove("drag-over");
        }, false);
    });

    dropZone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }, false);

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

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    function handleFile(file) {
        if (!allowedTypes.includes(file.type)) {
            showToast("Invalid file format. Please upload PNG, JPG, or JPEG.", true);
            fileInput.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            fileNameEl.textContent = file.name;
            fileSizeEl.textContent = formatBytes(file.size);
            
            // Show preview, hide drop zone
            dropZone.style.display = "none";
            previewContainer.style.display = "flex";
            btnPredict.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    // Remove file preview
    btnRemove.addEventListener("click", () => {
        fileInput.value = "";
        imagePreview.src = "";
        previewContainer.style.display = "none";
        dropZone.style.display = "flex";
        btnPredict.disabled = true;
    });

    // Replace file trigger
    btnReplace.addEventListener("click", () => {
        fileInput.click();
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
        if (!imagePreview.src) {
            showToast("No image loaded. Please upload a file.", true);
            return;
        }

        btnRemove.disabled = true;
        btnReplace.disabled = true;
        btnPredict.disabled = true;
        
        const uploadCard = document.querySelector(".upload-card");
        if (uploadCard) uploadCard.classList.add("thinking-glow");

        btnSpinner.style.display = "inline-block";
        btnText.textContent = "Processing Image...";

        fetch("/api/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ image: imagePreview.src })
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
                        inputType: "Upload",
                        digit: data.predicted_digit,
                        confidence: data.confidence,
                        latency: data.prediction_time,
                        timestamp: new Date().toISOString(),
                        image: imagePreview.src,
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
            showToast(err.message || "Failed to classify image.", true);
        })
        .finally(() => {
            btnRemove.disabled = false;
            btnReplace.disabled = false;
            btnPredict.disabled = false;
            
            const uploadCard = document.querySelector(".upload-card");
            if (uploadCard) uploadCard.classList.remove("thinking-glow");

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
