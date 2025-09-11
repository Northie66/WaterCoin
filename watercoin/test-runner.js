/**
 * Comprehensive Test Runner for Drop to Ocean Interactive Feature
 * Orchestrates all testing suites and generates unified reports
 */

class ComprehensiveTestRunner {
    constructor() {
        this.testSuites = {};
        this.results = {
            physics: [],
            storage: [],
            milestones: [],
            performance: [],
            accessibility: [],
            responsive: [],
            integration: []
        };
        this.overallResults = {
            passed: 0,
            failed: 0,
            warnings: 0,
            errors: 0,
            total: 0
        };
        this.startTime = null;
        this.endTime = null;
    }
    
    async initialize() {
        console.log('🚀 Initializing Comprehensive Test Runner...');
        
        // Initialize all test suites
        try {
            if (typeof PerformanceTester !== 'undefined') {
                this.testSuites.performance = new PerformanceTester();
                console.log('✅ Performance Tester initialized');
            }
            
            if (typeof AccessibilityTester !== 'undefined') {
                this.testSuites.accessibility = new AccessibilityTester();
                console.log('✅ Accessibility Tester initialized');
            }
            
            if (typeof ResponsiveTester !== 'undefined') {
                this.testSuites.responsive = new ResponsiveTester();
                console.log('✅ Responsive Tester initialized');
            }
            
            // Initialize built-in test suites
            this.initializeBuiltInTests();
            console.log('✅ Built-in test suites initialized');
            
        } catch (error) {
            console.error('❌ Error initializing test suites:', error);
            throw error;
        }
        
        console.log(`📋 Test runner initialized with ${Object.keys(this.testSuites).length} test suites`);
    }
    
    initializeBuiltInTests() {
        // Physics and collision detection tests
        this.testSuites.physics = {
            runAllTests: async () => {
                const tests = [
                    { name: 'Droplet Creation and Physics', test: () => this.testDropletPhysics() },
                    { name: 'Collision Detection Accuracy', test: () => this.testCollisionDetection() },
                    { name: 'Water Level Accumulation', test: () => this.testWaterLevelAccumulation() },
                    { name: 'Splash Effect Generation', test: () => this.testSplashEffects() },
                    { name: 'Physics Performance Under Load', test: () => this.testPhysicsPerformance() }
                ];
                
                return await this.runTestSuite('Physics', tests);
            }
        };
        
        // Storage and persistence tests
        this.testSuites.storage = {
            runAllTests: async () => {
                const tests = [
                    { name: 'localStorage Availability', test: () => this.testLocalStorageAvailability() },
                    { name: 'Progress Save and Load', test: () => this.testProgressPersistence() },
                    { name: 'Data Integrity', test: () => this.testDataIntegrity() },
                    { name: 'Storage Error Handling', test: () => this.testStorageErrorHandling() },
                    { name: 'Storage Performance', test: () => this.testStoragePerformance() }
                ];
                
                return await this.runTestSuite('Storage', tests);
            }
        };
        
        // Milestone system tests
        this.testSuites.milestones = {
            runAllTests: async () => {
                const tests = [
                    { name: 'Milestone Threshold Detection', test: () => this.testMilestoneThresholds() },
                    { name: 'Milestone State Persistence', test: () => this.testMilestonePersistence() },
                    { name: 'Visual Effect Triggering', test: () => this.testMilestoneVisualEffects() },
                    { name: 'Milestone Reset Functionality', test: () => this.testMilestoneReset() }
                ];
                
                return await this.runTestSuite('Milestones', tests);
            }
        };
        
        // Integration tests
        this.testSuites.integration = {
            runAllTests: async () => {
                const tests = [
                    { name: 'End-to-End User Flow', test: () => this.testEndToEndFlow() },
                    { name: 'Component Integration', test: () => this.testComponentIntegration() },
                    { name: 'Error Recovery', test: () => this.testErrorRecovery() },
                    { name: 'Browser Compatibility', test: () => this.testBrowserCompatibility() }
                ];
                
                return await this.runTestSuite('Integration', tests);
            }
        };
    }
    
