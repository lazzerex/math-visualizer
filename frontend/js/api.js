class MathAPI {
    constructor(baseURL = 'http://localhost:5000/api') {
        this.baseURL = baseURL;
        this.timeout = 30000; 
    }
    
    async makeRequest(endpoint, data = null, method = 'GET') {
        const url = `${this.baseURL}/${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(this.timeout)
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || `HTTP ${response.status}`);
            }
            
            return result;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - computation took too long');
            }
            throw error;
        }
    }
    
    async healthCheck() {
        return this.makeRequest('health');
    }
    
    async computeMandelbrot(params) {
        return this.makeRequest('mandelbrot', params, 'POST');
    }
    
    async computeFourier(params) {
        return this.makeRequest('fourier', params, 'POST');
    }
    
    async analyzeSignal(params) {
        return this.makeRequest('analyze', params, 'POST');
    }
}