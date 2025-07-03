class MathVisualizerApp {
    constructor() {
        this.api = new MathAPI();
        this.mandelbrot = null;
        this.fourier = null;
        this.currentBackend = 'python'; 
        this.init();
    }
    
    async init() {
        try {
            // Check backend health
            const health = await this.api.healthCheck();
            console.log('Backend connected:', health);
            this.showStatus('Backend connected: ' + health.version, 'success');
        } catch (error) {
            console.warn('Backend unavailable, falling back to client-side computation');
            this.currentBackend = 'javascript';
            this.showStatus('Using client-side computation', 'warning');
        }
        
        this.setupTabs();
        this.setupEventListeners();
        this.setupBackendToggle();
        
        
        this.mandelbrot = new MandelbrotVisualizer(this.api, this.currentBackend);
        this.fourier = new FourierVisualizer(this.api, this.currentBackend);
    }
    
    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }
    
    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === '1') this.switchTab('mandelbrot');
            if (e.key === '2') this.switchTab('fourier');
        });
    }
    
    setupBackendToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'backend-toggle';
        toggle.innerHTML = `
            <label>
                <input type="checkbox" id="backend-toggle" ${this.currentBackend === 'python' ? 'checked' : ''}>
                <span>Python Backend</span>
            </label>
        `;
        
        document.querySelector('.tabs').appendChild(toggle);
        
        document.getElementById('backend-toggle').addEventListener('change', (e) => {
            this.currentBackend = e.target.checked ? 'python' : 'javascript';
            this.mandelbrot.setBackend(this.currentBackend);
            this.fourier.setBackend(this.currentBackend);
            this.showStatus(`Switched to ${this.currentBackend} backend`, 'info');
        });
    }
    
    showStatus(message, type = 'info') {
        const statusEl = document.getElementById('global-status');
        if (!statusEl) {
            const status = document.createElement('div');
            status.id = 'global-status';
            status.className = 'global-status';
            document.body.appendChild(status);
        }
        
        const statusEl2 = document.getElementById('global-status');
        statusEl2.textContent = message;
        statusEl2.className = `global-status ${type}`;
        
        setTimeout(() => {
            if (statusEl2) statusEl2.remove();
        }, 5000);
    }
}