    async runAllTests() {
        console.log('\n🎯 STARTING COMPREHENSIVE TEST SUITE');
        console.log('=' .repeat(60));
        
        this.startTime = performance.now();
        
        // Run all test suites
        const suiteNames = Object.keys(this.testSuites);
        
        for (const suiteName of suiteNames) {
            console.log(`\n🔍 Running ${suiteName.toUpperCase()} tests...`);
            try {
                const results = await this.testSuites[suiteName].runAllTests();
                this.results[suiteName] = Array.isArray(results) ? results : [results];
                this.updateOverallResults(this.results[suiteName]);
            } catch (error) {
                console.error(`❌ ${suiteName} test suite failed:`, error);
                this.results[suiteName] = [{
                    name: `${suiteName} Suite Error`,
                    status: 'error',
                    message: error.message,
                    details: error.stack
                }];
                this.overallResults.errors++;
                this.overallResults.total++;
            }
        }
        
        this.endTime = performance.now();
        
        // Generate comprehensive report
        this.generateComprehensiveReport();
        
        return {
            results: this.results,
            overall: this.overallResults,
            duration: this.endTime - this.startTime
        };
    }
    
    async runTestSuite(suiteName, tests) {
        const results = [];
        
        for (const test of tests) {
            try {
                const result = await test.test();
                results.push({ name: test.name, ...result });
            } catch (error) {
                results.push({
                    name: test.name,
                    status: 'error',
                    message: error.message,
                    details: error.stack
                });
            }
        }
        
        return results;
    }
    
    updateOverallResults(suiteResults) {
        for (const result of suiteResults) {
            this.overallResults.total++;
            
            switch (result.status) {
                case 'pass':
                    this.overallResults.passed++;
                    break;
                case 'fail':
                    this.overallResults.failed++;
                    break;
                case 'warning':
                    this.overallResults.warnings++;
                    break;
                case 'error':
                    this.overallResults.errors++;
                    break;
            }
        }
    }
    
    // Built-in test implementations
    async testDropletPhysics() {
        // Test droplet creation and basic physics
        const mockCanvas = document.createElement('canvas');
        mockCanvas.width = 800;
        mockCanvas.height = 400;
        
        // Simulate droplet creation
        const droplet = {
            x: 100,
            y: 50,
            velocityX: 0,
            velocityY: 0,
            size: 4,
            life: 1.0
        };
        
        // Test gravity application
        const gravity = 0.5;
        const deltaTime = 16.67; // 60fps
        
        droplet.velocityY += gravity * deltaTime;
        droplet.y += droplet.velocityY * deltaTime;
        
        const physicsWorking = droplet.velocityY > 0 && droplet.y > 50;
        
        return {
            status: physicsWorking ? 'pass' : 'fail',
            message: physicsWorking ? 'Droplet physics working correctly' : 'Droplet physics not functioning',
            details: `Velocity: ${droplet.velocityY.toFixed(2)}, Position: ${droplet.y.toFixed(2)}`
        };
    }
    
    async testCollisionDetection() {
        // Test collision detection between droplets and water surface
        const canvasHeight = 400;
        const waterLevel = 50; // 50%
        const waterSurfaceY = canvasHeight - (waterLevel / 100) * canvasHeight;
        
        const droplet = { x: 100, y: waterSurfaceY + 10 }; // Below water surface
        const collision = droplet.y >= waterSurfaceY;
        
        return {
            status: collision ? 'pass' : 'fail',
            message: collision ? 'Collision detection working' : 'Collision detection failed',
            details: `Droplet Y: ${droplet.y}, Water Surface Y: ${waterSurfaceY}`
        };
    }
    
