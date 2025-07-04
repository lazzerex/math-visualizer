# Math Visualizer - Python + JavaScript Integration

A high-performance mathematical visualization tool combining Python's computational power with JavaScript's interactive capabilities.


![image](https://github.com/user-attachments/assets/d8f57c87-3049-4e61-9914-a8739d388971)

![image](https://github.com/user-attachments/assets/c9c1c742-b028-45e6-9d58-ba0d9f4429e1)



## Project Structure

```
math-visualizer/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── math_engine.py         # Mathematical computation engine
│   ├── config.py              # Configuration settings
│   ├── utils.py               # Helper functions
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── index.html             # Main HTML file
│   ├── css/
│   │   └── styles.css         # Enhanced styling
│   └── js/
│       ├── app.js             # Main application logic
│       ├── api.js             # API communication layer
│       ├── mandelbrot.js      # Mandelbrot visualization
│       └── fourier.js         # Fourier transform visualization
├── README.md                  # This file
```

## Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/lazzerex/math-visualizer.git
cd math-visualizer
```

### 2. Backend Setup (Python)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
cd backend
python app.py
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Option 1: Simple HTTP server (Python)
cd frontend
python -m http.server 8080

# Option 2: Node.js server (if you have Node.js)
cd frontend
npx serve .

# Option 3: Just open index.html in browser
# (may have CORS issues with API calls)
```

### 4. Access the Application

Open your browser and go to `http://localhost:8080`

## Dependencies

### Backend (Python)
- Flask>=2.0.0
- Flask-CORS>=4.0.0
- numpy>=1.21.0
- scipy>=1.7.0
- matplotlib>=3.5.0
- Pillow>=9.0.0

### Frontend (JavaScript)
- Modern browser with ES6+ support
- No additional dependencies (vanilla JavaScript)

## Configuration

### Backend Configuration (`backend/config.py`)

```python
class Config:
    SECRET_KEY = 'your-secret-key'
    DEBUG = True
    HOST = '0.0.0.0'
    PORT = 5000
    
    # Computation limits
    MAX_ITERATIONS = 1000
    MAX_RESOLUTION = 2048
    MAX_SAMPLE_RATE = 4096
```

### Environment Variables

```bash
export FLASK_DEBUG=True
export FLASK_HOST=0.0.0.0
export FLASK_PORT=5000
export SECRET_KEY=your-secret-key
```

## Features

### Mandelbrot Set Visualization
- **High-performance computation**: NumPy vectorized operations
- **Interactive zoom**: Click to zoom into interesting areas
- **Real-time parameters**: Adjust iterations, zoom, and center
- **Fallback support**: Client-side computation when backend unavailable

### Fourier Transform Analysis
- **Multiple wave types**: Sine, square, triangle, sawtooth
- **Real-time FFT**: Fast Fourier Transform with SciPy
- **Dual visualization**: Time domain and frequency domain
- **Advanced analysis**: Peak detection and statistics

### Backend Toggle
- **Seamless switching**: Between Python backend and JavaScript client
- **Performance comparison**: See computation time differences
- **Automatic fallback**: Graceful degradation when backend unavailable

## Usage Examples

### Basic Usage
1. Start the backend server
2. Open the frontend in your browser
3. Use the tabs to switch between visualizations
4. Toggle between Python and JavaScript backends

### Advanced Usage
```javascript
// Custom API calls
const api = new MathAPI();

// Compute high-resolution Mandelbrot
const result = await api.computeMandelbrot({
    width: 1920,
    height: 1080,
    maxIter: 500,
    zoom: 100,
    centerX: -0.5,
    centerY: 0.6
});

// Analyze custom signal
const analysis = await api.analyzeSignal({
    signal: [1, 2, 3, 4, 5],
    sampleRate: 1000
});
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Mandelbrot Computation
```
POST /api/mandelbrot
Content-Type: application/json

{
    "width": 800,
    "height": 600,
    "maxIter": 100,
    "zoom": 1,
    "centerX": 0,
    "centerY": 0
}
```

### Fourier Transform
```
POST /api/fourier
Content-Type: application/json

{
    "waveType": "sine",
    "frequency": 5,
    "amplitude": 1,
    "sampleRate": 1024,
    "duration": 1.0
}
```

### Signal Analysis
```
POST /api/analyze
Content-Type: application/json

{
    "signal": [1, 2, 3, ...],
    "sampleRate": 1000
}
```

## Performance

### Mandelbrot Set
- **Python Backend**: ~50ms for 800x600 at 100 iterations
- **JavaScript Client**: ~200ms for same parameters
- **Speedup**: ~4x faster with Python + NumPy

### Fourier Transform
- **Python Backend**: ~10ms for 1024 samples
- **JavaScript Client**: ~30ms for same parameters
- **Speedup**: ~3x faster with Python + SciPy

## Customization

### Adding New Visualizations
1. Create new visualization class in `frontend/js/`
2. Add corresponding API endpoint in `backend/app.py`
3. Implement computation in `backend/math_engine.py`
4. Add UI controls in `frontend/index.html`

### Styling
- Modify `frontend/css/styles.css`
- Use CSS custom properties for consistent theming
- All colors and spacing use CSS variables

## Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check Python dependencies
pip list

# Check logs
python app.py  # Look for error messages
```

### Frontend Issues
```bash
# Check browser console for errors
# Check network tab for API call failures
# Verify CORS settings
```

### Common Problems
1. **CORS errors**: Make sure Flask-CORS is installed and configured
2. **Port conflicts**: Change port in `config.py`
3. **Dependencies**: Make sure all Python packages are installed
4. **File paths**: Ensure frontend can access backend API

## Security Notes

- This is a development setup - not production ready
- Add authentication for production use
- Implement rate limiting for API endpoints
- Validate all input parameters
- Use HTTPS in production

## Deployment

### Development
```bash
# Start both backend and frontend locally
python backend/app.py &
python -m http.server 8080 --directory frontend
```

### Production
- Use production WSGI server (Gunicorn, uWSGI)
- Add reverse proxy (Nginx)
- Use environment variables for configuration
- Add SSL/TLS certificates

## Learning Resources

- [NumPy Documentation](https://numpy.org/doc/)
- [SciPy Documentation](https://scipy.org/doc/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Mandelbrot Set Mathematics](https://en.wikipedia.org/wiki/Mandelbrot_set)
- [Fourier Transform Theory](https://en.wikipedia.org/wiki/Fourier_transform)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use and modify!

## Support

- Open an issue on GitHub
- Check the troubleshooting section
- Review API documentation
- Test with both backends to isolate issues
