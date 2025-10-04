#!/usr/bin/env python3
"""
Configure ProSpector to use user's existing Twilio number
Updates environment and configuration for +1 844 803 1492
"""

import os
import json

def configure_twilio_number():
    """Configure ProSpector to use the user's Twilio toll-free number"""
    
    # User's Twilio toll-free number from screenshot
    user_twilio_number = "+18448031492"  # 844-803-1492
    
    print("🔧 Configuring ProSpector for your Twilio number...")
    print(f"📞 Number: {user_twilio_number} (Toll-free)")
    
    # Create environment configuration file
    env_config = {
        "TWILIO_FROM_NUMBER": user_twilio_number,
        "CALLER_ID_NAME": "HVAC Services",
        "CALLER_ID_NUMBER": user_twilio_number,
        "BUSINESS_NAME": "HVAC Services",
        "PHONE_NUMBER_DISPLAY": "844-803-1492",
        "NUMBER_TYPE": "toll-free",
        "PROFESSIONAL_CALLER_ID": True
    }
    
    # Write configuration
    with open('.env.twilio', 'w') as f:
        for key, value in env_config.items():
            if isinstance(value, bool):
                f.write(f"{key}={str(value).lower()}\n")
            else:
                f.write(f"{key}={value}\n")
    
    print("✅ Configuration saved to .env.twilio")
    
    # Create JavaScript configuration for frontend
    js_config = f"""
// Twilio Number Configuration for ProSpector
window.TWILIO_CONFIG = {{
    FROM_NUMBER: '{user_twilio_number}',
    DISPLAY_NUMBER: '844-803-1492',
    CALLER_ID_NAME: 'HVAC Services',
    NUMBER_TYPE: 'toll-free',
    CONFIGURED: true
}};

// Update ProSpector to use this number
if (typeof localStorage !== 'undefined') {{
    localStorage.setItem('prospector_caller_id', '{user_twilio_number}');
    localStorage.setItem('prospector_business_number', '844-803-1492');
    localStorage.setItem('twilio_configured', 'true');
}}

console.log('📞 ProSpector configured for Twilio number: {user_twilio_number}');
"""
    
    with open('twilio_config.js', 'w') as f:
        f.write(js_config)
    
    print("✅ Frontend configuration created: twilio_config.js")
    
    # Update the voice API default
    print("🔧 Updating voice API defaults...")
    
    # Create a simple config file that the API can read
    api_config = {
        "default_from_number": user_twilio_number,
        "caller_id_name": "HVAC Services",
        "number_type": "toll-free",
        "professional_setup": True
    }
    
    with open('api_twilio_config.json', 'w') as f:
        json.dump(api_config, f, indent=2)
    
    print("✅ API configuration updated")
    
    print("\n🎯 CONFIGURATION COMPLETE!")
    print(f"📞 ProSpector will now use: {user_twilio_number}")
    print("🏢 Caller ID: HVAC Services")
    print("📋 Type: Professional Toll-Free")
    print("\n📝 Next Steps:")
    print("1. Add your Twilio Account SID and Auth Token to environment")
    print("2. Test calls through the ProSpector interface")
    print("3. Your toll-free number will increase answer rates!")
    
    return env_config

if __name__ == "__main__":
    configure_twilio_number()