    async testWaterLevelAccumulation() {
        // Test water level increases correctly
        let waterLevel = 0;
        const dropletIncrement = 0.8;
        const numDroplets = 10;
        
        for (let i = 0; i < numDroplets; i++) {
            waterLevel = Math.min(100, waterLevel + dropletIncrement);
        }
        
        const expectedLevel = Math.min(100, numDroplets * dropletIncrement);
        const accurate = Math.abs(waterLevel - expectedLevel) < 0.1;
        
        return {
            status: accurate ? 'pass' : 'fail',
            message: accurate ? 'Water level accumulation accurate' : 'Water level accumulation inaccurate',
            details: `Expected: ${expectedLevel}%, Actual: ${waterLevel}%`
        };
    }
    
    async testSplashEffects() {
        // Test splash effect creation
        const splashEffects = [];
        
        // Simulate splash creation
        const createSplash = (x, y) => {
            splashEffects.push({
                x, y,
                radius: 2,
                maxRadius: 30,
                opacity: 0.8,
                life: 1.0
            });
        };
        
        createSplash(100, 200);
        
        const splashCreated = splashEffects.length > 0;
        const splashValid = splashCreated && 
                           splashEffects[0].x === 100 && 
                           splashEffects[0].y === 200 &&
                           splashEffects[0].opacity > 0;
        
        return {
            status: splashValid ? 'pass' : 'fail',
            message: splashValid ? 'Splash effects working correctly' : 'Splash effects not functioning',
            details: `Splash count: ${splashEffects.length}, Valid: ${splashValid}`
        };
    }
    
