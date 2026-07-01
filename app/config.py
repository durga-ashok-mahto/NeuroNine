import os

class Config:
    """Base configuration settings for NeuroNine."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'neuronine-dev-secret-key-999'
    
    # Directory paths
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'uploads')
    MODEL_FOLDER = os.path.join(BASE_DIR, '..', 'models')
    
    # Configure file upload limits (16 MB max)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    
    # Flask settings
    DEBUG = False
    TESTING = False

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    # Production overrides
    pass

config_by_name = {
    'dev': DevelopmentConfig,
    'prod': ProductionConfig,
    'default': DevelopmentConfig
}
