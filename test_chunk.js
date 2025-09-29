    <script>
        // Global Variables
        let sessionStartTime = Date.now();
        let currentVoiceModel = 'yeni';
        let isRolePlaying = false;
        let trainingData = {
            naturalness: 85,
            conversationFlow: 78,
            appointmentPotential: 92,
            objectionHandling: 71,
            progress: 73,
            modulesComplete: 12,
            trainingScore: 8.7
        };

        // DIAGNOSTIC: Verify latest version is loading
        console.log('🔥 TRAINING.HTML v3.0 - SCRIPT READING FIX LOADED');
        console.log('📅 Last Updated: 2025-09-28T23:55:00Z');
        console.log('🎯 Features: readScriptDirectly(), enhanced TTS fallback, dual button system');
        console.log('🔧 JavaScript execution test - Basic functionality check');
        
        // SIMPLE BUTTON TEST - Add immediate test for button responsiveness  
        setTimeout(() => {
            const testButton = document.createElement('button');
            testButton.innerHTML = '🧪 BUTTON TEST';
            testButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; background: red; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer;';
            testButton.onclick = () => {
                alert('✅ BUTTONS WORK! JavaScript is functioning.');
                testButton.remove();
            };
            document.body.appendChild(testButton);
            console.log('🧪 Test button added - click to verify button functionality');
        }, 2000);

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎓 AI Voice Training System initialized');
            initializeSliders();
            startSessionTimer();
            loadDefaultScript();
            
            // Initialize audio management
            window.currentAudio = null;
            
            // Add global audio stop capability
            document.addEventListener('keydown', function(e) {
                // Press Escape to stop any playing audio or close modals
                if (e.key === 'Escape') {
                    if (window.currentAudio) {
                        window.currentAudio.pause();
                        window.currentAudio = null;
                        console.log('⏹️ Audio stopped by user (Escape key)');
                    }
                    // Close customization modal if open
                    const modal = document.getElementById('voice-customization-modal');
                    if (modal) {
                        closeCustomizationModal();
                    }
                }
            });
            
            // Enhanced mobile button handling
            setTimeout(() => {
                const settingsButtons = document.querySelectorAll('button[onclick*="customizeVoice"]');
                settingsButtons.forEach(btn => {
                    // Add additional event listeners for mobile compatibility
                    btn.addEventListener('touchstart', function(e) {
