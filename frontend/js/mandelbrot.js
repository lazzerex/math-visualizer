class MandelbrotVisualizer {
    constructor(api, backend) {
        this.api = api;
        this.backend = backend;
        this.canvas = document.getElementById('mandelbrotCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.status = document.getElementById('mandelbrotStatus');
        this.isComputing = false;
        document.getElementById('mandelbrotRender').addEventListener('click', () => this.render());
        document.getElementById('mandelbrotReset').addEventListener('click', () => this.reset());
        this.setupEventListeners();
        this.render();
    }
    
    setBackend(backend) {
        this.backend = backend;
    }
    
    setupEventListeners() {
       
        this.canvas.addEventListener('click', (e) => {
            if (this.isComputing) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            
            const zoom = parseFloat(document.getElementById('zoom').value);
            const centerX = parseFloat(document.getElementById('centerX').value);
            const centerY = parseFloat(document.getElementById('centerY').value);
            
            const newCenterX = centerX + (x - this.canvas.width / 2) / (this.canvas.width / 4 * zoom);
            const newCenterY = centerY + (y - this.canvas.height / 2) / (this.canvas.height / 4 * zoom);
            
            document.getElementById('centerX').value = newCenterX.toFixed(6);
            document.getElementById('centerY').value = newCenterY.toFixed(6);
            document.getElementById('zoom').value = (zoom * 2).toFixed(1);
            
            this.render();
        });
    }
    
    async render() {
        if (this.isComputing) return;
        
        this.isComputing = true;
        this.status.textContent = 'Computing...';
        this.status.className = 'status computing';
        
        const params = {
            width: this.canvas.width,
            height: this.canvas.height,
            maxIter: parseInt(document.getElementById('maxIter').value),
            zoom: parseFloat(document.getElementById('zoom').value),
            centerX: parseFloat(document.getElementById('centerX').value),
            centerY: parseFloat(document.getElementById('centerY').value)
        };
        
        try {
            const startTime = performance.now();
            let result;
            
            if (this.backend === 'python') {
                const response = await this.api.computeMandelbrot(params);
                result = response.data.iterations;
            } else {
                result = this.computeClientSide(params);
            }
            
            const endTime = performance.now();
            
            this.renderResult(result, params.width, params.height);
            
            this.status.textContent = `Rendered in ${Math.round(endTime - startTime)}ms (${this.backend})`;
            this.status.className = 'status success';
            
        } catch (error) {
            console.error('Mandelbrot computation error:', error);
            this.status.textContent = `Error: ${error.message}`;
            this.status.className = 'status error';
        } finally {
            this.isComputing = false;
        }
    }
    
    computeClientSide(params) {
        const { width, height, maxIter, zoom, centerX, centerY } = params;
        const result = [];
        
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const c_re = (x - width / 2) / (width / 4 * zoom) + centerX;
                const c_im = (y - height / 2) / (height / 4 * zoom) + centerY;
                
                const iter = this.mandelbrotIteration(c_re, c_im, maxIter);
                row.push(iter);
            }
            result.push(row);
        }
        
        return result;
    }
    
    mandelbrotIteration(c_re, c_im, maxIter) {
        let z_re = 0, z_im = 0;
        let iter = 0;
        
        while (iter < maxIter && z_re * z_re + z_im * z_im < 4) {
            const temp = z_re * z_re - z_im * z_im + c_re;
            z_im = 2 * z_re * z_im + c_im;
            z_re = temp;
            iter++;
        }
        
        return iter;
    }
    
    renderResult(iterations, width, height) {
        const imageData = this.ctx.createImageData(width, height);
        const maxIter = parseInt(document.getElementById('maxIter').value);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const iter = iterations[y][x];
                const pixelIndex = (y * width + x) * 4;
                
                if (iter === maxIter) {
                    imageData.data[pixelIndex] = 0;
                    imageData.data[pixelIndex + 1] = 0;
                    imageData.data[pixelIndex + 2] = 0;
                } else {
                    const color = this.getColor(iter / maxIter);
                    imageData.data[pixelIndex] = color[0];
                    imageData.data[pixelIndex + 1] = color[1];
                    imageData.data[pixelIndex + 2] = color[2];
                }
                imageData.data[pixelIndex + 3] = 255;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    getColor(ratio) {
        const hue = ratio * 300;
        return this.hslToRgb(hue / 360, 0.7, 0.5);
    }
    
    hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    
    reset() {
        document.getElementById('maxIter').value = '100';
        document.getElementById('zoom').value = '1';
        document.getElementById('centerX').value = '0';
        document.getElementById('centerY').value = '0';
        this.render();
    }
}