import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    DEBUG = os.environ.get('FLASK_DEBUG') or True
    HOST = os.environ.get('FLASK_HOST') or '0.0.0.0'
    PORT = int(os.environ.get('FLASK_PORT') or 5000)
    
   
    MAX_ITERATIONS = 1000
    MAX_RESOLUTION = 2048
    MAX_SAMPLE_RATE = 4096