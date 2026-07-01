import os
from flask import Flask, render_template
from app.config import config_by_name

def create_app(config_name='dev'):
    """Flask application factory."""
    app = Flask(__name__)
    
    # Load configuration settings
    config_obj = config_by_name.get(config_name, config_by_name['default'])
    app.config.from_object(config_obj)
    
    # Ensure upload and model directories exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['MODEL_FOLDER'], exist_ok=True)
    
    # Configure and load the AI model
    model_path = os.path.join(app.config['MODEL_FOLDER'], 'cnnmodel.h5')
    from app.services import model_service
    model_service.model_path = model_path
    model_service.load_model()
    
    # Register Blueprints
    from app.routes.main import main_bp
    from app.routes.api import api_bp
    
    app.register_blueprint(main_bp)
    # API endpoints prefixed with /api
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Error Handlers
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('errors/500.html'), 500
        
    return app
