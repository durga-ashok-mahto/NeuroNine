/**
 * NeuroNine Main Client-Side Entrypoint
 * Handles theme initialization, global navigation triggers, and localization translation system.
 */

// 1. Theme Initializer - Executes instantly to prevent "white flashes" on page reload
(function() {
    const currentTheme = localStorage.getItem("theme") || "dark";
    if (currentTheme === "light") {
        document.documentElement.classList.add("light-theme");
        document.documentElement.classList.remove("dark-theme");
    } else {
        document.documentElement.classList.remove("light-theme");
        document.documentElement.classList.add("dark-theme");
    }
})();

// 2. Client-Side Translation Engine Localization Mappings
const dictionary = {
    "es": {
        // Sidebar Navigation
        "Dashboard": "Panel de Control",
        "Draw Digit": "Dibujar Dígito",
        "Upload Image": "Subir Imagen",
        "Camera": "Cámara",
        "Prediction History": "Historial",
        "Analytics": "Análisis",
        "Dataset": "Conjunto de Datos",
        "CNN Information": "Información CNN",
        "Reports": "Informes",
        "Settings": "Configuración",
        "About Developer": "Sobre el Creador",
        "Logout": "Salir",
        
        // Settings page
        "Application Preferences": "Preferencias de la Aplicación",
        "Customize your interface and model interactions.": "Personaliza tu interfaz y las interacciones del modelo.",
        "Application Theme": "Tema de la Aplicación",
        "Select UI and workspace layout color scheme.": "Selecciona el tema de color de la interfaz y del espacio de trabajo.",
        "Application Language": "Idioma de la Aplicación",
        "Select UI and translation locale language.": "Selecciona el idioma de la interfaz y de traducción local.",
        "Audio Feedback Sound": "Sonido de Retroalimentación",
        "Enable audio clicks and cue indicators.": "Activar clics de audio e indicadores visuales.",
        "Speech Synthesis (Voice)": "Síntesis de Voz (Audio)",
        "Speak classification outcomes output.": "Hablar los resultados de las clasificaciones.",
        "Interface Animations": "Animaciones de Interfaz",
        "Enable background particle simulations.": "Activar simulaciones de partículas en el fondo.",
        "Reset Defaults": "Restaurar Predeterminados",
        "Save Settings": "Guardar Ajustes",
        "Theme": "Tema",
        "Language": "Idioma",

        // Common Header
        "Search operations, models...": "Buscar operaciones, modelos...",
        "User Account": "Cuenta de Usuario",
        "ML Practitioner": "Practicante de ML",
        
        // Dashboard page
        "Welcome to NeuroNine": "Bienvenido a NeuroNine",
        "Think. Predict. Recognize.": "Piensa. Predice. Reconoce.",
        "Model Architecture": "Arquitectura del Modelo",
        "CNN Model loaded successfully.": "Modelo CNN cargado con éxito.",
        "Deep learning inference active on current session parameters.": "Inferencia de aprendizaje profundo activa en los parámetros de la sesión.",
        "Recent Predictions": "Predicciones Recientes",
        "MNIST Dataset Explorer": "Explorador de Datos MNIST",
        "Model Analytics & Metrics": "Análisis y Métricas del Modelo",
        "CNN Architecture Details": "Detalles de la Arquitectura CNN",
        "Model Performance Reports": "Informes de Rendimiento del Modelo",
        
        // Workspace pages
        "Predict Digit": "Predecir Dígito",
        "Clear Canvas": "Limpiar Lienzo",
        "Brush Tool": "Pincel",
        "Eraser Tool": "Borrador",
        "Undo Stroke": "Deshacer",
        "Redo Stroke": "Rehacer",
        "Save Image": "Guardar Imagen",
        "Brush Size": "Tamaño del Pincel",
        "Classification Output": "Resultado de la Clasificación",
        "Confidence": "Confianza",
        "Latency": "Latencia",
        "Speak": "Hablar",
        "Top Candidates": "Principales Candidatos",
        "Confidence Distribution": "Distribución de Confianza"
    },
    "de": {
        // Sidebar Navigation
        "Dashboard": "Dashboard",
        "Draw Digit": "Ziffer Zeichnen",
        "Upload Image": "Bild Hochladen",
        "Camera": "Kamera",
        "Prediction History": "Verlauf",
        "Analytics": "Analysen",
        "Dataset": "Datensatz",
        "CNN Information": "CNN-Information",
        "Reports": "Berichte",
        "Settings": "Einstellungen",
        "About Developer": "Über Entwickler",
        "Logout": "Abmelden",
        
        // Settings page
        "Application Preferences": "Anwendungseinstellungen",
        "Customize your interface and model interactions.": "Passen Sie Ihre Benutzeroberfläche und Modellinteraktionen an.",
        "Application Theme": "Anwendungs-Theme",
        "Select UI and workspace layout color scheme.": "Wählen Sie das Farbschema für UI und Workspace-Layout.",
        "Application Language": "Anwendungssprache",
        "Select UI and translation locale language.": "Wählen Sie die UI- und Übersetzungssprache aus.",
        "Audio Feedback Sound": "Audio-Feedback Sound",
        "Enable audio clicks and cue indicators.": "Aktivieren Sie Audio-Klicks und Hinweisindikatoren.",
        "Speech Synthesis (Voice)": "Sprachsynthese (Stimme)",
        "Speak classification outcomes output.": "Sprechen Sie Klassifizierungsergebnisse aus.",
        "Interface Animations": "Schnittstellenanimationen",
        "Enable background particle simulations.": "Hintergrundpartikelsimulationen aktivieren.",
        "Reset Defaults": "Standardwerte Wiederherstellen",
        "Save Settings": "Einstellungen Speichern",
        "Theme": "Theme",
        "Language": "Sprache",

        // Common Header
        "Search operations, models...": "Suche nach Operationen, Modellen...",
        "User Account": "Benutzerkonto",
        "ML Practitioner": "ML-Praktiker",
        
        // Dashboard page
        "Welcome to NeuroNine": "Willkommen bei NeuroNine",
        "Think. Predict. Recognize.": "Denken. Vorhersagen. Erkennen.",
        "Model Architecture": "Modellarchitektur",
        "CNN Model loaded successfully.": "CNN-Modell erfolgreich geladen.",
        "Deep learning inference active on current session parameters.": "Deep-Learning-Inferenz für aktuelle Sitzungsparameter aktiv.",
        "Recent Predictions": "Kürzliche Vorhersagen",
        "MNIST Dataset Explorer": "MNIST-Datensatz-Explorer",
        "Model Analytics & Metrics": "Modellanalysen und Metriken",
        "CNN Architecture Details": "CNN-Architektur-Details",
        "Model Performance Reports": "Modellleistungsberichte",
        
        // Workspace pages
        "Predict Digit": "Ziffer Vorhersagen",
        "Clear Canvas": "Lienzo Löschen",
        "Brush Tool": "Pinsel",
        "Eraser Tool": "Radiergummi",
        "Undo Stroke": "Rückgängig",
        "Redo Stroke": "Wiederholen",
        "Save Image": "Bild Speichern",
        "Brush Size": "Pinselgröße",
        "Classification Output": "Klassifizierungsergebnis",
        "Confidence": "Konfidenz",
        "Latency": "Latenz",
        "Speak": "Sprechen",
        "Top Candidates": "Top-Kandidaten",
        "Confidence Distribution": "Konfidenzverteilung"
    },
    "fr": {
        // Sidebar Navigation
        "Dashboard": "Tableau de Bord",
        "Draw Digit": "Dessiner Chiffre",
        "Upload Image": "Charger Image",
        "Camera": "Appareil Photo",
        "Prediction History": "Historique",
        "Analytics": "Analytique",
        "Dataset": "Jeu de Données",
        "CNN Information": "Info CNN",
        "Reports": "Rapports",
        "Settings": "Paramètres",
        "About Developer": "Développeur",
        "Logout": "Déconnexion",
        
        // Settings page
        "Application Preferences": "Préférences de l'Application",
        "Customize your interface and model interactions.": "Personnalisez votre interface et les interactions du modèle.",
        "Application Theme": "Thème de l'Application",
        "Select UI and workspace layout color scheme.": "Sélectionnez le schéma de couleur de l'UI et de l'espace de travail.",
        "Application Language": "Langue de l'Application",
        "Select UI and translation locale language.": "Sélectionnez la langue de l'UI et de la traduction locale.",
        "Audio Feedback Sound": "Retour Audio Son",
        "Enable audio clicks and cue indicators.": "Activer les clics audio et les indicateurs visuels.",
        "Speech Synthesis (Voice)": "Synthèse Vocale (Voix)",
        "Speak classification outcomes output.": "Parler les résultats de classification.",
        "Interface Animations": "Animations de l'Interface",
        "Enable background particle simulations.": "Activer les simulations de particules en arrière-plan.",
        "Reset Defaults": "Restaurer Défauts",
        "Save Settings": "Enregistrer Paramètres",
        "Theme": "Thème",
        "Language": "Langue",

        // Common Header
        "Search operations, models...": "Rechercher des opérations, des modèles...",
        "User Account": "Compte Utilisateur",
        "ML Practitioner": "Praticien ML",
        
        // Dashboard page
        "Welcome to NeuroNine": "Bienvenue sur NeuroNine",
        "Think. Predict. Recognize.": "Penser. Prédire. Reconnaître.",
        "Model Architecture": "Architecture du Modèle",
        "CNN Model loaded successfully.": "Modèle CNN chargé avec succès.",
        "Deep learning inference active on current session parameters.": "Inférence d'apprentissage profond active sur les paramètres de session.",
        "Recent Predictions": "Prédictions Récentes",
        "MNIST Dataset Explorer": "Explorateur de Jeu de Données MNIST",
        "Model Analytics & Metrics": "Analytiques et Métriques du Modèle",
        "CNN Architecture Details": "Détails de l'Architecture CNN",
        "Model Performance Reports": "Rapports de Performance du Modèle",
        
        // Workspace pages
        "Predict Digit": "Prédire le Chiffre",
        "Clear Canvas": "Effacer le Canevas",
        "Brush Tool": "Pinceau",
        "Eraser Tool": "Gomme",
        "Undo Stroke": "Annuler",
        "Redo Stroke": "Rétablir",
        "Save Image": "Sauvegarder",
        "Brush Size": "Taille du Pinceau",
        "Classification Output": "Résultat de la Classification",
        "Confidence": "Confiance",
        "Latency": "Latence",
        "Speak": "Parler",
        "Top Candidates": "Principaux Candidats",
        "Confidence Distribution": "Distribution de Confiance"
    },
    "hi": {
        // Sidebar Navigation
        "Dashboard": "डैशबोर्ड",
        "Draw Digit": "अंक खींचें",
        "Upload Image": "छवि अपलोड करें",
        "Camera": "कैमरा",
        "Prediction History": "इतिहास",
        "Analytics": "विश्लेषण",
        "Dataset": "डेटासेट",
        "CNN Information": "सीएनएन जानकारी",
        "Reports": "रिपोर्ट",
        "Settings": "सेटिंग्स",
        "About Developer": "डेवलपर",
        "Logout": "लॉगआउट",
        
        // Settings page
        "Application Preferences": "अनुप्रयोग प्राथमिकताएं",
        "Customize your interface and model interactions.": "अपने इंटरफ़ेस और मॉडल इंटरैक्शन को कस्टमाइज़ करें।",
        "Application Theme": "अनुप्रयोग थीम",
        "Select UI and workspace layout color scheme.": "यूआई और वर्कस्पेस लेआउट रंग योजना चुनें।",
        "Application Language": "अनुप्रयोग भाषा",
        "Select UI and translation locale language.": "यूआई और अनुवाद स्थानीय भाषा चुनें।",
        "Audio Feedback Sound": "ध्वनि प्रतिक्रिया",
        "Enable audio clicks and cue indicators.": "ऑडियो क्लिक और संकेत संकेतक सक्षम करें।",
        "Speech Synthesis (Voice)": "भाषण संश्लेषण (आवाज)",
        "Speak classification outcomes output.": "वर्गीकरण परिणामों को बोलें।",
        "Interface Animations": "इंटरफ़ेस एनिमेशन",
        "Enable background particle simulations.": "पृष्ठभूमि कण सिमुलेशन सक्षम करें।",
        "Reset Defaults": "डिफ़ॉल्ट रीसेट करें",
        "Save Settings": "सेटिंग्स सहेजें",
        "Theme": "थीम",
        "Language": "भाषा",

        // Common Header
        "Search operations, models...": "खोज संचालन, मॉडल...",
        "User Account": "उपयोगकर्ता खाता",
        "ML Practitioner": "एमएल प्रैक्टिशनर",
        
        // Dashboard page
        "Welcome to NeuroNine": "NeuroNine में आपका स्वागत है",
        "Think. Predict. Recognize.": "सोचें। भविष्यवाणी करें। पहचानें।",
        "Model Architecture": "मॉडल वास्तुकला",
        "CNN Model loaded successfully.": "सीएनएन मॉडल सफलतापूर्वक लोड किया गया।",
        "Deep learning inference active on current session parameters.": "वर्तमान सत्र मापदंडों पर गहन शिक्षण अनुमान सक्रिय है।",
        "Recent Predictions": "हाल के पूर्वानुमान",
        "MNIST Dataset Explorer": "डेटासेट एक्सप्लोरर",
        "Model Analytics & Metrics": "मॉडल विश्लेषण और मेट्रिक्स",
        "CNN Architecture Details": "सीएनएन संरचना विवरण",
        "Model Performance Reports": "मॉडल प्रदर्शन रिपोर्ट",
        
        // Workspace pages
        "Predict Digit": "पूर्वानुमान लगाएं",
        "Clear Canvas": "कैनवास साफ करें",
        "Brush Tool": "ब्रश",
        "Eraser Tool": "रबर",
        "Undo Stroke": "पूर्ववत करें",
        "Redo Stroke": "पुनः करें",
        "Save Image": "छवि सहेजें",
        "Brush Size": "ब्रश का आकार",
        "Classification Output": "वर्गीकरण आउटपुट",
        "Confidence": "विश्वास",
        "Latency": "विलंबता",
        "Speak": "बोलें",
        "Top Candidates": "शीर्ष उम्मीदवार",
        "Confidence Distribution": "विश्वास वितरण"
    }
};

