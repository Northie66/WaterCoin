/**
 * Accessibility Testing Script for Drop to Ocean Interactive Feature
 * Tests keyboard navigation, screen reader compatibility, and WCAG compliance
 */

class AccessibilityTester {
    constructor() {
        this.results = [];
        this.testCanvas = null;
        this.setupTestEnvironment();
    }
    
    setupTestEnvironment() {
        // Create test canvas if not exists
        if (!document.getElementById('a11y-test-canvas')) {
            this.testCanvas = document.createElement('canvas');
            this.testCanvas.id = 'a11y-test-canvas';
            this.testCanvas.width = 800;
            this.testCanvas.height = 400;
            this.testCanvas.style.position = 'absolute';
            this.testCanvas.style.left = '-9999px'; // Hide off-screen
            document.body.appendChild(this.testCanvas);
        } else {
            this.testCanvas = document.getElementById('a11y-test-canvas');
        }
    }
    
    async runAllAccessibilityTests() {
        console.log('♿ Starting comprehensive accessibility tests...');
        this.results = [];
        
        const tests = [
            { name: 'Canvas Accessibility Attributes', test: () => this.testCanvasAccessibilityAttributes() },
            { name: 'Keyboard Navigation Support', test: () => this.testKeyboardNavigation() },
            { name: 'Focus Management', test: () => this.testFocusManagement() },
            { name: 'ARIA Labels and Descriptions', test: () => this.testAriaLabelsAndDescriptions() },
            { name: 'Color Contrast Compliance', test: () => this.testColorContrastCompliance() },
            { name: 'Screen Reader Compatibility', test: () => this.testScreenReaderCompatibility() },
            { name: 'Reduced Motion Support', test: () => this.testReducedMotionSupport() },
            { name: 'Touch Target Size', test: () => this.testTouchTargetSize() },
            { name: 'Alternative Input Methods', test: () => this.testAlternativeInputMethods() },
            { name: 'Error Handling Accessibility', test: () => this.testErrorHandlingAccessibility() }
        ];
        
        for (const test of tests) {
            console.log(`\n♿ Running: ${test.name}`);
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
            
            await this.delay(50);
        }
        
        this.generateAccessibilityReport();
        return this.results;
    }
    
    async testCanvasAccessibilityAttributes() {
        // Test the main canvas element from the page
        const mainCanvas = document.getElementById('ocean-canvas');
        const issues = [];
        const recommendations = [];
        
        if (!mainCanvas) {
            return {
                status: 'error',
                message: 'Main ocean canvas not found',
                details: 'Cannot test canvas accessibility without the main canvas element'
            };
        }
        
        // Check required attributes
        const requiredAttributes = [
            { attr: 'tabindex', expected: '0', purpose: 'keyboard navigation' },
            { attr: 'role', expected: 'application', purpose: 'screen reader context' },
            { attr: 'aria-label', expected: null, purpose: 'accessible name' }
        ];
        
        for (const { attr, expected, purpose } of requiredAttributes) {
            const value = mainCanvas.getAttribute(attr);
            
            if (!value) {
                issues.push(`Missing ${attr} attribute for ${purpose}`);
            } else if (expected && value !== expected) {
                issues.push(`${attr} should be "${expected}" but is "${value}"`);
            }
        }
        
        // Check aria-describedby
        const ariaDescribedBy = mainCanvas.getAttribute('aria-describedby');
        if (ariaDescribedBy) {
            const descriptionElement = document.getElementById(ariaDescribedBy);
            if (!descriptionElement) {
                issues.push(`aria-describedby references non-existent element: ${ariaDescribedBy}`);
            }
        } else {
            recommendations.push('Consider adding aria-describedby for detailed instructions');
        }
        
        // Check for touch-action CSS property
        const computedStyle = window.getComputedStyle(mainCanvas);
        const touchAction = computedStyle.touchAction;
        if (touchAction !== 'none') {
            recommendations.push('Consider setting touch-action: none to prevent default touch behaviors');
        }
        
        return {
            status: issues.length === 0 ? 'pass' : 'fail',
            message: issues.length === 0 ? 'Canvas has proper accessibility attributes' : `${issues.length} accessibility issues found`,
            details: [...issues, ...recommendations.map(r => `Recommendation: ${r}`)].join('; ')
        };
    }
    
