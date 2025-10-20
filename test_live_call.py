#!/usr/bin/env python3
"""
Live Calling Test for (954) 629-8607
"""

import requests
import json

def test_live_call():
    """Test live call to your number"""
    
    print("📞 TESTING LIVE CALL TO (954) 629-8607")
    print("=" * 40)
    
    url = "https://8001-in729du0qi04ve0ijwlzw-6532622b.e2b.dev/api/place-phone-call"
    
    payload = {
        "phone_number": "(954) 629-8607",
        "script_text": "Hello! This is a LIVE test call from ProSpector HVAC Services. Your phone should be ringing right now! This is a real phone call using AI voice technology.",
        "voice_model": "yeni", 
        "lead_info": {
            "name": "Live Test User",
            "company": "HVAC Test",
            "industry": "office"
        }
    }
    
    print("🔄 Making LIVE call request...")
    print(f"📱 Target: {payload['phone_number']}")
    print(f"🎤 Voice: {payload['voice_model']}")
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        result = response.json()
        
        print("📋 RESPONSE:")
        print(json.dumps(result, indent=2))
        
        if result.get('success'):
            print("\n✅ LIVE CALL INITIATED!")
            print("📞 Your phone should ring momentarily!")
        else:
            print("\n⚠️ Call status unclear - check logs")
            
    except Exception as e:
        print(f"❌ Test error: {e}")

if __name__ == "__main__":
    test_live_call()
