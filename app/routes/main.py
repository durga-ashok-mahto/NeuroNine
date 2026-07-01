from flask import Blueprint, render_template, redirect, url_for

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Splash Screen entry page."""
    return render_template('splash.html')

@main_bp.route('/login')
def login():
    """Login page."""
    return render_template('login.html')

@main_bp.route('/register')
def register():
    """Register page placeholder."""
    return render_template('register.html')

@main_bp.route('/forgot-password')
def forgot_password():
    """Forgot password page placeholder."""
    return render_template('forgot_password.html')

@main_bp.route('/workspace')
def workspace():
    """Interactive handwritten digit drawing canvas and prediction interface."""
    return render_template('workspace.html')

@main_bp.route('/dashboard')
def dashboard():
    """Model analytics and training performance dashboard."""
    return render_template('dashboard.html')

@main_bp.route('/upload')
def upload():
    return render_template('upload.html')

@main_bp.route('/camera')
def camera():
    return render_template('camera.html')

@main_bp.route('/history')
def history():
    return render_template('history.html')

@main_bp.route('/analytics')
def analytics():
    return render_template('analytics.html')

@main_bp.route('/dataset')
def dataset():
    return render_template('dataset.html')

@main_bp.route('/cnn-info')
def cnn_info():
    return render_template('cnn_info.html')

@main_bp.route('/reports')
def reports():
    return render_template('reports.html')

@main_bp.route('/settings')
def settings_route():
    return render_template('settings.html')

@main_bp.route('/about')
def about():
    return render_template('about.html')

@main_bp.route('/logout')
def logout():
    return redirect(url_for('main.login'))
