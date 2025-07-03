from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
from math_engine import MathEngine
from config import Config
from utils import validate_params, logger
import traceback
import os

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)


math_engine = MathEngine()

@app.route('/')
def serve_frontend():
    """Serve the frontend application"""
    return send_from_directory('../frontend', 'index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('../frontend', filename)

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'version': '1.0.0',
        'backend': 'Python Flask',
        'numpy_version': np.__version__
    })

@app.route('/api/mandelbrot', methods=['POST'])
def compute_mandelbrot():
    """Compute Mandelbrot set"""
    try:
        data = request.get_json()
        
        
        required_keys = ['width', 'height', 'maxIter', 'zoom', 'centerX', 'centerY']
        limits = {
            'width': (100, Config.MAX_RESOLUTION),
            'height': (100, Config.MAX_RESOLUTION),
            'maxIter': (10, Config.MAX_ITERATIONS),
            'zoom': (0.1, 10000)
        }
        
        validate_params(data, required_keys, limits)
        
        
        width = int(data['width'])
        height = int(data['height'])
        max_iter = int(data['maxIter'])
        zoom = float(data['zoom'])
        center_x = float(data['centerX'])
        center_y = float(data['centerY'])
        
        
        if width * height > 500000:  
            result = math_engine.compute_mandelbrot_vectorized(
                width, height, max_iter, zoom, center_x, center_y
            )
        else:
            result = math_engine.compute_mandelbrot_optimized(
                width, height, max_iter, zoom, center_x, center_y
            )
        
        return jsonify({
            'success': True,
            'data': {
                'iterations': result.tolist(),
                'width': width,
                'height': height,
                'computation_method': 'vectorized' if width * height > 500000 else 'optimized'
            }
        })
        
    except Exception as e:
        logger.error(f"Mandelbrot computation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/fourier', methods=['POST'])
def compute_fourier():
    """Compute Fourier transform"""
    try:
        data = request.get_json()
        
        
        required_keys = ['waveType', 'frequency', 'amplitude']
        limits = {
            'frequency': (0.1, 1000),
            'amplitude': (0.1, 10),
            'sampleRate': (64, Config.MAX_SAMPLE_RATE)
        }
        
        validate_params(data, required_keys, limits)
        
        
        wave_type = data['waveType']
        frequency = float(data['frequency'])
        amplitude = float(data['amplitude'])
        sample_rate = int(data.get('sampleRate', 1024))
        duration = float(data.get('duration', 1.0))
        
        
        t, signal = math_engine.generate_wave(
            wave_type, frequency, amplitude, duration, sample_rate
        )
        
        
        frequencies, magnitude, phase = math_engine.compute_fft(signal, sample_rate)
        
        
        analysis = None
        if data.get('advancedAnalysis', False):
            analysis = math_engine.advanced_analysis(signal, sample_rate)
        
        return jsonify({
            'success': True,
            'data': {
                'time': t.tolist(),
                'signal': signal.tolist(),
                'frequencies': frequencies.tolist(),
                'magnitude': magnitude.tolist(),
                'phase': phase.tolist(),
                'sample_rate': sample_rate,
                'analysis': analysis
            }
        })
        
    except Exception as e:
        logger.error(f"Fourier computation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_signal():
    """Perform advanced signal analysis"""
    try:
        data = request.get_json()
        
        
        required_keys = ['signal', 'sampleRate']
        validate_params(data, required_keys)
        
        signal = np.array(data['signal'])
        sample_rate = int(data['sampleRate'])
        
        
        analysis = math_engine.advanced_analysis(signal, sample_rate)
        
        return jsonify({
            'success': True,
            'data': analysis
        })
        
    except Exception as e:
        logger.error(f"Signal analysis error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info("Starting Math Visualizer Backend")
    logger.info(f"Server running on http://{app.config['HOST']}:{app.config['PORT']}")
    app.run(
        host=app.config['HOST'],
        port=app.config['PORT'],
        debug=app.config['DEBUG']
    )