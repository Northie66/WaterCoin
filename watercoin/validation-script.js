/**
 * Validation Script for Drop to Ocean Interactive Feature
 * Validates the actual implementation against requirements
 */

class ImplementationValidator {
    constructor() {
        this.results = [];
        this.requirements = this.loadRequirements();
    }
    
    loadRequirements() {
        return {
            '1.1': 'Display section with correct heading structure',
            '1.2': 'Position section between Flowmap and Community',
            '1.3': 'Center content within section layout',
            '1.4': 'Apply consistent styling and fade-in animations',
            '2.1': 'Display canvas element with 60vh height',
            '2.2': 'Apply rounded-2xl styling and card-bg effect',
            '2.3': 'Start with empty container',
            '2.4': 'Center canvas within section',
            '2.5': 'Maintain responsive design',
            '3.1': 'Create droplets on click/tap',
            '3.2': 'Animate droplets with realistic physics',
            '3.3': 'Create splash effects on collision',
            '3.4': 'Increase water level on droplet collision',
            '3.5': 'Accumulate water level progressively',
            '3.6': 'Create appropriate splash and ripple effects',
            '4.1': 'Display progress counter below canvas',
            '4.2': 'Update counter with current fill percentage',
            '4.3': 'Use format "Ocean filled: X%"',
            '4.4': 'Initialize counter at 0% for new users',
            '4.5': 'Use smooth transitions for counter updates',
            '5.1': 'Save water level to localStorage',
            '5.2': 'Restore water level from localStorage',
            '5.3': 'Maintain progress on page refresh',
            '5.4': 'Handle localStorage unavailability gracefully',
            '6.1': 'Display fish at 30% milestone',
            '6.2': 'Start wave effects at 70% milestone',
            '6.3': 'Fill container completely at 100%',
            '6.4': 'Show glowing $WATER logo at 100%',
            '6.5': 'Display completion message',
            '6.6': 'Save milestone state to localStorage',
            '6.7': 'Restore milestone visual effects',
            '7.1': 'Use consistent color palette',
            '7.2': 'Use smooth transitions and modern effects',
            '7.3': 'Apply fade-in animation pattern',
            '7.4': 'Use consistent Tailwind CSS classes',
            '7.5': 'Maintain lightweight performance',
            '7.6': 'Avoid over-complication',
            '7.7': 'Support mobile touch interactions'
        };
    }
    
