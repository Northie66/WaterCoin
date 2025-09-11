/**
 * Performance Testing Script for Drop to Ocean Interactive Feature
 * Tests performance under various load conditions and validates optimization features
 */

class PerformanceTester {
    constructor() {
        this.results = [];
        this.isRunning = false;
        this.testCanvas = null;
        this.testCtx = null;
        this.frameRateMonitor = null;
        this.performanceScaler = null;
        
        this.setupTestEnvironment();
    }
    
    setupTestEnvironment() {
        // Create test canvas if not exists
        if (!document.getElementById('perf-test-canvas')) {
            this.testCanvas = document.createElement('canvas');
            this.testCanvas.id = 'perf-test-canvas';
            this.testCanvas.width = 800;
            this.testCanvas.height = 400;
            this.testCanvas.style.display = 'none';
            document.body.appendChild(this.testCanvas);
        } else {
            this.testCanvas = document.getElementById('perf-test-canvas');
        }
        
        this.testCtx = this.testCanvas.getContext('2d');
        
        // Initialize performance monitoring
        this.frameRateMonitor = new FrameRateMonitor();
        this.performanceScaler = new PerformanceScaler();
    }
    
    async runAllPerformanceTests() {
        console.log('🚀 Starting comprehensive performance tests...');
        this.results = [];
        
        const tests = [
            { name: 'Baseline Performance', test: () => this.testBaselinePerformance() },
            { name: 'Heavy Droplet Load', test: () => this.testHeavyDropletLoad() },
            { name: 'Rapid Click Simulation', test: () => this.testRapidClickSimulation() },
            { name: 'Memory Usage Stability', test: () => this.testMemoryUsageStability() },
            { name: 'Frame Rate Consistency', test: () => this.testFrameRateConsistency() },
            { name: 'Performance Scaling', test: () => this.testPerformanceScaling() },
            { name: 'Canvas Rendering Efficiency', test: () => this.testCanvasRenderingEfficiency() },
            { name: 'Object Pool Efficiency', test: () => this.testObjectPoolEfficiency() }
        ];
        
        for (const test of tests) {
            console.log(`\n🧪 Running: ${test.name}`);
            try {
                const result = await test.test();
                this.results.push({ name: test.name, ...result });
                console.log(`✅ ${test.name}: ${result.status} - ${result.message}`);
                if (result.details) {
                    console.log(`   Details: ${result.details}`);
                }
            } catch (error) {
                console.error(`❌ ${test.name} failed:`, error);
                this.results.push({
                    name: test.name,
                    status: 'error',
                    message: error.message,
                    details: error.stack
                });
            }
            
            // Small delay between tests
            await this.delay(100);
        }
        
        this.generatePerformanceReport();
        return this.results;
    }
    
