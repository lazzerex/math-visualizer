import numpy as np
from scipy import fft
from scipy.signal import spectrogram, find_peaks
import matplotlib.pyplot as plt
from utils import timing_decorator
import io
import base64

class MathEngine:
    """High-performance mathematical computation engine"""
    
    @staticmethod
    @timing_decorator
    def compute_mandelbrot_vectorized(width, height, max_iter, zoom, center_x, center_y):
        """Vectorized Mandelbrot computation using NumPy"""
        
        
        x = np.linspace(-2.5/zoom + center_x, 2.5/zoom + center_x, width)
        y = np.linspace(-2.5/zoom + center_y, 2.5/zoom + center_y, height)
        X, Y = np.meshgrid(x, y)
        C = X + 1j * Y
        
        
        Z = np.zeros_like(C, dtype=complex)
        iterations = np.zeros(C.shape, dtype=int)
        
    
        for i in range(max_iter):
            
            mask = np.abs(Z) <= 2
            
            
            Z[mask] = Z[mask]**2 + C[mask]
            iterations[mask] = i
        
        return iterations
    
    @staticmethod
    @timing_decorator
    def compute_mandelbrot_optimized(width, height, max_iter, zoom, center_x, center_y):
        """Optimized Mandelbrot with escape-time algorithm"""
        
        
        result = np.zeros((height, width), dtype=np.int32)
        
        
        x_min = -2.5/zoom + center_x
        x_max = 2.5/zoom + center_x
        y_min = -2.5/zoom + center_y
        y_max = 2.5/zoom + center_y
        
        
        dx = (x_max - x_min) / width
        dy = (y_max - y_min) / height
        
        
        for py in range(height):
            y = y_min + py * dy
            for px in range(width):
                x = x_min + px * dx
                
                
                zx, zy = 0, 0
                c_real, c_imag = x, y
                
                for iteration in range(max_iter):
                    if zx*zx + zy*zy > 4:
                        break
                    
                    zx_new = zx*zx - zy*zy + c_real
                    zy = 2*zx*zy + c_imag
                    zx = zx_new
                
                result[py, px] = iteration
        
        return result
    
    @staticmethod
    @timing_decorator
    def generate_wave(wave_type, frequency, amplitude, duration=1.0, sample_rate=1024):
        """Generate various wave types"""
        
        t = np.linspace(0, duration, int(sample_rate * duration))
        
        if wave_type == 'sine':
            signal = amplitude * np.sin(2 * np.pi * frequency * t)
        elif wave_type == 'square':
            signal = amplitude * np.sign(np.sin(2 * np.pi * frequency * t))
        elif wave_type == 'triangle':
            signal = amplitude * (2/np.pi) * np.arcsin(np.sin(2 * np.pi * frequency * t))
        elif wave_type == 'sawtooth':
            signal = amplitude * 2 * (t * frequency - np.floor(t * frequency + 0.5))
        elif wave_type == 'noise':
            signal = amplitude * np.random.normal(0, 1, len(t))
        else:
            raise ValueError(f"Unknown wave type: {wave_type}")
        
        return t, signal
    
    @staticmethod
    @timing_decorator
    def compute_fft(signal, sample_rate):
        """Compute FFT with proper scaling"""
        
        
        fft_result = fft.fft(signal)
        freqs = fft.fftfreq(len(signal), 1/sample_rate)
        
        
        n = len(signal) // 2
        magnitude = np.abs(fft_result[:n]) * 2 / len(signal)
        phase = np.angle(fft_result[:n])
        frequencies = freqs[:n]
        
        return frequencies, magnitude, phase
    
    @staticmethod
    @timing_decorator
    def advanced_analysis(signal, sample_rate):
        """Perform advanced signal analysis"""
        
        
        f, t, Sxx = spectrogram(signal, fs=sample_rate, nperseg=256)
        
        
        _, magnitude, _ = MathEngine.compute_fft(signal, sample_rate)
        peaks, properties = find_peaks(magnitude, height=0.01, distance=5)
        
        stats = {
            'mean': float(np.mean(signal)),
            'std': float(np.std(signal)),
            'min': float(np.min(signal)),
            'max': float(np.max(signal)),
            'rms': float(np.sqrt(np.mean(signal**2)))
        }
        
        return {
            'spectrogram': {
                'frequencies': f.tolist(),
                'times': t.tolist(),
                'power': Sxx.tolist()
            },
            'peaks': {
                'indices': peaks.tolist(),
                'heights': properties['peak_heights'].tolist()
            },
            'statistics': stats
        }