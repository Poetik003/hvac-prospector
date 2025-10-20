#!/usr/bin/env python3
"""
Setup Live Calling for ProSpector Pro
Enables real phone calls using Twilio or alternative services
"""

import os
import sys

def setup_twilio_live_calling():
    """
    Setup Twilio for live phone calling
    """
    print("🚀 Setting up LIVE PHONE CALLING for ProSpector Pro")
    print("=" * 50)
    
    print("\n📞 LIVE CALLING OPTIONS:")
    print("1. Twilio (Recommended - Professional grade)")
    print("2. Test Mode with real calling simulation") 
    print("3. Demo mode (current)")
    
    choice = input("\nSelect option (1-3): ").strip()
    
    if choice == "1":
        setup_twilio_credentials()
    elif choice == "2":
        setup_test_mode()
    elif choice == "3":
        print("✅ Staying in demo mode")
    else:
        print("❌ Invalid choice")

def setup_twilio_credentials():
    """
    Set up Twilio credentials for live calling
    """
    print("\n📋 TWILIO SETUP:")
    print("Go to https://console.twilio.com to get your credentials")
    print()
    
    account_sid = input("Enter your Twilio Account SID: ").strip()
    auth_token = input("Enter your Twilio Auth Token: ").strip()
    from_number = input("Enter your Twilio Phone Number (e.g., +15551234567): ").strip()
    
    if account_sid and auth_token and from_number:
        # Set environment variables
        os.environ['TWILIO_ACCOUNT_SID'] = account_sid
        os.environ['TWILIO_AUTH_TOKEN'] = auth_token
        os.environ['TWILIO_FROM_NUMBER'] = from_number
        
        # Create environment file
        with open('/home/user/webapp/.env', 'w') as f:
            f.write(f"TWILIO_ACCOUNT_SID={account_sid}\n")
            f.write(f"TWILIO_AUTH_TOKEN={auth_token}\n") 
            f.write(f"TWILIO_FROM_NUMBER={from_number}\n")
            f.write("LIVE_CALLING_ENABLED=true\n")
        
        print("\n✅ Twilio credentials configured!")
        print("🔄 Restart the voice API server to enable live calling")
        print("📞 Real phone calls will now be made to entered numbers")
        
    else:
        print("❌ Missing credentials - staying in demo mode")

def setup_test_mode():
    """
    Enable test mode with enhanced calling simulation
    """
    print("\n🧪 TEST MODE SETUP:")
    print("This will simulate real calling with detailed logging")
    
    # Create test configuration
    with open('/home/user/webapp/.env', 'w') as f:
        f.write("LIVE_CALLING_ENABLED=test\n")
        f.write("TEST_CALLING_MODE=true\n")
    
    print("✅ Test mode enabled!")
    print("📞 Calls will be simulated with real-like behavior")
    print("🔄 Restart the voice API server to apply changes")

def check_current_status():
    """
    Check current calling status
    """
    print("\n📊 CURRENT STATUS:")
    
    if os.path.exists('/home/user/webapp/.env'):
        print("✅ Configuration file exists")
        with open('/home/user/webapp/.env', 'r') as f:
            config = f.read()
            if 'TWILIO_ACCOUNT_SID' in config:
                print("✅ Twilio credentials configured")
            elif 'TEST_CALLING_MODE' in config:
                print("🧪 Test mode enabled")
            else:
                print("🔧 Demo mode active")
    else:
        print("🔧 Demo mode active (no configuration)")

if __name__ == "__main__":
    check_current_status()
    setup_twilio_live_calling()