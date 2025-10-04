#!/usr/bin/env python3
"""
Twilio + Bland AI Integration Module
Combines Twilio's reliable telephony with Bland AI's superior voice generation
"""

import os
import json
import logging
import requests
from typing import Dict, Any, Optional
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

class TwilioBlandIntegration:
    """
    Integration class combining Twilio telephony with Bland AI voices
    """
    
    def __init__(self):
        """Initialize the integration with configuration"""
        self.twilio_client = None
        self.bland_api_key = None
        self.setup_credentials()
    
    def setup_credentials(self):
        """Setup credentials from environment or configuration"""
        # Twilio credentials
        self.twilio_account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        self.twilio_auth_token = os.environ.get('TWILIO_AUTH_TOKEN') 
        self.twilio_phone_number = os.environ.get('TWILIO_FROM_NUMBER')
        
        # Bland AI credentials
        self.bland_api_key = os.environ.get('BLAND_AI_API_KEY')
        
        # Initialize Twilio client if credentials available
        if self.twilio_account_sid and self.twilio_auth_token:
            try:
                from twilio.rest import Client
                self.twilio_client = Client(self.twilio_account_sid, self.twilio_auth_token)
                logger.info("✅ Twilio client initialized successfully")
            except ImportError:
                logger.error("❌ Twilio SDK not installed")
            except Exception as e:
                logger.error(f"❌ Twilio client initialization failed: {e}")
    
    async def generate_bland_ai_voice(self, script: str, voice_model: str = "yeni", 
                                    lead_info: Optional[Dict] = None) -> Optional[str]:
        """
        Generate AI voice using Bland AI API
        
        Args:
            script: The text to convert to speech
            voice_model: Voice model to use (yeni, danny, gabi)
            lead_info: Lead information for personalization
            
        Returns:
            URL to the generated audio file or None if failed
        """
        if not self.bland_api_key:
            logger.error("❌ Bland AI API key not configured")
            return None
            
        try:
            logger.info(f"🎤 Generating Bland AI voice for {voice_model}")
            
            # Personalize script with lead info
            if lead_info:
                personalized_script = self.personalize_script(script, lead_info)
            else:
                personalized_script = script
            
            # Bland AI voice generation request
            headers = {
                'Authorization': self.bland_api_key,
                'Content-Type': 'application/json'
            }
            
            # Use Bland AI's voice generation endpoint
            payload = {
                'text': personalized_script,
                'voice': voice_model,
                'speed': 1.0,
                'stability': 0.75,
                'similarity_boost': 0.75
            }
            
            response = requests.post(
                'https://api.bland.ai/v1/voices/generate',
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                audio_url = result.get('audio_url')
                logger.info(f"✅ Bland AI voice generated: {audio_url}")
                return audio_url
            else:
                logger.error(f"❌ Bland AI voice generation failed: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Bland AI voice generation error: {e}")
            return None
    
    def personalize_script(self, script: str, lead_info: Dict) -> str:
        """
        Personalize the script with lead information
        
        Args:
            script: Base script template
            lead_info: Lead information dictionary
            
        Returns:
            Personalized script string
        """
        personalized = script
        
        # Replace placeholders with actual lead info
        if 'name' in lead_info and lead_info['name']:
            personalized = personalized.replace('[LEAD_NAME]', lead_info['name'])
            personalized = personalized.replace('[NAME]', lead_info['name'])
        
        if 'company' in lead_info and lead_info['company']:
            personalized = personalized.replace('[COMPANY]', lead_info['company'])
            personalized = personalized.replace('[BUSINESS]', lead_info['company'])
        
        if 'industry' in lead_info and lead_info['industry']:
            personalized = personalized.replace('[INDUSTRY]', lead_info['industry'])
        
        # Add current date/time context
        current_time = datetime.now().strftime("%B %d")
        personalized = personalized.replace('[DATE]', current_time)
        
        logger.info(f"📝 Script personalized for {lead_info.get('name', 'Unknown')}")
        return personalized
    
    def create_twilio_twiml(self, audio_url: str, call_id: str) -> str:
        """
        Create TwiML for playing Bland AI generated audio
        
        Args:
            audio_url: URL to the Bland AI generated audio
            call_id: Unique call identifier
            
        Returns:
            TwiML XML string
        """
        twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Connecting you to our HVAC specialist...</Say>
    <Play>{audio_url}</Play>
    <Gather input="speech dtmf" timeout="10" speechTimeout="auto">
        <Say voice="alice">Please press 1 to speak with a representative, or stay on the line.</Say>
    </Gather>
    <Redirect>/api/twilio-response/{call_id}</Redirect>
</Response>"""
        return twiml
    
    async def initiate_integrated_call(self, phone_number: str, script: str, 
                                     lead_info: Dict, voice_model: str = "yeni") -> Dict[str, Any]:
        """
        Initiate a phone call using Twilio + Bland AI integration
        
        Args:
            phone_number: Target phone number to call
            script: Script text for the AI to read
            lead_info: Lead information for personalization
            voice_model: Bland AI voice model to use
            
        Returns:
            Result dictionary with call status and details
        """
        try:
            logger.info(f"🚀 Starting integrated Twilio + Bland AI call to {phone_number}")
            
            # Step 1: Generate Bland AI voice
            audio_url = await self.generate_bland_ai_voice(script, voice_model, lead_info)
            if not audio_url:
                return {
                    'success': False,
                    'error': 'Failed to generate Bland AI voice',
                    'details': 'Bland AI voice generation failed'
                }
            
            # Step 2: Create call ID and TwiML
            call_id = f"twilio_bland_{int(datetime.now().timestamp())}"
            
            # Step 3: Initiate Twilio call
            if not self.twilio_client:
                return {
                    'success': False,
                    'error': 'Twilio client not initialized',
                    'details': 'Check Twilio credentials configuration'
                }
            
            # Create TwiML URL endpoint
            twiml_url = f"https://your-webhook-domain.com/api/twiml/{call_id}?audio={audio_url}"
            
            # Make the Twilio call
            call = self.twilio_client.calls.create(
                url=twiml_url,
                to=f'+1{phone_number.replace("+", "").replace("-", "").replace(" ", "")}',
                from_=self.twilio_phone_number,
                record=True,
                timeout=30,
                status_callback=f'https://your-webhook-domain.com/api/call-status/{call_id}',
                status_callback_event=['initiated', 'ringing', 'answered', 'completed']
            )
            
            logger.info(f"✅ Integrated call initiated! Twilio SID: {call.sid}")
            
            return {
                'success': True,
                'call_sid': call.sid,
                'call_id': call_id,
                'phone_number': phone_number,
                'audio_url': audio_url,
                'voice_model': voice_model,
                'lead_info': lead_info,
                'message': f'Integrated Twilio + Bland AI call initiated to {phone_number}',
                'integration_mode': 'twilio_bland_ai'
            }
            
        except Exception as e:
            logger.error(f"❌ Integrated call failed: {e}")
            return {
                'success': False,
                'error': f'Integration call failed: {str(e)}',
                'details': str(e)
            }
    
    def get_hvac_scripts(self) -> Dict[str, str]:
        """
        Get HVAC-specific script templates
        
        Returns:
            Dictionary of script templates by type
        """
        return {
            'intro': """
            Hello [LEAD_NAME], this is Sarah from ProSpector HVAC Services. 
            I'm calling [COMPANY] because we're offering a special promotion on 
            energy-efficient HVAC systems in your area. Do you have just 2 minutes 
            for me to explain how we can reduce your energy costs by up to 40%?
            """,
            
            'follow_up': """
            Hi [LEAD_NAME], this is Sarah from ProSpector HVAC following up on 
            our previous conversation about [COMPANY]'s HVAC efficiency. I have 
            some exciting updates on our energy savings program that could 
            significantly impact your utility costs. Is now a good time to chat?
            """,
            
            'appointment': """
            Hello [LEAD_NAME], this is Sarah from ProSpector HVAC Services. 
            I'm calling to confirm your HVAC consultation appointment for [DATE]. 
            Our certified technician will be evaluating [COMPANY]'s current system 
            and providing a comprehensive energy efficiency assessment. 
            Is this appointment still convenient for you?
            """,
            
            'emergency': """
            Hello [LEAD_NAME], this is Sarah from ProSpector HVAC Services. 
            We received your emergency service request for [COMPANY]. 
            Our emergency technician is currently en route and should arrive 
            within the next 45 minutes. I'll text you their contact information 
            so you can track their arrival. Is there anything else I can help you with?
            """
        }
    
    def get_integration_status(self) -> Dict[str, Any]:
        """
        Get current integration status
        
        Returns:
            Status dictionary with configuration details
        """
        return {
            'twilio_configured': bool(self.twilio_client),
            'twilio_account_sid': self.twilio_account_sid[:8] + '...' if self.twilio_account_sid else None,
            'twilio_phone_number': self.twilio_phone_number,
            'bland_ai_configured': bool(self.bland_api_key),
            'bland_api_key': self.bland_api_key[:12] + '...' if self.bland_api_key else None,
            'integration_ready': bool(self.twilio_client and self.bland_api_key),
            'timestamp': datetime.now().isoformat()
        }

# Initialize global integration instance
integration = TwilioBlandIntegration()

def get_integration():
    """Get the global integration instance"""
    return integration