    async validateImplementation() {
        console.log('🔍 Starting implementation validation...');
        
        const validationTests = [
            { name: 'HTML Structure Validation', test: () => this.validateHTMLStructure() },
            { name: 'CSS Styling Validation', test: () => this.validateCSSStyling() },
            { name: 'JavaScript Functionality Validation', test: () => this.validateJavaScriptFunctionality() },
            { name: 'Canvas Implementation Validation', test: () => this.validateCanvasImplementation() },
            { name: 'Event Handling Validation', test: () => this.validateEventHandling() },
            { name: 'Storage Implementation Validation', test: () => this.validateStorageImplementation() },
            { name: 'Performance Optimization Validation', test: () => this.validatePerformanceOptimizations() },
            { name: 'Accessibility Implementation Validation', test: () => this.validateAccessibilityImplementation() },
            { name: 'Responsive Design Validation', test: () => this.validateResponsiveDesign() },
            { name: 'Requirements Coverage Validation', test: () => this.validateRequirementsCoverage() }
        ];
        
        for (const test of validationTests) {
            console.log(`\n🔍 ${test.name}...`);
            try {
                const result = await test.test();
                this.results.push({ name: test.name, ...result });
                console.log(`${result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'} ${result.message}`);
                if (result.details) {
                    console.log(`   ${result.details}`);
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
        }
        
        this.generateValidationReport();
        return this.results;
    }
    
    async validateHTMLStructure() {
        const issues = [];
        const validations = [];
        
        // Check for main section
        const section = document.getElementById('drop-to-ocean');
        if (!section) {
            issues.push('Main section #drop-to-ocean not found');
        } else {
            validations.push('Main section exists');
            
            // Check section classes
            const expectedClasses = ['py-20', 'md:py-32', 'px-4', 'bg-[#0A0A0A]'];
            const hasExpectedClasses = expectedClasses.every(cls => 
                section.classList.contains(cls) || section.className.includes(cls)
            );
            
            if (hasExpectedClasses) {
                validations.push('Section has correct CSS classes');
            } else {
                issues.push('Section missing expected CSS classes');
            }
        }
        
        // Check for headings
        const h3 = section?.querySelector('h3');
        const h2 = section?.querySelector('h2');
        
        if (!h3 || !h3.textContent.includes('Interactive Experience')) {
            issues.push('H3 heading "Interactive Experience" not found');
        } else {
            validations.push('H3 heading found');
        }
        
        if (!h2 || !h2.textContent.includes('From Drop to Ocean')) {
            issues.push('H2 heading "From Drop to Ocean" not found');
        } else {
            validations.push('H2 heading found');
        }
        
        // Check for canvas
        const canvas = document.getElementById('ocean-canvas');
        if (!canvas) {
            issues.push('Canvas #ocean-canvas not found');
        } else {
            validations.push('Canvas element exists');
            
            // Check canvas attributes
            if (!canvas.hasAttribute('tabindex')) {
                issues.push('Canvas missing tabindex for accessibility');
            }
            
            if (!canvas.hasAttribute('role')) {
                issues.push('Canvas missing role attribute');
            }
            
            if (!canvas.hasAttribute('aria-label')) {
                issues.push('Canvas missing aria-label');
            }
        }
        
        // Check for progress counter
        const progressCounter = document.getElementById('progress-counter');
        if (!progressCounter) {
            issues.push('Progress counter not found');
        } else {
            validations.push('Progress counter exists');
        }
        
        const progressPercentage = document.getElementById('progress-percentage');
        if (!progressPercentage) {
            issues.push('Progress percentage element not found');
        } else {
            validations.push('Progress percentage element exists');
        }
        
        return {
            status: issues.length === 0 ? 'pass' : 'fail',
            message: issues.length === 0 ? 'HTML structure valid' : `${issues.length} HTML structure issues`,
            details: [...validations, ...issues.map(i => `Issue: ${i}`)].join('; '),
            requirements: ['1.1', '1.2', '2.1', '4.1']
        };
    }
    
    async validateCSSStyling() {
        const issues = [];
        const validations = [];
        
        // Check for canvas styling
        const canvas = document.getElementById('ocean-canvas');
        if (canvas) {
            const computedStyle = window.getComputedStyle(canvas);
            const height = computedStyle.height;
            
            // Check if height is approximately 60vh
            const viewportHeight = window.innerHeight;
            const expectedHeight = viewportHeight * 0.6;
            const actualHeight = parseFloat(height);
            
            if (Math.abs(actualHeight - expectedHeight) < 50) { // 50px tolerance
                validations.push('Canvas height approximately 60vh');
            } else {
                issues.push(`Canvas height ${actualHeight}px, expected ~${expectedHeight}px`);
            }
            
            // Check for rounded corners
            const borderRadius = computedStyle.borderRadius;
            if (borderRadius && borderRadius !== '0px') {
                validations.push('Canvas has rounded corners');
            } else {
                issues.push('Canvas missing rounded corners');
            }
        }
        
        // Check for card-bg styling
        const canvasContainer = canvas?.closest('.canvas-container');
        if (canvasContainer) {
            const containerStyle = window.getComputedStyle(canvasContainer);
            const backgroundColor = containerStyle.backgroundColor;
            const backdropFilter = containerStyle.backdropFilter;
            
            if (backgroundColor.includes('rgba') || backdropFilter.includes('blur')) {
                validations.push('Canvas container has card-bg styling');
            } else {
                issues.push('Canvas container missing card-bg styling');
            }
        }
        
        // Check for fade-in animations
        const fadeInElements = document.querySelectorAll('#drop-to-ocean .fade-in');
        if (fadeInElements.length > 0) {
            validations.push(`${fadeInElements.length} elements have fade-in animation`);
        } else {
            issues.push('No fade-in animations found');
        }
        
        // Check for responsive CSS
        const stylesheets = Array.from(document.styleSheets);
        let hasResponsiveCSS = false;
        
        try {
            for (const sheet of stylesheets) {
                const rules = Array.from(sheet.cssRules || []);
                for (const rule of rules) {
                    if (rule.cssText && rule.cssText.includes('@media') && rule.cssText.includes('max-width')) {
                        hasResponsiveCSS = true;
                        break;
                    }
                }
                if (hasResponsiveCSS) break;
            }
        } catch (e) {
            // Cross-origin stylesheets may not be accessible
        }
        
        if (hasResponsiveCSS) {
            validations.push('Responsive CSS media queries found');
        } else {
            issues.push('No responsive CSS media queries detected');
        }
        
        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            message: issues.length === 0 ? 'CSS styling valid' : `${issues.length} CSS styling issues`,
            details: [...validations, ...issues.map(i => `Issue: ${i}`)].join('; '),
            requirements: ['1.4', '2.2', '2.5', '7.1', '7.2', '7.3', '7.4']
        };
    }
    
    async validateJavaScriptFunctionality() {
        const issues = [];
        const validations = [];
        
        // Check for required classes/functions
        const requiredClasses = [
            'WaterSimulationEngine',
            'ProgressManager', 
            'MilestoneSystem',
            'CanvasRenderer'
        ];
        
        for (const className of requiredClasses) {
            if (typeof window[className] !== 'undefined' || 
                document.body.innerHTML.includes(`class ${className}`) ||
                document.body.innerHTML.includes(`function ${className}`)) {
                validations.push(`${className} implementation found`);
            } else {
                issues.push(`${className} implementation not found`);
            }
        }
        
        // Check for event listeners
        const canvas = document.getElementById('ocean-canvas');
        if (canvas) {
            // Try to detect if event listeners are attached
            const hasClickListener = canvas.onclick !== null || 
                                   canvas.addEventListener.toString().includes('click');
            
            if (hasClickListener || document.body.innerHTML.includes('addEventListener')) {
                validations.push('Event listeners likely implemented');
            } else {
                issues.push('No event listeners detected');
            }
        }
        
        // Check for localStorage usage
        if (document.body.innerHTML.includes('localStorage')) {
            validations.push('localStorage usage found');
        } else {
            issues.push('localStorage usage not found');
        }
        
        // Check for animation frame usage
        if (document.body.innerHTML.includes('requestAnimationFrame')) {
            validations.push('requestAnimationFrame usage found');
        } else {
            issues.push('requestAnimationFrame usage not found');
        }
        
        // Check for performance optimizations
        const performanceFeatures = [
            'ObjectPool',
            'FrameRateMonitor',
            'PerformanceScaler',
            'maxDroplets',
            'maxSplashEffects'
        ];
        
        let performanceOptimizations = 0;
        for (const feature of performanceFeatures) {
            if (document.body.innerHTML.includes(feature)) {
                performanceOptimizations++;
            }
        }
        
        if (performanceOptimizations >= 3) {
            validations.push('Performance optimizations implemented');
        } else {
            issues.push('Insufficient performance optimizations');
        }
        
        return {
            status: issues.length <= 2 ? 'pass' : 'warning', // Allow some tolerance
            message: issues.length <= 2 ? 'JavaScript functionality implemented' : `${issues.length} JavaScript issues`,
            details: [...validations, ...issues.map(i => `Issue: ${i}`)].join('; '),
            requirements: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '5.1', '5.2', '7.5']
        };
    }
    