// Translates all text nodes and placeholders on the page
function translatePage(lang) {
    if (!lang || lang === "en" || !dictionary[lang]) return;
    const dict = dictionary[lang];
    
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, function(node) {
        const parent = node.parentElement;
        if (parent && (parent.tagName === "SCRIPT" || parent.tagName === "STYLE" || parent.tagName === "TEXTAREA")) {
            return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
    });

    let node;
    while (node = walk.nextNode()) {
        const trimmed = node.nodeValue.trim();
        if (dict[trimmed]) {
            node.nodeValue = node.nodeValue.replace(trimmed, dict[trimmed]);
        }
    }
    
    // Translate search/input placeholders
    document.querySelectorAll("input[placeholder]").forEach(input => {
        const ph = input.placeholder.trim();
        if (dict[ph]) {
            input.placeholder = dict[ph];
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("NeuroNine: Core systems initialized.");
    
    const lang = localStorage.getItem("lang") || "en";
    
    // Apply client-side translation
    translatePage(lang);

    // Initialize UI Elements & Event Hooks
    const themeToggleBtn = document.getElementById("theme-toggle");
    const mobileToggle = document.getElementById("mobile-toggle");
    const sidebar = document.getElementById("sidebar");
    const soundToggleBtn = document.getElementById("sound-toggle");
    const langBtn = document.getElementById("lang-btn");

    // Hook Theme Toggler
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isLight = document.documentElement.classList.toggle("light-theme");
            if (isLight) {
                document.documentElement.classList.remove("dark-theme");
            } else {
                document.documentElement.classList.add("dark-theme");
            }
            localStorage.setItem("theme", isLight ? "light" : "dark");
            
            // Dispatch event for page-specific canvas updates
            document.dispatchEvent(new CustomEvent("themechanged", { detail: { isLight } }));
        });
    }

    // Hook Sound Toggler
    if (soundToggleBtn) {
        let soundEnabled = localStorage.getItem("sound") !== "off";
        
        // Sync visual class
        soundToggleBtn.classList.toggle("sound-off", !soundEnabled);
        soundToggleBtn.classList.toggle("sound-on", soundEnabled);

        soundToggleBtn.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem("sound", soundEnabled ? "on" : "off");
            soundToggleBtn.classList.toggle("sound-off", !soundEnabled);
            soundToggleBtn.classList.toggle("sound-on", soundEnabled);
        });
    }

    // Hook Mobile Sidebar Toggle
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("open");
        });
        document.addEventListener("click", (e) => {
            if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && e.target !== mobileToggle) {
                sidebar.classList.remove("open");
            }
        });
    }

    // Hook Language Dropdown (Top Nav popover)
    if (langBtn) {
        // Sync header language text indicator
        const langSpan = langBtn.querySelector("span");
        if (langSpan) {
            langSpan.textContent = lang.toUpperCase();
        }

        langBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            let dropdown = document.getElementById("lang-dropdown");
            if (dropdown) {
                dropdown.remove();
                return;
            }
            
            dropdown = document.createElement("div");
            dropdown.id = "lang-dropdown";
            dropdown.className = "glass-effect lang-dropdown-menu";
            
            // Inline positioning & styles for compatibility
            dropdown.style.position = "absolute";
            dropdown.style.right = "0";
            dropdown.style.top = "110%";
            dropdown.style.background = "rgba(18, 26, 38, 0.95)";
            dropdown.style.border = "1px solid var(--card-border)";
            dropdown.style.borderRadius = "12px";
            dropdown.style.padding = "0.5rem 0";
            dropdown.style.zIndex = "1000";
            dropdown.style.display = "flex";
            dropdown.style.flexDirection = "column";
            dropdown.style.minWidth = "120px";
            dropdown.style.boxShadow = "var(--card-shadow)";
            
            dropdown.addEventListener("click", (ev) => {
                ev.stopPropagation();
            });
            
            const languages = [
                { code: "en", label: "English" },
                { code: "es", label: "Español" },
                { code: "de", label: "Deutsch" },
                { code: "fr", label: "Français" },
                { code: "hi", label: "Hindi (हिन्दी)" }
            ];
            
            languages.forEach(itemInfo => {
                const item = document.createElement("button");
                item.className = "lang-dropdown-item";
                item.textContent = itemInfo.label;
                item.style.background = "none";
                item.style.border = "none";
                item.style.color = "var(--text-main)";
                item.style.padding = "0.5rem 1rem";
                item.style.textAlign = "left";
                item.style.cursor = "pointer";
                item.style.fontSize = "0.85rem";
                item.style.transition = "background 0.2s";
                
                if (lang === itemInfo.code) {
                    item.style.fontWeight = "700";
                    item.style.color = "var(--primary)";
                }

                item.addEventListener("mouseenter", () => {
                    item.style.background = "rgba(91, 124, 250, 0.2)";
                });
                item.addEventListener("mouseleave", () => {
                    item.style.background = "none";
                });
                
                item.addEventListener("click", (ev) => {
                    ev.stopPropagation();
                    localStorage.setItem("lang", itemInfo.code);
                    location.reload();
                });
                
                dropdown.appendChild(item);
            });
            
            langBtn.parentElement.style.position = "relative";
            langBtn.parentElement.appendChild(dropdown);
        });
        
        document.addEventListener("click", () => {
            const dropdown = document.getElementById("lang-dropdown");
            if (dropdown) dropdown.remove();
        });
    }
});
