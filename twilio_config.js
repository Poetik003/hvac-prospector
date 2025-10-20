
// Twilio Number Configuration for ProSpector
window.TWILIO_CONFIG = {
    FROM_NUMBER: '+18448031492',
    DISPLAY_NUMBER: '844-803-1492',
    CALLER_ID_NAME: 'HVAC Services',
    NUMBER_TYPE: 'toll-free',
    CONFIGURED: true
};

// Update ProSpector to use this number
if (typeof localStorage !== 'undefined') {
    localStorage.setItem('prospector_caller_id', '+18448031492');
    localStorage.setItem('prospector_business_number', '844-803-1492');
    localStorage.setItem('twilio_configured', 'true');
}

console.log('📞 ProSpector configured for Twilio number: +18448031492');