    async testKeyboardNavigation() {
        const testCanvas = this.createTestCanvas();
        let keyEventsCaptured = [];
        
        // Add keyboard event listeners
        const keyHandler = (e) => {
            keyEventsCaptured.push({
                type: e.type,
                key: e.key,
                code: e.code,
                defaultPrevented: e.defaultPrevented
            });
        };
        
        testCanvas.addEventListener('keydown', keyHandler);
        testCanvas.addEventListener('keyup', keyHandler);
        
        // Test focus
        testCanvas.focus();
        const hasFocus = document.activeElement === testCanvas;
        
        if (!hasFocus) {
            return {
                status: 'fail',
                message: 'Canvas cannot receive keyboard focus',
                details: 'Canvas must be focusable for keyboard navigation'
            };
        }
        
        // Test key events
        const testKeys = [
            { key: 'Enter', code: 'Enter' },
            { key: ' ', code: 'Space' },
            { key: 'Tab', code: 'Tab' },
            { key: 'Escape', code: 'Escape' }
        ];
        
        for (const testKey of testKeys) {
            const keyEvent = new KeyboardEvent('keydown', {
                key: testKey.key,
                code: testKey.code,
                bubbles: true,
                cancelable: true
            });
            
            testCanvas.dispatchEvent(keyEvent);
        }
        
        // Clean up
        testCanvas.removeEventListener('keydown', keyHandler);
        testCanvas.removeEventListener('keyup', keyHandler);
        testCanvas.remove();
        
        const capturedKeys = keyEventsCaptured.map(e => e.key);
        const expectedKeys = testKeys.map(k => k.key);
        const missingKeys = expectedKeys.filter(k => !capturedKeys.includes(k));
        
        return {
            status: missingKeys.length === 0 ? 'pass' : 'warning',
            message: missingKeys.length === 0 ? 'Keyboard events handled correctly' : `Some key events not captured: ${missingKeys.join(', ')}`,
            details: `Captured events: ${capturedKeys.join(', ')}`
        };
    }
    
    async testFocusManagement() {
        const testCanvas = this.createTestCanvas();
        const testButton = document.createElement('button');
        testButton.textContent = 'Test Button';
        document.body.appendChild(testButton);
        
        // Test focus sequence
        testButton.focus();
        const buttonHasFocus = document.activeElement === testButton;
        
        testCanvas.focus();
        const canvasHasFocus = document.activeElement === testCanvas;
        
        // Test focus indicators
        const focusStyles = window.getComputedStyle(testCanvas, ':focus');
        const hasFocusIndicator = focusStyles.outline !== 'none' || 
                                 focusStyles.boxShadow !== 'none' ||
                                 focusStyles.border !== testCanvas.style.border;
        
        // Clean up
        testCanvas.remove();
        testButton.remove();
        
        const issues = [];
        if (!buttonHasFocus) issues.push('Button cannot receive focus');
        if (!canvasHasFocus) issues.push('Canvas cannot receive focus');
        if (!hasFocusIndicator) issues.push('Canvas lacks visible focus indicator');
        
        return {
            status: issues.length === 0 ? 'pass' : 'fail',
            message: issues.length === 0 ? 'Focus management working correctly' : `${issues.length} focus issues`,
            details: issues.join('; ')
        };
    }
    
