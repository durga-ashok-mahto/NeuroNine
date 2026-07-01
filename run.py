import os
from app import create_app

# Get configuration name from environment variable, default to 'dev'
config_name = os.environ.get('FLASK_CONFIG', 'dev')
app = create_app(config_name)

if __name__ == '__main__':
    # Run the application locally
    print(f"Starting NeuroNine web server in '{config_name}' mode...")
    app.run(host='127.0.0.1', port=5000)