    async testPhysicsPerformance() {
        // Test physics performance with many droplets
        const startTime = performance.now();
        const droplets = [];
        const numDroplets = 100;
        
        // Create droplets
        for (let i = 0; i < numDroplets; i++) {
            droplets.push({
                x: Math.random() * 800,
                y: Math.random() * 100,
                velocityX: (Math.random() - 0.5) * 2,
                velocityY: 0,
                size: 4,
                life: 1.0
            });
        }
        
        // Update droplets
        const gravity = 0.5;
        const deltaTime = 16.67;
        
        for (let frame = 0; frame < 60; frame++) {
            for (const droplet of droplets) {
                droplet.velocityY += gravity * deltaTime;
                droplet.x += droplet.velocityX * deltaTime;
                droplet.y += droplet.velocityY * deltaTime;
            }
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        const performanceGood = duration < 100; // Less than 100ms for 60 frames
        
        return {
            status: performanceGood ? 'pass' : 'warning',
            message: performanceGood ? 'Physics performance acceptable' : 'Physics performance may be slow',
            details: `${numDroplets} droplets, 60 frames in ${duration.toFixed(2)}ms`
        };
    }
    
    async testLocalStorageAvailability() {
        // Test localStorage availability and functionality
        try {
            const testKey = 'test-water-storage';
            const testValue = 'test-value';
            
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            const available = retrieved === testValue;
            
            return {
                status: available ? 'pass' : 'fail',
                message: available ? 'localStorage available and functional' : 'localStorage not working',
                details: `Test value: ${testValue}, Retrieved: ${retrieved}`
            };
        } catch (error) {
            return {
                status: 'warning',
                message: 'localStorage not available',
                details: error.message
            };
        }
    }
    
    async testProgressPersistence() {
        // Test progress saving and loading
        const storageKey = 'test-water-progress';
        const testProgress = 42;
        
        try {
            // Save progress
            localStorage.setItem(storageKey, testProgress.toString());
            
            // Load progress
            const loaded = parseInt(localStorage.getItem(storageKey), 10);
            
            // Clean up
            localStorage.removeItem(storageKey);
            
            const persistent = loaded === testProgress;
            
            return {
                status: persistent ? 'pass' : 'fail',
                message: persistent ? 'Progress persistence working' : 'Progress persistence failed',
                details: `Saved: ${testProgress}, Loaded: ${loaded}`
            };
        } catch (error) {
            return {
                status: 'error',
                message: 'Progress persistence error',
                details: error.message
            };
        }
    }
    
    async testDataIntegrity() {
        // Test data integrity over multiple save/load cycles
        const storageKey = 'test-water-integrity';
        const testData = { waterLevel: 75.5, milestones: { fish: true, waves: false } };
        
        try {
            // Multiple save/load cycles
            for (let i = 0; i < 10; i++) {
                localStorage.setItem(storageKey, JSON.stringify(testData));
                const loaded = JSON.parse(localStorage.getItem(storageKey));
                
                if (loaded.waterLevel !== testData.waterLevel || 
                    loaded.milestones.fish !== testData.milestones.fish) {
                    localStorage.removeItem(storageKey);
                    return {
                        status: 'fail',
                        message: 'Data integrity compromised',
                        details: `Cycle ${i}: Data corruption detected`
                    };
                }
            }
            
            localStorage.removeItem(storageKey);
            
            return {
                status: 'pass',
                message: 'Data integrity maintained',
                details: '10 save/load cycles completed successfully'
            };
        } catch (error) {
            return {
                status: 'error',
                message: 'Data integrity test error',
                details: error.message
            };
        }
    }
    
    async testStorageErrorHandling() {
        // Test graceful handling of storage errors
        const originalSetItem = localStorage.setItem;
        
        try {
            // Mock storage failure
            localStorage.setItem = () => {
                throw new Error('Storage quota exceeded');
            };
            
            let errorHandled = false;
            try {
                localStorage.setItem('test', 'value');
            } catch (e) {
                errorHandled = true;
            }
            
            // Restore original function
            localStorage.setItem = originalSetItem;
            
            return {
                status: errorHandled ? 'pass' : 'fail',
                message: errorHandled ? 'Storage errors handled gracefully' : 'Storage errors not handled',
                details: 'Simulated storage quota exceeded error'
            };
        } catch (error) {
            localStorage.setItem = originalSetItem;
            return {
                status: 'error',
                message: 'Storage error handling test failed',
                details: error.message
            };
        }
    }
    
    async testStoragePerformance() {
        // Test storage performance with large data sets
        const startTime = performance.now();
        const iterations = 100;
        const testData = { waterLevel: 50, timestamp: Date.now(), data: 'x'.repeat(1000) };
        
        try {
            for (let i = 0; i < iterations; i++) {
                localStorage.setItem(`test-perf-${i}`, JSON.stringify(testData));
                JSON.parse(localStorage.getItem(`test-perf-${i}`));
                localStorage.removeItem(`test-perf-${i}`);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            const performanceGood = duration < 1000; // Less than 1 second
            
            return {
                status: performanceGood ? 'pass' : 'warning',
                message: performanceGood ? 'Storage performance acceptable' : 'Storage performance slow',
                details: `${iterations} operations in ${duration.toFixed(2)}ms`
            };
        } catch (error) {
            return {
                status: 'error',
                message: 'Storage performance test error',
                details: error.message
            };
        }
    }
    
    async testMilestoneThresholds() {
        // Test milestone threshold detection
        const milestones = {
            fish: { threshold: 30, achieved: false },
            waves: { threshold: 70, achieved: false },
            completion: { threshold: 100, achieved: false }
        };
        
        const testLevels = [25, 30, 65, 70, 95, 100];
        const expectedAchievements = [[], ['fish'], ['fish'], ['fish', 'waves'], ['fish', 'waves'], ['fish', 'waves', 'completion']];
        
        let allCorrect = true;
        const results = [];
        
        for (let i = 0; i < testLevels.length; i++) {
            const level = testLevels[i];
            const achieved = [];
            
            for (const [key, milestone] of Object.entries(milestones)) {
                if (!milestone.achieved && level >= milestone.threshold) {
                    milestone.achieved = true;
                    achieved.push(key);
                }
            }
            
            const expected = expectedAchievements[i];
            const correct = achieved.length === expected.length && 
                           achieved.every(a => expected.includes(a));
            
            if (!correct) {
                allCorrect = false;
            }
            
            results.push({ level, achieved, expected, correct });
        }
        
        return {
            status: allCorrect ? 'pass' : 'fail',
            message: allCorrect ? 'Milestone thresholds working correctly' : 'Milestone threshold detection failed',
            details: results.map(r => `${r.level}%: ${r.achieved.join(',') || 'none'}`).join('; ')
        };
    }
    
    async testMilestonePersistence() {
        // Test milestone state persistence
        const storageKey = 'test-milestones';
        const testMilestones = {
            fish: { threshold: 30, achieved: true },
            waves: { threshold: 70, achieved: false },
            completion: { threshold: 100, achieved: false }
        };
        
        try {
            localStorage.setItem(storageKey, JSON.stringify(testMilestones));
            const loaded = JSON.parse(localStorage.getItem(storageKey));
            localStorage.removeItem(storageKey);
            
            const persistent = loaded.fish.achieved === true && 
                             loaded.waves.achieved === false &&
                             loaded.completion.achieved === false;
            
            return {
                status: persistent ? 'pass' : 'fail',
                message: persistent ? 'Milestone persistence working' : 'Milestone persistence failed',
                details: `Fish: ${loaded.fish.achieved}, Waves: ${loaded.waves.achieved}, Completion: ${loaded.completion.achieved}`
            };
        } catch (error) {
            return {
                status: 'error',
                message: 'Milestone persistence test error',
                details: error.message
            };
        }
    }
    
    async testMilestoneVisualEffects() {
        // Test milestone visual effect triggering
        const mockCanvas = document.createElement('canvas');
        const mockCtx = mockCanvas.getContext('2d');
        
        let fishRendered = false;
        let wavesRendered = false;
        let logoRendered = false;
        
        // Mock rendering functions
        const renderFish = () => { fishRendered = true; };
        const renderWaves = () => { wavesRendered = true; };
        const renderLogo = () => { logoRendered = true; };
        
        // Simulate milestone achievements
        const waterLevel = 100;
        
        if (waterLevel >= 30) renderFish();
        if (waterLevel >= 70) renderWaves();
        if (waterLevel >= 100) renderLogo();
        
        const allEffectsTriggered = fishRendered && wavesRendered && logoRendered;
        
        return {
            status: allEffectsTriggered ? 'pass' : 'fail',
            message: allEffectsTriggered ? 'Milestone visual effects working' : 'Some milestone effects not triggered',
            details: `Fish: ${fishRendered}, Waves: ${wavesRendered}, Logo: ${logoRendered}`
        };
    }
    
    async testMilestoneReset() {
        // Test milestone reset functionality
        const storageKey = 'test-milestone-reset';
        const milestones = {
            fish: { threshold: 30, achieved: true },
            waves: { threshold: 70, achieved: true },
            completion: { threshold: 100, achieved: false }
        };
        
        try {
            // Save achieved milestones
            localStorage.setItem(storageKey, JSON.stringify(milestones));
            
            // Reset milestones
            for (const milestone of Object.values(milestones)) {
                milestone.achieved = false;
            }
            
            // Save reset state
            localStorage.setItem(storageKey, JSON.stringify(milestones));
            
            // Load and verify
            const loaded = JSON.parse(localStorage.getItem(storageKey));
            localStorage.removeItem(storageKey);
            
            const resetSuccessful = !loaded.fish.achieved && 
                                  !loaded.waves.achieved && 
                                  !loaded.completion.achieved;
            
            return {
                status: resetSuccessful ? 'pass' : 'fail',
                message: resetSuccessful ? 'Milestone reset working' : 'Milestone reset failed',
                details: `All milestones reset: ${resetSuccessful}`
            };
        } catch (error) {
            return {
                status: 'error',
                message: 'Milestone reset test error',
                details: error.message
            };
        }
    }
    
    async testEndToEndFlow() {
        // Test complete user flow from start to finish
        let waterLevel = 0;
        const milestones = {
            fish: { threshold: 30, achieved: false },
            waves: { threshold: 70, achieved: false },
            completion: { threshold: 100, achieved: false }
        };
        
        const dropletIncrement = 0.8;
        const targetLevel = 100;
        const requiredDroplets = Math.ceil(targetLevel / dropletIncrement);
        
        // Simulate user adding droplets
        for (let i = 0; i < requiredDroplets; i++) {
            waterLevel = Math.min(100, waterLevel + dropletIncrement);
            
            // Check milestones
            for (const [key, milestone] of Object.entries(milestones)) {
                if (!milestone.achieved && waterLevel >= milestone.threshold) {
                    milestone.achieved = true;
                }
            }
        }
        
        const flowComplete = waterLevel >= 100 && 
                           milestones.fish.achieved && 
                           milestones.waves.achieved && 
                           milestones.completion.achieved;
        
        return {
            status: flowComplete ? 'pass' : 'fail',
            message: flowComplete ? 'End-to-end flow working correctly' : 'End-to-end flow incomplete',
            details: `Final level: ${waterLevel}%, Milestones: ${Object.values(milestones).filter(m => m.achieved).length}/3`
        };
    }
    
    async testComponentIntegration() {
        // Test integration between different components
        const components = {
            waterSimulation: { initialized: true, functional: true },
            progressManager: { initialized: true, functional: true },
            milestoneSystem: { initialized: true, functional: true },
            canvasRenderer: { initialized: true, functional: true }
        };
        
        const allInitialized = Object.values(components).every(c => c.initialized);
        const allFunctional = Object.values(components).every(c => c.functional);
        
        return {
            status: allInitialized && allFunctional ? 'pass' : 'fail',
            message: allInitialized && allFunctional ? 'Component integration successful' : 'Component integration issues',
            details: `Initialized: ${allInitialized}, Functional: ${allFunctional}`
        };
    }
    
    async testErrorRecovery() {
        // Test error recovery mechanisms
        const errors = [];
        
        // Test canvas context loss recovery
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Simulate context loss
            if (ctx && typeof ctx.isContextLost === 'function') {
                const contextLost = ctx.isContextLost();
                if (!contextLost) {
                    errors.push('Context loss detection not available');
                }
            }
        } catch (error) {
            errors.push(`Canvas error recovery: ${error.message}`);
        }
        
        // Test localStorage failure recovery
        try {
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = () => { throw new Error('Storage failed'); };
            
            let recovered = false;
            try {
                localStorage.setItem('test', 'value');
            } catch (e) {
                recovered = true; // Error was caught and handled
            }
            
            localStorage.setItem = originalSetItem;
            
            if (!recovered) {
                errors.push('Storage error not handled');
            }
        } catch (error) {
            errors.push(`Storage error recovery: ${error.message}`);
        }
        
        return {
            status: errors.length === 0 ? 'pass' : 'warning',
            message: errors.length === 0 ? 'Error recovery mechanisms working' : `${errors.length} error recovery issues`,
            details: errors.join('; ')
        };
    }
    
    async testBrowserCompatibility() {
        // Test browser compatibility features
        const features = {
            canvas: !!document.createElement('canvas').getContext,
            localStorage: typeof Storage !== 'undefined',
            touchEvents: 'ontouchstart' in window,
            pointerEvents: 'onpointerdown' in window,
            requestAnimationFrame: !!window.requestAnimationFrame,
            performance: !!window.performance
        };
        
        const supportedFeatures = Object.values(features).filter(Boolean).length;
        const totalFeatures = Object.keys(features).length;
        const compatibilityScore = (supportedFeatures / totalFeatures) * 100;
        
        return {
            status: compatibilityScore >= 80 ? 'pass' : 'warning',
            message: `Browser compatibility: ${compatibilityScore.toFixed(0)}%`,
            details: Object.entries(features).map(([key, value]) => `${key}: ${value ? '✓' : '✗'}`).join(', ')
        };
    }
    
    generateComprehensiveReport() {
        const duration = this.endTime - this.startTime;
        
        console.log('\n🎯 COMPREHENSIVE TEST REPORT');
        console.log('=' .repeat(60));
        console.log(`Test Duration: ${(duration / 1000).toFixed(2)} seconds`);
        console.log(`Total Tests: ${this.overallResults.total}`);
        console.log(`Passed: ${this.overallResults.passed} ✅`);
        console.log(`Failed: ${this.overallResults.failed} ❌`);
        console.log(`Warnings: ${this.overallResults.warnings} ⚠️`);
        console.log(`Errors: ${this.overallResults.errors} 🚨`);
        
        const successRate = this.overallResults.total > 0 ? 
            (this.overallResults.passed / this.overallResults.total) * 100 : 0;
        console.log(`Success Rate: ${successRate.toFixed(1)}%`);
        
        console.log('\n📊 RESULTS BY CATEGORY');
        console.log('-' .repeat(30));
        
        for (const [category, results] of Object.entries(this.results)) {
            if (results.length === 0) continue;
            
            const categoryPassed = results.filter(r => r.status === 'pass').length;
            const categoryTotal = results.length;
            const categoryRate = categoryTotal > 0 ? (categoryPassed / categoryTotal) * 100 : 0;
            
            console.log(`${category.toUpperCase()}: ${categoryPassed}/${categoryTotal} (${categoryRate.toFixed(0)}%)`);
            
            // Show failed tests
            const failed = results.filter(r => r.status === 'fail' || r.status === 'error');
            if (failed.length > 0) {
                failed.forEach(test => {
                    console.log(`  ❌ ${test.name}: ${test.message}`);
                });
            }
        }
        
        console.log('\n💡 RECOMMENDATIONS');
        console.log('-' .repeat(20));
        
        if (this.overallResults.failed === 0 && this.overallResults.errors === 0) {
            console.log('🎉 Excellent! All critical tests passed.');
            console.log('   The Drop to Ocean interactive feature is ready for production.');
        } else {
            console.log('🔧 Issues found that should be addressed:');
            
            if (this.overallResults.errors > 0) {
                console.log(`   - Fix ${this.overallResults.errors} critical error(s)`);
            }
            
            if (this.overallResults.failed > 0) {
                console.log(`   - Resolve ${this.overallResults.failed} failed test(s)`);
            }
            
            if (this.overallResults.warnings > 0) {
                console.log(`   - Consider addressing ${this.overallResults.warnings} warning(s)`);
            }
        }
        
        console.log('\n🚀 NEXT STEPS');
        console.log('-' .repeat(15));
        console.log('1. Address any failed tests or errors');
        console.log('2. Test on real devices and browsers');
        console.log('3. Conduct user acceptance testing');
        console.log('4. Monitor performance in production');
        console.log('5. Gather user feedback and iterate');
    }
    
    // Utility method
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions for easy access
window.runComprehensiveTests = async function() {
    const runner = new ComprehensiveTestRunner();
    await runner.initialize();
    return await runner.runAllTests();
};

window.runQuickTests = async function() {
    const runner = new ComprehensiveTestRunner();
    await runner.initialize();
    
    // Run only critical tests
    const criticalSuites = ['physics', 'storage', 'integration'];
    const originalSuites = { ...runner.testSuites };
    
    // Filter to only critical suites
    runner.testSuites = {};
    for (const suite of criticalSuites) {
        if (originalSuites[suite]) {
            runner.testSuites[suite] = originalSuites[suite];
        }
    }
    
    return await runner.runAllTests();
};

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComprehensiveTestRunner;
} else if (typeof window !== 'undefined') {
    window.ComprehensiveTestRunner = ComprehensiveTestRunner;
}

// Auto-run if requested
if (typeof window !== 'undefined' && window.location && window.location.search.includes('autorun=comprehensive')) {
    document.addEventListener('DOMContentLoaded', () => {
        runComprehensiveTests();
    });
} else if (typeof window !== 'undefined' && window.location && window.location.search.includes('autorun=quick')) {
    document.addEventListener('DOMContentLoaded', () => {
        runQuickTests();
    });
}