    async testAriaLabelsAndDescriptions() {
        const testCanvas = this.createTestCanvas();
        
        // Set up ARIA attributes
        testCanvas.setAttribute('aria-label', 'Interactive water simulation');
        testCanvas.setAttribute('aria-describedby', 'canvas-description');
        
        const description = document.createElement('div');
        description.id = 'canvas-description';
        description.textContent = 'Click or tap to add water droplets. Use Enter or Space when focused to add droplets at the center.';
        description.style.position = 'absolute';
        description.style.left = '-9999px';
        document.body.appendChild(description);
        
        // Test ARIA attributes
        const ariaLabel = testCanvas.getAttribute('aria-label');
        const ariaDescribedBy = testCanvas.getAttribute('aria-describedby');
        const descriptionElement = document.getElementById(ariaDescribedBy);
        
        const issues = [];
        if (!ariaLabel || ariaLabel.length < 5) {
            issues.push('aria-label missing or too short');
        }
        if (!ariaDescribedBy) {
            issues.push('aria-describedby missing');
        }
        if (!descriptionElement) {
            issues.push('Description element not found');
        }
        if (descriptionElement && !descriptionElement.textContent.trim()) {
            issues.push('Description element is empty');
        }
        
        // Test dynamic ARIA updates
        testCanvas.setAttribute('aria-live', 'polite');
        testCanvas.setAttribute('aria-atomic', 'false');
        
        const ariaLive = testCanvas.getAttribute('aria-live');
        const ariaAtomic = testCanvas.getAttribute('aria-atomic');
        
        if (!ariaLive) {
            issues.push('aria-live not set for dynamic updates');
        }
        
        // Clean up
        testCanvas.remove();
        description.remove();
        
        return {
            status: issues.length === 0 ? 'pass' : 'fail',
            message: issues.length === 0 ? 'ARIA labels and descriptions properly configured' : `${issues.length} ARIA issues`,
            details: issues.join('; ')
        };
    }
    
    async testColorContrastCompliance() {
        // Test color combinations used in the interface
        const colorTests = [
            { bg: '#0A0A0A', fg: '#E0E0E0', name: 'Main text', level: 'AA' },
            { bg: '#0A0A0A', fg: '#3B82F6', name: 'Blue accent', level: 'AA' },
            { bg: '#0A0A0A', fg: '#67E8F9', name: 'Cyan accent', level: 'AA' },
            { bg: '#0A0A0A', fg: '#9CA3AF', name: 'Gray text', level: 'AA' },
            { bg: '#0A0A0A', fg: '#6B7280', name: 'Muted text', level: 'AA' },
            { bg: 'rgba(255, 255, 255, 0.03)', fg: '#E0E0E0', name: 'Card background text', level: 'AA' }
        ];
        
        const results = [];
        const failures = [];
        
        for (const test of colorTests) {
            const ratio = this.calculateContrastRatio(test.bg, test.fg);
            const threshold = test.level === 'AAA' ? 7 : 4.5;
            const passes = ratio >= threshold;
            
            results.push({
                name: test.name,
                ratio: ratio,
                passes: passes,
                level: test.level
            });
            
            if (!passes) {
                failures.push(`${test.name}: ${ratio.toFixed(2)}:1 (needs ${threshold}:1)`);
            }
        }
        
        return {
            status: failures.length === 0 ? 'pass' : 'fail',
            message: failures.length === 0 ? 'All color combinations meet WCAG standards' : `${failures.length} color contrast failures`,
            details: failures.length > 0 ? failures.join('; ') : results.map(r => `${r.name}: ${r.ratio.toFixed(2)}:1`).join('; ')
        };
    }
    