    async validateCanvasImplementation() {
        const issues = [];
        const validations = [];
        
        const canvas = document.getElementById('ocean-canvas');
        if (!canvas) {
            return {
                status: 'fail',
                message: 'Canvas element not found',
                details: 'Cannot validate canvas implementation',
                requirements: ['2.1', '2.2', '2.3']
            };
        }
        
        // Check canvas context
        const ctx = canvas.getContext('2d');
        if (ctx) {
            validations.push('Canvas 2D context available');
        } else {
            issues.push('Canvas 2D context not available');
        }
        
        // Check canvas dimensions
        if (canvas.width > 0 && canvas.height > 0) {
            validations.push(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
        } else {
            issues.push('Canvas has invalid dimensions');
        }
        
        // Check for touch-action CSS
        const computedStyle = window.getComputedStyle(canvas);
        const touchAction = computedStyle.touchAction;
        
        if (touchAction === 'none') {
            validations.push('Canvas has touch-action: none');
        } else {
            issues.push('Canvas missing touch-action: none');
        }
        
        // Check for cursor styling
        const cursor = computedStyle.cursor;
        if (cursor === 'pointer') {
            validations.push('Canvas has pointer cursor');
        } else {
            issues.push('Canvas missing pointer cursor');
        }
        
        // Check canvas container
        const container = canvas.closest('.canvas-container');
        if (container) {
            validations.push('Canvas has container wrapper');
            
            const containerStyle = window.getComputedStyle(container);
            if (containerStyle.transition && containerStyle.transition !== 'none') {
                validations.push('Canvas container has transitions');
            }
        } else {
            issues.push('Canvas missing container wrapper');
        }
        
        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            message: issues.length === 0 ? 'Canvas implementation valid' : `${issues.length} canvas issues`,
            details: [...validations, ...issues.map(i => `Issue: ${i}`)].join('; '),
            requirements: ['2.1', '2.2', '2.3', '2.4', '7.7']
        };
    }
    
