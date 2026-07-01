# NeuroNine — Think. Predict. Recognize.

NeuroNine is a premium AI-powered Handwritten Digit Recognition Web Application utilizing a deep Convolutional Neural Network (CNN) trained on the MNIST dataset, processing input signatures with OpenCV, and serving inferences via a Python Flask backend.

## Project Structure

```
c:/PROJECT 4 NEURONINE/
├── app/
│   ├── __init__.py           # Flask app factory
│   ├── config.py             # Server and folder config
│   ├── routes/               # Modular URL routing blueprints
│   │   ├── __init__.py
│   │   ├── main.py           # Views (Home, Workspace, Dashboard)
│   │   └── api.py            # API controller (inference, statistics)
│   ├── static/               # Client-side assets
│   │   ├── css/
│   │   │   └── main.css      # Custom stylesheet
│   │   └── js/
│   │       ├── main.js       # App initialization script
│   │       └── canvas.js     # Digit canvas drawing script
│   ├── templates/            # HTML pages
│   │   ├── base.html         # Document shell base
│   │   ├── index.html        # Landing page
│   │   ├── workspace.html    # Hand-drawing workbench
│   │   ├── dashboard.html    # Model telemetry
│   │   └── errors/           # Routing error response codes
│   │       ├── 404.html
│   │       └── 500.html
│   └── services/             # Machine Learning utilities
│       ├── __init__.py
│       └── ai_model.py       # OpenCV preprocessing & Keras model executor
├── models/                   # Folder housing trained MNIST CNN (.keras/.h5)
│   └── .gitkeep
├── uploads/                  # Upload folder for temporary Canvas canvas extracts
│   └── .gitkeep
├── run.py                    # Local server launcher
└── requirements.txt          # Third-party dependency list
```

## Prerequisites

- **Python 3.8+** (recommended)

## Setup and Running

1. **Clone or enter the directory**:
   ```powershell
   cd "c:\PROJECT 4 NEURONINE"
   ```

2. **Set up a Virtual Environment**:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

4. **Launch the Server**:
   ```powershell
   python run.py
   ```

5. **Access the application**:
   Open [http://127.0.0.1:5000/](http://127.0.0.1:5000/) in your web browser.