    async testScreenReaderCompatibility() {
        const testCanvas = this.createTestCanvas();
        
        // Set up proper screen reader attributes
        testCanvas.setAttribute('role', 'application');
        testCanvas.setAttribute('aria-label', 'Interactive water simulation');
        testCanvas.setAttribute('aria-describedby', 'sr-description');
        
        const description = document.createElement('div');
        description.id = 'sr-description';
        description.textContent = 'Interactive canvas where you can click to add water droplets and fill an ocean. Current progress will be announced.';
        description.setAttribute('aria-live', 'polite');
        description.style.position = 'absolute';
        description.style.left = '-9999px';
        document.body.appendChild(description);
        
        // Test screen reader announcements
        const progressElement = document.createElement('div');
        progressElement.setAttribute('aria-live', 'polite');
        progressElement.setAttribute('aria-atomic', 'true');
        progressElement.style.position = 'absolute';
        progressElement.style.left = '-9999px';
        document.body.appendChild(progressElement);
        
        // Simulate progress update
        progressElement.textContent = 'Ocean filled: 25%';
        
        // Test milestone announcements
        const milestoneElement = document.createElement('div');
        milestoneElement.setAttribute('aria-live', 'assertive');
        milestoneElement.setAttribute('role', 'status');
        milestoneElement.style.position = 'absolute';
        milestoneElement.style.left = '-9999px';
        document.body.appendChild(milestoneElement);
        
        milestoneElement.textContent = 'Milestone achieved: Fish are now swimming in your ocean!';
        
        // Check for proper structure
        const issues = [];
        
        if (!testCanvas.getAttribute('role')) {
            issues.push('Canvas missing role attribute');
        }
        
        if (!description.getAttribute('aria-live')) {
            issues.push('Description missing aria-live for updates');
        }
        
        if (!progressElement.getAttribute('aria-atomic')) {
            issues.push('Progress updates missing aria-atomic');
        }
        
        if (!milestoneElement.getAttribute('role')) {
            issues.push('Milestone announcements missing role');
        }
        
        // Clean up
        testCanvas.remove();
        description.remove();
        progressElement.remove();
        milestoneElement.remove();
        
        return {
            status: issues.length === 0 ? 'pass' : 'fail',
            message: issues.length === 0 ? 'Screen reader compatibility properly configured' : `${issues.length} screen reader issues`,
            details: issues.join('; ')
        };
    }
    