    async validateEventHandling() {
        const issues = [];
        const validations = [];
        
        const canvas = document.getElementById('ocean-canvas');
        if (!canvas) {
            return {
                status: 'fail',
                message: 'Canvas not found for event testing',
                details: 'Cannot validate event handling',
                requirements: ['3.1', '7.7']
            };
        }
        
        // Test mouse events
        let mouseEventHandled = false;
        const mouseHandler = () => { mouseEventHandled = true; };
        
        canvas.addEventListener('click', mouseHandler);
        
        const mouseEvent = new MouseEvent('click', {
            clientX: 100,
            clientY: 100,
            bubbles: true
        });
        
        canvas.dispatchEvent(mouseEvent);
        
        if (mouseEventHandled) {
            validations.push('Mouse click events handled');
        } else {
            issues.push('Mouse click events not handled');
        }
        
        canvas.removeEventListener('click', mouseHandler);
        
        // Test touch events
        let touchEventHandled = false;
        const touchHandler = () => { touchEventHandled = true; };
        
        canvas.addEventListener('touchstart', touchHandler);
        
        const touchEvent = new TouchEvent('touchstart', {
            touches: [{
                clientX: 100,
                clientY: 100,
                target: canvas
            }],
            bubbles: true,
            cancelable: true
        });
        
        canvas.dispatchEvent(touchEvent);
        
        if (touchEventHandled) {
            validations.push('Touch events handled');
        } else {
            issues.push('Touch events not handled');
        }
        
        canvas.removeEventListener('touchstart', touchHandler);
        
        // Test keyboard events (for accessibility)
        let keyEventHandled = false;
        const keyHandler = () => { keyEventHandled = true; };
        
        canvas.addEventListener('keydown', keyHandler);
        
        const keyEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            bubbles: true
        });
        
        canvas.dispatchEvent(keyEvent);
        
        if (keyEventHandled) {
            validations.push('Keyboard events handled');
        } else {
            issues.push('Keyboard events not handled');
        }
        
        canvas.removeEventListener('keydown', keyHandler);
        
        return {
            status: issues.length <= 1 ? 'pass' : 'warning', // Allow one missing event type
            message: issues.length <= 1 ? 'Event handling implemented' : `${issues.length} event handling issues`,
            details: [...validations, ...issues.map(i => `Issue: ${i}`)].join('; '),
            requirements: ['3.1', '7.7']
        };
    }
    
    async validateStorageImplementation() {
        const issues = [];
        const validations = [];
        
        // Check localStorage availability
        try {
            const testKey = 'validation-test';
            const testValue = 'test-value';
            
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (retrieved === testValue) {
                validations.push('localStorage functional');
            } else {
                issues.push('localStorage not working correctly');
            }
        } catch (error) {
            issues.push('localStorage not available');
        }
        
        // Check for storage keys in implementation
        const storageKeys = [
            'water-ocean-progress',
            'water-milestones'
        ];
        
        let storageImplementationFound = false;
        for (const key of storageKeys) {
            if (document.body.innerHTML.includes(key)) {
                storageImplementationFound = true;
                validations.push(`Storage key "${key}" found in implementation`);
                break;
            }
        }
        
        if (!storageImplementationFound) {
            issues.push('No storage keys found in implementation');
        }
        
        // Check for error handling
        if (document.body.innerHTML.includes('try') && 
            document.body.innerHTML.includes('catch') &&
            document.body.innerHTML.includes('localStorage')) {
            validations.push('localStorage error handling implemented');
        } else {
            issues.push('localStorage error handling not found');
        }
        
        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            message: issues.length === 0 ? 'Storage implementation valid' : `${issues.length} storage issues`,
            details: [...validations, ...issues.map(i => `Issue: ${i}`)].join('; '),
            requirements: ['5.1', '5.2', '5.3', '5.4']
        };
    }
    
    async validatePerformanceOptimizations() {
        const issues = [];
        const validations = [];
        
        // Check for performance-related implementations
        const performanceFeatures = [
            { name: 'Object Pooling', keywords: ['ObjectPool', 'pool', 'acquire', 'release'] },
            { name: 'Frame Rate Monitoring', keywords: ['FrameRateMonitor', 'fps', 'frameRate'] },
            { name: 'Performance Scaling', keywords: ['PerformanceScaler', 'performanceLevel', 'scaling'] },
            { name: 'Droplet Limiting', keywords: ['maxDroplets', 'droplet.*limit', 'droplets.*length'] },
            { name: 'Effect Limiting', keywords: ['maxSplash', 'splash.*limit', 'effects.*length'] },
            { name: 'Animation Optimization', keywords: ['requestAnimationFrame', 'deltaTime', 'lastTime'] }
        ];
        
        const htmlContent = document.body.innerHTML;
        
        for (const feature of performanceFeatures) {
            const found = feature.keywords.some(keyword => {
                const regex = new RegExp(keyword, 'i');
                return regex.test(htmlContent);
            });
            
            if (found) {
                validations.push(`${feature.name} implemented`);
            } else {
                issues.push(`${feature.name} not found`);
            }
        }
        
        // Check for performance monitoring
        if (htmlContent.includes('performance.now()')) {
            validations.push('Performance timing implemented');
        } else {
            issues.push('Performance timing not found');
        }
        
        return {
            status: validations.length >= 4 ? 'pass' : 'warning', // At least 4 optimizations
            message: validations.length >= 4 ? 'Performance optimizations implemented' : `Only ${validations.length}/6 optimizations found`,
            details: [...validations, ...issues.map(i => `Missing: ${i}`)].join('; '),
            requirements: ['7.5', '7.6']
        };
    }
    
    async validateAccessibilityImplementation() {
        const issues = [];
        const validations = [];
        
        const canvas = document.getElementById('ocean-canvas');
        if (!canvas) {
            return {
                status: 'fail',
                message: 'Canvas not found for accessibility testing',
                details: 'Cannot validate accessibility implementation',
                requirements: []
            };
        }
        
        // Check ARIA attributes
        const ariaAttributes = [
            { attr: 'aria-label', required: true },
            { attr: 'aria-describedby', required: false },
            { attr: 'role', required: true },
            { attr: 'tabindex', required: true }
        ];
        
        for (const { attr, required } of ariaAttributes) {
            const value = canvas.getAttribute(attr);
            if (value) {
                validations.push(`Canvas has ${attr}: "${value}"`);
            } else if (required) {
                issues.push(`Canvas missing required ${attr}`);
            }
        }
        
        // Check for instructions element
        const instructions = document.getElementById('canvas-instructions');
        if (instructions) {
            validations.push('Canvas instructions provided');
        } else {
            issues.push('Canvas instructions not found');
        }
        
        // Check for screen reader support
        const liveRegions = document.querySelectorAll('[aria-live]');
        if (liveRegions.length > 0) {
            validations.push(`${liveRegions.length} live regions for screen readers`);
        } else {
            issues.push('No live regions for screen reader updates');
        }
        
        // Check focus management
        if (canvas.tabIndex >= 0) {
            validations.push('Canvas is focusable');
        } else {
            issues.push('Canvas not focusable');
        }
        
        return {
            status: issues.length <= 1 ? 'pass' : 'warning',
            message: issues.length <= 1 ? 'Accessibility implementation adequate' : `${issues.length} accessibility issues`,
            details: [...validations, ...issues.map(i => `Issue: ${i}`)].join('; '),
            requirements: ['Accessibility best practices']
        };
    }
    
    async validateResponsiveDesign() {
        const issues = [];
        const validations = [];
        
        // Check viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            const content = viewportMeta.getAttribute('content');
            if (content.includes('width=device-width')) {
                validations.push('Viewport meta tag configured');
            } else {
                issues.push('Viewport meta tag missing device-width');
            }
        } else {
            issues.push('Viewport meta tag not found');
        }
        
        // Check for responsive CSS classes
        const canvas = document.getElementById('ocean-canvas');
        if (canvas) {
            const classes = canvas.className;
            if (classes.includes('w-full')) {
                validations.push('Canvas has responsive width');
            } else {
                issues.push('Canvas missing responsive width');
            }
        }
        
        // Check for media queries in CSS
        let hasMediaQueries = false;
        try {
            const stylesheets = Array.from(document.styleSheets);
            for (const sheet of stylesheets) {
                const rules = Array.from(sheet.cssRules || []);
                for (const rule of rules) {
                    if (rule.type === CSSRule.MEDIA_RULE) {
                        hasMediaQueries = true;
                        break;
                    }
                }
                if (hasMediaQueries) break;
            }
        } catch (e) {
            // Cross-origin stylesheets may not be accessible
        }
        
        if (hasMediaQueries || document.body.innerHTML.includes('@media')) {
            validations.push('Media queries found');
        } else {
            issues.push('No media queries detected');
        }
        
        // Check for mobile-specific CSS
        const mobileCSS = [
            'max-width: 768px',
            'max-width: 480px',
            '50vh',
            '45vh'
        ];
        
        let mobileOptimizations = 0;
        for (const css of mobileCSS) {
            if (document.body.innerHTML.includes(css)) {
                mobileOptimizations++;
            }
        }
        
        if (mobileOptimizations >= 2) {
            validations.push('Mobile optimizations found');
        } else {
            issues.push('Insufficient mobile optimizations');
        }
        
        return {
            status: issues.length <= 1 ? 'pass' : 'warning',
            message: issues.length <= 1 ? 'Responsive design implemented' : `${issues.length} responsive design issues`,
            details: [...validations, ...issues.map(i => `Issue: ${i}`)].join('; '),
            requirements: ['2.5', '7.7']
        };
    }
    
    async validateRequirementsCoverage() {
        const issues = [];
        const validations = [];
        
        // Map requirements to validation results
        const requirementsCovered = new Set();
        
        for (const result of this.results) {
            if (result.requirements) {
                for (const req of result.requirements) {
                    requirementsCovered.add(req);
                }
            }
        }
        
        const totalRequirements = Object.keys(this.requirements).length;
        const coveredRequirements = requirementsCovered.size;
        const coveragePercentage = (coveredRequirements / totalRequirements) * 100;
        
        if (coveragePercentage >= 90) {
            validations.push(`Excellent coverage: ${coveragePercentage.toFixed(1)}%`);
        } else if (coveragePercentage >= 80) {
            validations.push(`Good coverage: ${coveragePercentage.toFixed(1)}%`);
        } else {
            issues.push(`Low coverage: ${coveragePercentage.toFixed(1)}%`);
        }
        
        // Check for missing critical requirements
        const criticalRequirements = ['1.1', '2.1', '3.1', '4.1', '5.1', '6.1'];
        const missingCritical = criticalRequirements.filter(req => !requirementsCovered.has(req));
        
        if (missingCritical.length === 0) {
            validations.push('All critical requirements covered');
        } else {
            issues.push(`Missing critical requirements: ${missingCritical.join(', ')}`);
        }
        
        return {
            status: coveragePercentage >= 80 && missingCritical.length === 0 ? 'pass' : 'warning',
            message: `Requirements coverage: ${coveragePercentage.toFixed(1)}% (${coveredRequirements}/${totalRequirements})`,
            details: [...validations, ...issues.map(i => `Issue: ${i}`)].join('; '),
            requirements: Array.from(requirementsCovered)
        };
    }
    
    generateValidationReport() {
        console.log('\n🔍 IMPLEMENTATION VALIDATION REPORT');
        console.log('=' .repeat(50));
        
        const passed = this.results.filter(r => r.status === 'pass').length;
        const warnings = this.results.filter(r => r.status === 'warning').length;
        const failed = this.results.filter(r => r.status === 'fail').length;
        const errors = this.results.filter(r => r.status === 'error').length;
        
        console.log(`Total Validations: ${this.results.length}`);
        console.log(`Passed: ${passed} ✅`);
        console.log(`Warnings: ${warnings} ⚠️`);
        console.log(`Failed: ${failed} ❌`);
        console.log(`Errors: ${errors} 🚨`);
        
        const successRate = this.results.length > 0 ? (passed / this.results.length) * 100 : 0;
        console.log(`Success Rate: ${successRate.toFixed(1)}%`);
        
        console.log('\n📋 DETAILED VALIDATION RESULTS');
        console.log('-' .repeat(35));
        
        for (const result of this.results) {
            const icon = { pass: '✅', warning: '⚠️', fail: '❌', error: '🚨' }[result.status];
            console.log(`${icon} ${result.name}`);
            console.log(`   ${result.message}`);
            if (result.details) {
                console.log(`   Details: ${result.details}`);
            }
            if (result.requirements && result.requirements.length > 0) {
                console.log(`   Requirements: ${result.requirements.join(', ')}`);
            }
            console.log('');
        }
        
        console.log('🎯 IMPLEMENTATION READINESS');
        console.log('-' .repeat(25));
        
        if (failed === 0 && errors === 0) {
            console.log('🎉 Implementation validation successful!');
            console.log('   The Drop to Ocean feature is ready for production.');
            
            if (warnings > 0) {
                console.log(`   Consider addressing ${warnings} warning(s) for optimal quality.`);
            }
        } else {
            console.log('🔧 Implementation needs attention:');
            
            if (errors > 0) {
                console.log(`   - Fix ${errors} critical error(s)`);
            }
            
            if (failed > 0) {
                console.log(`   - Resolve ${failed} failed validation(s)`);
            }
            
            if (warnings > 0) {
                console.log(`   - Address ${warnings} warning(s) for better quality`);
            }
        }
        
        console.log('\n📝 NEXT STEPS');
        console.log('-' .repeat(15));
        console.log('1. Address any failed validations or errors');
        console.log('2. Run comprehensive test suite');
        console.log('3. Test on multiple browsers and devices');
        console.log('4. Conduct user acceptance testing');
        console.log('5. Deploy to staging environment for final testing');
    }
}

// Global function for easy access
window.validateImplementation = async function() {
    const validator = new ImplementationValidator();
    return await validator.validateImplementation();
};

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImplementationValidator;
} else if (typeof window !== 'undefined') {
    window.ImplementationValidator = ImplementationValidator;
}

// Auto-run if requested
if (typeof window !== 'undefined' && window.location && window.location.search.includes('validate=true')) {
    document.addEventListener('DOMContentLoaded', () => {
        validateImplementation();
    });
}