// IMMEDIATE SCROLL FIX - Run this in browser console
console.log('🔧 Applying immediate scroll fix...');

// Fix all modals that might have scrolling issues
function fixScrolling() {
    // Find all modal containers
    const modals = document.querySelectorAll('[class*="fixed"][class*="inset-0"]');
    
    modals.forEach(modal => {
        console.log('📱 Fixing modal:', modal);
        
        // Find the main content area
        const contentArea = modal.querySelector('.bg-slate-800, [class*="bg-slate-800"]');
        if (contentArea) {
            // Apply scrolling fixes
            contentArea.style.maxHeight = '90vh';
            contentArea.style.overflowY = 'auto';
            contentArea.style.display = 'flex';
            contentArea.style.flexDirection = 'column';
            
            // Find content wrapper and make it scrollable
            const content = contentArea.querySelector('div');
            if (content) {
                content.style.flexGrow = '1';
                content.style.overflowY = 'auto';
                content.style.maxHeight = 'calc(90vh - 150px)';
                content.style.paddingRight = '8px';
            }
        }
    });
    
    // Also fix the main page if it has scrolling issues
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto';
    
    console.log('✅ Scroll fix applied!');
}

// Apply fix immediately
fixScrolling();

// Also apply fix whenever new modals are opened
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            setTimeout(fixScrolling, 100);
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('🎯 Scroll fix system activated!');