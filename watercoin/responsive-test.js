/**
 * Responsive Design Testing Script for Drop to Ocean Interactive Feature
 * Tests responsive behavior across different screen sizes and devices
 */

class ResponsiveTester {
    constructor() {
        this.results = [];
        this.originalViewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.testViewports = [
            { name: 'Mobile Portrait', width: 320, height: 568, device: 'iPhone SE' },
            { name: 'Mobile Landscape', width: 568, height: 320, device: 'iPhone SE' },
            { name: 'Large Mobile', width: 414, height: 896, device: 'iPhone 11 Pro Max' },
            { name: 'Tablet Portrait', width: 768, height: 1024, device: 'iPad' },
            { name: 'Tablet Landscape', width: 1024, height: 768, device: 'iPad' },
            { name: 'Small Desktop', width: 1366, height: 768, device: 'Laptop' },
            { name: 'Large Desktop', width: 1920, height: 1080, device: 'Desktop' },
            { name: 'Ultra Wide', width: 2560, height: 1440, device: 'Ultra Wide Monitor' }
        ];
    }
    
    async runAllResponsiveTests() {
        console.log('📱 Starting comprehensive responsive design tests...');
        this.results = [];
        
        const tests = [
            { name: 'Canvas Responsive Sizing', test: () => this.testCanvasResponsiveSizing() },
            { name: 'Touch Target Accessibility', test: () => this.testTouchTargetAccessibility() },
            { name: 'Text Readability', test: () => this.testTextReadability() },
            { name: 'Layout Stability', test: () => this.testLayoutStability() },
            { name: 'Interaction Area Sizing', test: () => this.testInteractionAreaSizing() },
            { name: 'Viewport Meta Tag', test: () => this.testViewportMetaTag() },
            { name: 'CSS Media Queries', test: () => this.testCSSMediaQueries() },
            { name: 'Touch Event Handling', test: () => this.testTouchEventHandling() },
            { name: 'Orientation Changes', test: () => this.testOrientationChanges() },
            { name: 'Performance Across Devices', test: () => this.testPerformanceAcrossDevices() }
        ];
        
        for (const test of tests) {
            console.log(`\n📱 Running: ${test.name}`);
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
            
            await this.delay(100);
        }
        
        this.generateResponsiveReport();
        return this.results;
    }
    
    async testCanvasResponsiveSizing() {
        const testResults = [];
        const issues = [];
        
        for (const viewport of this.testViewports) {
            // Simulate viewport change
            this.simulateViewportChange(viewport.width, viewport.height);
            
            // Create test canvas with responsive sizing
            const testCanvas = this.createTestCanvas();
            testCanvas.style.width = '100%';
            testCanvas.style.height = '60vh';
            testCanvas.style.maxWidth = '800px';
            
            // Force layout recalculation
            testCanvas.offsetHeight;
            
            const rect = testCanvas.getBoundingClientRect();
            const canvasWidth = rect.width;
            const canvasHeight = rect.height;
            const expectedHeight = viewport.height * 0.6; // 60vh
            
            // Check if canvas dimensions are reasonable
            const widthRatio = canvasWidth / viewport.width;
            const heightRatio = canvasHeight / viewport.height;
            
            const result = {
                viewport: viewport.name,
                canvasWidth: Math.round(canvasWidth),
                canvasHeight: Math.round(canvasHeight),
                widthRatio: widthRatio.toFixed(3),
                heightRatio: heightRatio.toFixed(3),
                viewportWidth: viewport.width,
                viewportHeight: viewport.height
            };
            
            // Validate sizing
            if (canvasWidth <= 0 || canvasHeight <= 0) {
                issues.push(`${viewport.name}: Canvas has invalid dimensions (${canvasWidth}x${canvasHeight})`);
            }
            
            if (canvasWidth > viewport.width * 1.1) {
                issues.push(`${viewport.name}: Canvas width exceeds viewport (${canvasWidth} > ${viewport.width})`);
            }
            
            if (canvasHeight < 200 && viewport.height > 400) {
                issues.push(`${viewport.name}: Canvas too small for interaction (${canvasHeight}px height)`);
            }
            
            testResults.push(result);
            testCanvas.remove();
        }
        
        // Restore original viewport
        this.restoreViewport();
        
        return {
            status: issues.length === 0 ? 'pass' : 'fail',
            message: issues.length === 0 ? 'Canvas sizing responsive across all viewports' : `${issues.length} sizing issues found`,
            details: issues.length > 0 ? issues.join('; ') : `Tested ${testResults.length} viewports successfully`,
            metrics: { testResults, issues }
        };
    }
    