    async testBaselinePerformance() {
        const startTime = performance.now();
        const iterations = 1000;
        
        // Simulate basic canvas operations
        for (let i = 0; i < iterations; i++) {
            this.testCtx.clearRect(0, 0, this.testCanvas.width, this.testCanvas.height);
            this.testCtx.fillStyle = 'rgba(0, 82, 212, 0.3)';
            this.testCtx.fillRect(i % this.testCanvas.width, i % this.testCanvas.height, 10, 10);
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        const opsPerSecond = (iterations / duration) * 1000;
        
        return {
            status: duration < 50 ? 'pass' : 'warning',
            message: `${iterations} operations in ${duration.toFixed(2)}ms`,
            details: `${opsPerSecond.toFixed(0)} ops/sec`,
            metrics: { duration, opsPerSecond }
        };
    }
    
    async testHeavyDropletLoad() {
        const mockSimulation = new MockWaterSimulationEngine();
        const dropletCount = 100;
        const frameCount = 120; // 2 seconds at 60fps
        
        // Add many droplets
        for (let i = 0; i < dropletCount; i++) {
            mockSimulation.addDroplet(
                Math.random() * this.testCanvas.width,
                Math.random() * 100
            );
        }
        
        const startTime = performance.now();
        
        // Simulate frames
        for (let frame = 0; frame < frameCount; frame++) {
            mockSimulation.update(16.67); // 60fps
            
            // Render droplets
            this.testCtx.clearRect(0, 0, this.testCanvas.width, this.testCanvas.height);
            for (const droplet of mockSimulation.droplets) {
                this.testCtx.beginPath();
                this.testCtx.arc(droplet.x, droplet.y, droplet.size, 0, Math.PI * 2);
                this.testCtx.fillStyle = 'rgba(103, 232, 249, 0.8)';
                this.testCtx.fill();
            }
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        const avgFrameTime = duration / frameCount;
        const estimatedFPS = 1000 / avgFrameTime;
        
        return {
            status: estimatedFPS >= 30 ? 'pass' : 'warning',
            message: `${frameCount} frames with ${dropletCount} droplets`,
            details: `Avg frame time: ${avgFrameTime.toFixed(2)}ms, Est. FPS: ${estimatedFPS.toFixed(1)}`,
            metrics: { duration, avgFrameTime, estimatedFPS, dropletCount }
        };
    }
    
    async testRapidClickSimulation() {
        const mockSimulation = new MockWaterSimulationEngine();
        const clicksPerSecond = 20;
        const testDuration = 3000; // 3 seconds
        const totalClicks = (clicksPerSecond * testDuration) / 1000;
        
        const startTime = performance.now();
        let frameCount = 0;
        
        // Simulate rapid clicking
        const clickInterval = 1000 / clicksPerSecond;
        let lastClickTime = 0;
        let clickCount = 0;
        
        while (performance.now() - startTime < testDuration) {
            const currentTime = performance.now();
            
            // Add droplets at specified rate
            if (currentTime - lastClickTime >= clickInterval && clickCount < totalClicks) {
                mockSimulation.addDroplet(
                    Math.random() * this.testCanvas.width,
                    50
                );
                lastClickTime = currentTime;
                clickCount++;
            }
            
            // Update simulation
            mockSimulation.update(16.67);
            frameCount++;
            
            // Render (simplified)
            if (frameCount % 4 === 0) { // Render every 4th frame to save time
                this.testCtx.clearRect(0, 0, this.testCanvas.width, this.testCanvas.height);
                // Simplified rendering for performance test
                this.testCtx.fillStyle = 'rgba(103, 232, 249, 0.5)';
                this.testCtx.fillRect(0, this.testCanvas.height - (mockSimulation.waterLevel / 100) * this.testCanvas.height, 
                                    this.testCanvas.width, (mockSimulation.waterLevel / 100) * this.testCanvas.height);
            }
            
            await this.delay(1); // Yield control
        }
        
        const endTime = performance.now();
        const actualDuration = endTime - startTime;
        const avgFrameTime = actualDuration / frameCount;
        const estimatedFPS = 1000 / avgFrameTime;
        
        return {
            status: estimatedFPS >= 25 ? 'pass' : 'warning',
            message: `${clickCount} rapid clicks over ${actualDuration.toFixed(0)}ms`,
            details: `${frameCount} frames, Est. FPS: ${estimatedFPS.toFixed(1)}`,
            metrics: { clickCount, frameCount, estimatedFPS, actualDuration }
        };
    }
    
    async testMemoryUsageStability() {
        const mockSimulation = new MockWaterSimulationEngine();
        const cycles = 10;
        const dropletsPerCycle = 50;
        
        const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : null;
        
        for (let cycle = 0; cycle < cycles; cycle++) {
            // Create many droplets
            for (let i = 0; i < dropletsPerCycle; i++) {
                mockSimulation.addDroplet(
                    Math.random() * this.testCanvas.width,
                    50
                );
            }
            
            // Run simulation until all droplets are processed
            let iterations = 0;
            while (mockSimulation.droplets.length > 0 && iterations < 1000) {
                mockSimulation.update(16.67);
                iterations++;
            }
            
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
            
            await this.delay(10);
        }
        
        const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : null;
        
        if (initialMemory && finalMemory) {
            const memoryIncrease = finalMemory - initialMemory;
            const memoryIncreaseKB = memoryIncrease / 1024;
            
            return {
                status: memoryIncreaseKB < 1000 ? 'pass' : 'warning', // Less than 1MB increase
                message: `Memory usage after ${cycles} cycles`,
                details: `Initial: ${(initialMemory/1024/1024).toFixed(2)}MB, Final: ${(finalMemory/1024/1024).toFixed(2)}MB, Increase: ${memoryIncreaseKB.toFixed(2)}KB`,
                metrics: { initialMemory, finalMemory, memoryIncrease }
            };
        } else {
            return {
                status: 'info',
                message: 'Memory API not available',
                details: 'Cannot measure memory usage in this environment',
                metrics: {}
            };
        }
    }
    
    async testFrameRateConsistency() {
        const frameRateMonitor = new FrameRateMonitor();
        const testDuration = 2000; // 2 seconds
        const startTime = performance.now();
        const frameRates = [];
        
        while (performance.now() - startTime < testDuration) {
            frameRateMonitor.update();
            
            // Record FPS every 100ms
            if (frameRates.length === 0 || performance.now() - startTime > frameRates.length * 100) {
                frameRates.push(frameRateMonitor.getCurrentFps());
            }
            
            // Simulate some work
            this.testCtx.clearRect(0, 0, this.testCanvas.width, this.testCanvas.height);
            this.testCtx.fillStyle = 'rgba(0, 82, 212, 0.3)';
            this.testCtx.fillRect(0, 0, 100, 100);
            
            await this.delay(1);
        }
        
        const avgFPS = frameRates.reduce((a, b) => a + b, 0) / frameRates.length;
        const minFPS = Math.min(...frameRates);
        const maxFPS = Math.max(...frameRates);
        const variance = frameRates.reduce((acc, fps) => acc + Math.pow(fps - avgFPS, 2), 0) / frameRates.length;
        const stdDev = Math.sqrt(variance);
        
        return {
            status: stdDev < 10 ? 'pass' : 'warning', // Low standard deviation indicates consistency
            message: `Frame rate consistency over ${testDuration}ms`,
            details: `Avg: ${avgFPS.toFixed(1)} FPS, Range: ${minFPS.toFixed(1)}-${maxFPS.toFixed(1)}, StdDev: ${stdDev.toFixed(2)}`,
            metrics: { avgFPS, minFPS, maxFPS, stdDev, frameRates }
        };
    }
    
    async testPerformanceScaling() {
        const performanceScaler = new PerformanceScaler();
        const mockFrameRateMonitor = new FrameRateMonitor();
        
        // Simulate different performance scenarios
        const scenarios = [
            { name: 'Good Performance', fps: 60 },
            { name: 'Moderate Performance', fps: 45 },
            { name: 'Low Performance', fps: 25 },
            { name: 'Critical Performance', fps: 15 }
        ];
        
        const results = [];
        
        for (const scenario of scenarios) {
            // Mock the frame rate
            mockFrameRateMonitor.fps = scenario.fps;
            
            const initialLevel = performanceScaler.performanceLevel;
            const adjustedLevel = performanceScaler.adjustPerformance(mockFrameRateMonitor);
            
            results.push({
                scenario: scenario.name,
                fps: scenario.fps,
                initialLevel: initialLevel,
                adjustedLevel: adjustedLevel,
                scaledValue: performanceScaler.getScaledValue(10)
            });
            
            await this.delay(50);
        }
        
        const hasScaling = results.some(r => r.adjustedLevel !== r.initialLevel);
        
        return {
            status: hasScaling ? 'pass' : 'warning',
            message: 'Performance scaling behavior',
            details: results.map(r => `${r.scenario}: ${(r.adjustedLevel * 100).toFixed(0)}%`).join(', '),
            metrics: { results }
        };
    }
    
    async testCanvasRenderingEfficiency() {
        const operations = [
            { name: 'Clear Canvas', op: () => this.testCtx.clearRect(0, 0, this.testCanvas.width, this.testCanvas.height) },
            { name: 'Fill Rectangle', op: () => this.testCtx.fillRect(0, 0, 100, 100) },
            { name: 'Draw Circle', op: () => {
                this.testCtx.beginPath();
                this.testCtx.arc(100, 100, 50, 0, Math.PI * 2);
                this.testCtx.fill();
            }},
            { name: 'Draw Text', op: () => this.testCtx.fillText('Test', 100, 100) },
            { name: 'Set Style', op: () => this.testCtx.fillStyle = 'rgba(255, 0, 0, 0.5)' }
        ];
        
        const results = [];
        const iterations = 1000;
        
        for (const operation of operations) {
            const startTime = performance.now();
            
            for (let i = 0; i < iterations; i++) {
                operation.op();
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            const opsPerSecond = (iterations / duration) * 1000;
            
            results.push({
                name: operation.name,
                duration,
                opsPerSecond
            });
        }
        
        const totalOpsPerSecond = results.reduce((sum, r) => sum + r.opsPerSecond, 0);
        
        return {
            status: totalOpsPerSecond > 100000 ? 'pass' : 'warning', // Arbitrary threshold
            message: 'Canvas rendering operation efficiency',
            details: results.map(r => `${r.name}: ${r.opsPerSecond.toFixed(0)} ops/sec`).join(', '),
            metrics: { results, totalOpsPerSecond }
        };
    }
    
    async testObjectPoolEfficiency() {
        const createFn = () => ({ x: 0, y: 0, active: false });
        const pool = new ObjectPool(createFn, 10);
        
        const startTime = performance.now();
        const iterations = 10000;
        
        // Test acquire/release cycle
        for (let i = 0; i < iterations; i++) {
            const obj = pool.acquire();
            obj.x = Math.random() * 100;
            obj.y = Math.random() * 100;
            pool.release(obj);
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        const cyclesPerSecond = (iterations / duration) * 1000;
        
        return {
            status: cyclesPerSecond > 10000 ? 'pass' : 'warning', // 10k cycles per second
            message: 'Object pool acquire/release efficiency',
            details: `${iterations} cycles in ${duration.toFixed(2)}ms, ${cyclesPerSecond.toFixed(0)} cycles/sec`,
            metrics: { duration, cyclesPerSecond, poolSize: pool.getPoolSize(), activeCount: pool.getActiveCount() }
        };
    }
    
    generatePerformanceReport() {
        console.log('\n📊 PERFORMANCE TEST REPORT');
        console.log('=' .repeat(50));
        
        const passed = this.results.filter(r => r.status === 'pass').length;
        const warnings = this.results.filter(r => r.status === 'warning').length;
        const errors = this.results.filter(r => r.status === 'error').length;
        
        console.log(`Total Tests: ${this.results.length}`);
        console.log(`Passed: ${passed} ✅`);
        console.log(`Warnings: ${warnings} ⚠️`);
        console.log(`Errors: ${errors} ❌`);
        console.log('');
        
        // Detailed results
        for (const result of this.results) {
            const icon = { pass: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' }[result.status];
            console.log(`${icon} ${result.name}`);
            console.log(`   ${result.message}`);
            if (result.details) {
                console.log(`   ${result.details}`);
            }
            console.log('');
        }
        
        // Performance recommendations
        this.generateRecommendations();
    }
    
    generateRecommendations() {
        console.log('🎯 PERFORMANCE RECOMMENDATIONS');
        console.log('-'.repeat(30));
        
        const warnings = this.results.filter(r => r.status === 'warning');
        const errors = this.results.filter(r => r.status === 'error');
        
        if (warnings.length === 0 && errors.length === 0) {
            console.log('✨ Excellent! All performance tests passed.');
            console.log('   The implementation appears to be well-optimized.');
        } else {
            if (errors.length > 0) {
                console.log('🚨 Critical Issues:');
                errors.forEach(error => {
                    console.log(`   - ${error.name}: ${error.message}`);
                });
                console.log('');
            }
            
            if (warnings.length > 0) {
                console.log('⚠️ Performance Concerns:');
                warnings.forEach(warning => {
                    console.log(`   - ${warning.name}: ${warning.message}`);
                });
                console.log('');
            }
            
            console.log('💡 Suggested Optimizations:');
            console.log('   - Consider reducing particle counts on low-end devices');
            console.log('   - Implement frame rate limiting for consistent performance');
            console.log('   - Use object pooling to reduce garbage collection');
            console.log('   - Optimize canvas drawing operations');
            console.log('   - Consider using requestAnimationFrame for smooth animations');
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Mock classes for testing (simplified versions)
class MockWaterSimulationEngine {
    constructor() {
        this.waterLevel = 0;
        this.droplets = [];
        this.splashEffects = [];
        this.gravity = 0.5;
        this.dropletIncrement = 0.8;
        this.maxDroplets = 10;
        this.maxSplashEffects = 5;
    }
    
    addDroplet(x, y) {
        if (this.droplets.length >= this.maxDroplets) {
            return false;
        }
        
        this.droplets.push({
            x, y,
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: 0,
            size: 4 + Math.random() * 2,
            life: 1.0,
            splashed: false
        });
        return true;
    }
    
    update(deltaTime) {
        // Update droplets
        for (let i = this.droplets.length - 1; i >= 0; i--) {
            const droplet = this.droplets[i];
            
            droplet.velocityY += this.gravity * deltaTime;
            droplet.x += droplet.velocityX * deltaTime;
            droplet.y += droplet.velocityY * deltaTime;
            
            const waterSurfaceY = 400 - (this.waterLevel / 100) * 300;
            
            if (droplet.y >= waterSurfaceY && !droplet.splashed) {
                droplet.splashed = true;
                this.waterLevel = Math.min(100, this.waterLevel + this.dropletIncrement);
                this.createSplash(droplet.x, waterSurfaceY);
            }
            
            if (droplet.y > 450 || droplet.life <= 0) {
                this.droplets.splice(i, 1);
            } else {
                droplet.life -= deltaTime * 0.001;
            }
        }
        
        // Update splash effects
        for (let i = this.splashEffects.length - 1; i >= 0; i--) {
            const splash = this.splashEffects[i];
            splash.radius += splash.expansionSpeed * deltaTime;
            splash.opacity -= deltaTime * 0.002;
            splash.life -= deltaTime * 0.001;
            
            if (splash.life <= 0 || splash.opacity <= 0) {
                this.splashEffects.splice(i, 1);
            }
        }
    }
    
    createSplash(x, y) {
        if (this.splashEffects.length >= this.maxSplashEffects) {
            this.splashEffects.shift();
        }
        
        this.splashEffects.push({
            x, y,
            radius: 2,
            maxRadius: 30 + Math.random() * 20,
            expansionSpeed: 50 + Math.random() * 30,
            opacity: 0.8,
            life: 1.0
        });
    }
}

class FrameRateMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.fpsHistory = [];
        this.maxHistoryLength = 60;
    }
    
    update() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        
        if (deltaTime > 0) {
            const currentFps = 1000 / deltaTime;
            this.fpsHistory.push(currentFps);
            
            if (this.fpsHistory.length > this.maxHistoryLength) {
                this.fpsHistory.shift();
            }
            
            this.fps = this.getAverageFps();
        }
        
        this.lastTime = currentTime;
        this.frameCount++;
    }
    
    getAverageFps() {
        if (this.fpsHistory.length === 0) return 60;
        const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
        return sum / this.fpsHistory.length;
    }
    
    getCurrentFps() {
        return Math.round(this.fps);
    }
}

class PerformanceScaler {
    constructor() {
        this.performanceLevel = 1.0;
        this.lastAdjustment = 0;
        this.adjustmentCooldown = 2000;
        this.minPerformanceLevel = 0.3;
    }
    
    adjustPerformance(frameRateMonitor) {
        const currentTime = performance.now();
        
        if (currentTime - this.lastAdjustment < this.adjustmentCooldown) {
            return this.performanceLevel;
        }
        
        const fps = frameRateMonitor.getCurrentFps();
        
        if (fps < 20) {
            this.performanceLevel = Math.max(this.minPerformanceLevel, this.performanceLevel * 0.6);
        } else if (fps < 30) {
            this.performanceLevel = Math.max(this.minPerformanceLevel, this.performanceLevel * 0.8);
        } else if (fps > 50 && this.performanceLevel < 1.0) {
            this.performanceLevel = Math.min(1.0, this.performanceLevel * 1.1);
        }
        
        this.lastAdjustment = currentTime;
        return this.performanceLevel;
    }
    
    getScaledValue(baseValue) {
        return Math.max(1, Math.floor(baseValue * this.performanceLevel));
    }
}

class ObjectPool {
    constructor(createFn, initialSize = 10) {
        this.createFn = createFn;
        this.pool = [];
        this.active = [];
        
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }
    
    acquire() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFn();
        }
        
        this.active.push(obj);
        return obj;
    }
    
    release(obj) {
        const index = this.active.indexOf(obj);
        if (index !== -1) {
            this.active.splice(index, 1);
            if (this.pool.length < 50) {
                this.pool.push(obj);
            }
        }
    }
    
    getPoolSize() {
        return this.pool.length;
    }
    
    getActiveCount() {
        return this.active.length;
    }
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceTester;
} else if (typeof window !== 'undefined') {
    window.PerformanceTester = PerformanceTester;
}

// Auto-run if loaded directly
if (typeof window !== 'undefined' && window.location && window.location.search.includes('autorun')) {
    document.addEventListener('DOMContentLoaded', () => {
        const tester = new PerformanceTester();
        tester.runAllPerformanceTests();
    });
}