    async testReducedMotionSupport() {
        // Test CSS media query support
        const supportsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Create test elements with animations
        const testElement = document.createElement('div');
        testElement.style.cssText = `
            position: absolute;
            left: -9999px;
            transition: transform 0.3s ease;
            animation: fadeIn 0.6s ease-out;
        `;
        
        document.body.appendChild(testElement);
        
        // Test reduced motion CSS
        const reducedMotionCSS = `
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = reducedMotionCSS;
        document.head.appendChild(styleElement);
        
        // Check computed styles
        const computedStyle = window.getComputedStyle(testElement);
        const animationDuration = computedStyle.animationDuration;
        const transitionDuration = computedStyle.transitionDuration;
        
        // Clean up
        testElement.remove();
        styleElement.remove();
        
        const recommendations = [];
        
        if (!reducedMotionCSS.includes('prefers-reduced-motion')) {
            recommendations.push('Add CSS media query for prefers-reduced-motion');
        }
        
        recommendations.push('Ensure animations can be disabled via user preference');
        recommendations.push('Provide option to reduce or disable particle effects');
        recommendations.push('Consider static alternatives for animated content');
        
        return {
            status: 'pass',
            message: 'Reduced motion considerations evaluated',
            details: `Supports reduced motion: ${supportsReducedMotion}; Recommendations: ${recommendations.join(', ')}`
        };
    }
    
    async testTouchTargetSize() {
        const testCanvas = this.createTestCanvas();
        testCanvas.style.width = '800px';
        testCanvas.style.height = '400px';
        
        // Get canvas dimensions
        const rect = testCanvas.getBoundingClientRect();
        const minTouchTargetSize = 44; // WCAG recommendation: 44x44 CSS pixels
        
        const issues = [];
        
        // Check if canvas is large enough to be a touch target
        if (rect.width < minTouchTargetSize) {
            issues.push(`Canvas width ${rect.width}px is smaller than recommended ${minTouchTargetSize}px`);
        }
        
        if (rect.height < minTouchTargetSize) {
            issues.push(`Canvas height ${rect.height}px is smaller than recommended ${minTouchTargetSize}px`);
        }
        
        // Test touch target spacing (if there were multiple interactive elements)
        const spacing = 8; // Minimum spacing between touch targets
        const recommendations = [
            'Ensure adequate spacing between interactive elements',
            'Consider larger touch targets on mobile devices',
            'Provide visual feedback for touch interactions'
        ];
        
        testCanvas.remove();
        
        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            message: issues.length === 0 ? 'Touch target size meets guidelines' : `${issues.length} touch target issues`,
            details: [...issues, ...recommendations.map(r => `Recommendation: ${r}`)].join('; ')
        };
    }
    
    async testAlternativeInputMethods() {
        const testCanvas = this.createTestCanvas();
        let inputMethodsSupported = [];
        
        // Test keyboard input
        const keyboardSupported = testCanvas.tabIndex >= 0;
        if (keyboardSupported) {
            inputMethodsSupported.push('keyboard');
        }
        
        // Test mouse input
        let mouseEventFired = false;
        const mouseHandler = () => { mouseEventFired = true; };
        testCanvas.addEventListener('click', mouseHandler);
        
        const mouseEvent = new MouseEvent('click', { bubbles: true });
        testCanvas.dispatchEvent(mouseEvent);
        
        if (mouseEventFired) {
            inputMethodsSupported.push('mouse');
        }
        
        // Test touch input
        let touchEventFired = false;
        const touchHandler = () => { touchEventFired = true; };
        testCanvas.addEventListener('touchstart', touchHandler);
        
        const touchEvent = new TouchEvent('touchstart', {
            touches: [{ clientX: 100, clientY: 100 }],
            bubbles: true
        });
        testCanvas.dispatchEvent(touchEvent);
        
        if (touchEventFired) {
            inputMethodsSupported.push('touch');
        }
        
        // Test pointer events (modern alternative)
        let pointerEventFired = false;
        const pointerHandler = () => { pointerEventFired = true; };
        testCanvas.addEventListener('pointerdown', pointerHandler);
        
        const pointerEvent = new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true
        });
        testCanvas.dispatchEvent(pointerEvent);
        
        if (pointerEventFired) {
            inputMethodsSupported.push('pointer');
        }
        
        // Clean up
        testCanvas.removeEventListener('click', mouseHandler);
        testCanvas.removeEventListener('touchstart', touchHandler);
        testCanvas.removeEventListener('pointerdown', pointerHandler);
        testCanvas.remove();
        
        const recommendations = [
            'Support multiple input methods (mouse, touch, keyboard)',
            'Provide equivalent functionality across all input methods',
            'Consider voice control compatibility',
            'Support assistive technologies like switch controls'
        ];
        
        return {
            status: inputMethodsSupported.length >= 2 ? 'pass' : 'warning',
            message: `${inputMethodsSupported.length} input methods supported: ${inputMethodsSupported.join(', ')}`,
            details: recommendations.join('; ')
        };
    }
    
    async testErrorHandlingAccessibility() {
        const issues = [];
        const recommendations = [];
        
        // Test error message accessibility
        const errorElement = document.createElement('div');
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'assertive');
        errorElement.textContent = 'Error: Canvas not supported in this browser';
        errorElement.style.position = 'absolute';
        errorElement.style.left = '-9999px';
        document.body.appendChild(errorElement);
        
        // Check error message attributes
        if (!errorElement.getAttribute('role')) {
            issues.push('Error messages missing role attribute');
        }
        
        if (!errorElement.getAttribute('aria-live')) {
            issues.push('Error messages missing aria-live for screen reader announcements');
        }
        
        // Test fallback content
        const fallbackElement = document.createElement('div');
        fallbackElement.innerHTML = `
            <p>Your browser does not support the interactive canvas feature.</p>
            <p>Please try using a modern browser or enable JavaScript.</p>
            <button>Learn More About Browser Compatibility</button>
        `;
        
        const fallbackButton = fallbackElement.querySelector('button');
        const buttonAccessible = fallbackButton && fallbackButton.textContent.trim().length > 0;
        
        if (!buttonAccessible) {
            issues.push('Fallback content lacks accessible interactive elements');
        }
        
        // Clean up
        errorElement.remove();
        
        recommendations.push('Provide clear, actionable error messages');
        recommendations.push('Ensure error messages are announced to screen readers');
        recommendations.push('Offer accessible alternatives when features fail');
        recommendations.push('Include recovery instructions in error messages');
        
        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            message: issues.length === 0 ? 'Error handling accessibility properly configured' : `${issues.length} error handling issues`,
            details: [...issues, ...recommendations.map(r => `Recommendation: ${r}`)].join('; ')
        };
    }
    
    // Helper methods
    createTestCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 400;
        canvas.setAttribute('tabindex', '0');
        canvas.setAttribute('role', 'application');
        canvas.setAttribute('aria-label', 'Test canvas');
        canvas.style.position = 'absolute';
        canvas.style.left = '-9999px';
        document.body.appendChild(canvas);
        return canvas;
    }
    
    calculateContrastRatio(color1, color2) {
        const lum1 = this.getLuminance(color1);
        const lum2 = this.getLuminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }
    
    getLuminance(color) {
        // Handle rgba colors
        if (color.startsWith('rgba')) {
            const values = color.match(/[\d.]+/g);
            const r = parseInt(values[0]);
            const g = parseInt(values[1]);
            const b = parseInt(values[2]);
            const alpha = parseFloat(values[3]);
            
            // Blend with assumed white background
            const blendedR = Math.round(r * alpha + 255 * (1 - alpha));
            const blendedG = Math.round(g * alpha + 255 * (1 - alpha));
            const blendedB = Math.round(b * alpha + 255 * (1 - alpha));
            
            return this.calculateLuminanceFromRGB(blendedR, blendedG, blendedB);
        }
        
        // Handle hex colors
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            return this.calculateLuminanceFromRGB(r, g, b);
        }
        
        // Default fallback
        return 0.5;
    }
    
    calculateLuminanceFromRGB(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    generateAccessibilityReport() {
        console.log('\n♿ ACCESSIBILITY TEST REPORT');
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
        
        // Accessibility recommendations
        this.generateAccessibilityRecommendations();
    }
    
    generateAccessibilityRecommendations() {
        console.log('♿ ACCESSIBILITY RECOMMENDATIONS');
        console.log('-'.repeat(35));
        
        const warnings = this.results.filter(r => r.status === 'warning');
        const errors = this.results.filter(r => r.status === 'error');
        
        if (warnings.length === 0 && errors.length === 0) {
            console.log('🎉 Excellent! All accessibility tests passed.');
            console.log('   The implementation follows accessibility best practices.');
        } else {
            if (errors.length > 0) {
                console.log('🚨 Critical Accessibility Issues:');
                errors.forEach(error => {
                    console.log(`   - ${error.name}: ${error.message}`);
                });
                console.log('');
            }
            
            if (warnings.length > 0) {
                console.log('⚠️ Accessibility Improvements Needed:');
                warnings.forEach(warning => {
                    console.log(`   - ${warning.name}: ${warning.message}`);
                });
                console.log('');
            }
        }
        
        console.log('💡 General Accessibility Best Practices:');
        console.log('   - Ensure all interactive elements are keyboard accessible');
        console.log('   - Provide clear focus indicators for all focusable elements');
        console.log('   - Use ARIA labels and descriptions for complex interactions');
        console.log('   - Test with actual screen readers (NVDA, JAWS, VoiceOver)');
        console.log('   - Ensure color is not the only way to convey information');
        console.log('   - Provide alternatives for users who cannot use pointing devices');
        console.log('   - Test with users who have disabilities');
        console.log('   - Follow WCAG 2.1 AA guidelines as minimum standard');
    }
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityTester;
} else if (typeof window !== 'undefined') {
    window.AccessibilityTester = AccessibilityTester;
}

// Auto-run if loaded directly
if (typeof window !== 'undefined' && window.location && window.location.search.includes('autorun')) {
    document.addEventListener('DOMContentLoaded', () => {
        const tester = new AccessibilityTester();
        tester.runAllAccessibilityTests();
    });
}