class FourierVisualizer {
    constructor(api, backend) {
        this.api = api;
        this.backend = backend;
        this.canvas = document.getElementById('fourierCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.status = document.getElementById('fourierStatus');
        this.isComputing = false;
        document.getElementById('fourierAnalyze').addEventListener('click', () => this.render());
        document.getElementById('fourierClear').addEventListener('click', () => this.clear());
        this.render();
    }
    
    setBackend(backend) {
        this.backend = backend;
    }
    
    async render() {
        if (this.isComputing) return;
        
        this.isComputing = true;
        this.status.textContent = 'Computing...';
        this.status.className = 'status computing';
        
        const params = {
            waveType: document.getElementById('waveType').value,
            frequency: parseFloat(document.getElementById('frequency').value),
            amplitude: parseFloat(document.getElementById('amplitude').value),
            sampleRate: 1024,
            duration: 1.0,
            advancedAnalysis: false
        };
        
        try {
            const startTime = performance.now();
            let result;
            
            if (this.backend === 'python') {
                const response = await this.api.computeFourier(params);
                result = response.data;
            } else {
                result = this.computeClientSide(params);
            }
            
            const endTime = performance.now();
            
            this.renderResult(result);
            
            this.status.textContent = `Analyzed in ${Math.round(endTime - startTime)}ms (${this.backend})`;
            this.status.className = 'status success';
            
        } catch (error) {
            console.error('Fourier computation error:', error);
            this.status.textContent = `Error: ${error.message}`;
            this.status.className = 'status error';
        } finally {
            this.isComputing = false;
        }
    }
    
    computeClientSide(params) {
        const { waveType, frequency, amplitude, sampleRate, duration } = params;
        
        
        const time = [];
        const signal = [];
        const dt = duration / sampleRate;
        
        for (let i = 0; i < sampleRate; i++) {
            const t = i * dt;
            time.push(t);
            
            let value = 0;
            switch (waveType) {
                case 'sine':
                    value = amplitude * Math.sin(2 * Math.PI * frequency * t);
                    break;
                case 'square':
                    value = amplitude * Math.sign(Math.sin(2 * Math.PI * frequency * t));
                    break;
                case 'triangle':
                    value = amplitude * (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
                    break;
                case 'sawtooth':
                    value = amplitude * (2 * (t * frequency - Math.floor(t * frequency + 0.5)));
                    break;
            }
            signal.push(value);
        }
        
    
        const N = signal.length;
        const frequencies = [];
        const magnitude = [];
        
        for (let k = 0; k < N / 2; k++) {
            let realSum = 0;
            let imagSum = 0;
            
            for (let n = 0; n < N; n++) {
                const angle = -2 * Math.PI * k * n / N;
                realSum += signal[n] * Math.cos(angle);
                imagSum += signal[n] * Math.sin(angle);
            }
            
            const freq = k * sampleRate / N;
            const mag = Math.sqrt(realSum * realSum + imagSum * imagSum) * 2 / N;
            
            frequencies.push(freq);
            magnitude.push(mag);
        }
        
        return { time, signal, frequencies, magnitude };
    }
    
    renderResult(data) {
        const { time, signal, frequencies, magnitude } = data;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const midHeight = this.canvas.height / 2;
        
        
        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = '14px Inter';
        this.ctx.fillText('Time Domain', 10, 20);
        
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let i = 0; i < signal.length; i++) {
            const x = (i / signal.length) * this.canvas.width;
            const y = midHeight / 2 - signal[i] * 50;
            
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        
        
        this.ctx.fillStyle = '#00ff88';
        this.ctx.fillText('Frequency Domain', 10, midHeight + 20);
        
        
        const maxAmplitude = Math.max(...magnitude);
        const scale = maxAmplitude > 0 ? (midHeight - 40) / maxAmplitude : 1;
        
        this.ctx.fillStyle = '#00ff88';
        const barWidth = this.canvas.width / magnitude.length;
        
        for (let i = 0; i < magnitude.length; i++) {
            const x = i * barWidth;
            const height = magnitude[i] * scale;
            const y = this.canvas.height - height;
            
            if (height > 1) {
                this.ctx.fillRect(x, y, Math.max(barWidth - 1, 1), height);
            }
        }
        
    
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '12px Inter';
        const maxFreq = Math.max(...frequencies);
        
        for (let i = 0; i < 5; i++) {
            const freq = (i / 4) * maxFreq;
            const x = (i / 4) * this.canvas.width;
            this.ctx.fillText(Math.round(freq) + 'Hz', x, this.canvas.height - 5);
        }
        
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, midHeight);
        this.ctx.lineTo(this.canvas.width, midHeight);
        this.ctx.stroke();
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.status.textContent = 'Cleared';
        this.status.className = 'status';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new MathVisualizerApp();
});