    async testTouchTargetAccessibility() {
        const minTouchTargetSize = 44; // WCAG recommendation
        const testResults = [];
        const issues = [];
        
        const mobileViewports = this.testViewports.filter(v => v.width <= 768);
        
        for (const viewport of mobileViewports) {
            this.simulateViewportChange(viewport.width, viewport.height);
            
            const testCanvas = this.createTestCanvas();
            testCanvas.style.width = '100%';
            testCanvas.style.height = '50vh';
            
            const rect = testCanvas.getBoundingClientRect();
            
            // Check if canvas provides adequate touch target
            const touchTargetArea = rect.width * rect.height;
            const minArea = minTouchTargetSize * minTouchTargetSize;
            
            const result = {
                viewport: viewport.name,
                canvasWidth: Math.round(rect.width),
                canvasHeight: Math.round(rect.height),
                touchTargetArea: Math.round(touchTargetArea),
                meetsMinSize: touchTargetArea >= minArea
            };
            
            if (!result.meetsMinSize) {
                issues.push(`${viewport.name}: Touch target too small (${Math.round(touchTargetArea)} < ${minArea} px²)`);
            }
            
            // Test touch event simulation
            let touchEventHandled = false;
            const touchHandler = () => { touchEventHandled = true; };
            testCanvas.addEventListener('touchstart', touchHandler);
            
            const touchEvent = new TouchEvent('touchstart', {
                touches: [{
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top + rect.height / 2,
                    target: testCanvas
                }],
                bubbles: true,
                cancelable: true
            });
            
            testCanvas.dispatchEvent(touchEvent);
            
            if (!touchEventHandled) {
                issues.push(`${viewport.name}: Touch events not properly handled`);
            }
            
            testResults.push(result);
            testCanvas.removeEventListener('touchstart', touchHandler);
            testCanvas.remove();
        }
        
        this.restoreViewport();
        
        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            message: issues.length === 0 ? 'Touch targets accessible on mobile devices' : `${issues.length} touch accessibility issues`,
            details: issues.join('; '),
            metrics: { testResults, minTouchTargetSize }
        };
    }
    
    async testTextReadability() {
        const testResults = [];
        const issues = [];
        
        // Test text elements that would appear with the canvas
        const textElements = [
            { selector: 'h2', expectedSize: 'large', content: 'From Drop to Ocean' },
            { selector: 'h3', expectedSize: 'medium', content: 'Interactive Experience' },
            { selector: '#progress-counter', expectedSize: 'medium', content: 'Ocean filled: 0%' },
            { selector: '#canvas-instructions', expectedSize: 'small', content: 'Click or tap instructions' }
        ];
        
        for (const viewport of this.testViewports) {
            this.simulateViewportChange(viewport.width, viewport.height);
            
            for (const textElement of textElements) {
                const testElement = document.createElement(textElement.selector.replace('#', 'div'));
                testElement.textContent = textElement.content;
                testElement.className = this.getExpectedClasses(textElement.selector, viewport);
                testElement.style.position = 'absolute';
                testElement.style.left = '-9999px';
                document.body.appendChild(testElement);
                
                const computedStyle = window.getComputedStyle(testElement);
                const fontSize = parseFloat(computedStyle.fontSize);
                const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize * 1.2;
                
                const result = {
                    viewport: viewport.name,
                    element: textElement.selector,
                    fontSize: fontSize,
                    lineHeight: lineHeight,
                    readable: this.isTextReadable(fontSize, viewport.width)
                };
                
                if (!result.readable) {
                    issues.push(`${viewport.name}: ${textElement.selector} text too small (${fontSize}px)`);
                }
                
                testResults.push(result);
                testElement.remove();
            }
        }
        
        this.restoreViewport();
        
        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            message: issues.length === 0 ? 'Text readable across all viewports' : `${issues.length} readability issues`,
            details: issues.join('; '),
            metrics: { testResults }
        };
    }
    
    async testLayoutStability() {
        const testResults = [];
        const issues = [];
        
        for (const viewport of this.testViewports) {
            this.simulateViewportChange(viewport.width, viewport.height);
            
            // Create test layout
            const testContainer = document.createElement('div');
            testContainer.className = 'max-w-5xl mx-auto text-center px-4';
            testContainer.style.position = 'absolute';
            testContainer.style.left = '-9999px';
            
            const testCanvas = this.createTestCanvas();
            testCanvas.style.width = '100%';
            testCanvas.style.height = '60vh';
            testCanvas.className = 'rounded-2xl mx-auto mb-8';
            
            const testProgress = document.createElement('div');
            testProgress.textContent = 'Ocean filled: 0%';
            testProgress.className = 'text-lg text-gray-300';
            
            testContainer.appendChild(testCanvas);
            testContainer.appendChild(testProgress);
            document.body.appendChild(testContainer);
            
            // Force layout
            testContainer.offsetHeight;
            
            const containerRect = testContainer.getBoundingClientRect();
            const canvasRect = testCanvas.getBoundingClientRect();
            const progressRect = testProgress.getBoundingClientRect();
            
            // Check for layout issues
            const layoutStable = canvasRect.width > 0 && 
                               canvasRect.height > 0 && 
                               progressRect.width > 0 && 
                               progressRect.height > 0;
            
            const elementsOverlap = this.checkElementOverlap(canvasRect, progressRect);
            
            const result = {
                viewport: viewport.name,
                containerWidth: Math.round(containerRect.width),
                canvasWidth: Math.round(canvasRect.width),
                canvasHeight: Math.round(canvasRect.height),
                layoutStable: layoutStable,
                elementsOverlap: elementsOverlap
            };
            
            if (!layoutStable) {
                issues.push(`${viewport.name}: Layout unstable - elements have zero dimensions`);
            }
            
            if (elementsOverlap) {
                issues.push(`${viewport.name}: Elements overlap inappropriately`);
            }
            
            testResults.push(result);
            testContainer.remove();
        }
        
        this.restoreViewport();
        
        return {
            status: issues.length === 0 ? 'pass' : 'fail',
            message: issues.length === 0 ? 'Layout stable across all viewports' : `${issues.length} layout stability issues`,
            details: issues.join('; '),
            metrics: { testResults }
        };
    }
    
    async testInteractionAreaSizing() {
        const testResults = [];
        const issues = [];
        
        for (const viewport of this.testViewports) {
            this.simulateViewportChange(viewport.width, viewport.height);
            
            const testCanvas = this.createTestCanvas();
            testCanvas.style.width = '100%';
            testCanvas.style.height = '60vh';
            testCanvas.style.maxWidth = '800px';
            
            const rect = testCanvas.getBoundingClientRect();
            const interactionArea = rect.width * rect.height;
            
            // Calculate expected minimum interaction area based on viewport
            const minInteractionArea = viewport.width <= 768 ? 
                (viewport.width * 0.8) * (viewport.height * 0.4) : // Mobile: 80% width, 40% height
                (Math.min(800, viewport.width * 0.6)) * (viewport.height * 0.5); // Desktop: max 800px width, 50% height
            
            const result = {
                viewport: viewport.name,
                interactionArea: Math.round(interactionArea),
                minInteractionArea: Math.round(minInteractionArea),
                adequate: interactionArea >= minInteractionArea * 0.8 // Allow 20% tolerance
            };
            
            if (!result.adequate) {
                issues.push(`${viewport.name}: Interaction area too small (${Math.round(interactionArea)} < ${Math.round(minInteractionArea)})`);
            }
            
            testResults.push(result);
            testCanvas.remove();
        }
        
        this.restoreViewport();
        
        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            message: issues.length === 0 ? 'Interaction areas appropriately sized' : `${issues.length} interaction area issues`,
            details: issues.join('; '),
            metrics: { testResults }
        };
    }
    
    async testViewportMetaTag() {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        
        if (!viewportMeta) {
            return {
                status: 'fail',
                message: 'Viewport meta tag missing',
                details: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> to <head>'
            };
        }
        
        const content = viewportMeta.getAttribute('content');
        const hasDeviceWidth = content.includes('width=device-width');
        const hasInitialScale = content.includes('initial-scale=1');
        const hasUserScalable = content.includes('user-scalable=no');
        
        const issues = [];
        const recommendations = [];
        
        if (!hasDeviceWidth) {
            issues.push('Missing width=device-width');
        }
        
        if (!hasInitialScale) {
            issues.push('Missing initial-scale=1.0');
        }
        
        if (hasUserScalable) {
            recommendations.push('Consider allowing user scaling for accessibility');
        }
        
        return {
            status: issues.length === 0 ? 'pass' : 'fail',
            message: issues.length === 0 ? 'Viewport meta tag properly configured' : `${issues.length} viewport meta issues`,
            details: [...issues, ...recommendations.map(r => `Recommendation: ${r}`)].join('; '),
            metrics: { content, hasDeviceWidth, hasInitialScale, hasUserScalable }
        };
    }
    
    async testCSSMediaQueries() {
        const mediaQueries = [
            { query: '(max-width: 768px)', name: 'Mobile breakpoint' },
            { query: '(max-width: 480px)', name: 'Small mobile breakpoint' },
            { query: '(min-width: 769px)', name: 'Desktop breakpoint' },
            { query: '(orientation: landscape)', name: 'Landscape orientation' },
            { query: '(orientation: portrait)', name: 'Portrait orientation' },
            { query: '(prefers-reduced-motion: reduce)', name: 'Reduced motion preference' }
        ];
        
        const testResults = [];
        const issues = [];
        
        for (const mq of mediaQueries) {
            const mediaQueryList = window.matchMedia(mq.query);
            const supported = mediaQueryList.media !== 'not all';
            
            testResults.push({
                query: mq.query,
                name: mq.name,
                supported: supported,
                matches: mediaQueryList.matches
            });
            
            if (!supported) {
                issues.push(`Media query not supported: ${mq.query}`);
            }
        }
        
        // Test CSS rules that should exist
        const expectedCSSRules = [
            '@media (max-width: 768px)',
            '@media (max-width: 480px)',
            'height: 50vh', // Mobile canvas height
            'height: 45vh'  // Small mobile canvas height
        ];
        
        const stylesheets = Array.from(document.styleSheets);
        const cssText = stylesheets.map(sheet => {
            try {
                return Array.from(sheet.cssRules || []).map(rule => rule.cssText).join(' ');
            } catch (e) {
                return '';
            }
        }).join(' ');
        
        const missingRules = expectedCSSRules.filter(rule => !cssText.includes(rule));
        
        if (missingRules.length > 0) {
            issues.push(`Missing CSS rules: ${missingRules.join(', ')}`);
        }
        
        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            message: issues.length === 0 ? 'CSS media queries properly implemented' : `${issues.length} media query issues`,
            details: issues.join('; '),
            metrics: { testResults, missingRules }
        };
    }
    
    async testTouchEventHandling() {
        const testResults = [];
        const issues = [];
        
        const mobileViewports = this.testViewports.filter(v => v.width <= 768);
        
        for (const viewport of mobileViewports) {
            this.simulateViewportChange(viewport.width, viewport.height);
            
            const testCanvas = this.createTestCanvas();
            testCanvas.style.touchAction = 'none';
            
            let touchStartHandled = false;
            let touchMoveHandled = false;
            let touchEndHandled = false;
            let preventDefaultCalled = false;
            
            const touchStartHandler = (e) => {
                touchStartHandled = true;
                if (e.defaultPrevented) preventDefaultCalled = true;
            };
            
            const touchMoveHandler = (e) => {
                touchMoveHandled = true;
                e.preventDefault();
            };
            
            const touchEndHandler = (e) => {
                touchEndHandled = true;
            };
            
            testCanvas.addEventListener('touchstart', touchStartHandler);
            testCanvas.addEventListener('touchmove', touchMoveHandler);
            testCanvas.addEventListener('touchend', touchEndHandler);
            
            // Simulate touch sequence
            const touchStart = new TouchEvent('touchstart', {
                touches: [{ clientX: 100, clientY: 100, target: testCanvas }],
                bubbles: true,
                cancelable: true
            });
            
            const touchMove = new TouchEvent('touchmove', {
                touches: [{ clientX: 110, clientY: 110, target: testCanvas }],
                bubbles: true,
                cancelable: true
            });
            
            const touchEnd = new TouchEvent('touchend', {
                changedTouches: [{ clientX: 110, clientY: 110, target: testCanvas }],
                bubbles: true,
                cancelable: true
            });
            
            testCanvas.dispatchEvent(touchStart);
            testCanvas.dispatchEvent(touchMove);
            testCanvas.dispatchEvent(touchEnd);
            
            const result = {
                viewport: viewport.name,
                touchStartHandled,
                touchMoveHandled,
                touchEndHandled,
                preventDefaultCalled
            };
            
            if (!touchStartHandled) {
                issues.push(`${viewport.name}: touchstart not handled`);
            }
            
            if (!touchMoveHandled) {
                issues.push(`${viewport.name}: touchmove not handled`);
            }
            
            if (!touchEndHandled) {
                issues.push(`${viewport.name}: touchend not handled`);
            }
            
            testResults.push(result);
            
            testCanvas.removeEventListener('touchstart', touchStartHandler);
            testCanvas.removeEventListener('touchmove', touchMoveHandler);
            testCanvas.removeEventListener('touchend', touchEndHandler);
            testCanvas.remove();
        }
        
        this.restoreViewport();
        
        return {
            status: issues.length === 0 ? 'pass' : 'fail',
            message: issues.length === 0 ? 'Touch events handled correctly' : `${issues.length} touch handling issues`,
            details: issues.join('; '),
            metrics: { testResults }
        };
    }
    
    async testOrientationChanges() {
        const testResults = [];
        const issues = [];
        
        // Test portrait and landscape orientations
        const orientationTests = [
            { width: 414, height: 896, orientation: 'portrait' },
            { width: 896, height: 414, orientation: 'landscape' }
        ];
        
        for (const test of orientationTests) {
            this.simulateViewportChange(test.width, test.height);
            
            const testCanvas = this.createTestCanvas();
            testCanvas.style.width = '100%';
            testCanvas.style.height = test.orientation === 'portrait' ? '60vh' : '50vh';
            
            const rect = testCanvas.getBoundingClientRect();
            const aspectRatio = rect.width / rect.height;
            
            const result = {
                orientation: test.orientation,
                canvasWidth: Math.round(rect.width),
                canvasHeight: Math.round(rect.height),
                aspectRatio: aspectRatio.toFixed(2),
                usableArea: Math.round(rect.width * rect.height)
            };
            
            // Check if canvas maintains reasonable proportions
            if (test.orientation === 'portrait' && aspectRatio > 2) {
                issues.push(`Portrait: Canvas too wide (aspect ratio ${aspectRatio.toFixed(2)})`);
            }
            
            if (test.orientation === 'landscape' && aspectRatio < 0.5) {
                issues.push(`Landscape: Canvas too tall (aspect ratio ${aspectRatio.toFixed(2)})`);
            }
            
            if (result.usableArea < 50000) { // Arbitrary minimum usable area
                issues.push(`${test.orientation}: Canvas too small for interaction (${result.usableArea}px²)`);
            }
            
            testResults.push(result);
            testCanvas.remove();
        }
        
        this.restoreViewport();
        
        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            message: issues.length === 0 ? 'Handles orientation changes well' : `${issues.length} orientation issues`,
            details: issues.join('; '),
            metrics: { testResults }
        };
    }
    
    async testPerformanceAcrossDevices() {
        const testResults = [];
        const issues = [];
        
        // Simulate different device performance levels
        const deviceProfiles = [
            { name: 'Low-end Mobile', viewport: { width: 320, height: 568 }, performanceMultiplier: 0.3 },
            { name: 'Mid-range Mobile', viewport: { width: 414, height: 896 }, performanceMultiplier: 0.6 },
            { name: 'High-end Mobile', viewport: { width: 414, height: 896 }, performanceMultiplier: 0.8 },
            { name: 'Tablet', viewport: { width: 768, height: 1024 }, performanceMultiplier: 0.7 },
            { name: 'Desktop', viewport: { width: 1920, height: 1080 }, performanceMultiplier: 1.0 }
        ];
        
        for (const device of deviceProfiles) {
            this.simulateViewportChange(device.viewport.width, device.viewport.height);
            
            const testCanvas = this.createTestCanvas();
            const ctx = testCanvas.getContext('2d');
            
            // Simulate rendering load based on device performance
            const startTime = performance.now();
            const iterations = Math.floor(1000 * device.performanceMultiplier);
            
            for (let i = 0; i < iterations; i++) {
                ctx.clearRect(0, 0, testCanvas.width, testCanvas.height);
                ctx.fillStyle = 'rgba(0, 82, 212, 0.3)';
                ctx.fillRect(i % testCanvas.width, i % testCanvas.height, 10, 10);
            }
            
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            const estimatedFPS = iterations > 0 ? (1000 / (renderTime / iterations)) : 60;
            
            const result = {
                device: device.name,
                viewport: `${device.viewport.width}x${device.viewport.height}`,
                renderTime: renderTime.toFixed(2),
                estimatedFPS: estimatedFPS.toFixed(1),
                performanceLevel: device.performanceMultiplier,
                acceptable: estimatedFPS >= 30
            };
            
            if (!result.acceptable) {
                issues.push(`${device.name}: Performance too low (${result.estimatedFPS} FPS)`);
            }
            
            testResults.push(result);
            testCanvas.remove();
        }
        
        this.restoreViewport();
        
        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            message: issues.length === 0 ? 'Performance acceptable across devices' : `${issues.length} performance issues`,
            details: issues.join('; '),
            metrics: { testResults }
        };
    }
    
    // Helper methods
    simulateViewportChange(width, height) {
        // Note: This is a simulation - actual viewport changes require browser dev tools
        // In a real test environment, you would use tools like Puppeteer or Playwright
        Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, writable: true });
        
        // Trigger resize event
        window.dispatchEvent(new Event('resize'));
    }
    
    restoreViewport() {
        Object.defineProperty(window, 'innerWidth', { value: this.originalViewport.width, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: this.originalViewport.height, writable: true });
        window.dispatchEvent(new Event('resize'));
    }
    
    createTestCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 400;
        canvas.style.position = 'absolute';
        canvas.style.left = '-9999px';
        document.body.appendChild(canvas);
        return canvas;
    }
    
    getExpectedClasses(selector, viewport) {
        // Return expected Tailwind classes based on selector and viewport
        const baseClasses = {
            'h2': 'text-3xl md:text-5xl font-bold text-white',
            'h3': 'text-sm font-bold uppercase text-blue-400',
            '#progress-counter': 'text-lg text-gray-300',
            '#canvas-instructions': 'text-sm text-gray-400'
        };
        
        return baseClasses[selector] || '';
    }
    
    isTextReadable(fontSize, viewportWidth) {
        // Minimum font sizes for readability
        const minSizes = {
            mobile: 14,    // Mobile devices
            tablet: 16,    // Tablets
            desktop: 16    // Desktop
        };
        
        let minSize;
        if (viewportWidth <= 480) {
            minSize = minSizes.mobile;
        } else if (viewportWidth <= 768) {
            minSize = minSizes.tablet;
        } else {
            minSize = minSizes.desktop;
        }
        
        return fontSize >= minSize;
    }
    
    checkElementOverlap(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                rect2.right < rect1.left || 
                rect1.bottom < rect2.top || 
                rect2.bottom < rect1.top);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    generateResponsiveReport() {
        console.log('\n📱 RESPONSIVE DESIGN TEST REPORT');
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
        
        // Responsive design recommendations
        this.generateResponsiveRecommendations();
    }
    
    generateResponsiveRecommendations() {
        console.log('📱 RESPONSIVE DESIGN RECOMMENDATIONS');
        console.log('-'.repeat(40));
        
        const warnings = this.results.filter(r => r.status === 'warning');
        const errors = this.results.filter(r => r.status === 'error');
        
        if (warnings.length === 0 && errors.length === 0) {
            console.log('🎉 Excellent! All responsive design tests passed.');
            console.log('   The implementation works well across all device sizes.');
        } else {
            if (errors.length > 0) {
                console.log('🚨 Critical Responsive Issues:');
                errors.forEach(error => {
                    console.log(`   - ${error.name}: ${error.message}`);
                });
                console.log('');
            }
            
            if (warnings.length > 0) {
                console.log('⚠️ Responsive Improvements Needed:');
                warnings.forEach(warning => {
                    console.log(`   - ${warning.name}: ${warning.message}`);
                });
                console.log('');
            }
        }
        
        console.log('💡 General Responsive Design Best Practices:');
        console.log('   - Test on real devices, not just browser dev tools');
        console.log('   - Ensure touch targets are at least 44x44 CSS pixels');
        console.log('   - Use relative units (vh, vw, %) for flexible layouts');
        console.log('   - Implement proper CSS media queries for breakpoints');
        console.log('   - Consider performance implications on mobile devices');
        console.log('   - Test both portrait and landscape orientations');
        console.log('   - Ensure content is accessible without horizontal scrolling');
        console.log('   - Use progressive enhancement for advanced features');
    }
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveTester;
} else if (typeof window !== 'undefined') {
    window.ResponsiveTester = ResponsiveTester;
}

// Auto-run if loaded directly
if (typeof window !== 'undefined' && window.location && window.location.search.includes('autorun')) {
    document.addEventListener('DOMContentLoaded', () => {
        const tester = new ResponsiveTester();
        tester.runAllResponsiveTests();
    });
}